import React from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { Link, useNavigate } from "react-router-dom";
import { FiClock, FiCheckCircle, FiMessageSquare, FiUser, FiDollarSign, FiBox } from "react-icons/fi";

const StatusBadge = ({ isCompleted }) => (
  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm 
    ${isCompleted ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
    {isCompleted ? (
      <FiCheckCircle className="mr-1.5 h-4 w-4" />
    ) : (
      <FiClock className="mr-1.5 h-4 w-4" />
    )}
    {isCompleted ? 'Completed' : 'In Progress'}
  </div>
);

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get("/orders")
        .then((res) => res.data)
        .catch((err) => {
          throw new Error(err.response?.data?.message || "Failed to fetch orders");
        }),
  });

  const handleContact = async (order) => {
    const contactId = currentUser?.isSeller ? order.buyerId : order.sellerId;
    try {
      const res = await newRequest.post(`/conversations`, { to: contactId });
      navigate(`/messages/${res.data._id}`);
    } catch (err) {
      console.error("Contact error:", err);
    }
  };

  if (isLoading) return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl" />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="p-4 bg-red-50 rounded-xl flex items-center">
        <FiAlertCircle className="text-red-500 mr-2" />
        <span className="text-red-600">{error.message}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Your Orders</h1>
        <span className="text-gray-500">
          {data?.length} {data?.length === 1 ? 'order' : 'orders'}
        </span>
      </div>

      {data?.length === 0 ? (
        <div className="text-center py-20">
          <FiBox className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-xl text-gray-500 mb-2">No orders found</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl 
            hover:bg-blue-600 transition-all duration-200 font-medium"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Image */}
                <div className="md:col-span-2">
                  <img
                    src={order.img}
                    alt={order.title}
                    className="w-full h-32 object-cover rounded-xl"
                  />
                </div>

                {/* Details */}
                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center space-x-4">
                    <StatusBadge isCompleted={order.isCompleted} />
                    <h3 className="text-xl font-semibold text-gray-900">{order.title}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-600">
                    <div className="flex items-center">
                      <FiUser className="mr-2 text-gray-400" />
                      <span>{currentUser?.isSeller ? order.buyerName : order.sellerName}</span>
                    </div>
                    <div className="flex items-center">
                      <FiDollarSign className="mr-2 text-gray-400" />
                      <span>${order.price?.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="mr-2 text-gray-400" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-2 flex flex-col space-y-2">
                  <button
                    onClick={() => handleContact(order)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                    rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    <FiMessageSquare className="mr-2" />
                    Contact
                  </button>
                  {!order.isCompleted && (
                    <button className="w-full px-4 py-2 text-blue-500 border border-blue-500 rounded-xl hover:bg-blue-50 transition">
                      Track Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;