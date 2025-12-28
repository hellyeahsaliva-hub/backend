const express = require('express');
const router = express.Router();

// @route   GET api/status
// @desc    Get API status
// @access  Public
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API está funcionando corretamente!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

module.exports = router;
