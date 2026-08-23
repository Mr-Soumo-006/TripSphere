const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword, toggleWishlist, getWishlist } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Route to register a new user
router.post('/register', registerUser);

// Route to login an existing user
router.post('/login', loginUser);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Route for user profile (GET to fetch, PUT to update)
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// Wishlist Routes
router.route('/wishlist').get(protect, getWishlist);
router.route('/wishlist/:tourId').post(protect, toggleWishlist);

module.exports = router;
