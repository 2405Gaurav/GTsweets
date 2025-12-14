import express, { Express } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import sweetRoutes from './routes/sweetRoutes';
import cartRoutes from './routes/cartRoutes';

const app: Express = express();

// CORS Configuration - MUST be specific
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://g-tsweets.vercel.app/'
    : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight requests - FIXED: Remove path parameter
app.options(cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetRoutes);
app.use('/api/cart', cartRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'GTsweets API is running' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GTsweets API' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;