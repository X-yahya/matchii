import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import Reviews from '../../components/reviews/Reviews';
import { FiAlertCircle, FiCheck, FiLock, FiShoppingCart, FiX, FiStar  } from 'react-icons/fi';

export default function Gig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { isLoading, error, data: gig } = useQuery({
    queryKey: ['gig', id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const { isLoading: isLoadingUser, data: user } = useQuery({
    queryKey: ['user', gig?.userId],
    queryFn: () => newRequest.get(`/users/${gig?.userId}`).then((res) => res.data),
    enabled: !!gig?.userId,
  });

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-red-50 rounded-2xl">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Gig</h2>
          <p className="text-gray-600">Please refresh the page or try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 lg:max-w-3xl">
        {/* Seller Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-xs border border-gray-100 mb-8">
          <div className="flex items-center gap-4">
            <img
              src={user?.image || '/default-avatar.png'}
              alt="Seller"
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                {user?.username || 'Professional Seller'}
              </h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {user?.level || 'Top Rated'}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <FiStar className="w-4 h-4 text-yellow-400" />
                  <span>{(gig?.totalStars / gig?.starNumber).toFixed(1) || '5.0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gig Content */}
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{gig?.title}</h1>

          {/* Media Gallery */}
          <div className="space-y-5">
            <div className="aspect-video bg-gray-50 rounded-2xl overflow-hidden">
              <img
                src={gig?.coverImage}
                alt="Main preview"
                className="w-full h-full object-cover"
              />
            </div>
            {gig?.gallery?.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {gig.gallery.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-pointer hover:shadow-sm transition-shadow"
                  >
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Service Details</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {gig?.description}
            </p>
          </section>

          {/* Features */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Included Features</h2>
            <ul className="grid gap-3">
              {gig?.plans?.[0]?.features?.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center p-4 bg-gray-50 rounded-xl text-gray-700"
                >
                  <FiCheck className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          {/* Reviews */}
          <section>
            <Reviews gigId={gig?._id} />
          </section>
        </div>
      </div>

      {/* Order Sidebar */}
      <div className="w-full lg:w-96">
        <div className="sticky top-24 border border-gray-100 bg-white rounded-2xl p-6 shadow-xs">
          <div className="space-y-6">
            {/* Pricing */}
            <div className="pb-6 border-b border-gray-100">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  ${lowestPrice !== 'N/A' ? lowestPrice : 'N/A'}
                </span>
                <span className="text-gray-500">starting price</span>
              </div>
              
              <dl className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <dt>Delivery Time</dt>
                  <dd className="font-medium">{gig?.plans?.[0]?.deliveryDays || '3'} Days</dd>
                </div>
                <div className="flex justify-between text-gray-600">
                  <dt>Revisions</dt>
                  <dd className="font-medium">{gig?.plans?.[0]?.revisions || 'Unlimited'}</dd>
                </div>
              </dl>
            </div>

            {/* CTA */}
            <button
              onClick={() => setShowConfirmation(true)}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-xl font-medium transition-colors"
            >
              <FiShoppingCart className="w-5 h-5" />
              Continue to Purchase
            </button>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <FiLock className="w-4 h-4 text-green-500" />
              Secure payment processing
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Confirm Order</h2>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-medium text-gray-900 truncate">{gig?.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    ${lowestPrice !== 'N/A' ? lowestPrice : 'N/A'}
                  </p>
                </div>

                {purchaseError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                    <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                    {purchaseError}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50"
                  >
                    {isPurchasing && (
                      <svg 
                        className="animate-spin h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    Confirm Purchase
                  </button>
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="w-full py-3 text-gray-600 hover:bg-gray-50 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}