import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { registerUser, loginUser, AuthPayload } from '../services/authService';
import { asyncHandler } from '../middlewares/errorHandler';

export const register = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const payload: AuthPayload = req.body;

    if (!payload.name || !payload.email || !payload.password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    const result = await registerUser(payload);
    res.status(201).json(result);
  }
);

export const login = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const result = await loginUser(email, password);
    res.status(200).json(result);
  }
);

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<void> => {
    res.status(200).json({
      user: req.user,
    });
  }
);
