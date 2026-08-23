const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, deleteBooking } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware'); // Protects the routes

// We apply the protect middleware so only logged-in users can access these
router.post('/', protect, createBooking);
router.get('/mybookings', protect, getMyBookings);
router.delete('/:id', protect, admin, deleteBooking);

module.exports = router;
