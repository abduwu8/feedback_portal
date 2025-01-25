import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const protect = async (req, res, next) => {
  try {
    let token = req.cookies.jwt;
    
    console.log('Cookies received:', req.cookies); // Debug line
    console.log('JWT Token:', token); // Debug line

    if (!token) {
      console.log('No token found'); // Debug line
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug line

    req.user = await User.findById(decoded.userId).select('-password');
    console.log('User found:', req.user); // Debug line

    next();
  } catch (error) {
    console.error('Auth middleware error:', error); // Debug line
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};

export { protect, admin }; 