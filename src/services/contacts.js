import { Contact } from '../models/contact.js';

export const getAllContacts = async (
  query = {},
  skip = 0,
  limit = 10,
  sort = { name: 1 },
) => {
  return await Contact.find(query).sort(sort).skip(skip).limit(limit);
};

export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (contactData) => {
  return await Contact.create(contactData);
};

export const updateContact = async (contactId, updateData) => {
  return await Contact.findByIdAndUpdate(contactId, updateData, { new: true });
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
