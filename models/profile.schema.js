const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  profileTitle: {
    type: String,
    required: true
  },
  profileDescription: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  portfolio: {
    type: [String],
  },
}, { timestamps: true });

module.exports = profileSchema;