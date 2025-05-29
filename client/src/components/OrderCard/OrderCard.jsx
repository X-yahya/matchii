import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import { FiCheck, FiX, FiClock, FiDollarSign, FiMessageSquare, FiUser, FiLoader, FiBox, FiTag } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const OrderCard = ({ order, currentUser }) => {
    const queryClient = useQueryClient();
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();
    
    const isSeller = order.sellerId === currentUser?._id;
    const otherUser = isSeller ? order.buyer : order.seller;

    const { data: gig, isLoading: gigLoading } = useQuery({
        queryKey: ['gig', order.gigId],
        queryFn: () => newRequest.get(`/gigs/single/${order.gigId}`).then(res => res.data),
        enabled: !!order.gigId
    });

    const mutation = useMutation({
        mutationFn: (action) => newRequest.put(`/orders/${order._id}`, { action }),
        onSuccess: () => queryClient.invalidateQueries(['orders']),
        onSettled: () => setIsUpdating(false),
    });

    const contactMutation = useMutation({
  mutationFn: async () => {
    try {
      // Create conversation directly instead of checking first
      const res = await newRequest.post(`/conversations`, { 
        to: otherUser._id,
        gigId: order.gigId,
        orderId: order._id
      });
      return res.data;
    } catch (err) {
      // Handle duplicate error specifically
      if (err.response?.status === 409) {
        return err.response.data;
      }
      throw new Error(err.response?.data?.message || 'Failed to start conversation');
    }
  },
  onSuccess: (data) => navigate(`/message/${data.id}`),
  onError: (err) => alert(err.message)
});
    const statusColors = {
        pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <FiClock className="w-4 h-4" /> },
        refused: { bg: 'bg-red-100', text: 'text-red-700', icon: <FiX className="w-4 h-4" /> },
        inProgress: { bg: 'bg-blue-100', text: 'text-blue-700', icon: <FiLoader className="w-4 h-4 animate-spin" /> },
        completed: { bg: 'bg-green-100', text: 'text-green-700', icon: <FiCheck className="w-4 h-4" /> }
    };

    const handleAction = (action) => {
        setIsUpdating(true);
        mutation.mutate(action);
    };

    const progress = ((order.buyerCompleted + order.sellerCompleted) / 2) * 100;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Service Image */}
                <Link 
                    to={`/gig/${order.gigId}`}
                    className="flex-shrink-0 w-full md:w-40 h-40 rounded-xl overflow-hidden relative group"
                >
                    <img
                        src={gig?.coverImage || order.img}
                        alt={order.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {gigLoading && (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                            <FiBox className="w-6 h-6 text-gray-400 animate-pulse" />
                        </div>
                    )}
                </Link>

                {/* Order Details */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">
                                <Link 
                                    to={`/gig/${order.gigId}`}
                                    className="hover:text-blue-500 transition-colors"
                                >
                                    {order.title}
                                </Link>
                            </h2>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full flex items-center gap-1">
                                    <FiTag className="w-4 h-4" />
                                    {gig?.category || 'General Service'}
                                </span>
                                {gig?.deliveryTime && (
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full flex items-center gap-1">
                                        <FiClock className="w-4 h-4" />
                                        {gig.deliveryTime} day delivery
                                    </span>
                                )}
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${statusColors[order.status].bg} ${statusColors[order.status].text}`}>
                            {statusColors[order.status].icon}
                            {order.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <FiDollarSign className="w-4 h-4" /> Price
                            </p>
                            <p className="font-medium">${order.price}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <FiUser className="w-4 h-4" />
                                {isSeller ? 'Client' : 'Freelancer'}
                            </p>
                            <div className="flex items-center gap-2">
                                <img
                                    src={otherUser?.image || '/default-avatar.png'}
                                    alt={otherUser?.username}
                                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                />
                                <span className="font-medium">
                                    {otherUser?.username || 'Professional User'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {order.status === 'inProgress' && (
                        <div className="pt-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Progress</span>
                                <span className="font-medium text-blue-600">{Math.round(progress)}%</span>
                            </div>
                            <div className="relative h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div 
                                    className="absolute h-full bg-blue-500 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100">
                        {order.status === 'pending' && isSeller && !order.sellerAccepted && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleAction('accept')}
                                    disabled={isUpdating}
                                    className="flex-1 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isUpdating ? <FiLoader className="animate-spin" /> : <FiCheck />}
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleAction('refuse')}
                                    disabled={isUpdating}
                                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isUpdating ? <FiLoader className="animate-spin" /> : <FiX />}
                                    Decline
                                </button>
                            </div>
                        )}

                        {order.status === 'inProgress' && (
                            <div className="flex items-center justify-between gap-3 mt-4">
                                <button
                                    onClick={() => handleAction('complete')}
                                    disabled={isUpdating || (isSeller ? order.sellerCompleted : order.buyerCompleted)}
                                    className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isUpdating ? <FiLoader className="animate-spin" /> : <FiCheck />}
                                    Mark Complete
                                </button>
                                <button
                                    onClick={() => contactMutation.mutate()}
                                    disabled={contactMutation.isLoading}
                                    className="px-4 py-2.5 border border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg flex items-center gap-2 
                                              disabled:opacity-50 transition-all duration-150 hover:shadow-sm"
                                >
                                    {contactMutation.isLoading ? (
                                        <FiLoader className="animate-spin w-4 h-4" />
                                    ) : (
                                        <>
                                            <FiMessageSquare className="w-4 h-4" />
                                            <span className="hidden sm:inline">Message</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {order.status === 'completed' && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-green-600">
                                    <FiCheck className="w-5 h-5" />
                                    <span>Order Completed</span>
                                </div>
                                <button
                                    onClick={() => contactMutation.mutate()}
                                    className="px-4 py-2.5 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg flex items-center gap-2"
                                >
                                    <FiMessageSquare />
                                    Contact
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;