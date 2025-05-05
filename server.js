//server.js
// Import necessary dependencies
const express = require('express');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');
const cors = require('cors');
const userRoutes = require('./routes/users');

require('dotenv').config();


// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes); // Add this line to enable user routes

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Failed to connect to MongoDB:', err));


// Import and use the routes for posts
const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);  // This will route any requests to /api/posts to the 'posts' routes
  

// Example API route (you can expand this later)
app.get('/', (req, res) => {
  res.send('Hello, this is your blog API!');
});

// Server and socket setup
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server on port 5000
server.listen(5000, () => {
  console.log('Server running on port 5000');
});
