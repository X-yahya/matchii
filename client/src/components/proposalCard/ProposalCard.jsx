// components/ProposalCard.jsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';

const ProposalCard = ({ proposal }) => {
  const queryClient = useQueryClient();
  const freelancer = proposal.freelancerProfile;

  const mutation = useMutation({
    mutationFn: (status) => 
      newRequest.patch(`/proposals/${proposal._id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['proposals']);
    }
  });

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-start gap-4">
        <img
          src={freelancer.image || '/default-avatar.png'}
          alt={freelancer.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{freelancer.name}</h4>
              <p className="text-sm text-gray-500">
                {freelancer.country} • {freelancer.sellerStats.completedProjects} projects completed
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              proposal.status === 'accepted' ? 'bg-green-100 text-green-600' :
              proposal.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {proposal.status}
            </span>
          </div>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Success Rate</p>
                <p className="font-medium">{freelancer.sellerStats.successRate}%</p>
              </div>
              <div>
                <p className="text-gray-500">Avg. Rating</p>
                <p className="font-medium">4.9/5</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-gray-900 font-medium mb-2">Cover Letter</p>
              <p className="text-gray-600 whitespace-pre-line">{proposal.coverLetter}</p>
            </div>
          </div>

          {proposal.status === 'pending' && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => mutation.mutate('accepted')}
                className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                Accept Proposal
              </button>
              <button
                onClick={() => mutation.mutate('rejected')}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;