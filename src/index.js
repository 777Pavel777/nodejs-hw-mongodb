import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

const start = async () => {
  await initMongoConnection();
  setupServer();
};

start();
