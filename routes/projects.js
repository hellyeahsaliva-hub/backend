const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  projectPhotoUpload
} = require('../controllers/projects');

const Project = require('../models/Project');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Add advanced results middleware
router
  .route('/')
  .get(
    advancedResults(Project, {
      path: 'user',
      select: 'name email'
    }),
    getProjects
  )
  .post(protect, authorize('admin'), createProject);

router
  .route('/:id')
  .get(getProject)
  .put(protect, authorize('admin'), updateProject)
  .delete(protect, authorize('admin'), deleteProject);

// Photo upload
router
  .route('/:id/photo')
  .put(protect, authorize('admin'), projectPhotoUpload);

module.exports = router;
