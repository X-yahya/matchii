import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import { motion, AnimatePresence } from 'framer-motion';

const WorkDashboard = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isSeller = currentUser.isSeller;

  // Conversation functionality
const createConvoMutation = useMutation({
  mutationFn: (to) => newRequest.post('/conversations', { to }),
  onSuccess: (data) => {
    // For new conversations, navigate to the new conversation ID
    navigate(`/messages`);
  },
  onError: (error) => {
    
      navigate(`/messages`);
    
  }
});
  const handleMessage = (freelancerId) => {
    createConvoMutation.mutate(freelancerId);
  };

  // Main data query
  const { isLoading, error, data } = useQuery({
    queryKey: ['workData', isSeller],
    queryFn: () =>
      isSeller
        ? newRequest.get('/proposals').then(res => res.data)
        : newRequest.get('/projects/myprojects').then(res => res.data),
    select: rawData => {
      if (isSeller) {
        return {
          active: rawData.filter(p => ['accepted', 'pending'].includes(p.status)),
          rejected: rawData.filter(p => p.status === 'rejected')
        };
      }
      return {
        activeProjects: rawData.filter(p => p.status !== 'completed'),
        completedProjects: rawData.filter(p => p.status === 'completed')
      };
    }
  });

  // Proposal status mutation
  const updateProposalStatus = useMutation({
    mutationFn: ({ proposalId, status }) =>
      newRequest.patch(`/proposals/${proposalId}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries(['workData', isSeller])
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            {isSeller ? 'My Proposals' : 'My Projects'}
          </h1>
          <p className="text-lg text-gray-500 mt-1">
            {isSeller ? 'Track your proposal status' : 'Manage your active projects'}
          </p>
        </div>
        {!isSeller && (
          <Link
            to="/projects/add"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-base font-medium transition-colors"
          >
            <span>+ New Project</span>
          </Link>
        )}
      </header>

      <nav className="flex border-b border-gray-200 mb-6">
        {[
          { 
            key: 'active', 
            label: `Active (${(isSeller ? data?.active?.length : data?.activeProjects?.length) || 0})` 
          },
          { 
            key: isSeller ? 'rejected' : 'completed', 
            label: `${isSeller ? 'Declined' : 'Completed'} (${(isSeller ? data?.rejected?.length : data?.completedProjects?.length) || 0})` 
          }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 -mb-px border-b-2 text-base font-medium transition-colors ${
              activeTab === tab.key 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isSeller ? (
            <ProposalSection proposals={activeTab === 'active' ? data?.active : data?.rejected} />
          ) : (
            <ProjectSection 
              projects={activeTab === 'active' ? data?.activeProjects : data?.completedProjects}
              updateProposalStatus={updateProposalStatus}
              handleMessage={handleMessage}
              createConvoMutation={createConvoMutation}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Helper Components
const LoadingState = () => (
  <div className="flex justify-center py-20">
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600" />
  </div>
);

const ErrorState = ({ error }) => (
  <div className="bg-red-50 rounded-2xl p-6 flex items-start gap-4">
    <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <div>
      <h3 className="text-lg font-medium text-red-800">Loading Error</h3>
      <p className="text-base text-red-700 mt-1">{error.message}</p>
    </div>
  </div>
);

// Proposal Section Component
const ProposalSection = ({ proposals }) => (
  <div className="space-y-4">
    {proposals && proposals.length > 0 ? (
      proposals.map(proposal => (
        <motion.div
          key={proposal._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {proposal.project?.title || proposal.projectId?.title}
              </h3>
              <p className="text-base text-gray-600 mt-2 line-clamp-2">
                {proposal.coverLetter}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  proposal.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  proposal.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </span>
                <span className="text-base text-gray-500">
                  Budget: ${proposal.project?.budget || proposal.projectId?.budget}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">
                {new Date(proposal.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </motion.div>
      ))
    ) : (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No proposals found</p>
      </div>
    )}
  </div>
);

// Project Section Component
const ProjectSection = ({ 
  projects, 
  updateProposalStatus, 
  handleMessage,
  createConvoMutation 
}) => {
  const queryClient = useQueryClient();
  const [selectedProposal, setSelectedProposal] = useState(null);

  // Project status update mutation
  const updateProjectStatus = useMutation({
    mutationFn: ({ projectId, status }) => 
      newRequest.patch(`/projects/${projectId}`, { status }),
    onSuccess: () => queryClient.invalidateQueries(['workData', false])
  });

  const removeFreelancer = useMutation({
    mutationFn: ({ projectId, freelancerId }) => 
      newRequest.patch(`/projects/${projectId}/remove-freelancer`, { freelancerId }),
    onSuccess: () => queryClient.invalidateQueries(['workData', false])
  });

  // Status action helper
  const getStatusAction = (currentStatus) => {
    switch (currentStatus) {
      case 'open': return { nextStatus: 'in_progress', buttonText: 'Start Project', buttonClass: 'bg-blue-600 hover:bg-blue-700' };
      case 'in_progress': return { nextStatus: 'completed', buttonText: 'Mark as Complete', buttonClass: 'bg-green-600 hover:bg-green-700' };
      case 'completed': return { nextStatus: 'open', buttonText: 'Reopen Project', buttonClass: 'bg-gray-600 hover:bg-gray-700' };
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {projects && projects.length > 0 ? (
        projects.map(project => {
          const accepted = project.proposals?.filter(p => p.status === 'accepted') || [];
          const pending = project.proposals?.filter(p => p.status === 'pending') || [];
          const rejected = project.proposals?.filter(p => p.status === 'rejected') || [];
          const statusAction = getStatusAction(project.status);

          return (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'completed' ? 'bg-green-100 text-green-700' :
                      project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.replace('_', ' ').slice(1)}
                    </span>
                    <span className="text-base text-gray-600">
                      Budget: ${project.budget}
                    </span>
                    <span className="text-sm text-gray-500">
                      Duration: {project.duration} days
                    </span>
                  </div>
                  <p className="text-gray-600 mt-2 line-clamp-2">{project.description}</p>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                  {statusAction && (
                    <button
                      onClick={() => updateProjectStatus.mutate({
                        projectId: project._id,
                        status: statusAction.nextStatus
                      })}
                      disabled={updateProjectStatus.isLoading}
                      className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-sm ${statusAction.buttonClass}`}
                    >
                      {updateProjectStatus.isLoading ? 'Updating...' : statusAction.buttonText}
                    </button>
                  )}
                  
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-base font-medium text-blue-600 hover:text-blue-700"
                  >
                    View Details →
                  </Link>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{project.team?.length || 0}</p>
                  <p className="text-sm text-gray-500">Team Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{pending.length}</p>
                  <p className="text-sm text-gray-500">Pending Proposals</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{accepted.length}</p>
                  <p className="text-sm text-gray-500">Accepted</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{rejected.length}</p>
                  <p className="text-sm text-gray-500">Declined</p>
                </div>
              </div>

              {/* Team Members Section */}
              {project.team && project.team.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">Team Members</h4>
                    <span className="text-sm text-gray-500">{project.team.length} member{project.team.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-3">
                    {project.team.map(member => (
                      <div key={member.freelancerId._id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <img
                          src={member.freelancerId?.image || '/default-avatar.png'}
                          alt={member.freelancerId?.username}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{member.freelancerId?.username}</p>
                          <p className="text-sm text-gray-500">{member.freelancerId?.country}</p>
                          <p className="text-xs text-gray-400">
                            Role: {member.role || 'Contributor'} • Joined: {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                            Active
                          </span>
                          <button
                            onClick={() => handleMessage(member.freelancerId._id)}
                            className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                            disabled={createConvoMutation.isLoading}
                          >
                            {createConvoMutation.isLoading ? 'Redirecting...' : 'Message'}
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Remove ${member.freelancerId?.username}?`)) {
                                removeFreelancer.mutate({
                                  projectId: project._id,
                                  freelancerId: member.freelancerId._id
                                });
                              }
                            }}
                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition-colors"
                            disabled={removeFreelancer.isLoading}
                          >
                            {removeFreelancer.isLoading ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Proposals Section */}
              {(pending.length > 0 || rejected.length > 0) && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">Proposals</h4>
                    <span className="text-sm text-gray-500">
                      {pending.length} pending • {rejected.length} declined
                    </span>
                  </div>
                  <div className="space-y-4">
                    {[...pending, ...rejected].map(proposal => (
                      <div key={proposal._id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                        <img
                          src={proposal.freelancerId?.image || '/default-avatar.png'}
                          alt={proposal.freelancerId?.username}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="text-base font-medium text-gray-900">
                                {proposal.freelancerId?.username}
                              </p>
                              <p className="text-sm text-gray-500">
                                {proposal.freelancerId?.country}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-400">
                                  {proposal.freelancerId?.sellerStats?.completedProjects || 0} projects completed
                                </span>
                                <span className="text-xs text-gray-400">
                                  {proposal.freelancerId?.sellerStats?.successRate || 0}% success rate
                                </span>
                              </div>
                            </div>
                            <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                              proposal.status === 'accepted' ? 'bg-green-100 text-green-700' :
                              proposal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setSelectedProposal(proposal)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              View Full Proposal →
                            </button>
                            {proposal.status === 'pending' && (
                              <div className="flex gap-2 ml-auto">
                                <button
                                  onClick={() => updateProposalStatus.mutate({
                                    proposalId: proposal._id,
                                    status: 'accepted'
                                  })}
                                  disabled={updateProposalStatus.isLoading}
                                  className="text-sm px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => updateProposalStatus.mutate({
                                    proposalId: proposal._id,
                                    status: 'rejected'
                                  })}
                                  disabled={updateProposalStatus.isLoading}
                                  className="text-sm px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty states */}
              {project.team?.length === 0 && pending.length === 0 && rejected.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">No team members or proposals yet</p>
                  <p className="text-sm">Proposals will appear here once freelancers start applying</p>
                </div>
              )}
            </motion.div>
          );
        })
      ) : (
        <div className="text-center py-12">
          <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-gray-500 text-lg font-medium mb-2">No projects found</p>
          <p className="text-gray-400">Create your first project to get started</p>
        </div>
      )}

      {/* Proposal Details Modal */}
      <AnimatePresence>
        {selectedProposal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProposal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Proposal Details</h2>
                  <button
                    onClick={() => setSelectedProposal(null)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex gap-6 mb-8">
                  <img
                    src={selectedProposal.freelancerId?.image || '/default-avatar.png'}
                    alt={selectedProposal.freelancerId?.username}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedProposal.freelancerId?.username}
                    </h3>
                    <p className="text-gray-600 mt-1">{selectedProposal.freelancerId?.country}</p>
                    <div className="flex gap-4 mt-3">
                      <div>
                        <span className="text-sm text-gray-500">Success Rate</span>
                        <p className="font-medium">
                          {selectedProposal.freelancerId?.sellerStats?.successRate || 0}%
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Projects Completed</span>
                        <p className="font-medium">
                          {selectedProposal.freelancerId?.sellerStats?.completedProjects || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h4>
                    <div className="prose max-w-full">
                      <p className="text-gray-600 whitespace-pre-line break-words leading-relaxed">
                        {selectedProposal.coverLetter.split('\n').map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Proposal Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-500">Submitted</p>
                        <p className="font-medium">
                          {new Date(selectedProposal.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-500">Status</p>
                        <p className="font-medium capitalize">{selectedProposal.status}</p>
                      </div>
                    </div>
                  </div>

                  {selectedProposal.status === 'pending' && (
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => {
                          updateProposalStatus.mutate({
                            proposalId: selectedProposal._id,
                            status: 'accepted'
                          });
                          setSelectedProposal(null);
                        }}
                        disabled={updateProposalStatus.isLoading}
                        className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                      >
                        Accept Proposal
                      </button>
                      <button
                        onClick={() => {
                          updateProposalStatus.mutate({
                            proposalId: selectedProposal._id,
                            status: 'rejected'
                          });
                          setSelectedProposal(null);
                        }}
                        disabled={updateProposalStatus.isLoading}
                        className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                      >
                        Decline Proposal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkDashboard;