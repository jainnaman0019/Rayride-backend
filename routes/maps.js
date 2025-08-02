const express = require('express');
const router = express.Router();


// Get mock heatmap zones
router.get('/charging-stations', (req, res) => {
  res.send([
    { id: 'cs1', name: "EV Station A", lat: 28.6305, lng: 77.2177 },
    { id: 'cs2', name: "EV Station B", lat: 28.6456, lng: 77.2891 },
    { id: 'cs3', name: "GreenPower Hub", lat: 28.6123, lng: 77.2520 }
  ]);
});


// Get mock nearest charging stations
router.get('/heatmap', (req, res) => {
  res.send([
    { lat: 28.6310, lng: 77.2180, demand: 0.9 },
    { lat: 28.6455, lng: 77.2850, demand: 0.7 },
    { lat: 28.6152, lng: 77.2544, demand: 0.5 }
  ]);
});

router.get('/route', (req, res) => {
  const { from, to } = req.query;

  res.send({
    from,
    to,
    path: [
      { lat: 28.6310, lng: 77.2180 },
      { lat: 28.6350, lng: 77.2400 },
      { lat: 28.6400, lng: 77.2600 },
      { lat: 28.6455, lng: 77.2850 }
    ],
    distance_km: 4.5,
    estimated_time_min: 12
  });
});


module.exports = router;
