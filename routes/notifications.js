// routes/notifications.js
const express = require('express');
const router = express.Router();

// Mock Notification API
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  res.send([
    {
      icon: "taxi",
      title: "You have a new booking!",
      subtitle: "Pickup at 5:30 PM from Sector 21.",
      time: Date.now() - 15 * 60 * 1000, // 15 minutes ago
      read: false,
    },
    {
      icon: "battery",
      title: "Battery at 20% – charge soon",
      subtitle: "Low battery may affect ride acceptance.",
      time: Date.now(),
      read: false,
    },
    {
      icon: "money",
      title: "₹200 added to wallet",
      subtitle: "Payment from completed ride #10234.",
      time: Date.now() - (26 * 60 * 60 * 1000), // yesterday
      read: true,
    },
    {
      icon: "message",
      title: "New message from admin",
      subtitle: "Please upload your updated RC.",
      time: Date.now() - (30 * 60 * 60 * 1000),
      read: true,
    }
  ]);
});

module.exports = router;
