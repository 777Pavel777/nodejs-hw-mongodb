import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = express.Router();

router.get('/contacts../contacts', ctrlWrapper(getContacts));
router.get('/contacts/:contactId', ctrlWrapper(getContact));
router.post('/contacts', ctrlWrapper(createContact));
router.patch('/contacts/:contactId', ctrlWrapper(updateContact));
router.delete('/contacts/:contactId', ctrlWrapper(deleteContact));

export default router;
