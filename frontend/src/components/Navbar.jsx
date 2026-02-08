import { Link } from 'react-router-dom';
import { Rocket, LogOut, User } from 'lucide-react';
import { useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="border-b border-gray-800 bg-black/40 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-wider text-blue-400 overflow-hidden">
        <Rocket className="h-8 w-8 text-blue-500" />COSMIC WATCH
      </Link>
      
      <div className="flex gap-6 items-center text-sm font-medium">
        <Link to="/" className="hover:text-blue-400 transition text-gray-300">Dashboard</Link>
        <Link to="/risk-analysis" className="hover:text-blue-400 transition text-gray-300">Risk Analysis</Link>
        <Link to="/chat" className="hover:text-blue-400 transition text-gray-300">Chat Community</Link>
        
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-400 hidden md:inline">Welcome, <span className="text-white">{user.name}</span></span>
            <button 
              onClick={logout} 
              className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition cursor-pointer border border-red-500/20"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-white shadow-lg shadow-blue-900/20">
            <User size={18} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;