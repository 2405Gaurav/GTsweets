import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { asyncHandler } from '../middlewares/errorHandler';
import {
  getCartWithSummary,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  checkoutCart,
} from '../services/cartService';

// GET /api/cart - Get user's cart with summary
export const getCart = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const result = await getCartWithSummary(req.user.id);
  res.status(200).json(result);
});

// POST /api/cart/items - Add item to cart
export const addItemToCart = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const { sweetId, quantity } = req.body;

  if (!sweetId) {
    res.status(400).json({ error: 'Sweet ID is required' });
    return;
  }

  if (!quantity || quantity < 1) {
    res.status(400).json({ error: 'Valid quantity is required' });
    return;
  }

  const cart = await addToCart(req.user.id, sweetId, quantity);
  const summary = await getCartWithSummary(req.user.id);
  
  res.status(200).json({
    message: 'Item added to cart successfully',
    cart,
    summary: summary.summary,
  });
});

// PUT /api/cart/items/:itemId - Update cart item quantity
export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const { itemId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400).json({ error: 'Valid quantity is required' });
    return;
  }

  const cart = await updateCartItemQuantity(req.user.id, itemId, quantity);
  const summary = await getCartWithSummary(req.user.id);
  
  res.status(200).json({
    message: 'Cart item updated successfully',
    cart,
    summary: summary.summary,
  });
});

// DELETE /api/cart/items/:itemId - Remove item from cart
export const removeItemFromCart = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const { itemId } = req.params;

  const cart = await removeCartItem(req.user.id, itemId);
  const summary = await getCartWithSummary(req.user.id);
  
  res.status(200).json({
    message: 'Item removed from cart successfully',
    cart,
    summary: summary.summary,
  });
});

// DELETE /api/cart - Clear entire cart
export const clearUserCart = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const cart = await clearCart(req.user.id);
  
  res.status(200).json({
    message: 'Cart cleared successfully',
    cart,
    summary: {
      itemCount: 0,
      subtotal: 0,
      tax: 0,
      total: 0,
    },
  });
});

// POST /api/cart/checkout - Checkout cart
export const checkout = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }

  const cart = await checkoutCart(req.user.id);
  
  res.status(200).json({
    message: 'Checkout successful! Order placed.',
    cart,
  });
});