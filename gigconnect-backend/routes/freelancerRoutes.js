const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upsertProfile, getFreelancers } = require('../controllers/freelancerController');

router.post('/profile', protect, upsertProfile);
router.get('/profiles', getFreelancers);

module.exports = router;
