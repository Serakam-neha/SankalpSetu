# InnerGlow
InnerGlow is an AI/ML-based mental health companion that uses NLP to track moods, analyze sentiments, and provide personalized coping strategies. Built with ML models, it offers secure, accessible, and data-driven support for improving emotional well-being.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Development Setup

1. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd frontend
   npm install
   ```

2. **Environment Setup**
   - Create `backend/.env` file with:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=5000
     ```

3. **Start Development Servers**
   
   **Option 1: Use the batch script (Windows)**
   ```bash
   start-dev.bat
   ```
   
   **Option 2: Manual start**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

### API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user
- `GET /api/mood-entries` - Get mood entries
- `GET /api/meditations` - Get meditation sessions
- `GET /api/community` - Get community posts
- `POST /api/ai-chat` - Send chat message

### Project Structure

```
InnerGlow/
├── backend/           # Express.js API server
│   ├── controllers/   # Route controllers
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── server.js      # Main server file
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── entities/      # Data models
│   └── Pages/         # Page components
└── start-dev.bat      # Development startup script
```