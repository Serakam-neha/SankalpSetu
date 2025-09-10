const MoodEntry = require('../models/MoodEntry');
const User = require('../models/User');

// @desc    Create mood entry
// @route   POST /api/mood-entries
// @access  Private
const createMoodEntry = async (req, res) => {
  try {
    const {
      mood_rating,
      emotions,
      activities,
      stress_level,
      notes
    } = req.body;

    const moodEntry = await MoodEntry.create({
      user: req.user._id,
      mood_rating,
      emotions,
      activities,
      stress_level,
      notes
    });

    // Update user stats
    // await req.user.updateStats(mood_rating);

    res.status(201).json(moodEntry);
  } catch (error) {
    console.error('Create mood entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get user's mood entries
// @route   GET /api/mood-entries
// @access  Private
const getMoodEntries = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    
    const query = { user: req.user._id };
    
    if (startDate && endDate) {
      query.created_date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const moodEntries = await MoodEntry.find(query)
      .sort({ created_date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await MoodEntry.countDocuments(query);

    res.json({
      moodEntries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get mood entries error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get mood entry by ID
// @route   GET /api/mood-entries/:id
// @access  Private
const getMoodEntryById = async (req, res) => {
  try {
    const moodEntry = await MoodEntry.findById(req.params.id)
      .populate('user', 'name avatar');

    if (!moodEntry) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    // Check if user owns this entry or if it's public
    if (moodEntry.user._id.toString() !== req.user._id.toString() && !moodEntry.is_public) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(moodEntry);
  } catch (error) {
    console.error('Get mood entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update mood entry
// @route   PUT /api/mood-entries/:id
// @access  Private
const updateMoodEntry = async (req, res) => {
  try {
    const moodEntry = await MoodEntry.findById(req.params.id);

    if (!moodEntry) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    // Check if user owns this entry
    if (moodEntry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedMoodEntry = await MoodEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedMoodEntry);
  } catch (error) {
    console.error('Update mood entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete mood entry
// @route   DELETE /api/mood-entries/:id
// @access  Private
const deleteMoodEntry = async (req, res) => {
  try {
    const moodEntry = await MoodEntry.findById(req.params.id);

    if (!moodEntry) {
      return res.status(404).json({ error: 'Mood entry not found' });
    }

    // Check if user owns this entry
    if (moodEntry.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await moodEntry.remove();
    res.json({ message: 'Mood entry removed' });
  } catch (error) {
    console.error('Delete mood entry error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get mood statistics
// @route   GET /api/mood-entries/stats
// @access  Private
const getMoodStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const stats = await MoodEntry.getMoodStats(req.user._id, parseInt(days));
    const streak = await MoodEntry.getStreak(req.user._id);

    res.json({
      ...stats,
      streak
    });
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get public mood entries
// @route   GET /api/mood-entries/public
// @access  Public
const getPublicMoodEntries = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const moodEntries = await MoodEntry.find({ is_public: true })
      .populate('user', 'name avatar')
      .sort({ created_date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await MoodEntry.countDocuments({ is_public: true });

    res.json({
      moodEntries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get public mood entries error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createMoodEntry,
  getMoodEntries,
  getMoodEntryById,
  updateMoodEntry,
  deleteMoodEntry,
  getMoodStats,
  getPublicMoodEntries,
};
