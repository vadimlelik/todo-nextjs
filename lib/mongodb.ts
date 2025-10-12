import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
let isConnected = false;

export async function connectToDB() {
  if (isConnected) return;
  console.log('🚀 MongoDB connecting...', MONGODB_URI);
  for (let i = 0; i < 10; i++) {
    try {
      await mongoose.connect(MONGODB_URI);
      isConnected = true;
      console.log('✅ MongoDB connected');
      break;
    } catch (err) {
      console.log(`⚠️ MongoDB not ready, retrying in 3s... (${i + 1}/10)`);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  if (!isConnected)
    throw new Error('MongoDB connection failed after 10 retries');
}
