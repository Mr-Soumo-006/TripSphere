const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a tour title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  destination: {
    type: String,
    required: [true, 'Please add a destination']
  },
  category: {
    type: String,
    default: 'Adventure'
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  duration: {
    type: Number, // duration in days
    required: [true, 'Please add duration in days']
  },
  image: {
    type: String, // URL or file path for the tour image
    default: 'no-photo.jpg'
  },
  featured: {
    type: Boolean,
    default: false // Determines if this shows up on the homepage easily
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  lat: {
    type: Number,
    default: 0
  },
  lng: {
    type: Number,
    default: 0
  },
  itinerary: [{
    locationName: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    price: { type: Number, default: 0 }
  }]
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
