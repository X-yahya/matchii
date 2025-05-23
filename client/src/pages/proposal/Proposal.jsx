// pages/Proposals.jsx
//import ProposalList from '../components/proposalList/ProposalList';
import ProposalList from "../../components/proposalList/ProposalList"
const Proposals = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-gray-900">Project Proposals</h1>
        <p className="text-[17px] text-gray-500 mt-2">Review and manage incoming project proposals</p>
      </div>
      <ProposalList />
    </div>
  );
};

export default Proposals;