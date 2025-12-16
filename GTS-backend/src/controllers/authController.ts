import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/errorHandler';
import { registerUser, loginUser } from '../services/authService';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: 'All fields are required: name, email, and password' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Please provide a valid email address' 
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long' 
    });
  }

  // Validate role if provided
  if (role && !['customer', 'admin'].includes(role)) {
    return res.status(400).json({ 
      message: 'Invalid role. Must be either "customer" or "admin"' 
    });
  }

  const result = await registerUser({ name, email, password, role });
  return res.status(201).json(result);
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email and password are required' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Please provide a valid email address' 
    });
  }

  const result = await loginUser(email, password);
  return res.status(200).json(result);
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'User not authenticated' 
    });
  }

  return res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
});