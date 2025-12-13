import { User } from '../models/Users';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);

      expect(user._id).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe('customer'); // default role
      expect(user.password).not.toBe(userData.password); // should be hashed
      expect(user.createdAt).toBeDefined();
    });

    it('should create an admin user', async () => {
      const adminData = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin' as const,
      };

      const admin = await User.create(adminData);

      expect(admin.role).toBe('admin');
    });

    it('should fail without required name', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail without required email', async () => {
      const userData = {
        name: 'John Doe',
        password: 'password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail without required password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'test@example.com',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail with invalid email format', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await User.create(userData);

      const duplicateUser = {
        name: 'Jane Doe',
        email: 'john@example.com',
        password: 'password456',
      };

      await expect(User.create(duplicateUser)).rejects.toThrow();
    });

    it('should fail with password less than 6 characters', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345', // only 5 characters
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should convert email to lowercase', async () => {
      const userData = {
        name: 'John Doe',
        email: 'JOHN@EXAMPLE.COM',
        password: 'password123',
      };

      const user = await User.create(userData);

      expect(user.email).toBe('john@example.com');
    });

    it('should trim whitespace from name', async () => {
      const userData = {
        name: '  John Doe  ',
        email: 'john@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);

      expect(user.name).toBe('John Doe');
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);

      expect(user.password).not.toBe(userData.password);
      expect(user.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash pattern
    });

    it('should not rehash password if not modified', async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const originalHash = user.password;

      user.name = 'Jane Doe';
      await user.save();

      expect(user.password).toBe(originalHash);
    });
  });

  describe('comparePassword Method', () => {
    it('should return true for correct password', async () => {
      const password = 'password123';
      
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: password,
      });

      // Need to fetch user with password field since select: false
      const userWithPassword = await User.findById(user._id).select('+password');

      const isMatch = await userWithPassword!.comparePassword(password);

      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const user = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const userWithPassword = await User.findById(user._id).select('+password');

      const isMatch = await userWithPassword!.comparePassword('wrongpassword');

      expect(isMatch).toBe(false);
    });
  });

  describe('Password Field Selection', () => {
    it('should not return password by default', async () => {
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const user = await User.findOne({ email: 'john@example.com' });

      expect(user).toBeDefined();
      expect((user as any).password).toBeUndefined();
    });

    it('should return password when explicitly selected', async () => {
      await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      const user = await User.findOne({ email: 'john@example.com' }).select('+password');

      expect(user).toBeDefined();
      expect(user!.password).toBeDefined();
      expect(user!.password).toMatch(/^\$2[ayb]\$.{56}$/);
    });
  });
});