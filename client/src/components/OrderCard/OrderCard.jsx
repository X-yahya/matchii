import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import {
    FiCheck,
    FiX,
    FiClock,
    FiDollarSign,
    FiMessageSquare,
    FiUser,
    FiLoader,
    FiBox,
    FiTag,
    FiRepeat
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const OrderCard = ({ order }) => {
    const queryClient = useQueryClient();
    const [isUpdating, setIsUpdating] = useState(false);
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const isSeller = order.seller._id === currentUser?._id;
    const otherUser = isSeller ? order.buyer : order.seller;

    // Fetch gig data
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
            const conversationId = isSeller
                ? `${currentUser._id}${otherUser._id}`
                : `${otherUser._id}${currentUser._id}`;

            try {
                const res = await newRequest.get(`/conversations/single/${conversationId}`);
                return res.data;
            } catch (err) {
                const res = await newRequest.post(`/conversations`, { to: otherUser._id });
                return res.data;
            }
        },
        onSuccess: (data) => navigate(`/message/${data.id}`),
        onError: () => alert("Failed to contact user. Please try again later.")
    });

    const getStatusBadge = () => {
        const statusConfig = {
            pending: { color: 'bg-amber-500', icon: <FiClock className="w-3 h-3" /> },
            refused: { color: 'bg-red-500', icon: <FiX className="w-3 h-3" /> },
            inProgress: { color: 'bg-blue-500', icon: <FiLoader className="w-3 h-3 animate-spin" /> },
            completed: { color: 'bg-green-500', icon: <FiCheck className="w-3 h-3" /> }
        };

        return (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border">
                {statusConfig[order.status].icon}
                <span className="text-sm font-medium capitalize text-gray-700">
                    {order.status}
                </span>
            </div>
        );
    };

    const handleAction = (action) => {
        setIsUpdating(true);
        mutation.mutate(action);
    };

    return (
        <div className="border border-gray-100 rounded-2xl p-6 mb-4 bg-white shadow-sm hover:shadow-md transition-all duration-200">
            {/* Gig Information Section */}
            {gig ? (
                <div className="mb-6 border-b border-gray-100 pb-6">
                    <Link to={`/gig/${order.gigId}`} className="flex gap-4 group">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                            <img
                                src={gig.coverImage}
                                alt={gig.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.classList.add('hidden');
                                }}
                            />
                            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                <FiBox className="w-6 h-6 text-gray-400" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {gig.title}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full flex items-center gap-1">
                                    <FiTag className="w-3 h-3" />
                                    {gig.category}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full flex items-center gap-1">
                                    <FiClock className="w-3 h-3" />
                                    {gig.deliveryTime} day delivery
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full flex items-center gap-1">
                                    <FiRepeat className="w-3 h-3" />
                                    {gig.revisionNumber} revisions
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>
            ) : gigLoading ? (
                <div className="mb-6 border-b border-gray-100 pb-6 animate-pulse">
                    <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-xl bg-gray-100" />
                        <div className="flex-1 space-y-3">
                            <div className="h-4 bg-gray-100 rounded w-3/4" />
                            <div className="flex gap-2">
                                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                                <div className="h-6 w-24 bg-gray-100 rounded-full" />
                                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Order Information */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <img 
                            src={otherUser.image} 
                            className="w-14 h-14 rounded-full object-cover border-2 border-gray-50"
                            alt={otherUser.username}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.parentElement.querySelector('.avatar-fallback').classList.remove('hidden');
                            }}
                        />
                        <div className="avatar-fallback hidden absolute inset-0 bg-gray-100 rounded-full flex items-center justify-center">
                            <FiUser className="w-6 h-6 text-gray-400" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">{order.title}</h3>
                        <p className="text-sm text-gray-500">
                            
                        </p>
                    </div>
                </div>
                {getStatusBadge()}
            </div>

            {/* Order Metadata */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                    <FiDollarSign className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">${order.price}</span>
                </div>
                <div className="flex items-center gap-3">
                    <FiClock className="w-5 h-5 text-gray-400" />
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
            </div>

            {/* Action Buttons */}
            {order.status === 'pending' && isSeller && !order.sellerAccepted && (
                <div className="flex gap-3">
                    <button
                        onClick={() => handleAction('accept')}
                        disabled={isUpdating}
                        className="flex-1 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200"
                    >
                        {isUpdating ? (
                            <FiLoader className="animate-spin" />
                        ) : (
                            <>
                                <FiCheck /> Accept
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => handleAction('refuse')}
                        disabled={isUpdating}
                        className="flex-1 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200"
                    >
                        {isUpdating ? (
                            <FiLoader className="animate-spin" />
                        ) : (
                            <>
                                <FiX /> Decline
                            </>
                        )}
                    </button>
                </div>
            )}

            {order.status === 'inProgress' && (
                <>
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500">Progress</span>
                            <span className="text-sm font-medium text-gray-700">
                                {((order.buyerCompleted + order.sellerCompleted) / 2) * 100}%
                            </span>
                        </div>
                        <div className="relative h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div 
                                className="absolute h-full bg-blue-500 rounded-full transition-all duration-300"
                                style={{ width: `${((order.buyerCompleted + order.sellerCompleted) / 2) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleAction('complete')}
                            disabled={isUpdating || (isSeller ? order.sellerCompleted : order.buyerCompleted)}
                            className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200"
                        >
                            {isUpdating ? (
                                <FiLoader className="animate-spin" />
                            ) : (
                                <>
                                    <FiCheck /> Mark Complete
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => contactMutation.mutate()}
                            className="px-5 py-3 bg-transparent border border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                        >
                            <FiMessageSquare /> Message
                        </button>
                    </div>
                </>
            )}

            {order.status === 'completed' && (
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FiCheck className="w-5 h-5 text-green-600" />
                            <span className="text-green-700 font-medium">Order Completed</span>
                        </div>
                        <button
                            onClick={() => contactMutation.mutate()}
                            className="px-4 py-2 bg-white text-gray-700 rounded-lg flex items-center gap-2 border hover:border-gray-400 transition-all duration-200"
                        >
                            <FiMessageSquare /> Contact
                        </button>
                    </div>
                </div>
            )}

            {order.status === 'refused' && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="flex items-center gap-3">
                        <FiX className="w-5 h-5 text-red-600" />
                        <span className="text-red-700 font-medium">Order Declined</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderCard;