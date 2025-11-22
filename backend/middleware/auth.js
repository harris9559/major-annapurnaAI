import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    // Support both "authorization" and "Authorization"
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No authentication token' });
    }

    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: err.name === 'TokenExpiredError'
          ? 'Token expired'
          : 'Invalid token'
      });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
