import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,

        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful. Please login.');
        navigate('/login');
      } else {
        alert(data.msg || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server connection failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-96 border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-500">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
