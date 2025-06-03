import { useState } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { categories } from "../../data";
import { FiPlus, FiX, FiUser, FiDollarSign } from "react-icons/fi";

// Common roles that clients might need
const commonRoles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "Mobile Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Project Manager",
  "Content Writer",
  "Digital Marketer",
  "Graphic Designer",
  "Video Editor",
  "SEO Specialist",
  "QA Tester",
  "Database Administrator"
];

export default function AddProject() {
  const [project, setProject] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    duration: "",
    coverImage: null,
    requiredRoles: []
  });
  
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    budget: ""
  });
  
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [showCommonRoles, setShowCommonRoles] = useState(false);
  
  const navigate = useNavigate();

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "marketplace");
    const { data } = await newRequest.post(
      "https://api.cloudinary.com/v1_1/dddntqfyo/image/upload",
      fd,
      { withCredentials: false }
    );
    return data.url;
  };

  const addRole = () => {
    if (!newRole.name.trim()) {
      alert("Please enter a role name");
      return;
    }

    const role = {
      name: newRole.name.trim(),
      description: newRole.description.trim(),
      budget: newRole.budget ? Number(newRole.budget) : 0,
      filled: false
    };

    setProject({
      ...project,
      requiredRoles: [...project.requiredRoles, role]
    });

    setNewRole({ name: "", description: "", budget: "" });
    setShowRoleForm(false);
  };

  const addCommonRole = (roleName) => {
    const role = {
      name: roleName,
      description: "",
      budget: 0,
      filled: false
    };

    setProject({
      ...project,
      requiredRoles: [...project.requiredRoles, role]
    });
  };

  const removeRole = (index) => {
    const updatedRoles = project.requiredRoles.filter((_, i) => i !== index);
    setProject({ ...project, requiredRoles: updatedRoles });
  };

  const updateRole = (index, field, value) => {
    const updatedRoles = [...project.requiredRoles];
    updatedRoles[index] = {
      ...updatedRoles[index],
      [field]: field === 'budget' ? Number(value) : value
    };
    setProject({ ...project, requiredRoles: updatedRoles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!project.coverImage) {
        alert("Please upload a cover image");
        return;
      }

      if (project.requiredRoles.length === 0) {
        const confirm = window.confirm(
          "You haven't added any roles to this project. Are you sure you want to continue?"
        );
        if (!confirm) return;
      }

      const coverUrl = await uploadImage(project.coverImage);
      const payload = {
        ...project,
        coverImage: coverUrl,
        budget: Number(project.budget),
        duration: Number(project.duration),
      };
      
      const res = await newRequest.post("/projects", payload);
      console.log("Project created:", res.data);
      navigate("/projects/myprojects");
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  const totalRolesBudget = project.requiredRoles.reduce((sum, role) => sum + (role.budget || 0), 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm mt-12">
      <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Project Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Project Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Category</label>
              <select
                value={project.category}
                onChange={(e) => setProject({ ...project, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Total Budget (dt)</label>
                <input  
                  type="number"
                  min="1"
                  value={project.budget}
                  onChange={(e) => setProject({ ...project, budget: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                {totalRolesBudget > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Roles budget: {totalRolesBudget}dt | Remaining: {Number(project.budget || 0) - totalRolesBudget}
                  </p>
                )}
              </div>
              <div>
                <label className="block mb-1 font-medium">Duration (days)</label>
                <input
                  type="number"
                  min="1"
                  value={project.duration}
                  onChange={(e) => setProject({ ...project, duration: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProject({ ...project, coverImage: e.target.files[0] })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Required Roles Section */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Required Roles</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCommonRoles(!showCommonRoles)}
                className="px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 flex items-center gap-2"
              >
                <FiUser className="w-4 h-4" />
                Quick Add
              </button>
              <button
                type="button"
                onClick={() => setShowRoleForm(!showRoleForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add Custom Role
              </button>
            </div>
          </div>

          {/* Quick Add Common Roles */}
          {showCommonRoles && (
            <div className="mb-4 p-4 bg-white rounded-lg border">
              <h4 className="font-medium mb-3">Common Roles</h4>
              <div className="flex flex-wrap gap-2">
                {commonRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => addCommonRole(role)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm border"
                    disabled={project.requiredRoles.some(r => r.name === role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Role Form */}
          {showRoleForm && (
            <div className="mb-4 p-4 bg-white rounded-lg border">
              <h4 className="font-medium mb-3">Add Custom Role</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">Role Name *</label>
                  <input
                    type="text"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Budget (dt)</label>
                  <input
                    type="number"
                    min="0"
                    value={newRole.budget}
                    onChange={(e) => setNewRole({ ...newRole, budget: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional"
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      onClick={addRole}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                    >
                      Add Role
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowRoleForm(false);
                        setNewRole({ name: "", description: "", budget: "" });
                      }}
                      className="px-3 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <label className="block mb-1 text-sm font-medium">Description</label>
                <textarea
                  value={newRole.description}
                  onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm h-20 focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the role requirements and responsibilities..."
                />
              </div>
            </div>
          )}

          {/* Current Roles List */}
          {project.requiredRoles.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-medium">Added Roles ({project.requiredRoles.length})</h4>
              {project.requiredRoles.map((role, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={role.name}
                        onChange={(e) => updateRole(index, 'name', e.target.value)}
                        className="font-medium text-lg border-none bg-transparent focus:ring-0 focus:outline-none w-full"
                        placeholder="Role name"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      {role.budget > 0 && (
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                          <FiDollarSign className="w-3 h-3" />
                          {role.budget}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeRole(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <textarea
                        value={role.description}
                        onChange={(e) => updateRole(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm h-20 focus:ring-2 focus:ring-blue-500"
                        placeholder="Role description and requirements..."
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium">Budget (dt)</label>
                      <input
                        type="number"
                        min="0"
                        value={role.budget || ''}
                        onChange={(e) => updateRole(index, 'budget', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiUser className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No roles added yet</p>
              <p className="text-sm">Add roles to specify what skills you need for this project</p>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Publish Project
          </button>
        </div>
      </form>
    </div>
  );
}