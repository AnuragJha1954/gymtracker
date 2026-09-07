import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { readB2Object, writeB2Object } from '../lib/b2Storage.js';
import { sendWelcomeEmail } from '../lib/email.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Missing Google credential' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let users = await readB2Object('users.json') || [];
    let user = users.find(u => u.email === email);

    // If user doesn't exist, create them
    if (!user) {
      const userId = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
      user = {
        id: userId,
        email,
        name,
        googleId,
        created_at: new Date().toISOString()
      };
      users.push(user);
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

      // Send welcome email asynchronously
      sendWelcomeEmail(email, name, "Authenticated via Google OAuth").catch(e => console.error(e));
    } else {
      // If user exists but no googleId is linked, link it now (or just proceed)
      if (!user.googleId) {
        user.googleId = googleId;
        await writeB2Object('users.json', users);
      }
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({ success: true, token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Google Auth API Error:', error);
    return res.status(500).json({ error: 'Internal server error during Google authentication' });
  }
}
