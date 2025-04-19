import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const navigate = useNavigate() ; 

  const handleSubmit = async(e) => {
    e.preventDefault();
    // Handle login logic here
   try
   {
      const res = await newRequest.post("/auth/login",{username,  password}) ;  
      localStorage.setItem("currentUser" , JSON.stringify(res.data)) ;
      navigate("/") ;
   }catch(err)
   {
    console.log(err) ;
   }
  };
  return (
    <div className="min-h-screen bg-apple-gray-50 flex items-center justify-center p-4 font-sf-pro">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-semibold text-apple-gray-800 text-center mb-2">Sign in</h2>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={() => setUsernameFocused(false)}
                  className="w-full px-4 pt-6 pb-2 rounded-lg bg-apple-gray-100 border border-apple-gray-200 focus:ring-2 focus:ring-apple-blue focus:border-blue-500 transition-all duration-200 peer"
                  id="username"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="username"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none text-apple-gray-800
                    ${(usernameFocused || username) ? 'text-xs top-2' : 'text-base top-4'}`}
                >
                  Username
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="w-full px-4 pt-6 pb-2 rounded-lg bg-apple-gray-100 border border-apple-gray-200 focus:ring-2 focus:ring-apple-blue focus:border-apple-blue transition-all duration-200 peer"
                  id="password"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="password"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none text-apple-gray-800
                    ${(passwordFocused || password) ? 'text-xs top-2' : 'text-base top-4'}`}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-apple-gray-800 hover:text-apple-blue"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-apple-gray-200 text-apple-blue focus:ring-apple-blue"
                  />
                  <span className="ml-2 text-apple-gray-800">Keep me signed in</span>
                </label>
                <a href="#" className="text-apple-blue hover:underline font-medium">Forgot Username or Password?</a>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-apple-blue focus:ring-offset-2 transition-colors duration-200"
              >
                Continue
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-apple-gray-800 text-sm">
              Don't have an Account ?{' '}
              <a href="#" className="text-apple-blue hover:underline font-medium">
                Create yours now
              </a>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;