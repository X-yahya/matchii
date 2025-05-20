import React from 'react';
import ProposalList from '../../components/proposalList/ProposalList';

const Proposals = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Project Proposals</h1>
      <ProposalList />
    </div>
  );
};

export default Proposals;