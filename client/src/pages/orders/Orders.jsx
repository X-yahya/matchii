import React from 'react';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import OrderCard from '../../components/OrderCard/OrderCard';
import { FiBox } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // 👇 useQuery must be called with an object
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: () => newRequest.get('/orders').then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <p className="text-red-600">Failed to load orders.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Your Orders</h1>
        <span className="text-gray-600">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </span>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <FiBox className="mx-auto mb-4 w-16 h-16 text-gray-400" />
          <p className="text-xl text-gray-500 mb-4">No orders found</p>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
          >
            Browse Services
          </Link>
        </div>
      ) : (
        orders.map(order => (
          <OrderCard key={order._id} order={order} currentUser={currentUser} />
        ))
      )}
    </div>
  );
};

export default Orders;
