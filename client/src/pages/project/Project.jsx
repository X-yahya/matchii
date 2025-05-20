import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import moment from "moment";

export default function Project() {
  const { id } = useParams();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => newRequest.get(`/projects/${id}`).then((res) => res.data),
  });

  // Fetch client data
  const { data: client } = useQuery({
    queryKey: ["projectClient", project?.userId],
    queryFn: () => newRequest.get(`/users/${project?.userId}`).then((res) => res.data),
    enabled: !!project?.userId
  });

  if (isLoading) return (
    <div className="max-w-4xl mx-auto p-6 animate-pulse space-y-8">
      <div className="h-10 bg-gray-100 rounded-full w-3/4"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-6 bg-gray-100 rounded-full w-1/2"></div>
        <div className="h-6 bg-gray-100 rounded-full w-1/2"></div>
      </div>
      <div className="aspect-video bg-gray-100 rounded-2xl"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-100 rounded-full w-1/4"></div>
        <div className="h-32 bg-gray-100 rounded-xl"></div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-red-600">
        Failed to load project details
      </div>
      <Link to="/projects" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
        ← Back to Projects
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link 
          to="/projects" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          All Projects
        </Link>

        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              {project.category}
            </span>
            <span className="text-gray-500 text-sm">
              Posted {moment(project.createdAt).fromNow()}
            </span>
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
            {project.title}
          </h1>
        </header>

        <section>
          <img
            src={project.coverImage}
            alt="Project cover"
            className="w-full aspect-video object-cover rounded-2xl shadow-sm border border-gray-200"
            loading="lazy"
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Budget</h3>
            <p className="text-3xl font-semibold text-gray-900">
              ${project.budget.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Duration</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-gray-900">{project.duration}</span>
              <span className="text-gray-500">days</span>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">
            {project.description}
          </p>
        </section>

        {client && (
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={client.image || '/default-avatar.png'}
                  alt={client.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{client.name || client.username}</h3>
                  <p className="text-sm text-gray-500">Project Owner</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
                Message
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}