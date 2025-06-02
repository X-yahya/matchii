import React from 'react';

const RoleSelectionModal = ({
  selectedRoleForProposal,
  projects,
  handleRoleSelection,
  onClose
}) => {
  if (!selectedRoleForProposal) return null;

  const project = projects.find(
    (p) => p._id === selectedRoleForProposal.projectId
  );
  
  // Get open roles that aren't filled
  const openRoles = project?.requiredRoles?.filter((role) => !role.filled) || [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Assign Role</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <p className="mb-4">
          Select a role for <strong>{selectedRoleForProposal.proposal.freelancerId.username}</strong>:
        </p>
        
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {openRoles.map((role) => (
            <div 
              key={role._id}
              className="p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleRoleSelection(selectedRoleForProposal.proposal, role._id)}
            >
              <div className="font-medium">{role.name}</div>
              {role.description && (
                <p className="text-sm text-gray-600 mt-1">{role.description}</p>
              )}
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium">${role.budget}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Assign
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;