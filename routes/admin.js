const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats,
  getRecentActivities
} = require('../controllers/admin');

const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// User management routes
router
  .route('/users')
  .get(
    advancedResults(User, {
      path: '',
      select: 'name email role createdAt'
    }),
    getUsers
  )
  .post(createUser);

router
  .route('/users/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// Dashboard routes
router.get('/dashboard-stats', getDashboardStats);
router.get('/recent-activities', getRecentActivities);

module.exports = router;
