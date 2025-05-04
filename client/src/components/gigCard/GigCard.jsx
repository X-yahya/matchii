import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';

const GigCard = ({ item }) => {
  console.log("Fetching user data for userId:", item.userId);

  const { isLoading, error, data } = useQuery({
    queryKey: ['gigUser', item.userId],
    queryFn: () => newRequest.get(`/users/${item.userId}`).then((res) => res.data),
  });

  // Calculate delivery time
  const deliveryTime = item.plans?.[0]?.deliveryDays?.$numberInt
    ? `${item.plans[0].deliveryDays.$numberInt} Days`
    : item.plans?.[0]?.deliveryDays
    ? `${item.plans[0].deliveryDays} Days`
    : "No Delivery Info";

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Section */}
      <div className="aspect-[4/3] max-h-64 overflow-hidden">
        <img
          src={item.img || '/default-image.jpg'}
          alt={item.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-4">
        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-3">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-400">Loading...</span>
            </div>
          ) : error ? (
            <span className="text-sm font-medium text-red-500">Error loading seller</span>
          ) : data ? (
            <>
              <img
                src={data.img || '/default-seller.jpg'}
                alt="Seller"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium truncate">{data.username}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-gray-400">No seller info</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3rem]">
          {item.title}
        </h3>

        {/* Description */}
        <div className="flex-grow mb-4">
          <p className="text-gray-500 text-sm line-clamp-3">{item.description}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-500 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span className="text-sm font-medium">{item.averageRating}</span>
        </div>

        {/* Price & CTA */}
        <div className="mt-auto">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{deliveryTime}</span>
            <div className="text-xl font-bold">
              {item.price || "N/A"}
            </div>
          </div>
          <Link
            to={`/gig/${item._id.$oid || item._id}`}
            className="block mt-4 bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-full transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GigCard;