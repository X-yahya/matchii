import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import newRequest from '../../utils/newRequest';
import { FiStar, FiClock, FiUser, FiAlertCircle } from 'react-icons/fi';

const GigCard = ({ item }) => {
  const { isLoading: sellerLoading, error: sellerError, data: sellerData } = useQuery({
    queryKey: ['seller', item.userId],
    queryFn: () => newRequest.get(`/users/${item.userId}`).then(res => res.data),
  });

  // Fetch real order statistics
  const { data: ordersData } = [] ; 

  // Fetch real review statistics
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', item._id],
    queryFn: () => newRequest.get(`/reviews/${item._id}`).then(res => res.data),
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

  // Calculate rating statistics
  const averageRating = reviewsData?.length 
    ? reviewsData.reduce((sum, review) => sum + review.star, 0) / reviewsData.length
    : 0;

  const totalReviews = reviewsData?.length || 0;
  const totalOrders = ordersData?.count || 0;

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="group relative flex flex-col bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full"
    >
      {/* Image Section */}
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
          {sellerLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : sellerError ? (
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
      <div className="p-4 flex-1 flex flex-col">
        <div className="space-y-3">
          <span className="text-xs font-medium text-blue-600">
            {item.category}
          </span>

          <h3 className="text-lg font-semibold line-clamp-2 leading-tight">
            {item.title}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {item.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mt-auto">
          <div className="flex items-center gap-2">
            <FiStar className="w-4 h-4 text-yellow-400" />
            <span>
              {totalReviews > 0 
                ? `${averageRating.toFixed(1)} (${totalReviews})`
                : 'New Seller'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <FiClock className="w-4 h-4 text-blue-600" />
            <span>{item.deliveryDays} Days Delivery</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FiUser className="w-4 h-4 text-blue-600" />
            <span>{totalOrders}+ Orders</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-500">Starting at</span>
            <p className="text-xl font-semibold text-gray-900">
              {item.price || '300'}
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

      {(sellerLoading) && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}
    </motion.div>
  );
};

export default GigCard;