import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import newRequest from '../../utils/newRequest';

const Order = () => {
  const { state } = useLocation();
  const gig = state?.gig;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 lg:max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Order</h1>
            
            {/* Order Details Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Service Details</h2>
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={gig?.coverImage}
                  alt="Service"
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="text-lg font-medium">{gig?.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {gig?.shortDesc}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-medium">${gig?.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery Time</span>
                  <span className="font-medium">
                    {gig?.deliveryTime} Days
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-white border border-gray-300 rounded-full px-6 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-white border border-gray-300 rounded-full px-6 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="CVC"
                      className="w-full bg-white border border-gray-300 rounded-full px-6 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${gig?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-medium">$2.50</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${(gig?.price + 2.50).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Final Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-blue-500">
                    ${(gig?.price + 2.50).toFixed(2)}
                  </span>
                </div>

                <div className="text-sm text-gray-500">
                  <p className="mb-2">Includes:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Full service delivery</li>
                    <li>24/7 support</li>
                    <li>Money-back guarantee</li>
                  </ul>
                </div>

                <button
                  className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition-colors font-medium"
                  onClick={() => {
                    // Add payment confirmation logic here
                    alert('Payment confirmed!');
                  }}
                >
                  Confirm & Pay
                </button>

                <p className="text-xs text-gray-400 text-center mt-4">
                  Secure payment processed by Stripe
                  <br />
                  256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;