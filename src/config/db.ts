import mongoose from 'mongoose';

export async function connectMongo(uri: string): Promise<void> {
  if (!uri) throw new Error('MONGODB_URI is required');
  await mongoose.connect(uri);
}
