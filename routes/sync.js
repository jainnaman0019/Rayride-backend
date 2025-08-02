const express = require('express');
const router = express.Router();

// Sample in-memory storage (replace with DB like MongoDB, Firebase, etc.)
const bookingsDB = [];

router.post('/sync/bookings', async (req, res) => {
  try {
    const { userId, bookings } = req.body;

    if (!userId || !Array.isArray(bookings)) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    bookings.forEach((booking) => {
      bookingsDB.push({
        userId,
        pickup: booking.pickup,
        drop: booking.drop,
        fare: booking.fare,
        timestamp: booking.timestamp,
      });
    });

    console.log('Synced bookings:', bookingsDB);

    return res.status(200).json({ success: true, message: 'Bookings synced successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
