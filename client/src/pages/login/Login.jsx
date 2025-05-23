import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiAlertCircle, FiLock, FiMail, FiArrowRight } from 'react-icons/fi';
import newRequest from '../../utils/newRequest';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { email, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/5 border border-white/20 overflow-hidden"
      >
        <div className="px-8 py-12">
          {/* Auth Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center space-y-1"
          >
            <div className="mb-8 flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-5 bg-blue-500/10 rounded-2xl"
              >
                <FiLock className="text-3xl text-blue-500" />
              </motion.div>
            </div>
            <h1 className="text-4xl font-semibold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500">Sign in to your account</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center p-4 bg-red-50/50 border border-red-200 rounded-xl"
              >
                <FiAlertCircle className="text-red-500 mr-3 flex-shrink-0" />
                <span className="text-red-600 text-sm">{error}</span>
              </motion.div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                    placeholder-gray-400 pr-12"
                  placeholder="name@example.com"
                  required
                />
                <FiMail className="absolute right-4 top-4 text-gray-400 group-focus-within:text-blue-500" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-100 rounded-xl 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all
                    placeholder-gray-400 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-blue-500 p-1.5 rounded-lg"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-500 hover:text-blue-600 
                  hover:underline underline-offset-4 transition-all"
              >
                Forgot password?
              </Link>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="flex items-center gap-2 px-6 py-3.5 bg-blue-500 text-white 
                  rounded-xl font-medium shadow-sm hover:bg-blue-600 transition-colors"
              >
                Continue
                <FiArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </form>

          {/* Registration CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center text-sm text-gray-500"
          >
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-500 hover:text-blue-600 font-medium
                hover:underline underline-offset-4 transition-all"
            >
              Create account
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;