const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workExperienceSchema = new Schema({
  company: {
    type: String,
  },
  position: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  description: {
    type: String,
  }
});

module.exports = workExperienceSchema;