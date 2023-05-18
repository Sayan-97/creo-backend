const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  budgetType: {
    type: String,
    enum: ['hourly', 'fixed'],
    required: true
  },
  skillsRequired: {
    type: [String],
    required: true
  },
  expertiseLevel: {
    type: String,
    enum: ['entry-level', 'intermediate', 'expert'],
    required: true
  },
  projectScope: {
    type: String,
    enum: ['less than a month', '1-3 months', 'more than 6 months'],
    required: true
  },
  files: {
    type: [String],
    required: false
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
