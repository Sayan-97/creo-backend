const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const educationSchema = new Schema({
  institution: {
    type: String,
  },
  degree: {
    type: String,
  },
  fieldOfStudy: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  }
});

module.exports = educationSchema;