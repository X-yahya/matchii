// src/pages/myProjects/MyProjects.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import ProjectCard from "../../components/projectCard/ProjectCard";

export default function MyProjects() {
  const [currentUser] = useState(
    () => JSON.parse(localStorage.getItem("currentUser"))
  );

  const { isLoading, error, data: myProjects } = useQuery({
    queryKey: ["myProjects"],
    queryFn: () =>
      newRequest.get("/projects/myprojects").then((res) => res.data),
    enabled: !!currentUser && !currentUser.isSeller,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-md mx-auto mt-8 text-center">
        <div className="text-red-500 font-medium mb-2">
          Error loading projects: {error.message}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-16 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
        {!currentUser?.isSeller && (
          <Link
            to="/projects/add"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            + Create New Project
          </Link>
        )}
      </div>

      {/* Grid or Empty */}
      {myProjects?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="mb-8 text-gray-500">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              No projects found
            </h3>
            <p className="mt-1 text-gray-500">
              Get started by creating a new project.
            </p>
          </div>
          {!currentUser?.isSeller && (
            <Link
              to="/projects/add"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Project
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
