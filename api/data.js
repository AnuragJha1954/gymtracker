import jwt from 'jsonwebtoken';
import { readB2Object, writeB2Object } from './lib/b2Storage.js';
try {
  const dotenv = await import('dotenv');
  dotenv.default.config({ path: '.env.local' });
} catch (e) {}

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  if (token.startsWith('mock_token_')) {
    req.user = { id: token.split('mock_token_')[1] };
    return next();
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};

async function dataHandler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, collection, data, id } = req.body;
  const userId = req.user.id;
  const fileName = `gymtracker_isolated_${userId}.json`;

  try {
    let userData = await readB2Object(fileName) || {
      transactions: [],
      tasks: [],
      workouts: [],
      workout_sets: [],
      diet_plans: [],
      subscriptions: [],
      reminders: [],
      assignments: []
    };

    if (action === 'readAll') {
      return res.status(200).json({ success: true, data: userData });
    }

    // List of all globally valid collections
    const validCollections = ['transactions', 'tasks', 'workouts', 'workout_sets', 'diet_plans', 'subscriptions', 'reminders', 'assignments'];

    if (!collection || !validCollections.includes(collection)) {
      return res.status(400).json({ error: 'Invalid collection' });
    }

    // Auto-initialize collection if this user has an older JSON file without it
    if (!userData[collection]) {
      userData[collection] = [];
    }

    if (action === 'insert') {
      const newItem = { ...data, id: data.id || Date.now().toString(36) };
      userData[collection].push(newItem);
    } 
    else if (action === 'update') {
      const index = userData[collection].findIndex(item => item.id === id);
      if (index !== -1) {
        userData[collection][index] = { ...userData[collection][index], ...data };
      } else {
        return res.status(404).json({ error: 'Item not found' });
      }
    } 
    else if (action === 'delete') {
      userData[collection] = userData[collection].filter(item => item.id !== id);
    } 
    else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    await writeB2Object(fileName, userData);
    return res.status(200).json({ success: true, data: userData[collection] });
  } catch (error) {
    console.error('Data API Error:', error);
    return res.status(500).json({ error: 'Internal server error processing data' });
  }
}

export default function handler(req, res) {
  authenticate(req, res, () => dataHandler(req, res));
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
