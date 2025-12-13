import request from 'supertest';
import './setup';
import app from '../app';
import { User } from '../models/Users';

describe('User Authentication & Authorization', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with customer role by default', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('john@example.com');
      expect(response.body.user.role).toBe('customer');
      expect(response.body.user.name).toBe('John Doe');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should register a new admin user', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });

      expect(response.status).toBe(201);
      expect(response.body.user.role).toBe('admin');
      expect(response.body.user.email).toBe('admin@example.com');
      expect(response.body).toHaveProperty('token');
    });

    it('should fail when email is already registered', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'duplicate@example.com',
        password: 'password123',
      });

      const response = await request(app).post('/api/auth/register').send({
        name: 'Another User',
        email: 'duplicate@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Email already registered');
    });

    it('should fail when missing required fields - no email', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });

    it('should fail when missing required fields - no password', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'test@example.com',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });

    it('should fail when missing required fields - no name', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should hash password before saving', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Secure User',
        email: 'secure@example.com',
        password: 'plaintext123',
      });

      expect(response.status).toBe(201);

      const user = await User.findOne({ email: 'secure@example.com' }).select('+password');
      expect(user?.password).not.toBe('plaintext123');
      expect(user?.password).toMatch(/^\$2[aby]\$\d{1,2}\$/); // bcrypt hash pattern
    });

    it('should return a valid JWT token on successful registration', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Token Test',
        email: 'token@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      const token = response.body.token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.deleteMany({});
      await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should login user with correct credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('name');
      expect(response.body.user).toHaveProperty('role');
      expect(response.body.user.password).toBeUndefined();
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Invalid email or password');
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'password123',
      });

      expect(response.status).toBe(500);
      expect(response.body.error).toContain('Invalid email or password');
    });

    it('should fail when email is missing', async () => {
      const response = await request(app).post('/api/auth/login').send({
        password: 'password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });

    it('should fail when password is missing', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
    });

    it('should return valid JWT token on successful login', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      const token = response.body.token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });

    it('should login admin user successfully', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'adminpass',
        role: 'admin',
      });

      const response = await request(app).post('/api/auth/login').send({
        email: 'admin@example.com',
        password: 'adminpass',
      });

      expect(response.status).toBe(200);
      expect(response.body.user.role).toBe('admin');
    });
  });

  describe('GET /api/auth/profile', () => {
    let customerToken: string;
    let adminToken: string;
    let customerId: string;
    let adminId: string;

    beforeEach(async () => {
      await User.deleteMany({});

      // Register customer
      const customerResponse = await request(app).post('/api/auth/register').send({
        name: 'Customer User',
        email: 'customer@example.com',
        password: 'password123',
      });
      customerToken = customerResponse.body.token;
      customerId = customerResponse.body.user.id;

      // Register admin
      const adminResponse = await request(app).post('/api/auth/register').send({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpass',
        role: 'admin',
      });
      adminToken = adminResponse.body.token;
      adminId = adminResponse.body.user.id;
    });

    it('should get customer profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user.email).toBe('customer@example.com');
      expect(response.body.user.role).toBe('customer');
      expect(response.body.user.id).toBe(customerId);
    });

    it('should get admin profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('admin@example.com');
      expect(response.body.user.role).toBe('admin');
      expect(response.body.user.id).toBe(adminId);
    });

    it('should fail without token', async () => {
      const response = await request(app).get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('token');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Invalid or expired');
    });

    it('should fail with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'InvalidFormat');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('token');
    });

    it('should fail with empty token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer ');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('token');
    });

    it('should not return password in profile response', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user.password).toBeUndefined();
    });
  });

  describe('Authorization Middleware Tests', () => {
    let customerToken: string;
    let adminToken: string;

    beforeEach(async () => {
      await User.deleteMany({});

      const customerResponse = await request(app).post('/api/auth/register').send({
        name: 'Customer',
        email: 'customer@test.com',
        password: 'pass123',
      });
      customerToken = customerResponse.body.token;

      const adminResponse = await request(app).post('/api/auth/register').send({
        name: 'Admin',
        email: 'admin@test.com',
        password: 'pass123',
        role: 'admin',
      });
      adminToken = adminResponse.body.token;
    });

    it('should allow access to public routes without authentication', async () => {
      const registerResponse = await request(app).post('/api/auth/register').send({
        name: 'New User',
        email: 'new@test.com',
        password: 'pass123',
      });
      expect(registerResponse.status).toBe(201);

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: 'new@test.com',
        password: 'pass123',
      });
      expect(loginResponse.status).toBe(200);
    });

    it('should decode JWT token correctly and attach user to request', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${customerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('customer@test.com');
    });
  });

  describe('Edge Cases & Security', () => {
    it('should prevent SQL injection in email field', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: "' OR '1'='1",
        password: 'password123',
      });

      expect(response.status).not.toBe(200);
    });

    it('should handle very long passwords', async () => {
      const longPassword = 'a'.repeat(1000);
      const response = await request(app).post('/api/auth/register').send({
        name: 'Long Pass User',
        email: 'longpass@test.com',
        password: longPassword,
      });

      expect(response.status).toBe(201);
    });

    it('should trim whitespace from email', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Whitespace User',
        email: '  whitespace@test.com  ',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('whitespace@test.com');
    });

    it('should be case-insensitive for email login', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Case Test',
        email: 'CaseSensitive@Test.com',
        password: 'password123',
      });

      const response = await request(app).post('/api/auth/login').send({
        email: 'casesensitive@test.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
    });

    it('should handle concurrent registration attempts', async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        request(app).post('/api/auth/register').send({
          name: `User ${i}`,
          email: `concurrent${i}@test.com`,
          password: 'password123',
        })
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.status === 201).length;
      expect(successCount).toBe(5);
    });
  });

  describe('Token Expiration & Validation', () => {
    it('should include expiration in JWT token', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Token Expiry Test',
        email: 'expiry@test.com',
        password: 'password123',
      });

      const token = response.body.token;
      const decoded = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      expect(decoded).toHaveProperty('exp');
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
    });

    it('should include user id, email, and role in JWT payload', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'JWT Payload Test',
        email: 'payload@test.com',
        password: 'password123',
      });

      const token = response.body.token;
      const decoded = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      expect(decoded).toHaveProperty('id');
      expect(decoded).toHaveProperty('email');
      expect(decoded).toHaveProperty('role');
      expect(decoded.email).toBe('payload@test.com');
    });
  });
});