const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  jobPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  role: {
    type: String,
    default: 'client',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
