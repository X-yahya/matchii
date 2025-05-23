// components/ProposalList.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import ProposalCard from '../proposalCard/ProposalCard';
import { motion, AnimatePresence } from 'framer-motion';

const ProposalList = () => {
  const [expandedProject, setExpandedProject] = useState(null);

  const { isLoading, error, data: proposals } = useQuery({
    queryKey: ['proposals'],
    queryFn: () => newRequest.get('/proposals').then(res => res.data),
  });

  const groupedProposals = proposals?.reduce((acc, proposal) => {
    const key = proposal.project._id;
    if (!acc[key]) {
      acc[key] = {
        project: proposal.project,
        proposals: [],
      };
    }
    acc[key].proposals.push(proposal);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.values(groupedProposals || {}).map(({ project, proposals }) => (
        <div key={project._id} className="bg-white rounded-2xl shadow-xs border border-gray-200">
          <button
            onClick={() => setExpandedProject(prev => prev === project._id ? null : project._id)}
            className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div>
              <h3 className="text-[17px] font-semibold text-gray-900">{project.title}</h3>
              <p className="text-[15px] text-gray-500 mt-1">
                {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
              </p>
            </div>
            <svg
              className={`w-6 h-6 text-gray-500 transition-transform ${expandedProject === project._id ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {expandedProject === project._id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="border-t border-gray-100 p-5 pt-4 space-y-4">
                  {proposals.map((proposal) => (
                    <ProposalCard key={proposal._id} proposal={proposal} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default ProposalList;