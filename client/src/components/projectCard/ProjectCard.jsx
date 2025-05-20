import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import moment from "moment";

const ProjectCard = ({ project }) => {
  // Get the user ID safely
  const userId = project.userId?._id || project.userId;
  console.log("User ID:", userId); // Debugging log

  // Fetch client data
  const { isLoading, error, data: client } = useQuery({
    queryKey: ['projectUser', userId],
    queryFn: () => 
      newRequest.get(`/users/${userId}`)
        .then((res) => res.data)
        .catch(err => {
          console.error("Error fetching user:", err);
          return null;
        }),
    enabled: !!userId // Only fetch if userId exists
  });

  // Client info with fallbacks
  const clientName = client?.username || client?.name || "Unknown Client";
  const clientImage = client?.image || "/default-avatar.png";
  const clientLevel = client?.sellerStats?.completedProjects || 0;

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Cover Image */}
      <div className="aspect-[4/3] max-h-60 overflow-hidden">
        <img
          src={project.coverImage || "/default-image.jpg"}
          alt={project.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
          loading="lazy"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-grow p-4">
        {/* Client Info */}
        <div className="flex items-center gap-2 mb-3">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 w-24 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 w-16 rounded animate-pulse"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-sm">Error loading client</div>
          ) : (
            <>
              <img
                src={clientImage}
                alt={clientName}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium truncate">{clientName}</p>
                <p className="text-xs text-gray-500">
                  {client?.isSeller ? "Freelancer" : "Client"} • Level {clientLevel}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Project Details */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {project.title}
        </h3>

        <p className="text-gray-500 text-sm line-clamp-3 flex-grow">
          {project.description}
        </p>

        {/* Project Metadata */}
        <div className="mt-4 text-sm text-gray-600 space-y-2">
          <div className="flex justify-between items-center">
            <span>Budget:</span>
            <span className="font-medium text-blue-600">
              ${project.budget?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Duration:</span>
            <span className="font-medium">
              {project.duration} day{project.duration > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Posted:</span>
            <span className="font-medium">
              {moment(project.createdAt).fromNow()}
            </span>
          </div>
        </div>

        {/* View Button */}
        <Link
          to={`/projects/${project._id}`}
          className="mt-4 block bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-full transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;