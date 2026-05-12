

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authService.register(formData);

      console.log(response.data);

      setSuccess("Registration Successful");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log(err);

      setError(
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.detail ||
        "Registration Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-black to-slate-900 px-4 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>

     
      <div className="relative max-w-lg w-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8">

    
        <div className="text-center mb-8">

          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">
              T
            </span>
          </div>

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            TaskFlow AI
          </h1>

          <p className="text-gray-300 mt-3 text-sm tracking-wide">
            Create your productivity account
          </p>

        </div>

       
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl mb-5 text-sm">
            {error}
          </div>
        )}

        
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-300 p-3 rounded-xl mb-5 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

       
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>

              <input
                type="text"
                name="first_name"
                placeholder="First name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>

              <input
                type="text"
                name="last_name"
                placeholder="Last name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
              />
            </div>

          </div>

         
          <div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>

            <input
              type="text"
              name="username"
              required
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />

          </div>

  
          <div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              required
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />

          </div>

        
          <div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              required
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            />

          </div>

         
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:scale-105 hover:shadow-blue-500/30 transition duration-300 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

     
        <div className="flex items-center my-6">

          <div className="flex-1 h-px bg-gray-700"></div>

          

          <div className="flex-1 h-px bg-gray-700"></div>

        </div>

      
      

       
        <p className="text-center mt-8 text-sm text-gray-400">

          Already have an account?

          <Link
            to="/login"
            className="text-blue-400 font-semibold hover:text-blue-300 ml-1"
          >
            Login
          </Link>

        </p>

      </div>
    </div>
  );
};

export default Register;