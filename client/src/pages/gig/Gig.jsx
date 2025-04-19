import { useParams } from 'react-router-dom';
import { gig } from '../../data';

export default function Gig() {
  const { id } = useParams();
  const selectedGig = gig.find((item) => item.id === parseInt(id));

  if (!selectedGig) {
    return <div className="p-6 text-center text-gray-600 mt-8">Gig not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-8 flex flex-col lg:flex-row gap-8">
      {/* Main Content Section */}
      <div className="flex-1 lg:max-w-[800px]">
        {/* Seller Header */}
        <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">
          <img
            src={selectedGig.pp}
            alt="Seller"
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{selectedGig.username}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                Level 1 Seller
              </span>
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-lg">★</span> {/* Replaced StarIcon */}
                <span className="text-gray-600">{selectedGig.star}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gig Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedGig.title}</h1>

        {/* Image Gallery */}
        <div className="mb-8 space-y-4">
          <img
            src={selectedGig.cover}
            alt="Gig preview"
            className="w-full h-96 object-cover rounded-xl shadow-sm"
          />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <img
                key={item}
                src={selectedGig.cover}
                alt={`Preview ${item}`}
                className="w-full h-32 object-cover rounded-lg cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Features & Description */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Gig</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {selectedGig.desc}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">What's Included</h2>
            <ul className="space-y-3">
              {selectedGig.features?.map((feature, index) => (
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
      </div>

      {/* Order Sidebar */}
      <div className="w-full lg:w-96">
        <div className="border rounded-xl shadow-sm bg-white sticky top-24 p-6">
          <div className="space-y-6">
            <div className="border-b pb-6">
              <p className="text-2xl font-bold text-gray-800 mb-4">${selectedGig.price}</p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between">
                  <span>Delivery Time</span>
                  <span className="font-medium">{selectedGig.delivery} Days</span>
                </li>
                <li className="flex justify-between">
                  <span>Revisions</span>
                  <span className="font-medium">{selectedGig.revision || 'Unlimited'}</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                Continue (${selectedGig.price})
              </button>
              
              <div className="text-center text-sm text-gray-500">
                24/7 Support · Secure Payment
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-4 text-gray-600 text-sm">
                <div className="flex-1 text-center">
                  <p className="font-medium">98%</p>
                  <p>Completion Rate</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="font-medium">4h</p>
                  <p>Avg. Response</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="font-medium">127</p>
                  <p>Orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}