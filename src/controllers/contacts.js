import createHttpError from 'http-errors';
import * as path from 'node:path';

import * as contactServices from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

import { sortByList } from '../db/models/Contact.js';

const enableCloudinary = env('ENABLE_CLOUDINARY');

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
  const filter = req.query.filter || {};
  const { _id: userId } = req.user;
  filter.userId = userId;

  const data = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  res.json({
    status: 200,
    message: 'Successfully find contacts!',
    data,
  });
};

export const getContactsByIdController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const data = await contactServices.getContactById({ id, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully find contacts!`,
    data,
  });
};

export const addContactController = async (req, res) => {
    const { _id: userId } = req.user;
    let photo = null;
    if (req.file) {
      if (enableCloudinary === 'true') {
        photo = await saveFileToCloudinary(req.file, 'photo');
      } else {
        await saveFileToUploadDir(req.file);
        photo = path.join(req.file.filename);
      }
    }


const data = await contactServices.addContact({ ...req.body, photo, userId });

  res.status(201).json({
    status: 201,
   message: 'Successfully created a contact!',
    data,
   });
};

export const upsertContactController = async (req, res) => {
  const { id: _id } = req.params;
  const userId = req.user._id;

  const result = await contactServices.updateContact({
    _id,
    userId,
    payload: req.body,
    options: {
    upsert: true,
    },
  });

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Contact upserted successfully',
    data: result.data,
  });
};

export const patchContactController = async (req, res) => {
  const { id: _id } = req.params;
  const userId = req.user._id;

 let photo = null;
 if (req.file) {
   if (enableCloudinary === 'true') {
     photo = await saveFileToCloudinary(req.file, 'photos');
   } else {
     await saveFileToUploadDir(req.file);
     photo = path.join(req.file.filename);
   }
 }

 const payload = { ...req.body };
 if (photo) payload.photo = photo;

  const result = await contactServices.updateContact({
    _id,
    userId,
    payload: req.body,
  });

  if (!result) {
    throw createHttpError(404, `Contact with id=${_id} not found`);
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id: _id } = req.params;
  const userId = req.user._id;

  const data = await contactServices.deleteContact({ _id, userId });

  if (!data) {
    throw createHttpError(404, `Contact with id=${_id} not found`);
  }

  res.status(204).send();
};


