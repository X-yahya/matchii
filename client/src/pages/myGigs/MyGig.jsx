import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function MyGigs() {
  const [currentUser] = useState({
    role: 'seller', // Change to 'buyer' to test different views
    name: 'JohnDoe',
    pp: 'https://picsum.photos/50?random=user'
  });

  // Sample data with both seller and buyer information
  const myGigs = [
    {
      id: 1,
      title: "Professional Web Design Service",
      price: 299,
      sales: 45,
      status: "active",
      seller: {
        name: "DesignPro",
        pp: "https://picsum.photos/50?random=1"
      },
      buyer: {
        name: "Client123",
        pp: "https://picsum.photos/50?random=5"
      }
    },
    {
      id: 2,
      title: "Mobile App Development with React Native",
      price: 599,
      sales: 28,
      status: "paused",
      seller: {
        name: "DevTeam",
        pp: "https://picsum.photos/50?random=2"
      },
      buyer: {
        name: "StartupXYZ",
        pp: "https://picsum.photos/50?random=6"
      }
    },
    {
      id: 3,
      title: "Logo Design and Branding Package",
      price: 149,
      sales: 63,
      status: "active",
      seller: {
        name: "CreativeStudio",
        pp: "https://picsum.photos/50?random=3"
      },
      buyer: {
        name: "SmallBiz",
        pp: "https://picsum.photos/50?random=7"
      }
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-12">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Gigs</h1>
        {currentUser.role === 'seller' && (
          <Link 
            to="/create-gig"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm md:text-base"
          >
            Create New Gig
          </Link>
        )}
      </div>

      {/* Gigs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myGigs.map((gig) => (
          <div key={gig.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
            {/* Gig Image */}
            <img
              src={`https://picsum.photos/200?random=${gig.id}`}
              alt="Gig cover"
              className="w-full h-48 object-cover"
            />

            {/* Gig Details */}
            <div className="p-4 flex flex-col flex-1">
              {/* User Info Section */}
              <div className="flex items-center gap-2 mb-3">
                <img
                  src={currentUser.role === 'buyer' ? gig.seller.pp : gig.buyer.pp}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.role === 'buyer' ? gig.seller.name : gig.buyer.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {currentUser.role === 'buyer' ? 'Seller' : 'Buyer'}
                  </p>
                </div>
              </div>

              {/* Title and Status */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                  {gig.title}
                </h3>
                <span className={`text-sm px-2 py-1 rounded-full flex-shrink-0 ${
                  gig.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {gig.status}
                </span>
              </div>

              {/* Price and Sales */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-bold text-gray-900">${gig.price}</p>
                <p className="text-sm text-gray-600">{gig.sales} sales</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-auto">
                {currentUser.role === 'seller' ? (
                  <>
                    <button className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                      Edit
                    </button>
                    <button className={`flex-1 py-2 rounded-lg transition-colors text-sm ${
                      gig.status === 'active'
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}>
                      {gig.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                  </>
                ) : (
                  <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                    View Order Details
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}