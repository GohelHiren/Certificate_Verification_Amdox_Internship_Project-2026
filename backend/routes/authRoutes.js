import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js'; // <-- Yeh import zaroori hai

const router = express.Router();

// ==========================================
//              ADMIN ROUTES
// ==========================================

// --- Admin Register ---
router.post('/admin/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'All fields required' });

    let admin = await Admin.findOne({ email });
    if (admin) return res.status(400).json({ message: 'Admin already exists' });

    admin = new Admin({ email, password });
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);
    await admin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Admin Login ---
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'All fields required' });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Admin Token
    const token = jwt.sign({ admin: { id: admin.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role: 'admin' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
//              USER (STUDENT) ROUTES
// ==========================================

// --- User Register ---
router.post('/user/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- User Login ---
router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'All fields required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // User Token
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role: 'user', name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================================
//              PROFILE ROUTE (NEW)
// ==========================================
// GET /api/auth/me
// Yeh API logged-in user ki details bhejegi
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Agar User (Student) hai
    if (req.user) {
      const user = await User.findById(req.user.id).select('-password'); // Password mat bhejo
      return res.json(user);
    }
    
    // Agar Admin hai
    if (req.admin) {
      const admin = await Admin.findById(req.admin.id).select('-password');
      return res.json({ ...admin._doc, name: 'Administrator', role: 'admin' });
    }
    
    res.status(404).json({ message: 'User not found' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;