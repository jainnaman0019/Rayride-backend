const express = require('express');
const router = express.Router();
const db = require('../services/firebase');

function calculateDistance(loc1, loc2) {
  const toRad = (val) => (val * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lng - loc1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(loc1.lat)) *
    Math.cos(toRad(loc2.lat)) *
    Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

router.post('/match-ride', async (req, res) => {
  const { riderId, pickup } = req.body;

  if (!riderId || !pickup) {
    return res.status(400).send({ error: "Missing riderId or pickup location" });
  }

  try {
    const snapshot = await db.collection('users')
      .where('role', '==', 'driver')
      .where('isOnline', '==', true)
      .get();

    const drivers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (drivers.length === 0) {
      return res.status(404).send({ message: "No available drivers" });
    }

    let nearest = drivers[0];
    let minDist = calculateDistance(pickup, nearest.currentLocation);

    for (let driver of drivers.slice(1)) {
      const dist = calculateDistance(pickup, driver.currentLocation);
      if (dist < minDist) {
        nearest = driver;
        minDist = dist;
      }
    }

    res.send({
      message: "Driver matched",
      driver: {
        id: nearest.id,
        name: nearest.name,
        distance: `${minDist.toFixed(2)} km`
      }
    });

  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
