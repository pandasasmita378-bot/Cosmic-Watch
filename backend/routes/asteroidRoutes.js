const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/feed', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    // Default to today if no date provided
    const today = new Date().toISOString().split('T')[0];
    const start = start_date || today;
    const end = end_date || today;

    const response = await axios.get(process.env.NASA_API_URL, {
      params: {
        start_date: start,
        end_date: end,
        api_key: process.env.NASA_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("NASA API Error:", error.message);
    res.status(500).json({ msg: "Failed to fetch asteroid data" });
  }
});

module.exports = router;