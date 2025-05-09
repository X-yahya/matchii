import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiAlertCircle, FiLock, FiUser } from 'react-icons/fi';
import newRequest from '../../utils/newRequest';

function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/auth/login", { name, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5f7] to-[#e6e6ed] flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white/95 backdrop-blur-lg w-full max-w-md rounded-[2rem] shadow-2xl shadow-[rgba(0,113,227,0.1)] border border-white/20 overflow-hidden"
      >
        <div className="px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-10 text-center"
          >
            <div className="mb-6 flex justify-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="p-4 bg-gradient-to-br from-[#0071e3] to-[#005cba] rounded-2xl shadow-lg"
              >
                <FiLock className="text-3xl text-white" />
              </motion.div>
            </div>
            <h2 className="text-4xl font-bold text-[#1d1d1f] mb-2">Welcome Back</h2>
            <p className="text-[#86868b]">Sign in to continue your journey</p>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="space-y-7"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center bg-[#ff3b30]/10 p-4 rounded-xl border border-[#ff3b30]/20"
                >
                  <FiAlertCircle className="text-[#ff3b30] mr-3 animate-pulse" />
                  <span className="text-[#ff3b30] text-sm font-medium">{error}</span>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0071e3]/20 to-[#0071e3]/5 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setNameFocused(true)}
                      onBlur={() => setNameFocused(false)}
                      className="w-full px-5 pt-7 pb-3 rounded-xl bg-[#fbfbfd] border-2 border-[#e0e0e0]/50 
                        focus:border-[#0071e3]/40 focus:ring-0 peer transition-all duration-300 placeholder-transparent"
                      id="name"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="name"
                      className={`absolute left-5 transition-all duration-300 pointer-events-none 
                        ${(nameFocused || name) ? 'text-xs top-3.5 text-[#0071e3]' : 'text-sm top-5 text-[#86868b]'}`}
                    >
                      Name
                    </label>
                    <FiUser className={`absolute right-5 top-5 text-[#86868b] transition-colors duration-300 
                      ${nameFocused ? 'text-[#0071e3]' : ''}`} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0071e3]/20 to-[#0071e3]/5 rounded-xl blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      className="w-full px-5 pt-7 pb-3 rounded-xl bg-[#fbfbfd] border-2 border-[#e0e0e0]/50 
                        focus:border-[#0071e3]/40 focus:ring-0 peer transition-all duration-300 placeholder-transparent"
                      id="password"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="password"
                      className={`absolute left-5 transition-all duration-300 pointer-events-none 
                        ${(passwordFocused || password) ? 'text-xs top-3.5 text-[#0071e3]' : 'text-sm top-5 text-[#86868b]'}`}
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-5 text-[#86868b] hover:text-[#0071e3] transition-colors p-1 rounded-lg hover:bg-[#0071e3]/10"
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5" />
                      ) : (
                        <FiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between text-sm"
              >
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                    />
                    <div className="w-5 h-5 rounded border-[#e0e0e0] bg-white flex items-center justify-center 
                      transition-all duration-300 group-hover:border-[#0071e3] peer-checked:bg-[#0071e3] 
                      peer-checked:border-[#0071e3] shadow-sm">
                      <svg className="w-3 h-3 text-white opacity-0 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[#1d1d1f] select-none">Keep me signed in</span>
                </label>
                <a
                  href="#"
                  className="text-[#0071e3] hover:text-[#0063c7] transition-colors font-medium relative 
                    before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-[#0071e3] 
                    hover:before:w-full before:transition-all before:duration-300"
                >
                  Forgot password?
                </a>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-br from-[#0071e3] to-[#005cba] text-white py-5 px-6 
                  rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-[#0063c7] hover:to-[#0050a5] 
                  focus:outline-none focus:ring-2 focus:ring-[#0071e3]/50 focus:ring-offset-2 
                  transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 text-center"
          >
            <p className="text-[#86868b] text-sm">
              New to our community?{' '}
              <a
                href="register"
                className="text-[#0071e3] hover:text-[#0063c7] font-medium relative
                  before:absolute before:bottom-0 before:left-0 before:w-0 before:h-px before:bg-[#0071e3]
                  hover:before:w-full before:transition-all before:duration-300"
              >
                Create account
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;