const mongoose = require('mongoose');

const meditationSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: [
      'Mindfulness', 'Breathing', 'Body Scan', 'Loving-Kindness',
      'Transcendental', 'Zen', 'Vipassana', 'Guided', 'Music',
      'Nature Sounds', 'Silent', 'Movement', 'Walking'
    ],
    required: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 minute'],
    max: [480, 'Duration cannot exceed 8 hours']
  },
  audio_url: {
    type: String,
    default: null
  },
  thumbnail_url: {
    type: String,
    default: null
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  tags: [{
    type: String,
    maxlength: 20
  }],
  is_featured: {
    type: Boolean,
    default: false
  },
  is_premium: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  play_count: {
    type: Number,
    default: 0
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
meditationSessionSchema.index({ category: 1, difficulty: 1 });
meditationSessionSchema.index({ is_featured: 1, createdAt: -1 });
meditationSessionSchema.index({ rating: -1 });

module.exports = mongoose.model('MeditationSession', meditationSessionSchema);
