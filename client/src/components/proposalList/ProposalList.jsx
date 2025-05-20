// components/ProposalList.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
// import newRequest from '../utils/newRequest';
import newRequest from '../../utils/newRequest';
import ProposalCard from '../proposalCard/ProposalCard';

const ProposalList = () => {
  const [expandedProject, setExpandedProject] = useState(null);
  const { isLoading, error, data: proposals } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => newRequest.get('/proposals').then(res => res.data),
  });

  // Group proposals by project
  const groupedProposals = proposals?.reduce((acc, proposal) => {
    const key = proposal.project._id;
    if (!acc[key]) {
      acc[key] = {
        project: proposal.project,
        proposals: []
      };
    }
    acc[key].proposals.push(proposal);
    return acc;
  }, {});

  if (isLoading) return <div className="p-6">Loading proposals...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading proposals</div>;

  return (
    <div className="space-y-6 p-6">
      {Object.values(groupedProposals || {}).map((group) => (
        <div key={group.project._id} className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedProject(prev => 
                prev === group.project._id ? null : group.project._id
              )}>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{group.project.title}</h3>
                <p className="text-gray-500">
                  {group.proposals.length} proposal{group.proposals.length !== 1 ? 's' : ''}
                </p>
              </div>
              <svg
                className={`w-6 h-6 transform transition-transform ${
                  expandedProject === group.project._id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {expandedProject === group.project._id && (
              <div className="mt-4 space-y-4">
                {group.proposals.map(proposal => (
                  <ProposalCard key={proposal._id} proposal={proposal} />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProposalList;