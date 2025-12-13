import request from 'supertest';
import app from '../app.js';
import { User } from '../models/Users';
import { connectDB, disconnectDB } from '../config/db.js';

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    await connectDB();
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await disconnectDB();
  });

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

    it('should fail when missing required fields', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'John Doe',
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('required');
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

    it('should return valid JWT token', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      const token = response.body.token;
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3);
    });
  });

  describe('GET /api/auth/profile', () => {
    let token: string;

    beforeAll(async () => {
      await User.deleteMany({});
      const response = await request(app).post('/api/auth/register').send({
        name: 'Profile Test User',
        email: 'profile@example.com',
        password: 'password123',
      });
      token = response.body.token;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user.email).toBe('profile@example.com');
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
  });
});
