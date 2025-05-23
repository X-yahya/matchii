// components/proposalCard/ProposalCard.jsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import { motion, AnimatePresence } from 'framer-motion';

const ProposalCard = ({ proposal }) => {
  const queryClient = useQueryClient();
  const [showDetails, setShowDetails] = useState(false);
  const freelancer = proposal.freelancerProfile;

  const mutation = useMutation({
    mutationFn: (status) => newRequest.patch(`/proposals/${proposal._id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries(['proposals']),
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xs border border-gray-200 hover:shadow-sm transition-shadow"
      >
        <div className="p-5">
          <div className="flex items-start gap-4">
            <img
              src={freelancer.image || '/default-avatar.png'}
              alt={freelancer.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs"
            />
            
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[17px] font-semibold text-gray-900">{freelancer.name}</h3>
                  <p className="text-[15px] text-gray-500">
                    {freelancer.country} • {freelancer.sellerStats?.completedProjects || 0} projects
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[13px] font-medium ${
                  proposal.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  proposal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {proposal.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[15px]">
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-500">Success Rate</p>
                  <p className="font-medium mt-1">{freelancer.sellerStats?.successRate || 0}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-gray-500">Avg. Rating</p>
                  <p className="font-medium mt-1">4.9</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowDetails(true)}
                  className="text-blue-600 hover:text-blue-700 text-[15px] font-medium"
                >
                  View Proposal Details →
                </button>
              </div>

              {proposal.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => mutation.mutate('accepted')}
                    className="flex-1 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[15px] font-medium transition-colors"
                  >
                    Accept Proposal
                  </button>
                  <button
                    onClick={() => mutation.mutate('rejected')}
                    className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[15px] font-medium transition-colors"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Proposal Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Proposal Details</h2>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex gap-6 mb-8">
                  <img
                    src={freelancer.image || '/default-avatar.png'}
                    alt={freelancer.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{freelancer.name}</h3>
                    <p className="text-gray-600 mt-1">{freelancer.country}</p>
                    <div className="flex gap-4 mt-3">
                      <div>
                        <span className="text-gray-500">Success Rate</span>
                        <p className="font-medium">{freelancer.sellerStats?.successRate || 0}%</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Projects Completed</span>
                        <p className="font-medium">{freelancer.sellerStats?.completedProjects || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Cover Letter</h4>
                    <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                      {proposal.coverLetter}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Proposal Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-500">Submitted</p>
                        <p className="font-medium">
                          {new Date(proposal.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-500">Status</p>
                        <p className="font-medium capitalize">{proposal.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProposalCard;