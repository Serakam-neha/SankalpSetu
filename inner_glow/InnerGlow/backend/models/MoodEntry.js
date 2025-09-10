const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood_rating: {
    type: Number,
    required: [true, 'Mood rating is required'],
    min: [1, 'Mood rating must be at least 1'],
    max: [10, 'Mood rating cannot exceed 10']
  },
  emotions: [{
    type: String
  }],
  activities: [{
    type: String
  }],
  energy_level: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  sleep_hours: {
    type: Number,
    min: 0,
    max: 24
  },
  stress_level: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  tags: [{
    type: String,
    maxlength: 20
  }],
  weather: {
    condition: String,
    temperature: Number
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number]
  },
  is_public: {
    type: Boolean,
    default: false
  },
  created_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
moodEntrySchema.index({ user: 1, created_date: -1 });
moodEntrySchema.index({ user: 1, mood_rating: 1 });
moodEntrySchema.index({ created_date: -1 });

// Virtual for date formatting
moodEntrySchema.virtual('formatted_date').get(function() {
  return this.created_date.toLocaleDateString();
});

// Method to get mood statistics
moodEntrySchema.statics.getMoodStats = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const stats = await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        created_date: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        averageMood: { $avg: '$mood_rating' },
        totalEntries: { $sum: 1 },
        moodDistribution: {
          $push: {
            rating: '$mood_rating',
            label: '$mood_label',
            date: '$created_date'
          }
        }
      }
    }
  ]);

  return stats[0] || { averageMood: 0, totalEntries: 0, moodDistribution: [] };
};

// Method to get streak
moodEntrySchema.statics.getStreak = async function(userId) {
  const entries = await this.find({ user: userId })
    .sort({ created_date: -1 })
    .select('created_date');

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < entries.length; i++) {
    const entryDate = new Date(entries[i].created_date);
    entryDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (entryDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
