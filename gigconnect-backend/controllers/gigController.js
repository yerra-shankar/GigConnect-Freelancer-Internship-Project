const Gig = require('../models/Gig');

// Create Gig
const createGig = async (req, res) => {
  const { title, description, skillsRequired, budget } = req.body;
  const gig = await Gig.create({
    client: req.user._id,
    title,
    description,
    skillsRequired,
    budget,
  });
  res.status(201).json(gig);
};

// Get all gigs
const getGigs = async (req, res) => {
  const gigs = await Gig.find().populate('client', 'name email');
  res.json(gigs);
};

// Get client's own gigs
const getMyGigs = async (req, res) => {
  const gigs = await Gig.find({ client: req.user._id });
  res.json(gigs);
};

// Delete gig
const deleteGig = async (req, res) => {
  const gig = await Gig.findById(req.params.id);
  if (!gig) return res.status(404).json({ message: 'Gig not found' });
  if (gig.client.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  await gig.remove();
  res.json({ message: 'Gig deleted' });
};

module.exports = { createGig, getGigs, getMyGigs, deleteGig };
