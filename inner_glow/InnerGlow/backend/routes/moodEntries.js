const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const {
  createMoodEntry,
  getMoodEntries,
  getMoodEntryById,
  updateMoodEntry,
  deleteMoodEntry,
  getMoodStats,
  getPublicMoodEntries,
} = require('../controllers/moodController');

// Public routes
router.get('/public', getPublicMoodEntries);

// Protected routes
router.route('/')
  .post(protect, createMoodEntry)
  .get(protect, getMoodEntries);

router.get('/stats', protect, getMoodStats);

router.route('/:id')
  .get(optionalAuth, getMoodEntryById)
  .put(protect, updateMoodEntry)
  .delete(protect, deleteMoodEntry);

module.exports = router;
