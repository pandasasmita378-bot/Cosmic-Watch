import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('Backend did not return JSON');
    }

    if (res.ok) {
      login(data.token, data);
      navigate('/');
    } else {
      alert(data.msg || 'Login failed');
    }
  } catch (err) {
    console.error(err);
    alert(err.message || 'Server connection failed');
  }
};


  const handleDemoGoogle = () => {
    alert("Google Login is disabled for this demo version.\nPlease use Email/Password.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="bg-purple-50/1 backdrop-blur-sm p-8 rounded-lg shadow-xl w-96 border border-2 border-purple-300/40">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">Cosmic Watch</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-black/20 focus:border-blue-500 outline-none"
              placeholder="pilot@nasa.gov"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded border border-gray-700 focus:border-blue-500 outline-none rounded-70"
              placeholder="••••••"
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:bg-gradient-to-r hover:from-blue-700 hover:via-indigo-600 hover:to-purple-600 text-white font-bold py-2 rounded transition">
            Login
          </button>
          <p className="mt-4 text-center text-gray-400">
            Don’t have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>

        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
            </div>
          </div>

          <button 
            onClick={handleDemoGoogle}
            className="mt-4 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 p-8 text-white text-gray-900 font-bold py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-200 transition"
          >
            <span className="font-bold text-2xl text-white">G</span> 
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;