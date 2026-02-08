const { fetchAsteroidFeed } = require('../services/nasaService');

exports.getFeed = async (req, res) => {
  try {
    const data = await fetchAsteroidFeed();
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching asteroid data' });
  }
};