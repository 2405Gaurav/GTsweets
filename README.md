# **TDD KATA: SUGAR RUSH** 🍬

## Sweet Shop Management System

A full-stack sweet shop management system built using **Test-Driven Development (TDD)** principles. This project demonstrates clean code practices, comprehensive testing, and modern development workflows with AI assistance.

---

## 📚 Learning Resources - TDD & Best Practices

Before diving into the code, I studied these excellent resources to understand TDD, refactoring, and modern development practices:

1. **[Fireship: Test Driven Development](https://youtu.be/Jv2uxzhPFl4?si=MvdCgwRspRLaPomr)** - Quick introduction to TDD concepts
2. **[Test-driven development with GitHub Copilot: A beginner's practical guide](https://youtu.be/arn6hqERKn4?si=429kS8PjCmyxnQs3)** - Practical TDD implementation with AI tools
3. **[Code review & refactoring with GitHub Copilot: A beginner's guide](https://www.youtube.com/watch?v=LsQGilvXAfE&t=391s)** - Refactoring techniques and code quality

---

## 🎯 Project Overview

SugarRush is a comprehensive sweet shop management system that allows:
- **Customers** to browse, search, and purchase sweets
- **Admins** to manage inventory, add/update/delete products
- **Cart Management** with real-time stock validation
- **Secure Authentication** using JWT tokens

### Tech Stack

**Backend:**
- Node.js + TypeScript
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Jest + Supertest (Testing)

**Frontend:**
- React + TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite + TypeScript + Tailwind)      │   │
│  │  - Authentication UI                                  │   │
│  │  - Sweet Catalog & Search                            │   │
│  │  - Shopping Cart                                      │   │
│  │  - Admin Dashboard                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                       API LAYER (Express)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes                                               │   │
│  │  ├─ /api/auth (register, login, profile)            │   │
│  │  ├─ /api/sweets (CRUD operations)                    │   │
│  │  └─ /api/cart (cart management)                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middleware                                           │   │
│  │  ├─ authenticateToken (JWT validation)              │   │
│  │  ├─ authorizeRoles (Role-based access)              │   │
│  │  └─ errorHandler (Global error handling)            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Controllers                                          │   │
│  │  ├─ authController (User authentication)            │   │
│  │  ├─ sweetController (Sweet management)              │   │
│  │  └─ cartController (Cart operations)                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Business Logic                                       │   │
│  │  ├─ authService (Registration, Login, JWT)          │   │
│  │  ├─ sweetService (CRUD, Stock management)           │   │
│  │  └─ cartService (Cart operations, Checkout)         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE LAYER (MongoDB)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Models (Mongoose Schemas)                           │   │
│  │  ├─ User (name, email, password, role)              │   │
│  │  ├─ Sweet (name, category, price, quantity)         │   │
│  │  └─ Cart (userId, items[], status)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Test-Driven Development (TDD) Approach

This project strictly follows the **Red-Green-Refactor** cycle:

### TDD Implementation Areas

#### 1. **Authentication System** (`tests/auth.test.ts`)
- ✅ User registration with validation
- ✅ Login with credential verification
- ✅ JWT token generation and validation
- ✅ Profile retrieval with authentication
- ✅ Password hashing verification
- ✅ Role-based authorization

**Test Coverage:**
- Registration edge cases (duplicate email, missing fields, invalid email)
- Login scenarios (correct/incorrect credentials)
- Token validation and expiration
- Security features (SQL injection prevention, password security)

#### 2. **Sweet Management** (`tests/sweets.test.ts`)
- ✅ CRUD operations with proper authorization
- ✅ Stock validation (prevent negative quantities)
- ✅ Search functionality
- ✅ Admin-only operations enforcement

**Test Coverage:**
- Sweet creation with admin/customer roles
- Update and delete operations
- Validation for negative prices/quantities
- Non-existent resource handling

#### 3. **Cart System** (`services/cartService.ts`)
- ✅ Add/update/remove items from cart
- ✅ Real-time stock validation
- ✅ Cart summary calculation (subtotal, tax, total)
- ✅ Checkout process with inventory management

**Test Coverage:**
- Cart operations with stock validation
- Multiple item management
- Tax calculation (18% GST)
- Checkout flow with inventory updates

### TDD Workflow Example

```typescript
// 1. RED: Write failing test first
describe('POST /api/sweets', () => {
  it('should reject negative price', async () => {
    const response = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Sweet', category: 'candy', price: -5, quantity: 10 });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('negative');
  });
});

// 2. GREEN: Implement minimum code to pass
export const createSweet = async (payload: CreateSweetPayload) => {
  if (payload.price < 0) {
    const error = new Error('Price cannot be negative');
    (error as any).statusCode = 400;
    throw error;
  }
  // ... rest of implementation
};

// 3. REFACTOR: Clean up code while keeping tests green
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/2405Gaurav/GTsweets.git
cd GTsweets/GTS-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
MONGODB_URI=mongodb://localhost:27017/sugarrush
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sugarrush

JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

4. **Run tests**
```bash
npm test
```

5. **Start development server**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../GTS-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start development server**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## 📸 Application Screenshots

### Homepage - Sweet Catalog
![Sweet Catalog](./public/assets/screeshots/homepage.png)
*Browse through our collection of delicious sweets*

### Admin Dashboard
![Admin Dashboard](.GTS-frontend/public/assets/screeshots/admin-dashboard.png)
*Manage inventory, add new sweets, and track stock*

### Authentication
![Login Page](./public/assets/screeshots/login.png)
*Secure authentication with JWT tokens*

### User Dashboard
![User Dashboard](./public/assets/screeshots/userdb.png)
*View past orders and account details*
## 🧪 Running Tests

### Backend Tests

```bash
cd GTS-backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
```

### Test Report Summary

```
Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        8.234s

Coverage:
- Statements   : 95.2%
- Branches     : 88.6%
- Functions    : 92.3%
- Lines        : 94.8%
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Sweets Management
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets
- `GET /api/sweets/:id` - Get sweet by ID
- `POST /api/sweets` - Create sweet (Admin only)
- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)
- `POST /api/sweets/:id/purchase` - Purchase sweet (Protected)
- `POST /api/sweets/:id/restock` - Restock sweet (Admin only)

### Cart Management
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart/items` - Add item to cart (Protected)
- `PUT /api/cart/items/:itemId` - Update cart item (Protected)
- `DELETE /api/cart/items/:itemId` - Remove cart item (Protected)
- `DELETE /api/cart` - Clear cart (Protected)
- `POST /api/cart/checkout` - Checkout cart (Protected)

---

## 🤖 My AI Usage

### AI Tools Used

I extensively used **Claude AI (Anthropic)** and **GitHub Copilot** throughout this project to enhance productivity while maintaining code quality and learning.

### How I Used AI

#### 1. **Test Generation & TDD Workflow**
- **Used AI for:** Generating initial test structure and edge cases
- **Example:** Asked Claude to suggest test cases for authentication that I might have missed
- **Impact:** Helped me achieve 95%+ test coverage by identifying edge cases like:
  - SQL injection attempts
  - Concurrent registration attempts
  - Token expiration scenarios
  - Case-insensitive email handling

#### 2. **Code Refactoring**
- **Used AI for:** Identifying code smells and suggesting cleaner alternatives
- **Example:** Refactored error handling from try-catch blocks to a centralized `asyncHandler` wrapper
- **Before AI:**
```typescript
try {
  const sweet = await createSweet(payload);
  res.status(201).json(sweet);
} catch (error) {
  res.status(500).json({ error: error.message });
}
```
- **After AI Suggestion:**
```typescript
export const createSweetHandler = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const sweet = await createSweet(req.body);
    res.status(201).json(sweet);
  }
);
```

#### 3. **TypeScript Type Definitions**
- **Used AI for:** Creating comprehensive interface definitions
- **Impact:** Reduced type errors and improved code maintainability
- **Example:** Generated proper types for cart items, authentication payloads, and service responses

#### 4. **Architecture Design**
- **Used AI for:** Brainstorming the layered architecture (Controller → Service → Model)
- **Discussed with AI:** Separation of concerns, dependency injection patterns, and middleware structure
- **Outcome:** Clean, maintainable architecture following SOLID principles

#### 5. **Documentation**
- **Used AI for:** Generating initial documentation structure, README sections, and code comments
- **Personalization:** I reviewed and customized all AI-generated documentation to reflect my actual implementation

#### 6. **Debugging & Problem Solving**
- **Used AI for:** Understanding MongoDB validation errors, TypeScript strict mode issues
- **Example:** Solved issue with password comparison logic (inverted boolean check)
- **Learning:** AI helped me understand the root cause rather than just providing a fix

### AI Limitations & Manual Work

While AI was helpful, I manually:
- Designed the business logic and workflow
- Made all architectural decisions
- Wrote custom validation logic
- Debugged complex async/await race conditions
- Configured deployment (Render + Vercel)
- Created the UI/UX design and interactions
- Implemented responsive design with Tailwind

### Reflection on AI Impact

**Positive Impact:**
- ✅ Accelerated development by 40-50%
- ✅ Helped identify edge cases I would have missed
- ✅ Improved code quality through refactoring suggestions
- ✅ Served as a 24/7 pair programming partner

**Challenges:**
- ⚠️ Sometimes suggested overcomplicated solutions
- ⚠️ Required validation of generated code for correctness
- ⚠️ Needed to ensure I understood the code, not just copied it

**Key Learning:**
AI tools are incredibly powerful when used as **assistants**, not **replacements**. The most valuable skill is knowing **when to use AI** and **when to think independently**. I treated AI as a senior developer reviewing my work, suggesting improvements, but always made the final decisions myself.

---

## 🌐 Live Deployment

### Frontend (Vercel)
🔗 **Live Demo:** [https://g-tsweets.vercel.app](https://g-tsweets.vercel.app)

### Backend (Render)
🔗 **API Base URL:** [https://gtsweets-backend.onrender.com/api](https://gtsweets-backend.onrender.com/api)

**Note:** The backend is deployed on Render's free tier, which may spin down after periods of inactivity. First request might take 30-60 seconds to wake up the server.

---

## 👤 Test Credentials

### Admin Account
```
Email: admin@sugarrush.com
Password: admin123
```

### Customer Account
```
Email: customer@sugarrush.com
Password: customer123
```

---

## 🎨 Features Implemented

### Customer Features
- ✅ Browse sweet catalog
- ✅ Search and filter sweets
- ✅ Add items to cart
- ✅ Real-time stock validation
- ✅ Checkout with tax calculation
- ✅ View order history

### Admin Features
- ✅ Add new sweets
- ✅ Update sweet details
- ✅ Delete sweets
- ✅ Restock inventory
- ✅ View all orders

### Technical Features
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Password hashing with bcrypt
- ✅ MongoDB data persistence
- ✅ RESTful API design
- ✅ Comprehensive test coverage (95%+)
- ✅ Error handling middleware
- ✅ Input validation
- ✅ Responsive UI design

---

## 📝 Git Commit History

This project follows **conventional commits** with clear, descriptive messages following the TDD workflow:

```bash
# Example commit messages showing TDD progression
feat: add user registration endpoint (RED phase)
test: add authentication tests for registration
fix: implement password hashing on user save (GREEN phase)
refactor: extract JWT generation to utility function
test: add edge cases for duplicate email registration
feat: add role-based authorization middleware
test: verify admin-only routes reject customers
```

### AI Co-authorship
For commits where AI significantly contributed, I added co-author attribution:

```bash
git commit -m "refactor: centralize error handling with asyncHandler

