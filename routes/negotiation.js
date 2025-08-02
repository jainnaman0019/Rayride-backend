const express = require('express');
const router = express.Router();
const db = require('../services/firebase');

// Rider proposes a fare
router.post('/propose', async (req, res) => {
  const { rideId, riderId, fare } = req.body;
  try {
    await db.collection('rideRequests').doc(rideId).set({
      riderId,
      proposedFare: fare,
      status: 'negotiating',
      negotiationStatus: 'rider_responded'
    }, { merge: true });

    res.send({ message: 'Fare proposed by rider.' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Driver counters the fare
router.post('/counter', async (req, res) => {
  const { rideId, driverId, fare } = req.body;
  try {
    await db.collection('rideRequests').doc(rideId).set({
      driverId,
      counterFare: fare,
      status: 'negotiating',
      negotiationStatus: 'driver_responded'
    }, { merge: true });

    res.send({ message: 'Fare countered by driver.' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Either party accepts the final fare
router.post('/accept', async (req, res) => {
  const { rideId, finalFare } = req.body;
  try {
    await db.collection('rideRequests').doc(rideId).set({
      finalFare,
      status: 'accepted',
      negotiationStatus: 'agreed'
    }, { merge: true });

    res.send({ message: 'Fare accepted.' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Either party rejects the negotiation
router.post('/reject', async (req, res) => {
  const { rideId } = req.body;
  try {
    await db.collection('rideRequests').doc(rideId).set({
      status: 'rejected',
      negotiationStatus: 'rejected'
    }, { merge: true });

    res.send({ message: 'Fare negotiation rejected.' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
