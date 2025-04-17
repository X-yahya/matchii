import React from 'react';
import { motion } from 'framer-motion';

const CatCard = ({ title, items }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 w-80 h-80 flex-shrink-0"
    >
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li 
              key={index}
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span className="mr-2">→</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default CatCard;