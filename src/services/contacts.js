import { Contact } from '../models/contact.js';

export const getAllContacts = async ({
  filter = {},
  skip = 0,
  limit = 10,
  sort = { name: 1 },
  count = false,
  userId,
} = {}) => {
  const updatedFilter = { ...filter, userId };
  if (count) {
    return await Contact.countDocuments(updatedFilter);
  }
  return await Contact.find(updatedFilter).sort(sort).skip(skip).limit(limit);
};

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (contactData, userId) => {
  return await Contact.create({ ...contactData, userId });
};

export const updateContact = async (contactId, updateData, userId) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    updateData,
    { new: true },
  );
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
