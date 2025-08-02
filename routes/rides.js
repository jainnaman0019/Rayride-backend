const express = require('express');
const router = express.Router();
const db = require('../services/firebase');



// Book a ride
router.post('/book', async (req, res) => {
  const { commuterId, pickup, drop, fare } = req.body;

  console.log("📩 Incoming booking request:", req.body);
  try {
    const rideRef = await db.collection('rides').add({
      commuterId,
      pickup,
      drop,
      fare,
      driverId: null,
      status: 'requested',
      timestamp: Date.now()
    });
    console.log("✅ Ride added to Firestore with ID:", rideRef.id); 
    res.status(200).json({ rideId: rideRef.id, message: "Ride requested" });
  } catch (err) {
    console.error("❌ Error while booking ride:", err.message);
    res.status(500).send({ error: err.message });
  }
});

// Accept a ride
router.post('/accept', async (req, res) => {
  const { rideId, driverId } = req.body;
  try {
    await db.collection('rides').doc(rideId).update({
      driverId,
      status: 'accepted'
    });
    res.send({ message: "Ride accepted!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Complete a ride
router.post('/complete', async (req, res) => {
  const { rideId } = req.body;
  try {
    await db.collection('rides').doc(rideId).update({
      status: 'completed',
      completedAt: Date.now()
    });
    res.send({ message: "Ride completed!" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get all active rides
router.get('/active', async (req, res) => {
  try {
    const snapshot = await db.collection('rides')
      .where('status', 'in', ['requested', 'accepted']).get();
    const rides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(rides);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get rides by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const snapshot = await db.collection('rides')
      .where('commuterId', '==', req.params.userId).get();
    const rides = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(rides);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
