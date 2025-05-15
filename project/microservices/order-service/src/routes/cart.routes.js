const express = require('express');
const { check } = require('express-validator');
const cartController = require('../controllers/cart.controller');
const { authenticateJWT } = require('../middleware/auth.middleware');

const router = express.Router();

// All cart routes require authentication
router.use(authenticateJWT);

// Get user's cart
router.get('/', cartController.getCart);

// Add item to cart
router.post(
  '/items',
  [
    check('productId', 'Product ID is required').not().isEmpty(),
    check('quantity', 'Quantity must be a positive number').isInt({ min: 1 })
  ],
  cartController.addItem
);

// Update item quantity
router.put(
  '/items/:productId',
  [
    check('quantity', 'Quantity must be a positive number').isInt({ min: 1 })
  ],
  cartController.updateItem
);

// Remove item from cart
router.delete('/items/:productId', cartController.removeItem);

// Clear cart
router.delete('/', cartController.clearCart);

module.exports = router;