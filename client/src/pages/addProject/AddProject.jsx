import { useState } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";

export default function AddProject() {
  const [project, setProject] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    duration: "",
    coverImage: null,
  });
  const navigate = useNavigate();

  // single-file upload to Cloudinary
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // require a cover image
      if (!project.coverImage) {
        alert("Please upload a cover image");
        return;
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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm mt-12">
      <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={project.title}
            onChange={(e) =>
              setProject({ ...project, title: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        {/* Category */}
        <div>
          <label className="block mb-1 font-medium">Category</label>
          <input
            type="text"
            value={project.category}
            onChange={(e) =>
              setProject({ ...project, category: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg h-32"
            required
          />
        </div>
        {/* Budget & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Budget ($)</label>
            <input
              type="number"
              min="1"
              value={project.budget}
              onChange={(e) =>
                setProject({ ...project, budget: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Duration (days)</label>
            <input
              type="number"
              min="1"
              value={project.duration}
              onChange={(e) =>
                setProject({ ...project, duration: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        </div>
        {/* Cover Image */}
        <div>
          <label className="block mb-1 font-medium">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setProject({ ...project, coverImage: e.target.files[0] })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Publish Project
        </button>
      </form>
    </div>
  );
}
