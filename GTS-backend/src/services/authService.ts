import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/Users';

export interface AuthPayload {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'customer';
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerUser = async (payload: AuthPayload): Promise<AuthResponse> => {
  // Normalize email (trim and lowercase)
  const normalizedEmail = payload.email.trim().toLowerCase();

  // Validate email format
  if (!emailRegex.test(normalizedEmail)) {
    const error = new Error('Invalid email format');
    (error as any).statusCode = 400;
    throw error;
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error('Email already registered');
    (error as any).statusCode = 500;
    throw error;
  }

  const user = new User({
    name: payload.name,
    email: normalizedEmail,
    password: payload.password,
    role: payload.role || 'customer',
  });

  const savedUser = await user.save();
  const token = generateToken(savedUser);

  return {
    user: {
      id: savedUser._id.toString(),
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
    },
    token,
  };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Normalize email (trim and lowercase)
  const normalizedEmail = email.trim().toLowerCase();

  // Find user and include password field
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    const error = new Error('Invalid email or password');
    (error as any).statusCode = 500;
    throw error;
  }

  // Compare password - FIX: Inverted logic!
  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch) {  // ✅ FIXED: Should be !passwordMatch
    const error = new Error('Invalid email or password');
    (error as any).statusCode = 500;
    throw error;
  }

  const token = generateToken(user);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || 'secret';
  const payload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  
  return jwt.sign(payload, secret, {
    expiresIn: '7d',
  });
};