import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CatCard = ({ id, title, desc, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${id}`); // Navigate to the category page
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative bg-slate-800 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 w-80 h-80 flex-shrink-0 overflow-hidden cursor-pointer"
      style={{
        backgroundImage: `url("${image}")`, // Ensure the URL is wrapped in quotes
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={handleClick} // Add click handler
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl"></div>

      {/* Content */}
      <div className="relative z-10 text-white">
        <h3 className="text-2xl font-semibold">{title}</h3>
        {desc && <p className="mt-2 text-sm text-gray-300">{desc}</p>}
      </div>
    </motion.div>
  );
};

export default CatCard;