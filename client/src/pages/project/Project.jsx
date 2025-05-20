import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import moment from 'moment';

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

  // Fetch client data
  const { data: client } = useQuery({
    queryKey: ['client', project?.userId],
    queryFn: () => newRequest.get(`/users/${project?.userId}`).then((res) => res.data),
    enabled: !!project?.userId
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 mt-8 text-center text-red-500">
        ⚠️ Error loading project details
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-8 flex flex-col lg:flex-row gap-8">
      {/* Main Content Section */}
      <div className="flex-1 lg:max-w-[800px]">
        <Link to="/projects" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          ← Back to Projects
        </Link>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {project.category}
            </span>
            <span className="text-gray-500 text-sm">
              Posted {moment(project.createdAt).fromNow()}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
        </div>

        {/* Cover Image */}
        <img
          src={project.coverImage}
          alt="Project cover"
          className="w-full h-96 object-cover rounded-2xl shadow-sm mb-8"
        />

        {/* Project Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Project Details</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* Client Information */}
        {client && (
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={client.image || '/default-avatar.png'}
                  alt={client.username}
                  className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{client.username}</h3>
                  <p className="text-sm text-gray-500">Project Owner</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200">
                Message
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Application Sidebar */}
      <div className="w-full lg:w-96">
        <div className="border rounded-2xl shadow-sm bg-white sticky top-24 p-6">
          <div className="space-y-6">
            <div className="border-b pb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-800">${project.budget}</p>
                  <p className="text-sm text-gray-500">Project Budget</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{project.duration}</p>
                  <p className="text-sm text-gray-500 text-right">Days</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{project.category}</span>
                </p>
                <p className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-medium capitalize">{project.status.replace('_', ' ')}</span>
                </p>
              </div>
            </div>

            {/* Application Button */}
            {currentUser?.isSeller ? (
              project.userId !== currentUser._id ? (
                hasApplied ? (
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-green-600 font-medium">✓ Application Submitted</p>
                    <p className="text-sm text-green-500 mt-1">
                      Applied {moment(hasApplied.createdAt).fromNow()}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleApplyClick}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-medium transition-colors"
                  >
                    Apply Now
                  </button>
                )
              ) : null
            ) : (
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-600">
                  {currentUser ? "Only freelancers can apply" : "Login to apply"}
                </p>
                {!currentUser && (
                  <Link
                    to={`/login?redirect=/projects/${id}`}
                    className="text-blue-500 hover:text-blue-600 font-medium mt-2 inline-block"
                  >
                    Login as Freelancer
                  </Link>
                )}
              </div>
            )}

            {/* Project Guidelines */}
            <div className="text-sm text-gray-500 space-y-2">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Please read project details carefully
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Include relevant experience in your proposal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Submit Proposal
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (150-1500 characters)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full h-40 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Explain why you're the best fit for this project..."
                />
              </div>

              {proposalError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  {proposalError}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowProposalModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  disabled={mutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={submitProposal}
                  disabled={mutation.isPending}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  {mutation.isPending && (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  )}
                  Submit Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}