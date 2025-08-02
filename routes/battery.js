const express = require('express');
const router = express.Router();
const db = require('../services/firebase');

// Log battery level
router.post('/log', async (req, res) => {
  const { userId, batteryLevel } = req.body;
  try {
    await db.collection('batteryLogs').add({
      userId,
      batteryLevel,
      timestamp: Date.now()
    });
    res.send({ message: "Battery log stored" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get battery logs by userId
router.get('/:userId', async (req, res) => {
  try {
    const snapshot = await db.collection('batteryLogs')
      .where('userId', '==', req.params.userId).get();
    const logs = snapshot.docs.map(doc => doc.data());
    res.send(logs);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
