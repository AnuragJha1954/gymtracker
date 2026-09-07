import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readB2Object, writeB2Object } from '../lib/b2Storage.js';
import { sendResetPasswordEmail } from '../lib/email.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, email, token, newPassword } = req.body;

  try {
    let users = await readB2Object('users.json') || [];

    if (action === 'request') {
      if (!email) return res.status(400).json({ error: 'Email is required' });
      
      const user = users.find(u => u.email === email);
      if (!user) {
        // Return success even if user doesn't exist for security reasons (don't leak emails)
        return res.status(200).json({ success: true, message: 'If the email exists, a reset link has been sent.' });
      }

      // Generate a temporary reset token (expires in 1h)
      const resetToken = jwt.sign({ id: user.id, email: user.email, type: 'reset' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Save reset token hash in user object for verification later
      user.resetToken = resetToken;
      await writeB2Object('users.json', users);

      await sendResetPasswordEmail(user.email, resetToken);
      return res.status(200).json({ success: true, message: 'If the email exists, a reset link has been sent.' });
    }

    if (action === 'reset') {
      if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password are required' });

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      if (decoded.type !== 'reset') return res.status(400).json({ error: 'Invalid token type' });

      const userIndex = users.findIndex(u => u.id === decoded.id);
      if (userIndex === -1) return res.status(400).json({ error: 'User not found' });

      if (users[userIndex].resetToken !== token) {
        return res.status(400).json({ error: 'Token has already been used or is invalid' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      users[userIndex].password = await bcrypt.hash(newPassword, salt);
      users[userIndex].resetToken = null; // Consume token

      await writeB2Object('users.json', users);
      return res.status(200).json({ success: true, message: 'Password has been successfully reset.' });
    }

    return res.status(400).json({ error: 'Invalid action' });
  } catch (error) {
    console.error('Reset Password API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
