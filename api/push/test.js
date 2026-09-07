import jwt from 'jsonwebtoken';
import webpush from 'web-push';
import { readB2Object } from '../lib/b2Storage.js';

webpush.setVapidDetails(
  'mailto:support@unitrack.com',
  process.env.VITE_VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }

  const fileName = `user_data_${user.id}.json`;

  try {
    const userData = await readB2Object(fileName);
    if (!userData || !userData.push_subscriptions || userData.push_subscriptions.length === 0) {
      return res.status(404).json({ error: 'No push subscriptions found for this user.' });
    }

    const payload = JSON.stringify({
      title: 'Test Notification',
      body: 'Your Push Notifications are working perfectly!',
      tag: 'test',
      url: '/'
    });

    let sent = 0;
    for (const sub of userData.push_subscriptions) {
      try {
        await webpush.sendNotification(sub, payload);
        sent++;
      } catch (e) {
        console.error('Push send error:', e.message);
      }
    }

    if (sent === 0) {
      return res.status(500).json({ error: 'Failed to send to any registered device.' });
    }

    return res.status(200).json({ success: true, message: `Sent test notification to ${sent} device(s)` });
  } catch (error) {
    console.error('Test Push API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
