import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getContacts } from './controllers/contacts.js';
import { getContact } from './controllers/contacts.js';
import process from 'process';

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.get('/contacts', getContacts);
  app.get('/contacts/:contactId', getContact);

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};
