const Contact = require('../models/Contact');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = asyncHandler(async (req, res, next) => {
  const { name, email, phone, message } = req.body;

  // Create contact
  const contact = await Contact.create({
    name,
    email,
    phone,
    message
  });

  // Send email notification
  const emailMessage = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  try {
    await sendEmail({
      email: process.env.ADMIN_EMAIL,
      subject: 'New Contact Form Submission',
      html: emailMessage
    });

    // Send confirmation email to user
    const userMessage = `
      <h2>Thank you for contacting us, ${name}!</h2>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p>Here's a copy of your message:</p>
      <p>${message}</p>
      <p>Best regards,<br>Lucas - Portfolio</p>
    `;

    await sendEmail({
      email: email,
      subject: 'Thank you for contacting us!',
      html: userMessage
    });

    res.status(200).json({ 
      success: true, 
      data: 'Email sent successfully' 
    });
  } catch (err) {
    console.error('Error sending email:', err);
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Get all contact submissions (admin only)
// @route   GET /api/contact
// @access  Private/Admin
exports.getContacts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single contact submission (admin only)
// @route   GET /api/contact/:id
// @access  Private/Admin
exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(
      new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404)
    );
  }

  // Mark as read
  if (!contact.isRead) {
    contact.isRead = true;
    await contact.save();
  }

  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Delete contact submission (admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
exports.deleteContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(
      new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404)
    );
  }

  await contact.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Mark contact as read/unread (admin only)
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return next(
      new ErrorResponse(`Contact not found with id of ${req.params.id}`, 404)
    );
  }

  contact.isRead = req.body.isRead !== undefined ? req.body.isRead : !contact.isRead;
  await contact.save();

  res.status(200).json({
    success: true,
    data: contact
  });
});
