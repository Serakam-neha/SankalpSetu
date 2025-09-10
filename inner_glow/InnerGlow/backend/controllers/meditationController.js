const MeditationSession = require('../models/MeditationSession');

// @desc    Create meditation session
// @route   POST /api/meditations
// @access  Private
const createMeditationSession = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      duration,
      audio_url,
      thumbnail_url,
      difficulty,
      tags,
      is_featured,
      is_premium
    } = req.body;

    const meditationSession = await MeditationSession.create({
      user: req.user._id,
      title,
      description,
      category,
      duration,
      audio_url,
      thumbnail_url,
      difficulty,
      tags,
      is_featured,
      is_premium,
      created_by: req.user._id
    });

    res.status(201).json(meditationSession);
  } catch (error) {
    console.error('Create meditation session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all meditation sessions
// @route   GET /api/meditations
// @access  Public
const getMeditationSessions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      difficulty, 
      is_featured,
      search 
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (is_featured) query.is_featured = is_featured === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const meditationSessions = await MeditationSession.find(query)
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await MeditationSession.countDocuments(query);

    res.json({
      meditationSessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get meditation sessions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get meditation session by ID
// @route   GET /api/meditations/:id
// @access  Public
const getMeditationSessionById = async (req, res) => {
  try {
    const meditationSession = await MeditationSession.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('created_by', 'name avatar');

    if (!meditationSession) {
      return res.status(404).json({ error: 'Meditation session not found' });
    }

    // Increment play count
    meditationSession.play_count += 1;
    await meditationSession.save();

    res.json(meditationSession);
  } catch (error) {
    console.error('Get meditation session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update meditation session
// @route   PUT /api/meditations/:id
// @access  Private
const updateMeditationSession = async (req, res) => {
  try {
    const meditationSession = await MeditationSession.findById(req.params.id);

    if (!meditationSession) {
      return res.status(404).json({ error: 'Meditation session not found' });
    }

    // Check if user owns this session or is admin
    if (meditationSession.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedMeditationSession = await MeditationSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedMeditationSession);
  } catch (error) {
    console.error('Update meditation session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Delete meditation session
// @route   DELETE /api/meditations/:id
// @access  Private
const deleteMeditationSession = async (req, res) => {
  try {
    const meditationSession = await MeditationSession.findById(req.params.id);

    if (!meditationSession) {
      return res.status(404).json({ error: 'Meditation session not found' });
    }

    // Check if user owns this session or is admin
    if (meditationSession.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await meditationSession.remove();
    res.json({ message: 'Meditation session removed' });
  } catch (error) {
    console.error('Delete meditation session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Rate meditation session
// @route   POST /api/meditations/:id/rate
// @access  Private
const rateMeditationSession = async (req, res) => {
  try {
    const { rating } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const meditationSession = await MeditationSession.findById(req.params.id);

    if (!meditationSession) {
      return res.status(404).json({ error: 'Meditation session not found' });
    }

    // Update rating
    const currentRating = meditationSession.rating;
    const newCount = currentRating.count + 1;
    const newAverage = ((currentRating.average * currentRating.count) + rating) / newCount;

    meditationSession.rating = {
      average: newAverage,
      count: newCount
    };

    await meditationSession.save();
    res.json(meditationSession);
  } catch (error) {
    console.error('Rate meditation session error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get featured meditation sessions
// @route   GET /api/meditations/featured
// @access  Public
const getFeaturedMeditationSessions = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const featuredSessions = await MeditationSession.find({ is_featured: true })
      .populate('user', 'name avatar')
      .sort({ rating: -1, play_count: -1 })
      .limit(parseInt(limit))
      .exec();

    res.json(featuredSessions);
  } catch (error) {
    console.error('Get featured meditation sessions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get meditation categories
// @route   GET /api/meditations/categories
// @access  Public
const getMeditationCategories = async (req, res) => {
  try {
    const categories = await MeditationSession.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get meditation categories error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createMeditationSession,
  getMeditationSessions,
  getMeditationSessionById,
  updateMeditationSession,
  deleteMeditationSession,
  rateMeditationSession,
  getFeaturedMeditationSessions,
  getMeditationCategories,
};
