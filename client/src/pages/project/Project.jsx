import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import moment from 'moment';
import { 
  FiArrowLeft,
  FiDollarSign, 
  FiClock, 
  FiCalendar, 
  FiUser,
  FiUsers,
  FiBriefcase,
  FiCheckCircle,
  FiAlertCircle,
  FiMessageSquare,
  FiInfo,
  FiSend
} from 'react-icons/fi';
import newRequest from '../../utils/newRequest';

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [proposalError, setProposalError] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Fetch project data
  const { isLoading, error, data: project } = useQuery({
    queryKey: ['project', id],
    queryFn: () => newRequest.get(`/projects/${id}`).then((res) => res.data),
  });

  // Fetch client data with proper ID handling
  const { data: client } = useQuery({
    queryKey: ['client', project?.userId?._id],
    queryFn: () => newRequest.get(`/users/${project?.userId?._id}`).then((res) => res.data),
    enabled: !!project?.userId?._id
  });

  // Check existing proposal
  const { data: hasApplied } = useQuery({
    queryKey: ['proposalCheck', id, currentUser?._id],
    queryFn: () => newRequest.get(`/proposals/check/${id}`).then((res) => res.data),
    enabled: !!currentUser?._id
  });

  // Proposal mutation
  const mutation = useMutation({
    mutationFn: () => newRequest.post(`/proposals/${id}`, { coverLetter }),
    onSuccess: () => {
      queryClient.invalidateQueries(['proposalCheck', id, currentUser?._id]);
      setShowProposalModal(false);
      setCoverLetter('');
    },
    onError: (err) => {
      setProposalError(err.response?.data?.message || 'Application failed. Please try again.');
    }
  });

  const handleApplyClick = () => {
    if (!currentUser) {
      navigate(`/login?redirect=/projects/${id}`);
      return;
    }
    setShowProposalModal(true);
  };

  const submitProposal = async () => {
    setProposalError(null);
    
    if (coverLetter.length < 150) {
      setProposalError('Cover letter must be at least 150 characters');
      return;
    }

    mutation.mutate();
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-8 flex justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-6"
        >
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Project</h2>
          <p className="text-red-600">Unable to load project details. Please try again later.</p>
        </motion.div>
      </div>
    );
  }

  // Calculate project statistics
  const totalRoles = project.requiredRoles?.length || 0;
  const filledRoles = project.requiredRoles?.filter(role => role.filled).length || 0;
  const totalRoleBudget = project.requiredRoles?.reduce((sum, role) => sum + (role.budget || 0), 0) || 0;
  const proposalCount = project.proposals?.length || 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8 mt-8 flex flex-col lg:flex-row gap-8"
    >
      {/* Main Content Section */}
      <div className="flex-1 lg:max-w-[800px]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link to="/projects" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 group">
            <FiArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </motion.div>

        {/* Project Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ').toUpperCase()}
            </span>
            {project.category && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                <FiBriefcase className="w-3 h-3" />
                {project.category}
              </span>
            )}
            <span className="text-gray-500 text-sm flex items-center gap-1">
              <FiCalendar className="w-3 h-3" />
              Posted {moment(project.createdAt).fromNow()}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{(project.budget || totalRoleBudget).toLocaleString()} dt</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4 text-blue-600" />
              <span>{project.duration} days</span>
            </div>
            <div className="flex items-center gap-2">
              <FiUsers className="w-4 h-4 text-blue-600" />
              <span>{project.team?.length || 0} team members</span>
            </div>
            {proposalCount > 0 && (
              <div className="flex items-center gap-2">
                <FiUser className="w-4 h-4 text-blue-600" />
                <span>{proposalCount} proposal{proposalCount !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative mb-8"
        >
          <img
            src={project.coverImage}
            alt="Project cover"
            className="w-full h-96 object-cover rounded-2xl shadow-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent rounded-2xl" />
        </motion.div>

        {/* Required Roles Section */}
        {project.requiredRoles && project.requiredRoles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FiUsers className="w-5 h-5 text-blue-600" />
                Required Roles
              </h2>
              <span className="text-sm text-gray-500">{filledRoles}/{totalRoles} filled</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${totalRoles > 0 ? (filledRoles / totalRoles) * 100 : 0}%` }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
              />
            </div>

            {/* Roles List */}
            <div className="grid gap-4 md:grid-cols-2">
              {project.requiredRoles.map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    role.filled 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-orange-200 bg-orange-50 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {role.filled ? (
                        <FiCheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <FiAlertCircle className="w-5 h-5 text-orange-600" />
                      )}
                      <h3 className="font-medium text-gray-900">{role.name}</h3>
                    </div>
                    {role.budget > 0 && (
                      <span className="font-semibold text-gray-700">
                        {role.budget.toLocaleString()} dt
                      </span>
                    )}
                  </div>
                  {role.description && (
                    <p className="text-sm text-gray-600 ml-7">{role.description}</p>
                  )}
                  <div className="mt-2 ml-7">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      role.filled 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {role.filled ? 'Filled' : 'Open'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Project Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-sm mb-8 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiInfo className="w-5 h-5 text-blue-600" />
            Project Details
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>
        </motion.div>

        {/* Client Information */}
        {client && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={client.image || '/default-avatar.png'}
                    alt={client.username}
                    className="w-16 h-16 rounded-full object-cover border-3 border-blue-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{client.username}</h3>
                  <p className="text-sm text-gray-600">Project Owner</p>
                  <div className="flex items-center gap-1 mt-1">

          
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors flex items-center gap-2">
                <FiMessageSquare className="w-4 h-4" />
                Message
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Application Sidebar */}
      <div className="w-full lg:w-96">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="border rounded-2xl shadow-sm bg-white sticky top-24 p-6 border-gray-100"
        >
          <div className="space-y-6">
            <div className="border-b pb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-1">
                    <FiDollarSign className="w-6 h-6 text-blue-600" />
                    {(project.budget || totalRoleBudget).toLocaleString()}dt
                  </p>
                  <p className="text-sm text-gray-500">Budget</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-1">
                    <FiClock className="w-6 h-6 text-blue-600" />
                    {project.duration}
                  </p>
                  <p className="text-sm text-gray-500">Days</p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-800 capitalize">{project.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                {totalRoles > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Roles:</span>
                    <span className="font-medium text-gray-800">{filledRoles}/{totalRoles} filled</span>
                  </div>
                )}
                {proposalCount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Proposals:</span>
                    <span className="font-medium text-gray-800">{proposalCount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Application Button */}
            {currentUser?.isSeller ? (
              project.userId?._id !== currentUser._id ? (
                hasApplied ? (
                  <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="text-center p-4 bg-green-50 rounded-xl border border-green-200"
                  >
                    <FiCheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-green-700 font-medium">Application Submitted</p>
                    <p className="text-sm text-green-600 mt-1">
                      Applied {moment().fromNow()}
                    </p>
                  </motion.div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleApplyClick}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FiSend className="w-4 h-4" />
                    Apply Now
                  </motion.button>
                )
              ) : null
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <FiUser className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">
                  {currentUser ? "Only freelancers can apply" : "Login to apply for this project"}
                </p>
                {!currentUser && (
                  <Link
                    to={`/login?redirect=/projects/${id}`}
                    className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center gap-1"
                  >
                    <FiUser className="w-4 h-4" />
                    Login as Freelancer
                  </Link>
                )}
              </div>
            )}

            {/* Project Guidelines */}
            <div className="bg-blue-50 rounded-xl p-4 space-y-3 border border-blue-100">
              <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <FiInfo className="w-4 h-4" />
                Application Tips
              </h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  Read project details and requirements carefully
                </p>
                <p className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  Highlight your relevant experience and skills
                </p>
                <p className="flex items-start gap-2">
                  <FiCheckCircle className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                  Write a compelling cover letter (150+ characters)
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Proposal Modal */}
      {showProposalModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <FiSend className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Submit Proposal</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter *
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Explain why you're the perfect fit for this project. Highlight your relevant experience, skills, and what makes you unique..."
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Minimum 150 characters</span>
                  <span className={coverLetter.length >= 150 ? 'text-green-600' : 'text-gray-400'}>
                    {coverLetter.length}/1500
                  </span>
                </div>
              </div>

              {proposalError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200 flex items-center gap-2"
                >
                  <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
                  {proposalError}
                </motion.div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowProposalModal(false);
                    setProposalError(null);
                    setCoverLetter('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={mutation.isPending}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={submitProposal}
                  disabled={mutation.isPending || coverLetter.length < 150}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                >
                  {mutation.isPending ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4" />
                      Submit Proposal
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}