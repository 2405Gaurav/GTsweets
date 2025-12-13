import { Cart, ICart } from '../models/cart';
import { Sweet } from '../models/Sweets';
import mongoose from 'mongoose';

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface CartWithSummary {
  cart: ICart;
  summary: CartSummary;
}

// Get or create user's active cart
export const getOrCreateCart = async (userId: string): Promise<ICart> => {
  let cart = await Cart.findOne({ 
    userId, 
    status: 'active' 
  }).populate('items.sweetId');

  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [],
      status: 'active',
    });
  }

  return cart;
};

// Get cart with calculated summary
export const getCartWithSummary = async (userId: string): Promise<CartWithSummary> => {
  const cart = await getOrCreateCart(userId);
  const summary = calculateCartSummary(cart);

  return { cart, summary };
};

// Add item to cart
export const addToCart = async (
  userId: string,
  sweetId: string,
  quantity: number
): Promise<ICart> => {
  // Validate sweetId
  if (!mongoose.Types.ObjectId.isValid(sweetId)) {
    const error = new Error('Invalid sweet ID');
    (error as any).statusCode = 400;
    throw error;
  }

  // Check if sweet exists and has sufficient stock
  const sweet = await Sweet.findById(sweetId);
  if (!sweet) {
    const error = new Error('Sweet not found');
    (error as any).statusCode = 404;
    throw error;
  }

  if (sweet.quantity < quantity) {
    const error = new Error(`Only ${sweet.quantity} items available in stock`);
    (error as any).statusCode = 400;
    throw error;
  }

  // Get or create cart
  const cart = await getOrCreateCart(userId);

  // Check if item already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.sweetId.toString() === sweetId
  );

  if (existingItemIndex > -1) {
    // Update existing item quantity
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    
    // Check if total quantity exceeds stock
    if (sweet.quantity < newQuantity) {
      const error = new Error(`Only ${sweet.quantity} items available in stock`);
      (error as any).statusCode = 400;
      throw error;
    }

    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    // Add new item
    cart.items.push({
      sweetId: new mongoose.Types.ObjectId(sweetId),
      quantity,
      priceAtTime: sweet.price,
    });
  }

  cart.updatedAt = new Date();
  await cart.save();
  
  // Populate sweet details before returning
  await cart.populate('items.sweetId');
  return cart;
};

// Update cart item quantity
export const updateCartItemQuantity = async (
  userId: string,
  itemId: string,
  quantity: number
): Promise<ICart> => {
  if (quantity < 1) {
    const error = new Error('Quantity must be at least 1');
    (error as any).statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({ userId, status: 'active' });
  if (!cart) {
    const error = new Error('Cart not found');
    (error as any).statusCode = 404;
    throw error;
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id?.toString() === itemId
  );

  if (itemIndex === -1) {
    const error = new Error('Item not found in cart');
    (error as any).statusCode = 404;
    throw error;
  }

  // Check stock availability
  const sweet = await Sweet.findById(cart.items[itemIndex].sweetId);
  if (!sweet) {
    const error = new Error('Sweet not found');
    (error as any).statusCode = 404;
    throw error;
  }

  if (sweet.quantity < quantity) {
    const error = new Error(`Only ${sweet.quantity} items available in stock`);
    (error as any).statusCode = 400;
    throw error;
  }

  cart.items[itemIndex].quantity = quantity;
  cart.updatedAt = new Date();
  await cart.save();
  
  await cart.populate('items.sweetId');
  return cart;
};

// Remove item from cart
export const removeCartItem = async (
  userId: string,
  itemId: string
): Promise<ICart> => {
  const cart = await Cart.findOne({ userId, status: 'active' });
  if (!cart) {
    const error = new Error('Cart not found');
    (error as any).statusCode = 404;
    throw error;
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id?.toString() === itemId
  );

  if (itemIndex === -1) {
    const error = new Error('Item not found in cart');
    (error as any).statusCode = 404;
    throw error;
  }

  cart.items.splice(itemIndex, 1);
  cart.updatedAt = new Date();
  await cart.save();
  
  await cart.populate('items.sweetId');
  return cart;
};

// Clear entire cart
export const clearCart = async (userId: string): Promise<ICart> => {
  const cart = await Cart.findOne({ userId, status: 'active' });
  if (!cart) {
    const error = new Error('Cart not found');
    (error as any).statusCode = 404;
    throw error;
  }

  cart.items = [];
  cart.updatedAt = new Date();
  await cart.save();
  
  return cart;
};

// Calculate cart summary
export const calculateCartSummary = (cart: ICart): CartSummary => {
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.priceAtTime * item.quantity,
    0
  );

  const taxRate = 0.18; // 18% GST
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    itemCount,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

// Checkout - validate stock and complete cart
export const checkoutCart = async (userId: string): Promise<ICart> => {
  const cart = await Cart.findOne({ userId, status: 'active' }).populate('items.sweetId');
  
  if (!cart) {
    const error = new Error('Cart not found');
    (error as any).statusCode = 404;
    throw error;
  }

  if (cart.items.length === 0) {
    const error = new Error('Cart is empty');
    (error as any).statusCode = 400;
    throw error;
  }

  // Validate stock for all items
  for (const item of cart.items) {
    const sweet = await Sweet.findById(item.sweetId);
    if (!sweet) {
      const error = new Error(`Sweet not found: ${item.sweetId}`);
      (error as any).statusCode = 404;
      throw error;
    }

    if (sweet.quantity < item.quantity) {
      const error = new Error(
        `Insufficient stock for ${sweet.name}. Only ${sweet.quantity} available.`
      );
      (error as any).statusCode = 400;
      throw error;
    }
  }

  // Reduce stock for all items
  for (const item of cart.items) {
    await Sweet.findByIdAndUpdate(item.sweetId, {
      $inc: { quantity: -item.quantity },
    });
  }

  // Mark cart as completed
  cart.status = 'completed';
  cart.updatedAt = new Date();
  await cart.save();

  return cart;
};