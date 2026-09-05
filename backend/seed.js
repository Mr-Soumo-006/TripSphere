const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travel-portal';

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to MongoDB. Seeding database...');
    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      for (let collection of collections) {
        await db.dropCollection(collection.name);
      }
      
      const usersRaw = fs.readFileSync(__dirname + '/data/users.json');
      const toursRaw = fs.readFileSync(__dirname + '/data/tours.json');
      const users = JSON.parse(usersRaw);
      const tours = JSON.parse(toursRaw);

      users.forEach(user => {
        user._id = new mongoose.Types.ObjectId(user._id);
        if (user.createdAt) user.createdAt = new Date(user.createdAt);
        if (user.updatedAt) user.updatedAt = new Date(user.updatedAt);
      });

      tours.forEach(tour => {
        tour._id = new mongoose.Types.ObjectId(tour._id);
        if (tour.createdAt) tour.createdAt = new Date(tour.createdAt);
        if (tour.updatedAt) tour.updatedAt = new Date(tour.updatedAt);
        if (tour.reviews) {
          tour.reviews.forEach(review => {
            if (review._id) review._id = new mongoose.Types.ObjectId(review._id);
            if (review.user) review.user = new mongoose.Types.ObjectId(review.user);
            if (review.createdAt) review.createdAt = new Date(review.createdAt);
            if (review.updatedAt) review.updatedAt = new Date(review.updatedAt);
          });
        }
      });

      if (users.length > 0) await db.collection('users').insertMany(users);
      if (tours.length > 0) await db.collection('tours').insertMany(tours);
      console.log('Database Seeding Completed Successfully! ✅');
      process.exit(0);
    } catch (error) {
      console.error('Error seeding data:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error. Is MongoDB running?', err);
    process.exit(1);
  });
