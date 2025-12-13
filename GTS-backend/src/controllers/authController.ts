import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/errorHandler';
import { registerUser, loginUser } from '../services/authService';

export const register = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    res.status(400).json({ 
      error: 'All fields are required: name, email, and password' 
    });
    return;
  }

  const result = await registerUser({ name, email, password, role });
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    res.status(400).json({ 
      error: 'Email and password are required' 
    });
    return;
  }

  const result = await loginUser(email, password);
  res.status(200).json(result);
});

export const getProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    },
  });
});