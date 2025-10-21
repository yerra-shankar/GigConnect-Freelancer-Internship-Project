const FreelancerProfile = require('../models/FreelancerProfile');

// Create or Update Freelancer Profile
const upsertProfile = async (req, res) => {
  const userId = req.user._id;
  const { skills, bio, location, hourlyRate, portfolio } = req.body;

  let profile = await FreelancerProfile.findOne({ user: userId });
  if (profile) {
    profile.skills = skills;
    profile.bio = bio;
    profile.location = location;
    profile.hourlyRate = hourlyRate;
    profile.portfolio = portfolio;
    await profile.save();
    return res.json(profile);
  }

  profile = await FreelancerProfile.create({
    user: userId,
    skills,
    bio,
    location,
    hourlyRate,
    portfolio
  });
  res.status(201).json(profile);
};

// Get all freelancer profiles (for search)
const getFreelancers = async (req, res) => {
  const profiles = await FreelancerProfile.find().populate('user', 'name email');
  res.json(profiles);
};

module.exports = { upsertProfile, getFreelancers };
