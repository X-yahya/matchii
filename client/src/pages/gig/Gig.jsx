import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import Reviews from '../../components/reviews/Reviews';

export default function Gig() {
  const { id } = useParams();

  // Fetch gig data using react-query
  const { isLoading, error, data: gig } = useQuery({
    queryKey: ['gig', id],
    queryFn: () => newRequest.get(`/gigs/single/${id}`).then((res) => res.data),
  });

  // Fetch user data using the userId from the gig data
  const { isLoading: isLoadingUser, error: errorUser, data: user } = useQuery({
    queryKey: ['user', gig?.userId],
    queryFn: () => newRequest.get(`/users/${gig?.userId}`).then((res) => res.data),
    enabled: !!gig?.userId,
  });

  // Calculate the lowest price across all plans
  const lowestPrice = gig?.plans?.length > 0
    ? Math.min(
        ...gig.plans.map((plan) =>
          plan.price?.$numberInt 
            ? parseInt(plan.price.$numberInt, 10) 
            : plan.price || 0
        )
      )
    : 'N/A';

  if (isLoading || isLoadingUser) {
    return <div className="p-6 text-center text-gray-600 mt-8">Loading...</div>;
  }

  if (error || errorUser) {
    return <div className="p-6 text-center text-red-500 mt-8">Error loading data. Please try again.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-8 flex flex-col lg:flex-row gap-8">
      {/* Main Content Section */}
      <div className="flex-1 lg:max-w-[800px]">
        {/* Seller Header */}
        <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <img
            src={user?.image || '/default-seller.jpg'}
            alt="Seller"
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user?.username || 'Unknown Seller'}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {user?.level || 'Level 1 Seller'}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-gray-600">
                  {gig.totalStars && gig.starNumber
                    ? (gig.totalStars / gig.starNumber).toFixed(1)
                    : 'No ratings'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gig Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{gig.title}</h1>

        {/* Image Gallery */}
        <div className="mb-8 space-y-4">
          <img
            src={gig.coverImage}
            alt="Gig preview"
            className="w-full h-96 object-cover rounded-xl shadow-sm"
          />
          <div className="grid grid-cols-3 gap-4">
            {gig.gallery?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Features & Description */}
        <div className="space-y-8">
          {/* About This Gig */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Gig</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{gig.description}</p>
          </div>

          {/* What's Included */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">What's Included</h2>
            <ul className="space-y-3">
              {gig.plans?.[0]?.features?.map((feature, index) => (
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
        </div>

        {/* Added Reviews Section */}
        <Reviews gigId={gig._id} />
      </div>

      {/* Order Sidebar */}
      <div className="w-full lg:w-96">
        <div className="border rounded-xl shadow-sm bg-white sticky top-24 p-6">
          <div className="space-y-6">
            <div className="border-b pb-6">
              <p className="text-2xl font-bold text-gray-800 mb-4">
                ${lowestPrice !== 'N/A' ? lowestPrice : 'N/A'}
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between">
                  <span>Delivery Time</span>
                  <span className="font-medium">
                    {gig.plans?.[0]?.deliveryDays?.$numberInt
                      ? `${parseInt(gig.plans[0].deliveryDays.$numberInt, 10)} Days`
                      : gig.plans?.[0]?.deliveryDays
                      ? `${gig.plans[0].deliveryDays} Days`
                      : 'N/A'}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Revisions</span>
                  <span className="font-medium">{gig.plans?.[0]?.revisions || 'Unlimited'}</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Continue (${lowestPrice !== 'N/A' ? lowestPrice : 'N/A'})
              </button>
              <div className="text-center text-sm text-gray-500">
                24/7 Support · Secure Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}