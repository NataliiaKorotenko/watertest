import { Schema, model } from 'mongoose';
import { handleSaveError } from './hooks.js';

const waterSchema = new Schema(
  {
    waterVolume: {
      type: Number,
      required: [true, '"Water Volume" is required'], // Поле обязательно
      min: [1, '"Water Volume" must be at least 1 ml'], // Минимум
      max: [5000, '"Water Volume" cannot exceed 5000 ml'], // Максимум
    },
    dailyNorm: {
      type: Number, // Поле не обязательно
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, '"User ID" is required'], // Поле обязательно
    },
    date: {
      type: Date,
      required: [true, '"Date" is required'], // Поле обязательно
      validate: {
        validator: function (value) {
          return !isNaN(new Date(value).getTime()); // Проверка на валидность даты
        },
        message: '"Date" must be a valid date',
      },
    },
  },
  { versionKey: false, timestamps: true }
);

// Обработка ошибок сохранения
waterSchema.post('save', handleSaveError);

// Обработка ошибок обновления
waterSchema.post('findOneAndUpdate', handleSaveError);

const WaterCollection = model('water', waterSchema);

export default WaterCollection;
