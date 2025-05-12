import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import Reviews from '../../components/reviews/Reviews';

export default function Gig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch gig data
  const { isLoading, error, data: gig } = useQuery({
    queryKey: ['gig', id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  // Fetch seller data
  const { isLoading: isLoadingUser, data: user } = useQuery({
    queryKey: ['user', gig?.userId],
    queryFn: () => newRequest.get(`/users/${gig?.userId}`).then((res) => res.data),
    enabled: !!gig?.userId,
  });

  // Calculate lowest price
  const lowestPrice = gig?.plans?.reduce((min, plan) => {
    const price = plan.price?.$numberInt ? parseInt(plan.price.$numberInt, 10) : plan.price;
    return price < min ? price : min;
  }, Infinity) || 'N/A';

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      setPurchaseError(null);

      if (!localStorage.getItem('currentUser')) {
        navigate('/login');
        return;
      }

      const response = await newRequest.post(`/orders/${id}`);
      if (response.status === 201) navigate('/orders');
      
    } catch (err) {
      setPurchaseError(err.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
      setShowConfirmation(false);
    }
  };

  if (isLoading || isLoadingUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-8 text-center text-red-500">
        ⚠️ Error loading gig details
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-8 flex flex-col lg:flex-row gap-8">
      {/* Main Content Section */}
      <div className="flex-1 lg:max-w-[800px]">
        {/* Seller Information */}
        <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm">
          <img
            src={user?.image || '/default-avatar.png'}
            alt="Seller"
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.username || 'Professional Seller'}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {user?.level || 'Top Rated Seller'}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="text-gray-600">
                  {(gig?.totalStars / gig?.starNumber).toFixed(1) || '5.0'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gig Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{gig?.title}</h1>

        {/* Image Gallery */}
        <div className="mb-8 space-y-4">
          <img
            src={gig?.coverImage}
            alt="Gig preview"
            className="w-full h-96 object-cover rounded-2xl shadow-sm"
          />
          <div className="grid grid-cols-3 gap-4">
            {gig?.gallery?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              />
            ))}
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Service</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {gig?.description}
          </p>
        </div>

        {/* Features Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">What's Included</h2>
          <ul className="space-y-3">
            {gig?.plans?.[0]?.features?.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2 text-green-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <Reviews gigId={gig?._id} />
        </div>
      </div>

      {/* Order Sidebar */}
      <div className="w-full lg:w-96">
        <div className="border rounded-2xl shadow-sm bg-white sticky top-24 p-6">
          <div className="space-y-6">
            <div className="border-b pb-6">
              <p className="text-2xl font-bold text-gray-800 mb-4">
                ${lowestPrice !== 'N/A' ? lowestPrice : 'N/A'}
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between">
                  <span>Delivery Time</span>
                  <span className="font-medium">
                    {gig?.plans?.[0]?.deliveryDays || '3'} Days
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Revisions</span>
                  <span className="font-medium">
                    {gig?.plans?.[0]?.revisions || 'Unlimited'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Purchase Button */}
            <button 
              onClick={() => setShowConfirmation(true)}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl transition-all font-medium"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              Purchase Now
            </button>

            {/* Security Assurance */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 text-green-500" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              24/7 Support · Secure Payment
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Confirm Purchase
            </h2>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="font-medium text-gray-900">{gig?.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${lowestPrice !== 'N/A' ? lowestPrice : 'N/A'}
                </p>
              </div>

              <p className="text-gray-600">
                You're about to purchase this service. By confirming, you agree to our terms of service and privacy policy.
              </p>

              {purchaseError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                  <svg 
                    className="w-4 h-4 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {purchaseError}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  disabled={isPurchasing}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={isPurchasing}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {isPurchasing && (
                    <svg 
                      className="animate-spin h-4 w-4 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Confirm Purchase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}