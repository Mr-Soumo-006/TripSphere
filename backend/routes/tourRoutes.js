const express = require('express');
const router = express.Router();
const { getTours, getTourById, createTour, deleteTour, updateTour, createTourReview } = require('../controllers/tourController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route to get all tours and create new tour
router.route('/').get(getTours).post(protect, admin, createTour);

// Route to create a review
router.route('/:id/reviews').post(protect, createTourReview);

// Route to get single tour, delete tour, and update tour
router.route('/:id').get(getTourById).delete(protect, admin, deleteTour).put(protect, admin, updateTour);

module.exports = router;
