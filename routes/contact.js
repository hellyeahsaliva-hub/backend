const express = require('express');
const {
  submitContact,
  getContacts,
  getContact,
  deleteContact,
  markAsRead
} = require('../controllers/contact');

const Contact = require('../models/Contact');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route for submitting contact form
router.post('/', submitContact);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(
    advancedResults(Contact, null, {
      path: '',
      select: 'name email message isRead createdAt'
    }),
    getContacts
  );

router
  .route('/:id')
  .get(getContact)
  .delete(deleteContact);

router.route('/:id/read').put(markAsRead);

module.exports = router;
