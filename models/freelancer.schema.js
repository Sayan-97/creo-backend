const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = require('./user.schema');
const profileSchema = require('./profile.schema');
const workExperienceSchema = require('./experience.schema');
const educationSchema = require('./education.schema');

const freelancerSchema = new Schema({
  user: {
    type: userSchema,
    required: true
  },
  profile: {
    type: profileSchema,
    required: true
  },
  workExperience: {
    type: [workExperienceSchema],
  },
  education: {
    type: [educationSchema],
  },
  role: {
    type: String,
    default: 'freelancer',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Freelancer', freelancerSchema);
