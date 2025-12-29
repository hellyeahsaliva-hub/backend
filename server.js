require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// Import routes
const projectRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contact');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const statusRoutes = require('./routes/status');

// Initialize express app
const app = express();

// ======================
// Middleware
// ======================
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// ======================
// ROOT ROUTE (TEM QUE VIR ANTES DE TUDO)
// ======================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API está funcionando corretamente!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// ======================
// Connect to MongoDB
// ======================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// ======================
// API Routes
// ======================
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/status', statusRoutes);

// ======================
// 404 Handler (rota inexistente)
// ======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ======================
// Error handling middleware (ÚLTIMO)
// ======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// ======================
// Start server
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
