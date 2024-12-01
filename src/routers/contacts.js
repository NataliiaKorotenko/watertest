import { Router } from 'express';

import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';


import * as contactControllers from '../controllers/contacts.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';

import {
  contactAddSchema,
  updateContactSchema,
} from '../validation/contacts.js';


const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', ctrlWrapper(contactControllers.getContactsController));

contactsRouter.get(
  '/:id',
  isValidId,
  ctrlWrapper(contactControllers.getContactsByIdController),
);

// upload.fields([{name: "poster", maxCount: 1}, {name: "subposter", maxCount: 3}])
// upload.array("poster", 10);

contactsRouter.post(
  '/',
  upload.single('photo'),
  validateBody(contactAddSchema),
  ctrlWrapper(contactControllers.addContactController),
);

contactsRouter.put(
  '/:id',
  isValidId,
  upload.single('photo'),
  validateBody(contactAddSchema),
  ctrlWrapper(contactControllers.upsertContactController),
);

contactsRouter.patch(
  '/:id',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(contactControllers.patchContactController),
);

contactsRouter.delete(
  '/:id',
  isValidId,
  ctrlWrapper(contactControllers.deleteContactController),
);

export default contactsRouter;
