import express, { Express } from 'express';
import cors from 'cors';


const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'CandyCraft API is running' });
});
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to GTsweets' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// app.use(errorHandler);

export default app;
