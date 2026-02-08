import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Earth3D from '../components/Earth3D';
import { AlertTriangle, Eye, Activity, Calendar, Search, LocateFixed } from 'lucide-react';

const Home = () => {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [focusedAsteroidId, setFocusedAsteroidId] = useState(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchAsteroids = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/asteroids/feed`, {
        params: { start_date: startDate, end_date: endDate }
      });
      const rawData = res.data.near_earth_objects;
      const flatList = Object.values(rawData).flat();
      flatList.sort((a, b) => new Date(a.close_approach_data[0].close_approach_date_full) - new Date(b.close_approach_data[0].close_approach_date_full));
      setAsteroids(flatList);
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve deep space data. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsteroids();
  }, []);

  const handleFocus = (id) => {
    if (focusedAsteroidId === id) setFocusedAsteroidId(null);
    else setFocusedAsteroidId(id);
  };

  const totalNEOs = asteroids.length;
  const hazardousCount = asteroids.filter(a => a.is_potentially_hazardous_asteroid).length;
  const closestObject = asteroids.length > 0 
    ? asteroids.reduce((prev, curr) => parseFloat(prev.close_approach_data[0].miss_distance.kilometers) < parseFloat(curr.close_approach_data[0].miss_distance.kilometers) ? prev : curr)
    : null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pt-20">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-transparent rounded-xl overflow-hidden border border-gray-800 relative h-96 shadow-2xl shadow-blue-900/20">
          
          <Earth3D asteroids={asteroids} focusedId={focusedAsteroidId} />

          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            {focusedAsteroidId ? (
                <div className="bg-blue-600/80 backdrop-blur px-4 py-2 rounded text-white text-sm font-bold flex items-center gap-2 animate-pulse border border-blue-400">
                    <LocateFixed size={16}/> TARGET LOCKED: {asteroids.find(a => a.id === focusedAsteroidId)?.name}
                </div>
            ) : (
                <div className="bg-black/60 backdrop-blur px-3 py-1 rounded text-xs text-blue-400 border border-blue-500/30">
                    LIVE ORBITAL VIEW
                </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-gray-700">
            <h3 className="text-gray-400 text-sm font-medium uppercase">NEOs Detected ({startDate})</h3>
            <p className="text-4xl font-bold text-white mt-2">{loading ? "..." : totalNEOs}</p>
          </div>

          <div className={`p-6 rounded-xl border backdrop-blur ${hazardousCount > 0 ? 'bg-red-900/40 border-red-500/50' : 'bg-gray-900/80 border-gray-700'}`}>
            <h3 className={`${hazardousCount > 0 ? 'text-red-400' : 'text-green-400'} text-sm font-medium uppercase flex items-center gap-2`}>
              <AlertTriangle size={16} /> Hazardous Objects
            </h3>
            <p className="text-4xl font-bold text-white mt-2">{loading ? "..." : hazardousCount}</p>
            <p className="text-xs text-gray-500 mt-1">{hazardousCount > 0 ? "Requires immediate analysis" : "Sector Clear"}</p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-gray-700">
            <h3 className="text-blue-400 text-sm font-medium uppercase">Closest Approach</h3>
            {closestObject ? (
                <>
                    <p className="text-2xl font-bold text-white mt-2">{closestObject.name}</p>
                    <p className="text-xs text-gray-500">
                        {parseInt(closestObject.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km away
                    </p>
                </>
            ) : (
                <p className="text-gray-500 mt-2">Scanning...</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-end bg-gray-900/80 backdrop-blur p-4 rounded-xl border border-gray-800">
        <div className='flex-1'>
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                <Activity className="text-blue-400" /> Deep Space Scanner
            </h2>
            <p className="text-gray-500 text-xs mt-1">Select timeframe to scan for Near Earth Objects</p>
        </div>
        
        <div className="flex gap-2 items-center bg-black/50 p-2 rounded border border-gray-700">
            <Calendar size={16} className="text-gray-400"/>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-white text-sm outline-none"/>
            <span className="text-gray-600">-</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-white text-sm outline-none"/>
        </div>

        <button onClick={fetchAsteroids} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 transition">
            <Search size={16}/> {loading ? "Scanning..." : "Scan Sector"}
        </button>
      </div>

      <div className="bg-gray-900/80 backdrop-blur rounded-xl border border-gray-800 overflow-hidden">
        {error && <div className="p-4 text-red-400 bg-red-900/20 text-center">{error}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-950/50 text-gray-400 text-sm">
              <tr>
                <th className="p-4">Asteroid Name</th>
                <th className="p-4">Diameter (est)</th>
                <th className="p-4">Velocity</th>
                <th className="p-4">Miss Distance</th>
                <th className="p-4">Risk Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr><td colSpan="6" className="p-12 text-center text-gray-500 animate-pulse">Establishing Link with NASA JPL...</td></tr>
              ) : asteroids.length === 0 ? (
                <tr><td colSpan="6" className="p-12 text-center text-gray-500">No objects detected.</td></tr>
              ) : asteroids.map((neo) => (
                <tr key={neo.id} className={`hover:bg-gray-800/50 transition group ${focusedAsteroidId === neo.id ? 'bg-blue-900/20' : ''}`}>
                  <td className="p-4 font-mono text-blue-300 font-bold">{neo.name}</td>
                  <td className="p-4 text-gray-300">{Math.round(neo.estimated_diameter.meters.estimated_diameter_max)} m</td>
                  <td className="p-4 text-gray-300">{parseInt(neo.close_approach_data[0].relative_velocity.kilometers_per_hour).toLocaleString()} km/h</td>
                  <td className="p-4 text-gray-300">{parseInt(neo.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km</td>
                  <td className="p-4">
                    {neo.is_potentially_hazardous_asteroid ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded border border-red-500/30 font-bold animate-pulse">
                        <AlertTriangle size={12} /> HAZARDOUS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20">SAFE</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleFocus(neo.id)} className={`transition p-2 rounded cursor-pointer ${focusedAsteroidId === neo.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                      {focusedAsteroidId === neo.id ? <LocateFixed size={18} /> : <Eye size={18} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;