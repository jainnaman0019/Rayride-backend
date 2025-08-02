const express = require('express');
const router = express.Router();
const db = require('../services/firebase');

// Add rider to queue
router.post('/enqueue', async (req, res) => {
  const { riderId, pickup } = req.body;

  if (!riderId || !pickup) {
    return res.status(400).send({ error: 'Missing riderId or pickup' });
  }

  try {
    await db.collection('rideQueue').doc(riderId).set({
      riderId,
      pickup,
      timestamp: new Date()
    });

    res.send({ message: 'Rider added to queue' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Fetch next rider from queue
router.get('/dequeue', async (req, res) => {
  try {
    const snapshot = await db.collection('rideQueue')
      .orderBy('timestamp', 'asc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).send({ message: 'Queue is empty' });
    }

    const doc = snapshot.docs[0];
    await doc.ref.delete(); // remove from queue

    res.send({ message: 'Rider dequeued', rider: doc.data() });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
