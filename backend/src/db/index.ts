import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pmobm';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
};

export const getPool = () => {
    if (mongoose.connection.readyState !== 1) {
        console.warn('Mongoose is not connected yet or was disconnected.');
    }
    return mongoose.connection;
};
