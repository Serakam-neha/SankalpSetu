const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Support both Vite ports
  credentials: true
}));
app.use(express.json());
// const dbUrl = import.meta.env.VITE_DATABASE_URL;
// MongoDB Connection
// add url here
const MONGODB_URI = 'mongodb+srv://sravanthi2706:sravanthi2706@cluster0.acne1i1.mongodb.net/innerglow?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Simple User Schema for testing
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  loginMethod: { type: String, default: 'email' },
  googleId: String,
  avatar: { url: String },
  isVerified: { type: Boolean, default: false },
  preferences: {
    theme: { type: String, default: 'auto' },
    notifications: { email: { type: Boolean, default: true }, push: { type: Boolean, default: true } },
    privacy: { profileVisibility: { type: String, default: 'private' } }
  },
  stats: {
    totalMoodEntries: { type: Number, default: 0 },
    totalMeditations: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    averageMood: { type: Number, default: 0 }
  },
  role: { type: String, default: 'user' }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Meditation Session Schema
const meditationSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true }, // in minutes
  category: { type: String, required: true },
  audioUrl: { type: String },
  imageUrl: { type: String },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date },
  rating: { type: Number, min: 1, max: 5 },
  notes: { type: String }
}, { timestamps: true });

const MeditationSession = mongoose.model('MeditationSession', meditationSessionSchema);

// Community Post Schema
const communityPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'general' },
  tags: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  isAnonymous: { type: Boolean, default: false }
}, { timestamps: true });

const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret-key', {
    expiresIn: '30d',
  });
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'InnerGlow API is running with MongoDB Atlas',
    timestamp: new Date().toISOString(),
    database: 'Connected to MongoDB Atlas'
  });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      loginMethod: 'email'
    });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      loginMethod: user.loginMethod,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        loginMethod: user.loginMethod,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Google OAuth endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, name, picture, googleId } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // User exists, update Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.loginMethod = 'google';
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar: { url: picture },
        loginMethod: 'google',
        isVerified: true
      });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      loginMethod: user.loginMethod,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user endpoint
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      loginMethod: user.loginMethod,
      preferences: user.preferences,
      stats: user.stats,
      role: user.role,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Mock mood endpoints
app.get('/api/mood-entries', (req, res) => {
  res.json({
    moodEntries: [],
    totalPages: 0,
    currentPage: 1,
    total: 0
  });
});

app.get('/api/mood-entries/stats', (req, res) => {
  res.json({
    averageMood: 0,
    totalEntries: 0,
    moodDistribution: [],
    streak: 0
  });
});

// Meditation endpoints
app.get('/api/meditations', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = category ? { category } : {};
    
    const meditations = await MeditationSession.find(filter)
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await MeditationSession.countDocuments(filter);
    
    res.json({
      meditationSessions: meditations,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get meditations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/meditations/featured', async (req, res) => {
  try {
    const featured = await MeditationSession.find({ isCompleted: true })
      .populate('userId', 'name avatar')
      .sort({ rating: -1, completedAt: -1 })
      .limit(5);
    
    res.json(featured);
  } catch (error) {
    console.error('Get featured meditations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/meditations/categories', (req, res) => {
  res.json([
    'Mindfulness',
    'Breathing',
    'Sleep',
    'Stress Relief',
    'Focus',
    'Anxiety',
    'Gratitude',
    'Body Scan'
  ]);
});

app.post('/api/meditations', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const { title, description, duration, category, audioUrl, imageUrl } = req.body;

    const meditation = await MeditationSession.create({
      userId: decoded.id,
      title,
      description,
      duration,
      category,
      audioUrl,
      imageUrl
    });

    res.status(201).json(meditation);
  } catch (error) {
    console.error('Create meditation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/meditations/:id/complete', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const { rating, notes } = req.body;

    const meditation = await MeditationSession.findOneAndUpdate(
      { _id: req.params.id, userId: decoded.id },
      { 
        isCompleted: true, 
        completedAt: new Date(),
        rating,
        notes
      },
      { new: true }
    );

    if (!meditation) {
      return res.status(404).json({ error: 'Meditation session not found' });
    }

    res.json(meditation);
  } catch (error) {
    console.error('Complete meditation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Community endpoints
app.get('/api/community', async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = category ? { category } : {};
    
    const posts = await CommunityPost.find(filter)
      .populate('userId', 'name avatar')
      .populate('likes', 'name')
      .populate('comments.userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await CommunityPost.countDocuments(filter);
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get community posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/community', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const { title, content, category, tags, isAnonymous } = req.body;

    const post = await CommunityPost.create({
      userId: decoded.id,
      title,
      content,
      category,
      tags: tags || [],
      isAnonymous
    });

    await post.populate('userId', 'name avatar');
    res.status(201).json(post);
  } catch (error) {
    console.error('Create community post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/community/:id/like', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const isLiked = post.likes.includes(decoded.id);
    
    if (isLiked) {
      post.likes.pull(decoded.id);
    } else {
      post.likes.push(decoded.id);
    }

    await post.save();
    res.json({ isLiked: !isLiked, likesCount: post.likes.length });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/community/:id/comment', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const { content } = req.body;

    // Validate the post ID
    if (!req.params.id || req.params.id === 'undefined') {
      return res.status(400).json({ error: 'Invalid post ID' });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      userId: decoded.id,
      content
    });

    await post.save();
    await post.populate('comments.userId', 'name avatar');
    
    const newComment = post.comments[post.comments.length - 1];
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:5174`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️  Database: MongoDB Atlas`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`);
});
