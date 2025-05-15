const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/user.controller');
const { authenticateJWT, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateJWT, isAdmin, userController.getAllUsers);

// Get user by ID
router.get('/:id', authenticateJWT, userController.getUserById);

// Update user
router.put(
  '/:id',
  authenticateJWT,
  [
    check('name', 'Name is too short').optional().isLength({ min: 2 }),
    check('email', 'Please include a valid email').optional().isEmail()
  ],
  userController.updateUser
);

// Change password
router.put(
  '/:id/change-password',
  authenticateJWT,
  [
    check('currentPassword', 'Current password is required').exists(),
    check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
  ],
  userController.changePassword
);

// Delete user
router.delete('/:id', authenticateJWT, userController.deleteUser);

module.exports = router;