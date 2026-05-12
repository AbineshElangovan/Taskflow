import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const res = await authService.login(formData);

      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);

      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-black to-slate-900 px-4 relative overflow-hidden">

      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>

      {/* Login Card */}
      <div className="relative max-w-md w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8">

        {/* Logo Section */}
        <div className="text-center mb-8">

          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">
              T
            </span>
          </div>

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            TaskFlow app
          </h1>

          <p className="text-gray-300 mt-3 text-sm tracking-wide">
        
          </p>

        </div>

       
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

      
        <form onSubmit={handleSubmit} className="space-y-5">

         
          <div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>

            <input
              type="text"
              required
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  username: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />

          </div>

          {/* Password */}
          <div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            />

          </div>

          
          <div className="flex items-center justify-between text-sm">

            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                className="accent-blue-500"
              />
              Remember me
            </label>

            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition"
            >
              Forgot Password?
            </a>

          </div>

          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-blue-500/30 transition duration-300 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

      
        <div className="flex items-center my-6">

          <div className="flex-1 h-px bg-gray-700"></div>

         

          <div className="flex-1 h-px bg-gray-700"></div>

        </div>

       
        

        {/* Register */}
        <p className="mt-8 text-center text-gray-400 text-sm">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-400 font-semibold hover:text-blue-300 ml-1"
          >
            Register now
          </Link>

        </p>

      </div>
    </div>
  );
};

export default Login;