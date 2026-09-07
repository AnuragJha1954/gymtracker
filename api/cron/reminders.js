import webpush from 'web-push';
import { readB2Object, listB2Objects } from '../lib/b2Storage.js';

webpush.setVapidDetails(
  'mailto:support@unitrack.com',
  process.env.VITE_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  // Simple auth to prevent random abuse. The external cron provider must pass an Authorization header.
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'unitrack-cron-secret'}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const allFiles = await listB2Objects();
    const userFiles = allFiles.filter(f => f.startsWith('user_data_') && f.endsWith('.json'));

    const now = new Date();
    // Round to nearest minute for comparison, or just use hour/minute
    let sentCount = 0;

    for (const file of userFiles) {
      const userData = await readB2Object(file);
      if (!userData || !userData.push_subscriptions || userData.push_subscriptions.length === 0) continue;
      if (!userData.reminders || userData.reminders.length === 0) continue;

      const dueReminders = userData.reminders.filter(reminder => {
        // We'll store reminders in ISO format or UTC.
        // For simplicity, let's just trigger ones where 'nextTrigger' is <= now
        // Or if external cron is used (e.g. daily), we just trigger all reminders due today.
        const reminderTime = new Date(reminder.nextTrigger);
        return reminderTime <= now;
      });

      for (const reminder of dueReminders) {
        // Prepare notification payload
        const payload = JSON.stringify({
          title: 'UNItrack Reminder',
          body: reminder.title,
          tag: reminder.id,
          url: '/'
        });

        // Send to all devices
        for (const sub of userData.push_subscriptions) {
          try {
            await webpush.sendNotification(sub, payload);
            sentCount++;
          } catch (e) {
            // If subscription is invalid/expired (status 410), we could remove it.
            console.error('Push error:', e.statusCode || e.message);
          }
        }

        // Calculate next trigger time based on frequency
        if (reminder.frequency === 'daily') {
          const next = new Date(reminder.nextTrigger);
          next.setDate(next.getDate() + 1);
          reminder.nextTrigger = next.toISOString();
        } else if (reminder.frequency === 'weekly') {
          const next = new Date(reminder.nextTrigger);
          next.setDate(next.getDate() + 7);
          reminder.nextTrigger = next.toISOString();
        } else if (reminder.frequency === 'monthly') {
          const next = new Date(reminder.nextTrigger);
          next.setMonth(next.getMonth() + 1);
          reminder.nextTrigger = next.toISOString();
        } else {
          // Once - remove it
          reminder.completed = true;
        }
      }

      // Cleanup completed ones
      if (dueReminders.length > 0) {
        userData.reminders = userData.reminders.filter(r => !r.completed);
        await writeB2Object(file, userData);
      }
    }

    return res.status(200).json({ success: true, sent: sentCount });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Cron failed' });
  }
}
