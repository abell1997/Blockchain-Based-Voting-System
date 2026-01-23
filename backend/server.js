const express = require('express');
const cors = require('cors');
const path = require('path');

// Import Routes
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/vote');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON bodies

// Serve Frontend Static Files
// Points to the sibling 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', voteRoutes); // Mounts /vote and /results to /api

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`VoteChain Server running on http://localhost:${PORT}`);
    console.log(`Frontend accessible at http://localhost:${PORT}/login.html`);
});
