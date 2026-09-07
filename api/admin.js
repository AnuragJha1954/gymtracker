import jwt from 'jsonwebtoken';
import { readB2Object, writeB2Object, deleteB2Object } from './lib/b2Storage.js';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') throw new Error('Not an admin');
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden. Admin access required.' });
  }

  try {
    if (req.method === 'GET') {
      // Fetch all users
      const users = await readB2Object('users.json') || [];
      // Remove passwords before sending to frontend
      const safeUsers = users.map(u => ({ id: u.id, email: u.email, name: u.name, created_at: u.created_at, googleId: u.googleId }));
      return res.status(200).json({ success: true, users: safeUsers });
    }

    if (req.method === 'DELETE') {
      // Delete a user
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'User ID is required' });

      let users = await readB2Object('users.json') || [];
      const updatedUsers = users.filter(u => u.id !== id);
      
      if (users.length === updatedUsers.length) {
        return res.status(404).json({ error: 'User not found' });
      }

      await writeB2Object('users.json', updatedUsers);

      // Attempt to delete their data file as well
      try {
        await deleteB2Object(`user_data_${id}.json`);
      } catch (err) {
        console.error(`Failed to delete data for user ${id}, might not exist yet.`);
      }

      return res.status(200).json({ success: true, message: 'User deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Admin API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