Used Claude AI to suggest the asyncHandler pattern for cleaner
async error handling across all routes.

Co-authored-by: Claude AI <ai@anthropic.com>"
```

---

## 🛠️ Technologies & Tools

### Backend
- **Runtime:** Node.js 18+
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Testing:** Jest + Supertest
- **In-Memory DB (Testing):** mongodb-memory-server

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Routing:** React Router v6
- **Icons:** Lucide React

### DevOps & Deployment
- **Version Control:** Git + GitHub
- **Backend Hosting:** Render
- **Frontend Hosting:** Vercel
- **CI/CD:** Automated via Git hooks

---

## 📈 Future Enhancements

- [ ] Add payment gateway integration (Stripe/Razorpay)
- [ ] Implement order tracking system
- [ ] Add email notifications
- [ ] Create admin analytics dashboard
- [ ] Add product reviews and ratings
- [ ] Implement wishlist functionality
- [ ] Add multi-language support
- [ ] Optimize with Redis caching
- [ ] Add GraphQL API alternative
- [ ] Implement real-time notifications (WebSockets)

---

## 🤝 Contributing

This is a personal project for a TDD kata challenge, but feedback and suggestions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (following TDD principles)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 About the Developer

**Gaurav Thakur**
- Portfolio: [thegauravthakur.in](https://thegauravthakur.in)
- GitHub: [@2405Gaurav](https://github.com/2405Gaurav)
- Email: contact@thegauravthakur.in

---

## 🙏 Acknowledgments

- **Anthropic's Claude AI** for assistance in code review and refactoring
- **GitHub Copilot** for intelligent code suggestions
- **Fireship** for excellent TDD tutorials
- **MongoDB** for comprehensive documentation
- **The TDD community** for best practices and patterns

---

## 📊 Project Statistics

- **Total Lines of Code:** ~3,500
- **Test Files:** 5
- **Test Cases:** 45+
- **Test Coverage:** 95.2%
- **Development Time:** ~40 hours
- **Git Commits:** 51+
- **API Endpoints:** 16

---

**Built with ❤️ and high sugar content by Gaurav Thakur**

*"Write tests first, code later - The TDD way!"*