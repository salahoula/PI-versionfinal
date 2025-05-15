const axios = require('axios');
const Cart = require('../models/cart.model');

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002/api';

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;

    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    
    res.json({
      cart: {
        items: cart.items,
        total: cart.getTotal(),
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add item to cart
exports.addItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;
    
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }
    
    // Fetch product details from product service
    try {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`);
      const product = response.data;
      
      let cart = await Cart.findOne({ userId });
      
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }
      
      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.productId === productId
      );
      
      if (existingItemIndex > -1) {
        // Update quantity if product already in cart
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          productId,
          quantity,
          price: product.price,
          name: product.name,
          thumbnail: product.thumbnail
        });
      }
      
      await cart.save();
      
      res.json({
        message: 'Item added to cart',
        cart: {
          items: cart.items,
          total: cart.getTotal(),
          updatedAt: cart.updatedAt
        }
      });
    } catch (error) {
      console.error('Product service error:', error);
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update item quantity
exports.updateItem = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Find the item in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId
    );
    
    if (existingItemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Update quantity
    cart.items[existingItemIndex].quantity = quantity;
    await cart.save();
    
    res.json({
      message: 'Item updated',
      cart: {
        items: cart.items,
        total: cart.getTotal(),
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = req.params.productId;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Remove the item from cart
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.productId !== productId);
    
    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    await cart.save();
    
    res.json({
      message: 'Item removed from cart',
      cart: {
        items: cart.items,
        total: cart.getTotal(),
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    } else {
      cart.items = [];
    }
    
    await cart.save();
    
    res.json({
      message: 'Cart cleared',
      cart: {
        items: [],
        total: 0,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};