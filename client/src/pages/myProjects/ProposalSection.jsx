const ProposalSection = ({ proposals }) => (
  <div className="space-y-4">
    {proposals && proposals.length > 0 ? (
      proposals.map(proposal => (
        <motion.div
          key={proposal._id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {proposal.project?.title || proposal.projectId?.title}
                  </h3>
                  {proposal.appliedRole && (
                    <div className="mt-1">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                        Applied Role: {proposal.appliedRole.name}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <span className="text-sm text-gray-500">
                    {new Date(proposal.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              
              <p className="text-base text-gray-600 mt-2 line-clamp-2">
                {proposal.coverLetter}
              </p>
              
              <div className="flex items-center gap-4 mt-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  proposal.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  proposal.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </span>
                
                {proposal.appliedRole?.budget ? (
                  <span className="text-base text-gray-500">
                    Role Budget: ${proposal.appliedRole.budget}
                  </span>
                ) : (
                  <span className="text-base text-gray-500">
                    Project Budget: ${proposal.project?.budget || proposal.projectId?.budget}
                  </span>
                )}
              </div>
              
              {proposal.status === 'accepted' && proposal.appliedRole?.filled && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-green-700">This role has been filled</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))
    ) : (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No proposals found</p>
      </div>
    )}
  </div>
);