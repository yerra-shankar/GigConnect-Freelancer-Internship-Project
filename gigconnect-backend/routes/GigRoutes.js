const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createGig, getGigs, getMyGigs, deleteGig } = require('../controllers/gigController');

router.post('/', protect, createGig);
router.get('/', getGigs);
router.get('/my', protect, getMyGigs);
router.delete('/:id', protect, deleteGig);

module.exports = router;
