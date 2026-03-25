import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './db';
import projectRoutes from './routes/projectRoutes';
import resourceRoutes from './routes/resourceRoutes';
import rateRoutes from './routes/rateRoutes';
import closureRoutes from './routes/closureRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/rates', rateRoutes);
app.use('/api/closures', closureRoutes);

// Health Check
import { Request, Response } from "express";
// ...
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ ok: true });
});


// Start Server
const startServer = async () => {
    try {
        await connectDB();
        console.log("Database connected successfully");
    } catch (error) {
        console.warn("⚠️ Database not available. Running in DEV mode without DB.");
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();


