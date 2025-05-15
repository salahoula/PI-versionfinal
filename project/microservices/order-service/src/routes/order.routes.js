const express = require('express');
const { check } = require('express-validator');
const orderController = require('../controllers/order.controller');
const { authenticateJWT, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// All order routes require authentication
router.use(authenticateJWT);

// Get all orders for current user
router.get('/', orderController.getOrders);

// Get order by ID
router.get('/:id', orderController.getOrderById);

// Create new order
router.post(
  '/',
  [
    check('shippingAddress', 'Shipping address is required').not().isEmpty(),
    check('billingAddress', 'Billing address is required').not().isEmpty(),
    check('paymentMethod', 'Payment method is required').isIn(['credit_card', 'paypal', 'bank_transfer'])
  ],
  orderController.createOrder
);

// Update order status (admin only)
router.patch(
  '/:id/status',
  isAdmin,
  [
    check('status', 'Status is required').isIn(['processing', 'confirmed', 'shipped', 'delivered', 'cancelled'])
  ],
  orderController.updateOrderStatus
);

// Update payment status (admin only)
router.patch(
  '/:id/payment',
  isAdmin,
  [
    check('paymentStatus', 'Payment status is required').isIn(['pending', 'paid', 'failed'])
  ],
  orderController.updatePaymentStatus
);

// Cancel order
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;