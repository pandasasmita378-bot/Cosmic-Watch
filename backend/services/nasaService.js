const axios = require('axios');

const fetchAsteroidFeed = async () => {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const today = new Date().toISOString().split('T')[0];
  
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    const neos = Object.values(response.data.near_earth_objects).flat();
    
    // Risk Analysis Logic
    const analyzedNeos = neos.map(neo => {
      const diameter = neo.estimated_diameter.kilometers.estimated_diameter_max;
      const velocity = parseFloat(neo.close_approach_data[0].relative_velocity.kilometers_per_hour);
      const missDistance = parseFloat(neo.close_approach_data[0].miss_distance.kilometers);
      const isHazardous = neo.is_potentially_hazardous_asteroid;

      // Simple Risk Score Calculation (0-100)
      let riskScore = 0;
      if (isHazardous) riskScore += 50;
      if (diameter > 0.1) riskScore += 20; 
      if (missDistance < 7500000) riskScore += 20; 
      if (velocity > 50000) riskScore += 10; 

      return {
        id: neo.id,
        name: neo.name,
        diameter_km: diameter.toFixed(3),
        velocity_kph: velocity.toFixed(0),
        miss_distance_km: missDistance.toFixed(0),
        is_hazardous: isHazardous,
        risk_score: riskScore,
        approach_date: neo.close_approach_data[0].close_approach_date_full
      };
    });

    return analyzedNeos;
  } catch (error) {
    console.error('NASA API Error:', error.message);
    throw new Error('Failed to fetch NASA data');
  }
};

module.exports = { fetchAsteroidFeed };