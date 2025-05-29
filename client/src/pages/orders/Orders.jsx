import React from 'react';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import OrderCard from '../../components/OrderCard/OrderCard';
import { FiBox, FiUser, FiPackage, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => newRequest.get('/orders').then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="animate-pulse space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="w-24 h-24 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="inline-flex items-center p-4 bg-red-50 rounded-xl">
          <FiBox className="w-6 h-6 mr-2 text-red-600" />
          <p className="text-red-600">Failed to load orders. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
            <FiPackage className="text-blue-500" /> Your Orders
          </h1>
          <p className="text-gray-500 mt-1">Manage your purchased services</p>
        </div>
        <span className="px-4 py-2 bg-gray-100 rounded-full text-sm">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </span>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-16 space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
            <FiBox className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-xl text-gray-600">No orders found</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Browse Available Services
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <OrderCard key={order._id} order={order} currentUser={currentUser} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;