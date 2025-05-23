// File: components/ProjectSection.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const ProjectSection = ({ projects = [], handleMessage, updateProposalStatus, updateProjectStatus, removeFreelancer, createConvoMutation }) => {
  const [selectedProposal, setSelectedProposal] = useState(null);

  return (
    <div className="space-y-6">
      {projects.length > 0 ? (
        projects.map(project => {
          const accepted = project.proposals?.filter(p => p.status === 'accepted') || [];
          const pending = project.proposals?.filter(p => p.status === 'pending') || [];
          const rejected = project.proposals?.filter(p => p.status === 'rejected') || [];

          const getStatusAction = (status) => {
            switch (status) {
              case 'open': return { next: 'in_progress', text: 'Start Project', class: 'bg-blue-600 hover:bg-blue-700' };
              case 'in_progress': return { next: 'completed', text: 'Mark as Complete', class: 'bg-green-600 hover:bg-green-700' };
              case 'completed': return { next: 'open', text: 'Reopen Project', class: 'bg-gray-600 hover:bg-gray-700' };
              default: return null;
            }
          };

          const action = getStatusAction(project.status);

          return (
            <motion.div key={project._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      project.status === 'completed' ? 'bg-green-100 text-green-700' :
                      project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{project.status.replace('_',' ').replace(/\b\w/g, l=>l.toUpperCase())}</span>
                    <span className="text-base text-gray-600">Budget: ${project.budget}</span>
                    <span className="text-sm text-gray-500">Duration: {project.duration} days</span>
                  </div>
                  <p className="text-gray-600 mt-2 line-clamp-2">{project.description}</p>
                </div>

                <div className="flex items-center gap-3 ml-4">
                  {action && (
                    <button onClick={() => updateProjectStatus.mutate({ projectId: project._id, status: action.next })} disabled={updateProjectStatus.isLoading} className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-sm ${action.class}`}>
                      {updateProjectStatus.isLoading ? 'Updating...' : action.text}
                    </button>
                  )}
                  <Link to={`/projects/${project._id}`} className="text-blue-600 hover:text-blue-700 font-medium">View Details →</Link>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-center"><p className="text-2xl font-bold text-gray-900">{project.team?.length || 0}</p><p className="text-sm text-gray-500">Team Members</p></div>
                <div className="text-center"><p className="text-2xl font-bold text-blue-600">{pending.length}</p><p className="text-sm text-gray-500">Pending Proposals</p></div>
                <div className="text-center"><p className="text-2xl font-bold text-green-600">{accepted.length}</p><p className="text-sm text-gray-500">Accepted</p></div>
                <div className="text-center"><p className="text-2xl font-bold text-red-600">{rejected.length}</p><p className="text-sm text-gray-500">Declined</p></div>
              </div>

              {project.team?.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800">Team Members</h4>
                  <div className="space-y-3 mt-3">
                    {project.team.map(member => (
                      <div key={member.freelancerId._id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border">
                        <img src={member.freelancerId.image||'/default-avatar.png'} alt={member.freelancerId.username} className="w-12 h-12 rounded-xl object-cover border-2 border-white" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{member.freelancerId.username}</p>
                          <p className="text-sm text-gray-500">{member.freelancerId.country}</p>
                          <p className="text-xs text-gray-400">Role: {member.role||'Contributor'} • Joined: {new Date(member.joinedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleMessage(member.freelancerId._id)} className="px-3 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm">Message</button>
                          <button onClick={() => removeFreelancer.mutate({ projectId: project._id, freelancerId: member.freelancerId._id })} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(pending.length>0||rejected.length>0)&&(
                <div>
                  <h4 className="font-semibold text-gray-800">Proposals</h4>
                  <div className="space-y-4 mt-3">
                    {[...pending,...rejected].map(proposal => (
                      <div key={proposal._id} className="flex items-start gap-4 p-4 border rounded-xl hover:bg-gray-50">
                        <img src={proposal.freelancerId.image||'/default-avatar.png'} alt={proposal.freelancerId.username} className="w-12 h-12 rounded-xl object-cover border-2 border-white" />
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <div>
                              <p className="font-medium">{proposal.freelancerId.username}</p>
                              <p className="text-sm text-gray-500">{proposal.freelancerId.country}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              proposal.status==='accepted'? 'bg-green-100 text-green-700': proposal.status==='rejected'? 'bg-red-100 text-red-700':'bg-blue-100 text-blue-700'
                            }`}>{proposal.status.charAt(0).toUpperCase()+proposal.status.slice(1)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {proposal.status==='pending'&&(
                              <>
                                <button onClick={()=>updateProposalStatus.mutate({proposalId:proposal._id,status:'accepted'})} className="px-4 py-2 bg-green-600 text-white rounded">Accept</button>
                                <button onClick={()=>updateProposalStatus.mutate({proposalId:proposal._id,status:'rejected'})} className="px-4 py-2 bg-red-600 text-white rounded">Decline</button>
                              </>
                            )}
                            <button onClick={()=>setSelectedProposal(proposal)} className="ml-auto text-blue-600 hover:underline text-sm">View</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <AnimatePresence>
                    {selectedProposal && (
                      <ProposalModal proposal={selectedProposal} onClose={()=>setSelectedProposal(null)} onUpdate={(pid,status)=>{updateProposalStatus.mutate({proposalId:pid,status});setSelectedProposal(null);}} />
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          );
        })
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found</p>
        </div>
      )}
    </div>
  );
};

export default ProjectSection;