import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const origins = [
    'http://localhost:4000', 
    'https://data-base-inky.vercel.app',
    'https://db-backend-0p5f.onrender.com']

app.use(cors({ origin: origins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
