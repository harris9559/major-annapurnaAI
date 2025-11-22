import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { inMemoryUsers } from '../routes/auth.js';
import mongoose from 'mongoose';

export const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.userId = decoded.userId;

    // Check DB status
    const isDBConnected = mongoose.connection.readyState === 1;

    if (isDBConnected) {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }

    } else {
      // In-memory fallback
      let foundAdmin = false;

      for (const [email, user] of inMemoryUsers.entries()) {
        if (user._id === req.userId && user.isAdmin) {
          foundAdmin = true;
          break;
        }
      }

      if (!foundAdmin) {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }
    }

    next();

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
