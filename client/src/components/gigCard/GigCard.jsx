import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import newRequest from '../../utils/newRequest';
import { FiStar, FiClock, FiUser, FiAlertCircle } from 'react-icons/fi';

const GigCard = ({ item }) => {
  const { isLoading, error, data: sellerData } = useQuery({
    queryKey: ['seller', item.userId],
    queryFn: () => newRequest.get(`/users/${item.userId}`).then(res => res.data),
  });

  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FiStar
            key={i}
            className={`w-4 h-4 ${
              i < fullStars ? 'text-yellow-400 fill-current' : 
              (hasHalfStar && i === fullStars) ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Image Section with Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.img || '/default-image.jpg'}
          alt={item.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        
        {/* Seller Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : error ? (
            <div className="flex items-center gap-2 text-red-500">
              <FiAlertCircle className="w-5 h-5" />
              <span className="text-white text-sm">Error loading seller</span>
            </div>
          ) : (
            <>
              <img
                src={sellerData?.image || "/default-avatar.png"}
                alt={sellerData?.username}
                className="w-8 h-8 rounded-full border-2 border-white object-cover"
              />
              <span className="text-white font-medium text-sm drop-shadow">
                {sellerData?.username || "Independent Seller"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Category Tag */}
        <span className="text-xs font-medium text-blue-600">
          {item.category}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold line-clamp-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3">
          {item.description}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <FiStar className="w-4 h-4 text-yellow-400" />
            <span>
              {item.averageRating 
                ? `${Math.round(item.averageRating * 10) / 10} (${item.totalReviews || 0})`
                : 'New Seller'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <FiClock className="w-4 h-4 text-blue-600" />
            <span>{item.deliveryDays} Days Delivery</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FiUser className="w-4 h-4 text-blue-600" />
            <span>{item.ordersCompleted}+ Orders</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3">
          <div>
            <span className="text-xs text-gray-500">Starting at</span>
            <p className="text-xl font-semibold text-gray-900">
              ${item.price || '300'} {/* Default to $300 if no price */}
            </p>
          </div>
          <Link
            to={`/gig/${item._id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg
                     transition-colors flex items-center gap-2 text-sm"
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" 
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}
    </motion.div>
  );
};

export default GigCard;