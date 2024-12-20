import createHttpError from 'http-errors';

import * as waterServices from '../services/water.js';
/*import parseWaterFilterParams from '../utils/filter/parseWaterFilterParams.js';*/

export const addWaterController = async (req, res) => {
  const { _id: userId } = req.user;
  const { waterVolume, date } = req.body;
  if (waterVolume > 5000) {
    throw createHttpError(400, 'Water volume cannot exceed 5000 ml');
  }

  if (!date) {
    throw createHttpError(400, 'Date is required');
  }

  const data = await waterServices.createWater({
    waterVolume,
    userId,
    date: new Date(date).toISOString(),
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully add record',
    data,
  });
};

export const patchWaterController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const result = await waterServices.updateWater({ _id: id, userId }, req.body);
  if (!result) {
    throw createHttpError(404, 'Water record not found');
  }
  res.json({
    status: 200,
    message: 'Successfully patched a water record!',
    data: result.data,
  });
};

export const deleteWaterController = async (req, res) => {
  const { id } = req.params;
  const { _id: userId } = req.user;
  const data = await waterServices.deleteWater({ _id: id, userId });
  if (!data) {
    throw createHttpError(404, 'Water record not found');
  }

  res.status(204).send();
};
