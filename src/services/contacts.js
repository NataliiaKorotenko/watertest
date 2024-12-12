import ContactCollection from '../db/models/Contact.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';


export const getContacts = async ({ userId, page = 1, perPage = 10, sortBy = "_id", sortOrder = "asc" } = {}) => {
  const query = ContactCollection.find({ userId });

  const totalItems = await ContactCollection.countDocuments();
  const skip = (page - 1) * perPage;

 const data = await query.skip(skip).limit(perPage).sort({[sortBy]: sortOrder});


  const paginationData = calculatePaginationData({ totalItems, page, perPage });
  return { data, ...paginationData };
};


export const getContactById = ({ id, userId }) =>
  ContactCollection.findOne({ _id: id, userId });

export const addContact = (payload) => ContactCollection.create(payload);

export const updateContact = async ({ _id, userId, payload, options = {} }) => {
  const rawResult = await ContactCollection.findOneAndUpdate(
    { _id, userId },
    payload,
    {
      ...options,
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContact = ({ _id, userId }) =>
  ContactCollection.findOneAndDelete({ _id, userId });
