import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import RoleSelectionModal from './RoleSelectionModal'; // Make sure this import is correct

const ProjectSection = ({ 
  projects, 
  updateProposalStatus, 
  handleMessage,
  createConvoMutation 
}) => {
  const queryClient = useQueryClient();
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [selectedRoleForProposal, setSelectedRoleForProposal] = useState(null);
  
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

  // Handle role selection for proposal
  const handleRoleSelection = (roleId) => {
    updateProposalStatus.mutate({
      proposalId: selectedRoleForProposal.proposal._id,
      status: 'accepted',
      roleId
    });
    setSelectedRoleForProposal(null);
  };

  return (
    <div className="space-y-6">
      {projects && projects.length > 0 ? (
        projects.map(project => {
          const accepted = project.proposals?.filter(p => p.status === 'accepted') || [];
          const pending = project.proposals?.filter(p => p.status === 'pending') || [];
          const rejected = project.proposals?.filter(p => p.status === 'rejected') || [];
          const statusAction = getStatusAction(project.status);
          const openRoles = project.requiredRoles?.filter(role => !role.filled) || [];

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

              {/* Required Roles Section */}
              {project.requiredRoles && project.requiredRoles.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">Required Roles</h4>
                    <span className="text-sm text-gray-500">
                      {project.requiredRoles.filter(r => r.filled).length}/
                      {project.requiredRoles.length} filled
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {project.requiredRoles.map(role => (
                      <div 
                        key={role._id} 
                        className={`p-4 rounded-xl border ${
                          role.filled 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <div className="flex justify-between">
                          <h5 className="font-medium">{role.name}</h5>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            role.filled 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {role.filled ? 'Filled' : 'Open'}
                          </span>
                        </div>
                        {role.description && (
                          <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                        )}
                        <div className="mt-2 flex justify-between items-center">
                          <span className="text-sm font-medium">${role.budget}</span>
                          {!role.filled && (
                            <span className="text-xs text-gray-500">
                              {pending.filter(p => p.role?._id === role._id).length || 0} applicants
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                          {/* Show assigned role */}
                          <p className="text-xs text-gray-400">
                            Role: {member.role} • Joined: {new Date(member.joinedAt).toLocaleDateString()}
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
                                  onClick={() => {
                                    setSelectedRoleForProposal({
                                      proposal,
                                      projectId: project._id
                                    });
                                  }}
                                  disabled={openRoles.length === 0}
                                  className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                                    openRoles.length > 0
                                      ? 'bg-green-600 hover:bg-green-700 text-white'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }`}
                                >
                                  {openRoles.length > 0 ? 'Accept' : 'No Roles Available'}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2M7 7h10" />
          </svg>
          <p className="text-gray-500 text-lg font-medium mb-2">No projects found</p>
          <p className="text-gray-400">Create your first project to get started</p>
        </div>
      )}

      {/* Proposal Details Modal */}


      {/* Role Selection Modal */}
      {selectedRoleForProposal && (
        <RoleSelectionModal
          selectedRoleForProposal={selectedRoleForProposal}
          projects={projects}
          handleRoleSelection={handleRoleSelection}
          onClose={() => setSelectedRoleForProposal(null)}
        />
      )}
    </div>
  );
};

export default ProjectSection;