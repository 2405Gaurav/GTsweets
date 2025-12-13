import request from 'supertest';
import express from 'express';
import cartRoutes from '../routes/cartRoutes';
import * as cartService from '../services/cartService';

const app = express();
app.use(express.json());

jest.mock('../middlewares/authMiddleware', () => ({
  authenticateToken: (req: any, _res: any, next: any) => {
    req.user = { id: 'user123' };
    next();
  },
}));

jest.mock('../services/cartService');

app.use('/api/cart', cartRoutes);

describe('Cart Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/cart', () => {
    it('should return cart with summary', async () => {
      (cartService.getCartWithSummary as jest.Mock).mockResolvedValue({
        cart: { items: [] },
        summary: { itemCount: 0, subtotal: 0, tax: 0, total: 0 },
      });

      const res = await request(app).get('/api/cart');

      expect(res.status).toBe(200);
      expect(res.body.summary.itemCount).toBe(0);
    });
  });

  describe('POST /api/cart/items', () => {
    it('should add item to cart', async () => {
      (cartService.addToCart as jest.Mock).mockResolvedValue({ items: [] });
      (cartService.getCartWithSummary as jest.Mock).mockResolvedValue({
        summary: { itemCount: 2, subtotal: 200, tax: 36, total: 236 },
      });

      const res = await request(app)
        .post('/api/cart/items')
        .send({ sweetId: '507f191e810c19729de860ea', quantity: 2 });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Item added to cart successfully');
    });

    it('should fail if quantity is invalid', async () => {
      const res = await request(app)
        .post('/api/cart/items')
        .send({ sweetId: 'abc', quantity: 0 });

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/cart/items/:itemId', () => {
    it('should update cart item quantity', async () => {
      (cartService.updateCartItemQuantity as jest.Mock).mockResolvedValue({ items: [] });
      (cartService.getCartWithSummary as jest.Mock).mockResolvedValue({
        summary: { itemCount: 3, subtotal: 300, tax: 54, total: 354 },
      });

      const res = await request(app)
        .put('/api/cart/items/item123')
        .send({ quantity: 3 });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Cart item updated successfully');
    });
  });

  describe('DELETE /api/cart/items/:itemId', () => {
    it('should remove item from cart', async () => {
      (cartService.removeCartItem as jest.Mock).mockResolvedValue({ items: [] });
      (cartService.getCartWithSummary as jest.Mock).mockResolvedValue({
        summary: { itemCount: 0, subtotal: 0, tax: 0, total: 0 },
      });

      const res = await request(app).delete('/api/cart/items/item123');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Item removed from cart successfully');
    });
  });

  describe('DELETE /api/cart', () => {
    it('should clear the cart', async () => {
      (cartService.clearCart as jest.Mock).mockResolvedValue({ items: [] });

      const res = await request(app).delete('/api/cart');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Cart cleared successfully');
      expect(res.body.summary.total).toBe(0);
    });
  });

  describe('POST /api/cart/checkout', () => {
    it('should checkout cart', async () => {
      (cartService.checkoutCart as jest.Mock).mockResolvedValue({ status: 'completed' });

      const res = await request(app).post('/api/cart/checkout');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Checkout successful! Order placed.');
    });
  });
});
