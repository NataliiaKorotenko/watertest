import { Router } from 'express';

import {
  addWaterController,
  deleteWaterController,

  patchWaterController,

} from '../controllers/water.js';

import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../middlewares/validateBody.js';

import {
  addWaterValidation,
  updateWaterValidation,
} from '../validation/water.js';

const waterRouter = Router();

waterRouter.use(authenticate);

waterRouter.post(
  '/',
  validateBody(addWaterValidation),
  ctrlWrapper(addWaterController),
);
waterRouter.patch(
  '/:id',
  isValidId,
  validateBody(updateWaterValidation),
  ctrlWrapper(patchWaterController),
);
waterRouter.delete('/:id', isValidId, ctrlWrapper(deleteWaterController));

/*waterRouter.get('/monthInfo', ctrlWrapper(getMonthWaterController));

waterRouter.get('/dayInfo/:todayStr', ctrlWrapper(getWaterInfoTodayController));*/

export default waterRouter;
