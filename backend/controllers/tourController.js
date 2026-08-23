const Tour = require('../models/Tour');

// @desc    Fetch all tours
// @route   GET /api/tours
// @access  Public
const getTours = async (req, res) => {
  try {
    const tours = await Tour.find({});
    res.json(tours);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single tour
// @route   GET /api/tours/:id
// @access  Public
const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (tour) {
      res.json(tour);
    } else {
      res.status(404).json({ message: 'Tour not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a tour
// @route   POST /api/tours
// @access  Private/Admin
const createTour = async (req, res) => {
  try {
    const tour = new Tour({
      title: 'Sample Tour Title',
      price: 0,
      destination: 'Sample Destination',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=500&q=80',
      duration: 1,
      description: 'Sample description for this beautiful new tour.',
    });

    const createdTour = await tour.save();
    res.status(201).json(createdTour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a tour
// @route   DELETE /api/tours/:id
// @access  Private/Admin
const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (tour) {
      await Tour.deleteOne({ _id: tour._id });
      res.json({ message: 'Tour removed' });
    } else {
      res.status(404).json({ message: 'Tour not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a tour
// @route   PUT /api/tours/:id
// @access  Private/Admin
const updateTour = async (req, res) => {
  try {
    const { title, price, description, destination, category, image, duration, featured, rating, lat, lng, itinerary } = req.body;

    const tour = await Tour.findById(req.params.id);

    if (tour) {
      tour.title = title || tour.title;
      tour.price = price || tour.price;
      tour.description = description || tour.description;
      tour.destination = destination || tour.destination;
      tour.category = category || tour.category;
      tour.image = image || tour.image;
      tour.duration = duration || tour.duration;
      tour.featured = featured !== undefined ? featured : tour.featured;
      tour.rating = rating || tour.rating;
      tour.lat = lat !== undefined ? lat : tour.lat;
      tour.lng = lng !== undefined ? lng : tour.lng;
      tour.itinerary = itinerary || tour.itinerary;

      const updatedTour = await tour.save();
      res.json(updatedTour);
    } else {
      res.status(404).json({ message: 'Tour not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/tours/:id/reviews
// @access  Private
const createTourReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const tour = await Tour.findById(req.params.id);

    if (tour) {
      const alreadyReviewed = tour.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Tour already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      tour.reviews.push(review);
      tour.numReviews = tour.reviews.length;
      tour.rating =
        tour.reviews.reduce((acc, item) => item.rating + acc, 0) /
        tour.reviews.length;

      await tour.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Tour not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTours,
  getTourById,
  createTour,
  deleteTour,
  updateTour,
  createTourReview
};
