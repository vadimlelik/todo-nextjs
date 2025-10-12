/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('❌ Please define the MONGODB_URI environment variable');
}

/**
 * Глобальный кеш соединения, чтобы Mongoose не создавал новый connect
 * при каждом запросе (особенно важно для serverless и Next.js)
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached.conn) {
    // Уже подключено
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🚀 Connecting to MongoDB:', MONGODB_URI);
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      })
      .then((mongoose) => {
        console.log('✅ MongoDB connected');
        return mongoose;
      })
      .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
