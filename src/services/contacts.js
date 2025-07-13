import { Contact } from '../models/contact.js';

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};
