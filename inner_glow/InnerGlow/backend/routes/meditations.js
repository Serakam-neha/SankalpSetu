const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  createMeditationSession,
  getMeditationSessions,
  getMeditationSessionById,
  updateMeditationSession,
  deleteMeditationSession,
  rateMeditationSession,
  getFeaturedMeditationSessions,
  getMeditationCategories,
} = require('../controllers/meditationController');

// Public routes
router.get('/', getMeditationSessions);
router.get('/featured', getFeaturedMeditationSessions);
router.get('/categories', getMeditationCategories);
router.get('/:id', getMeditationSessionById);

// Protected routes
router.route('/')
  .post(protect, createMeditationSession);

router.route('/:id')
  .put(protect, updateMeditationSession)
  .delete(protect, deleteMeditationSession);

router.post('/:id/rate', protect, rateMeditationSession);

module.exports = router;
