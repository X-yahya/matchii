// src/pages/AssignedProjects.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest'
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const AssignedProjects = () => {
  const [activeTab, setActiveTab] = useState('active');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const navigate = useNavigate();

  // Fetch assigned projects
  const { isLoading, error, data } = useQuery({
    queryKey: ['assignedProjects'],
    queryFn: () => newRequest.get('/projects/assigned').then(res => res.data),
    select: (rawData) => {
      // Separate active and completed projects
      const active = rawData.filter(project => project.status !== 'completed');
      const completed = rawData.filter(project => project.status === 'completed');
      return { active, completed };
    }
  });

  // Conversation functionality
  const handleMessage = (clientId) => {
    newRequest.post('/conversations', { to: clientId })
      .then(() => navigate('/messages'))
      .catch(() => navigate('/messages'));
  };

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600" />
    </div>
  );

  if (error) return (
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

  const projects = activeTab === 'active' ? data?.active : data?.completed;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Assigned Projects</h1>
        <p className="text-lg text-gray-500 mt-1">Projects you're currently working on</p>
      </header>

      <nav className="flex border-b border-gray-200 mb-6">
        {[
          { 
            key: 'active', 
            label: `Active (${data?.active?.length || 0})` 
          },
          { 
            key: 'completed', 
            label: `Completed (${data?.completed?.length || 0})` 
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
          className="space-y-6"
        >
          {projects && projects.length > 0 ? (
            projects.map(project => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      <Link to={`/projects/${project._id}`} className="hover:text-blue-600">
                        {project.title}
                      </Link>
                    </h3>
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
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => handleMessage(project.userId._id)}
                      className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                    >
                      Message Client
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Client Info */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={project.client?.image || '/default-avatar.png'}
                      alt={project.client?.username}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Client</p>
                      <p className="text-sm text-gray-500">{project.client?.username}</p>
                      <p className="text-xs text-gray-400">{project.client?.country}</p>
                    </div>
                  </div>

                  {/* My Role */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900">My Role</p>
                    <p className="text-sm text-gray-500 mt-1">{project.myRole}</p>
                    {project.assignedRole && (
                      <div className="mt-2">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                          {project.assignedRole.name}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">${project.assignedRole.budget}</p>
                      </div>
                    )}
                  </div>

                  {/* Project Timeline */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900">Timeline</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Started: {project.joinedAt ? new Date(project.joinedAt).toLocaleDateString() : 'N/A'}
                    </p>
                    {project.status === 'completed' && (
                      <p className="text-sm text-gray-500 mt-1">
                        Completed: {project.completedAt ? new Date(project.completedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-base font-medium text-blue-600 hover:text-blue-700"
                  >
                    View Project Details →
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500 text-lg font-medium mb-2">No projects found</p>
              <p className="text-gray-400">You don't have any {activeTab} projects assigned yet</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AssignedProjects;