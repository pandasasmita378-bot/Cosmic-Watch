import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Search, 
  AlertTriangle, 
  X,
  Calendar 
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const RiskAnalysis = () => {
  const [riskData, setRiskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showRiskAlert, setShowRiskAlert] = useState(false);
  const [hazardousCount, setHazardousCount] = useState(0);

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/asteroids/feed`, {
        params: { start_date: startDate, end_date: endDate }
      });

      const rawData = res.data.near_earth_objects;
      
      if (!rawData) {
        setRiskData([]);
        return;
      }

      const flatList = Object.values(rawData).flat();
      
      const processedData = flatList.map(item => ({
        name: item.name,
        diameter: item.estimated_diameter.meters.estimated_diameter_max,
        missDistance: parseFloat(item.close_approach_data[0].miss_distance.kilometers),
        velocity: parseFloat(item.close_approach_data[0].relative_velocity.kilometers_per_hour),
        isHazardous: item.is_potentially_hazardous_asteroid
      }));

      setRiskData(processedData);

    } catch (err) {
      console.error(err);
      setError("Failed to load risk analysis data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Initial load

  useEffect(() => {
    if (riskData.length > 0) {
      const count = riskData.filter(asteroid => asteroid.isHazardous).length;
      setHazardousCount(count);
      
      if (count > 0) {
        setShowRiskAlert(true);
      } else {
        setShowRiskAlert(false);
      }
    } else {
        setHazardousCount(0);
        setShowRiskAlert(false);
    }
  }, [riskData]);

  const avgVelocity = riskData.length > 0 
    ? (riskData.reduce((acc, curr) => acc + curr.velocity, 0) / riskData.length).toFixed(0) 
    : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pt-24 relative">
      
      {showRiskAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl z-50 animate-bounce-in">
          <div className="bg-red-600/90 backdrop-blur-md border border-red-500 text-white p-4 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.6)] flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-800 rounded-full animate-pulse">
                <AlertTriangle size={32} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-wider">Warning: Impact Risk Detected</h3>
                <p className="text-red-100 text-sm">
                  {hazardousCount} Potentially Hazardous Object(s) identified in this sector.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowRiskAlert(false)} 
              className="p-2 hover:bg-red-700 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="text-blue-500" /> Risk Analysis Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Deep learning assessment of orbital trajectories and impact probability.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-900/80 p-2 rounded-xl border border-gray-800 backdrop-blur">
             <div className="flex gap-2 items-center px-2">
                <Calendar size={16} className="text-gray-400"/>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="bg-transparent text-white text-sm outline-none"
                />
                <span className="text-gray-600">-</span>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="bg-transparent text-white text-sm outline-none"
                />
            </div>
            <button 
                onClick={fetchData} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
                <Search size={18} /> Scan
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm uppercase">Threat Level</p>
              <h3 className={`text-3xl font-bold mt-2 ${hazardousCount > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {hazardousCount > 0 ? 'ELEVATED' : 'NOMINAL'}
              </h3>
            </div>
            {hazardousCount > 0 ? <ShieldAlert size={32} className="text-red-500" /> : <ShieldCheck size={32} className="text-green-500" />}
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm uppercase">Objects Analyzed</p>
              <h3 className="text-3xl font-bold text-white mt-2">{riskData.length}</h3>
            </div>
            <Activity size={32} className="text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm uppercase">Avg Velocity</p>
              <h3 className="text-3xl font-bold text-white mt-2">{parseInt(avgVelocity).toLocaleString()} <span className="text-sm text-gray-500">km/h</span></h3>
            </div>
            <Activity size={32} className="text-purple-500" />
          </div>
        </div>
      </div>

      {riskData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-gray-800 h-96">
              <h3 className="text-white font-bold mb-6">Object Diameter Analysis (Meters)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} tick={false} />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} itemStyle={{ color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="diameter" fill="#3b82f6" name="Diameter (m)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-900/80 backdrop-blur p-6 rounded-xl border border-gray-800 h-96">
              <h3 className="text-white font-bold mb-6">Relative Velocity Trends (km/h)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} tick={false} />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} itemStyle={{ color: '#fff' }} />
                  <Legend />
                  <Line type="monotone" dataKey="velocity" stroke="#8b5cf6" strokeWidth={2} name="Velocity" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
      ) : (
          <div className="text-center p-12 text-gray-500 bg-gray-900/50 rounded-xl border border-gray-800">
              No data available for this timeframe. Adjust the dates above to scan.
          </div>
      )}
    </div>
  );
};

export default RiskAnalysis;