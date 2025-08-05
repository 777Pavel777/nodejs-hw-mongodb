import process from 'process';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import 'dotenv/config';

const start = async () => {
  try {
    await initMongoConnection();
    console.log('MongoDB connection established');
    setupServer();
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
