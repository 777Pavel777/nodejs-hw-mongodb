import process from 'process';
import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
      process.env;

    console.log('MongoDB connection variables:', {
      MONGODB_USER,
      MONGODB_PASSWORD: MONGODB_PASSWORD ? '[REDACTED]' : undefined,
      MONGODB_URL,
      MONGODB_DB,
    });

    if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
      throw new Error('Missing required MongoDB environment variables');
    }

    const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    console.log(
      'Connection String:',
      connectionString.replace(MONGODB_PASSWORD, '[REDACTED]'),
    );

    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error);
    throw error;
  }
};
