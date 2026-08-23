import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDatabase } from './seed';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ladesar-organics');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDatabase();
  } catch (error: any) {
    console.warn(`⚠️ MongoDB connection error: ${error.message}. Running in memory fallback mode.`);
  }
};

export default connectDB;
