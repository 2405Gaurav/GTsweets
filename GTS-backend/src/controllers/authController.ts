import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { registerUser, loginUser, AuthPayload } from '../services/authService';
import { asyncHandler } from '../middleware/errorHandler';

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

