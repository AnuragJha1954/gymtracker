import jwt from 'jsonwebtoken';
import { readB2Object, writeB2Object } from '../lib/b2Storage.js';

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

  const { subscription } = req.body;
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription object' });
  }

  const fileName = `user_data_${user.id}.json`;

  try {
    let userData = await readB2Object(fileName) || {};
    
    // Make sure push_subscriptions array exists
    if (!userData.push_subscriptions) {
      userData.push_subscriptions = [];
    }

    // Prevent duplicate subscriptions (by endpoint)
    const existingIndex = userData.push_subscriptions.findIndex(s => s.endpoint === subscription.endpoint);
    if (existingIndex === -1) {
      userData.push_subscriptions.push(subscription);
      await writeB2Object(fileName, userData);
    }

    return res.status(200).json({ success: true, message: 'Subscription saved' });
  } catch (error) {
    console.error('Push Subscription API Error:', error);
    return res.status(500).json({ error: 'Internal server error processing subscription' });
  }
}
