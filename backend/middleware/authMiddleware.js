// backend/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // 1. Header se token nikaalo
  const token = req.header('x-auth-token');

  // 2. Check karo ki token hai ya nahi
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. Token ko Verify karo
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Decoded token se user ki ID ko request mein add kar do
    req.admin = decoded.admin;
    next(); // Sab sahi hai, request ko aage jaane do
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;