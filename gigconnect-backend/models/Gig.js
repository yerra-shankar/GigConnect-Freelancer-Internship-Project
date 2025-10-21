const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  skillsRequired: [String],
  budget: Number,
  status: { type: String, enum: ['open', 'in-progress', 'completed'], default: 'open' },
}, { timestamps: true });

module.exports = mongoose.model('Gig', gigSchema);
