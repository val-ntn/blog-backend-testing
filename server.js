//server.js
// Import necessary dependencies
import express from 'express';
import mongoose from 'mongoose';
import { Server as SocketIO } from 'socket.io';
import http from 'http';
import cors from 'cors';
import userRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import postRoutes from './routes/posts.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/admin.js';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from './routes/upload.js';
import eventReportRoutes from './routes/eventReports.js';


// TODO: Implement rate limiting for sensitive routes (auth, uploads, etc.)
// Purpose: Prevent brute-force attacks, abuse, and excessive API usage
// Package to consider: express-rate-limit
// Suggested usage:
// import rateLimit from 'express-rate-limit';
// const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
// app.use('/api/auth', authLimiter);

// NOTE: Skipped during MVP/demo phase to avoid risk of blocking dev/demo traffic.
// Return to this after presentation.


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load environment variables from .env file into process.env
dotenv.config();

// Initialize the Express app
const app = express();

// Create a HTTP server based on the Express app
const server = http.createServer(app);

// Initialize Socket.IO server instance on top of the HTTP server
const io = new SocketIO(server);

// Middleware to parse incoming JSON payloads in request bodies
app.use(express.json());

// Parse cookies from incoming requests for easy access
app.use(cookieParser());





// Enable CORS for all origins (adjust in production for security)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'], // your React frontend URL
  credentials: true,                // allow cookies with cross-origin requests
}));

// Handle authentication routes (e.g., login)
app.use('/api/auth', authRoutes);

// Mount user-related routes on /api/users path
app.use('/api/users', userRoutes);

// Mount event-related routes on /api/events path
app.use('/api/events', eventRoutes);

// Mount report-related routes on /api/event-reports path
app.use('/api/event-reports', eventReportRoutes);

// Mount post-related routes on /api/posts path
app.use('/api/posts', postRoutes);

// ... other app.use lines
app.use('/api/admin', adminRoutes);



app.use('/api/upload', uploadRoutes);
// Connect to MongoDB using the connection string from environment variables
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))  // Success message
  .catch((err) => console.log('Failed to connect to MongoDB:', err)); // Error handling

// Simple root route to verify server is running
app.get('/', (req, res) => {
  res.send('Hello, this is your blog API!');
});
// Serve static files from uploads folder (so images are accessible)
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));


// Setup WebSocket connection listeners
io.on('connection', (socket) => {
  console.log('A user connected');  // Log when a user connects

  socket.on('disconnect', () => {
    console.log('A user disconnected');  // Log when a user disconnects
  });
});

// Start the HTTP server on port 5000 and log startup message
server.listen(5000, () => {
  console.log('Server running on port 5000');
});