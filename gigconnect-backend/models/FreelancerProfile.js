const mongoose = require('mongoose');

const freelancerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [String],
  bio: String,
  location: String,
  hourlyRate: Number,
  portfolio: [String], // links to projects/images
}, { timestamps: true });

module.exports = mongoose.model('FreelancerProfile', freelancerProfileSchema);
