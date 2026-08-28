const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { tourId, startDate, endDate } = req.body;

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      tour: tour._id,
      price: tour.price,
      startDate: startDate || new Date(),
      endDate: endDate || new Date(new Date().setDate(new Date().getDate() + (tour.duration || 1))),
      status: 'confirmed' // Auto-confirming for now
    });

    // Send confirmation email
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #fafafa; padding: 2rem; border-radius: 8px;">
        <h1 style="color: #d4af37; text-align: center; font-weight: 300; text-transform: uppercase;">Booking Confirmed!</h1>
        <p style="color: #a1a1aa; text-align: center; font-size: 1.1rem;">Thank you for your reservation, ${req.user.name}.</p>
        
        <div style="background: #18181b; padding: 1.5rem; border-radius: 4px; border: 1px solid #27272a; margin-top: 2rem;">
          <h2 style="margin-top: 0; font-weight: 400; color: #fafafa;">${tour.title}</h2>
          <p style="color: #a1a1aa; margin: 0 0 1rem 0;">📍 ${tour.destination}</p>
          
          <div style="display: flex; justify-content: space-between; border-top: 1px solid #27272a; padding-top: 1rem; margin-top: 1rem;">
            <span style="color: #71717a;">Total Paid</span>
            <span style="color: #d4af37; font-weight: bold; font-size: 1.2rem;">₹${tour.price}</span>
          </div>
        </div>
        
        <p style="text-align: center; color: #71717a; margin-top: 2rem; font-size: 0.9rem;">
          Your itinerary awaits. View your full booking details in your <a href="http://localhost:5173/dashboard" style="color: #d4af37;">Dashboard</a>.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        email: req.user.email,
        subject: `Booking Confirmation: ${tour.title}`,
        message: `Your booking for ${tour.title} is confirmed. Total Paid: ₹${tour.price}`,
        html: emailHtml
      });
    } catch (emailErr) {
      console.error('Error sending confirmation email', emailErr);
      // We don't want to fail the booking if email fails
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    // Populate will also grab the associated tour details
    const bookings = await Booking.find({ user: req.user._id }).populate('tour');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    await booking.deleteOne();
    res.json({ message: 'Booking removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  deleteBooking
};
