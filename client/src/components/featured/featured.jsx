import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Featured = () => {
  const [mounted, setMounted] = useState(false);
  const categories = ['website development', 'logo design', 'video editing', 'architecture & interior design'];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 space-y-12 relative overflow-hidden">
      {/* Main Heading Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6 max-w-4xl"
      >
        <h1 className="text-5xl font-semibold text-gray-900">
          Hire Freelancers hungry to prove their skills.<br />
          <span className="text-blue-600">Build the future, together.</span>
        </h1>
        <p className="text-xl text-gray-600">Where ambition meets execution—no limits.</p>
      </motion.div>

      {/* Search Container */}
      <motion.div 
        className="w-full max-w-3xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative group">
          <input
            type="text"
            placeholder="Search Talent"
            className="w-full px-6 py-4 rounded-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-500 text-gray-900 outline-none transition-all duration-300 shadow-sm hover:shadow-md"
          />
          <div className="absolute inset-y-0 right-4 flex items-center">
            <svg
              className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories Row */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 text-sm font-medium transition-all duration-300 hover:scale-105"
            >
              → {category}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Enhanced Pulse Effects */}
      {mounted && (
        <>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-20 mix-blend-screen blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-green-300 to-cyan-300 rounded-full opacity-20 mix-blend-screen blur-3xl animate-pulse delay-1000" />
        </>
      )}
    </div>
  );
};

export default Featured;