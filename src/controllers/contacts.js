import {
  getAllContacts,
  getContactById,
  createContact as createContactService,
  updateContact as сontactUpdate,
  deleteContact as contactDelete,
} from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getContacts = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const perPageNum = Math.max(parseInt(perPage, 10) || 10, 1);
  const skip = (pageNum - 1) * perPageNum;

  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true' || isFavourite === true;
  }

  const validSortFields = [
    'name',
    'phoneNumber',
    'email',
    'contactType',
    'createdAt',
    'updatedAt',
  ];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
  const sortValue = sortOrder === 'desc' ? -1 : 1;
  const sort = { [sortField]: sortValue };

  const [contacts, totalItems] = await Promise.all([
    getAllContacts({ filter, skip, limit: perPageNum, sort }),
    getAllContacts({ filter, count: true }),
  ]);

  const totalPages = Math.ceil(totalItems / perPageNum);
  const hasPreviousPage = pageNum > 1;
  const hasNextPage = pageNum < totalPages;

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: pageNum,
      perPage: perPageNum,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
};

export const getContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContact = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const contact = await createContactService({
    name,
    phoneNumber,
    email,
    isFavourite: isFavourite || false,
    contactType,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const updateData = req.body;
  const contact = await сontactUpdate(contactId, updateData);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
};

export const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  const contact = await contactDelete(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};
