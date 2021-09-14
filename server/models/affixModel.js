const mongoose = require("mongoose");

const affixSchema = new mongoose.Schema({
  roman: {
    type: String,
    required: [true, "Не указана романизация"],
    unique: true,
    trim: true,
  },
  korean: {
    type: String,
    required: [true, "Не указан аффикс"],
    unique: true,
    trim: true,
  },
  meaning: {
    type: String,
    required: [true, "Не указано значение"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    default: "Описание отсутствует (пока...)",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Affix = mongoose.model("Affix", affixSchema);

module.exports = Affix;
