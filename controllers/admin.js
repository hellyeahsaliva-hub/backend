const User = require('../models/User');
const Project = require('../models/Project');
const Contact = require('../models/Contact');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user (admin only)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create user (admin only)
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Update user (admin only)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get dashboard stats (admin only)
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const [
    totalProjects,
    totalContacts,
    unreadContacts,
    totalUsers
  ] = await Promise.all([
    Project.countDocuments(),
    Contact.countDocuments(),
    Contact.countDocuments({ isRead: false }),
    User.countDocuments()
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalProjects,
      totalContacts,
      unreadContacts,
      totalUsers
    }
  });
});

// @desc    Get recent activities (admin only)
// @route   GET /api/admin/recent-activities
// @access  Private/Admin
exports.getRecentActivities = asyncHandler(async (req, res, next) => {
  const recentContacts = await Contact.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email message isRead createdAt');

  const recentProjects = await Project.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title description image createdAt');

  res.status(200).json({
    success: true,
    data: {
      recentContacts,
      recentProjects
    }
  });
});
