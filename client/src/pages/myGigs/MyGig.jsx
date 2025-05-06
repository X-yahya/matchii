import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import { useState } from 'react';

export default function MyGigs() {
  // Get authenticated user from localStorage
  const [currentUser] = useState(JSON.parse(localStorage.getItem('currentUser')));
  
  // Fetch user-specific gigs from API
  const { isLoading, error, data: myGigs } = useQuery({
    queryKey: ['myGigs'],
    queryFn: () => newRequest.get('/gigs/mygigs').then((res) => res.data),
    enabled: !!currentUser?.isSeller
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 max-w-md mx-auto mt-8 text-center">
        <div className="text-red-500 font-medium mb-2">
          Error loading gigs: {error.message}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-16 py-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">My Gigs</h1>
        {currentUser?.isSeller && (
          <Link
            to="/add"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + Create New Gig
          </Link>
        )}
      </div>

      {/* Gigs Grid */}
      {myGigs?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myGigs.map((gig) => (
            <div key={gig._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              {/* Gig Cover Image */}
              <img
                src={gig.coverImage || '/default-gig.jpg'}
                alt={gig.title}
                className="w-full h-48 object-cover rounded-t-xl"
              />

              {/* Gig Details */}
              <div className="p-5">
                {/* Seller Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={gig.userId?.image || '/default-avatar.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {gig.userId?.name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {gig.userId?.isSeller ? 'Seller' : 'Buyer'}
                    </p>
                  </div>
                </div>

                {/* Title and Status */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {gig.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    gig.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {gig.status || 'draft'}
                  </span>
                </div>

                {/* Pricing and Sales */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-xl font-bold text-gray-900">
                      ${gig.plans?.[0]?.price || '0'}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">starting price</span>
                  </div>
                  <div className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {gig.sales} sales
                  </div>
                </div>

                {/* Action Buttons */}
                {currentUser?.isSeller && (
                  <div className="flex gap-3 mt-4">
                    <Link
                      to={`/edit-gig/${gig._id}`}
                      className="flex-1 text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                      {gig.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Empty State
        <div className="text-center py-20">
          <div className="mb-8 text-gray-500">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-900">No gigs found</h3>
            <p className="mt-1 text-gray-500">Get started by creating a new gig.</p>
          </div>
          {currentUser?.isSeller && (
            <Link
              to="/add"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Gig
            </Link>
          )}
        </div>
      )}
    </div>
  );
}