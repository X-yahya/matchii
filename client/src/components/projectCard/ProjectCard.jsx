import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import newRequest from "../../utils/newRequest";
import moment from "moment";
import { FiClock, FiDollarSign, FiCalendar, FiUser } from "react-icons/fi";

const ProjectCard = ({ project }) => {
  const userId = project.userId?._id || project.userId;
  
  const { isLoading, error, data: client } = useQuery({
    queryKey: ['projectUser', userId],
    queryFn: () => 
      newRequest.get(`/users/${userId}`)
        .then((res) => res.data)
        .catch(console.error),
    enabled: !!userId
  });

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Image Section with Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.coverImage || "/default-image.jpg"}
          alt={project.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
        
        {/* Client Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <img
              src={client?.image || "/default-avatar.png"}
              alt={client?.username}
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          )}
          <span className="text-white font-medium text-sm drop-shadow">
            {client?.username || "Anonymous Client"}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Title & Description */}
        <h3 className="text-lg font-semibold line-clamp-2">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">
          {project.description}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <FiDollarSign className="w-4 h-4 text-blue-600" />
            <span>${project.budget?.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FiClock className="w-4 h-4 text-blue-600" />
            <span>{project.duration} days</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FiCalendar className="w-4 h-4 text-blue-600" />
            <span>{moment(project.createdAt).fromNow()}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <FiUser className="w-4 h-4 text-blue-600" />
            <span>{client?.isSeller ? "Pro Client" : "New Client"}</span>
          </div>
        </div>

        {/* View Button */}
        <Link
          to={`/projects/${project._id}`}
          className="block mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          View Project
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;