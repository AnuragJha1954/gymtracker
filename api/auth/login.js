import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readB2Object } from '../lib/b2Storage.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  try {
    if (email === 'unitrack' && password === 'Unitrackadmin@26') {
      const adminUser = { id: 'admin', role: 'admin', name: 'Super Admin', email: 'admin@unitrack.infirow.in' };
      const token = jwt.sign(adminUser, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.status(200).json({ success: true, token, user: adminUser });
    }

    const users = await readB2Object('users.json') || [];
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.password && user.googleId) {
      return res.status(401).json({ error: 'This account uses Google Login. Please sign in with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({ success: true, token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Login API Error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
}
