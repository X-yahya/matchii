import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import Reviews from '../../components/reviews/Reviews';
import { FiClock,FiAlertCircle, FiCheck, FiLock, FiShoppingCart, FiX, FiStar, FiInfo } from 'react-icons/fi';

export default function Gig() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

  const { isLoading, error, data: gig } = useQuery({
    queryKey: ['gig', id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  const { isLoading: isLoadingUser, data: user } = useQuery({
    queryKey: ['user', gig?.userId],
    queryFn: () => newRequest.get(`/users/${gig?.userId}`).then((res) => res.data),
    enabled: !!gig?.userId,
  });

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      setPurchaseError(null);

      if (!localStorage.getItem('currentUser')) {
        navigate('/login');
        return;
      }

      const response = await newRequest.post(`/orders/${id}`, {
        planIndex: selectedPlanIndex
      });
      
      if (response.status === 201) navigate('/orders');
    } catch (err) {
      setPurchaseError(err.response?.data?.message || 'Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
      setShowConfirmation(false);
    }
  };

  if (isLoading || isLoadingUser) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorScreen />;
  }

  const selectedPlan = gig?.plans?.[selectedPlanIndex] || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 lg:max-w-3xl">
        {/* Seller Card */}
        <SellerCard user={user} gig={gig} />

        {/* Gig Content */}
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{gig?.title}</h1>

          <MediaGallery gig={gig} />

          <DescriptionSection gig={gig} />

          {/* Plans & Features */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Service Plans</h2>
            <div className="space-y-4">
              {gig?.plans?.map((plan, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-xl border ${
                    selectedPlanIndex === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } cursor-pointer transition-colors`}
                  onClick={() => setSelectedPlanIndex(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{plan.name}</h3>
                    <span className="text-xl font-bold text-blue-600">
                      ${plan.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      {plan.deliveryDays} Days Delivery
                    </span>
                    <span className="flex items-center gap-1">
                      <FiInfo className="w-4 h-4" />
                      {plan.revisions} Revisions
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center text-gray-700">
                        <FiCheck className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <Reviews gigId={gig?._id} />
        </div>
      </div>

      {/* Order Sidebar */}
      <div className="w-full lg:w-96">
        <div className="sticky top-24 border border-gray-100 bg-white rounded-2xl p-6 shadow-xs">
          <div className="space-y-6">
            <div className="pb-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold mb-4">{selectedPlan.name}</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {selectedPlan.price}dt
                </span>
                <span className="text-gray-500">one-time payment</span>
              </div>
              <dl className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <dt>Delivery Time</dt>
                  <dd className="font-medium">{selectedPlan.deliveryDays} Days</dd>
                </div>
                <div className="flex justify-between text-gray-600">
                  <dt>Revisions</dt>
                  <dd className="font-medium">{selectedPlan.revisions}</dd>
                </div>
              </dl>
            </div>

            <button
              onClick={() => setShowConfirmation(true)}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-xl font-medium transition-colors"
            >
              <FiShoppingCart className="w-5 h-5" />
              Continue to Purchase
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <FiLock className="w-4 h-4 text-green-500" />
              Secure payment processing
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal 
          gig={gig}
          selectedPlan={selectedPlan}
          isPurchasing={isPurchasing}
          purchaseError={purchaseError}
          onConfirm={handlePurchase}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}

// Sub-components
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-transparent border-blue-500" />
  </div>
);

const ErrorScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center max-w-md p-8 bg-red-50 rounded-2xl">
      <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Gig</h2>
      <p className="text-gray-600">Please refresh the page or try again later</p>
    </div>
  </div>
);

const SellerCard = ({ user, gig }) => (
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
);

const MediaGallery = ({ gig }) => (
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
);

const DescriptionSection = ({ gig }) => (
  <section className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900">Service Details</h2>
    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
      {gig?.description}
    </p>
  </section>
);

const ConfirmationModal = ({ gig, selectedPlan, isPurchasing, purchaseError, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Confirm Order</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl">
            <h3 className="font-medium text-gray-900 truncate">{gig?.title}</h3>
            <div className="mt-2 space-y-1">
              <p className="text-lg font-semibold">{selectedPlan.name}</p>
              <p className="text-2xl font-bold text-gray-900">${selectedPlan.price}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  {selectedPlan.deliveryDays} Days Delivery
                </span>
                <span className="flex items-center gap-1">
                  <FiInfo className="w-4 h-4" />
                  {selectedPlan.revisions} Revisions
                </span>
              </div>
            </div>
          </div>

          {purchaseError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
              {purchaseError}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
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
              onClick={onCancel}
              className="w-full py-3 text-gray-600 hover:bg-gray-50 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);