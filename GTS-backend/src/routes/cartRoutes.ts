import { Router } from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearUserCart,
  checkout,
} from '../controllers/cartController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/items', addItemToCart);

// Update cart item quantity
router.put('/items/:itemId', updateCartItem);

// Remove item from cart
router.delete('/items/:itemId', removeItemFromCart);

// Clear entire cart
router.delete('/', clearUserCart);

// Checkout
router.post('/checkout', checkout);

export default router;