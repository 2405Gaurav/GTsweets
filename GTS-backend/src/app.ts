import express, { Express } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import sweetRoutes from './routes/sweetRoutes';
import cartRoutes from './routes/cartRoutes'; // 

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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