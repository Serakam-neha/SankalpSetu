const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// Debug logs
console.log('Working dir:', process.cwd());
console.log('__dirname:', __dirname);
console.log('.env resolved path:', path.resolve(__dirname, '.env'));
console.log('MONGO_URI (raw):', process.env.MONGO_URI);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
if (!process.env.MONGO_URI) {
  console.error('❌ ERROR: MONGO_URI is not defined. Check backend/.env');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connect error:', err);
    process.exit(1);
  });

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'InnerGlow API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/users', require('./routes/users'));
  app.use('/api/mood-entries', require('./routes/moodEntries'));
  app.use('/api/meditations', require('./routes/meditations'));
  app.use('/api/community', require('./routes/community'));
  app.use('/api/ai-chat', require('./routes/aiChat'));
  console.log('✅ All routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading routes:', error.message);
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler




app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`API URL: http://localhost:${PORT}`);
});
