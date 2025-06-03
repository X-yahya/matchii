import React from "react";
import { FiBriefcase, FiDollarSign, FiFileText } from "react-icons/fi";

const ProposalDetailsModal = ({
  proposal,
  onClose,
  onAccept,
  onDecline,
  loading
}) => {
  if (!proposal) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-screen overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Proposal Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-6 mb-8">
            <img
              src={proposal.freelancerId?.image || '/default-avatar.png'}
              alt={proposal.freelancerId?.username}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-sm"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {proposal.freelancerId?.username}
              </h3>
              <p className="text-gray-600 mt-1">{proposal.freelancerId?.country}</p>
              <div className="flex gap-4 mt-3">
                <div>
                  <span className="text-sm text-gray-500">Success Rate</span>
                  <p className="font-medium">
                    {proposal.freelancerId?.sellerStats?.successRate || 0}%
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Projects Completed</span>
                  <p className="font-medium">
                    {proposal.freelancerId?.sellerStats?.completedProjects || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Applied Role Section */}
            {proposal.appliedRole && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FiBriefcase className="w-5 h-5 text-purple-600" />
                  Applied Role
                </h4>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-purple-800">{proposal.appliedRole.name}</h5>
                      {proposal.appliedRole.description && (
                        <p className="text-gray-600 mt-1">{proposal.appliedRole.description}</p>
                      )}
                    </div>
                    <span className="font-semibold text-gray-700 flex items-center gap-1">
                      <FiDollarSign className="w-4 h-4" />
                      {proposal.appliedRole.budget}
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      proposal.appliedRole.filled 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {proposal.appliedRole.filled ? 'Filled' : 'Open'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Cover Letter Section */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FiFileText className="w-5 h-5 text-blue-600" />
                Cover Letter
              </h4>
              <div className="prose max-w-full bg-gray-50 p-4 rounded-xl border border-gray-100">
                <p className="text-gray-600 whitespace-pre-line break-words leading-relaxed">
                  {proposal.coverLetter.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            </div>

            {/* Proposal Information */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Proposal Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium">
                    {new Date(proposal.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{proposal.status}</p>
                </div>
              </div>
            </div>

            {proposal.status === 'pending' && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onAccept}
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={loading || proposal.appliedRole?.filled}
                >
                  {proposal.appliedRole?.filled ? (
                    "Role Filled"
                  ) : loading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Accepting...
                    </>
                  ) : (
                    "Accept Proposal"
                  )}
                </button>
                <button
                  onClick={onDecline}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Decline Proposal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsModal;