import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
let isConnected = false;

export async function connectToDB() {
  if (isConnected) return;

  console.log('🚀 Connecting to MongoDB:', MONGODB_URI);

  for (let i = 0; i < 10; i++) {
    try {
      await mongoose.connect(MONGODB_URI);
      isConnected = true;
      console.log('✅ MongoDB connected');
      break;
    } catch (err) {
      console.error('❌ MongoDB connection error:', err);
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  if (!isConnected) throw new Error('❌ MongoDB connection failed');
}
