import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readB2Object, writeB2Object } from '../lib/b2Storage.js';
import { sendWelcomeEmail } from '../lib/email.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing required fields' });

  try {
    let users = await readB2Object('users.json') || [];
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists in workspace' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate simple ID
    const userId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2);

    const newUser = {
      id: userId,
      email,
      name,
      password: hashedPassword,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    await writeB2Object('users.json', users);

    // Initialize user data file on B2
    const initialData = {
      transactions: [],
      tasks: [],
      workouts: [],
      workout_sets: [],
      diet_plans: [],
      subscriptions: []
    };
    await writeB2Object(`user_data_${userId}.json`, initialData);

    // Send email and await it so Vercel doesn't kill the function
    try {
      await sendWelcomeEmail(email, name, password);
    } catch (e) {
      console.error('Failed to send welcome email', e);
    }

    const token = jwt.sign({ id: userId, email, name }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({ success: true, token, user: { id: userId, email, name } });
  } catch (error) {
    console.error('Register API Error:', error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
}
