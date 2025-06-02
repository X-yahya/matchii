import React, { useState, useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { 
  FiSearch, 
  FiFilter, 
  FiDollarSign, 
  FiClock, 
  FiCalendar, 
  FiUser,
  FiGrid,
  FiList,
  FiUsers,
  FiBriefcase,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
// import newRequest from '../utils/newRequest';
import newRequest from '../../utils/newRequest'; // Adjust the import path as necessary
// Enhanced ProjectCard Component
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

  // Calculate project statistics
  const totalRoles = project.requiredRoles?.length || 0;
  const filledRoles = project.requiredRoles?.filter(role => role.filled).length || 0;
  const unfilledRoles = totalRoles - filledRoles;
  const totalRoleBudget = project.requiredRoles?.reduce((sum, role) => sum + (role.budget || 0), 0) || 0;

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
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
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        
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
        <div>
          <h3 className="text-lg font-semibold line-clamp-2 mb-2">
            {project.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {project.description}
          </p>
        </div>

        {/* Category */}
        {project.category && (
          <div className="flex items-center gap-2">
            <FiBriefcase className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 capitalize">
              {project.category.replace('-', ' ')}
            </span>
          </div>
        )}

        {/* Roles Section */}
        {project.requiredRoles && project.requiredRoles.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Required Roles</span>
              <span className="text-gray-500">{filledRoles}/{totalRoles} filled</span>
            </div>
            
            {/* Roles Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalRoles > 0 ? (filledRoles / totalRoles) * 100 : 0}%` }}
              />
            </div>

            {/* First few roles preview */}
            <div className="space-y-1">
              {project.requiredRoles.slice(0, 2).map((role, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {role.filled ? (
                      <FiCheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <FiAlertCircle className="w-3 h-3 text-orange-500" />
                    )}
                    <span className={role.filled ? "text-gray-600" : "text-gray-900 font-medium"}>
                      {role.name}
                    </span>
                  </div>
                  {role.budget > 0 && (
                    <span className="text-gray-500">{role.budget.toLocaleString()} dt</span>
                  )}
                </div>
              ))}
              {project.requiredRoles.length > 2 && (
                <div className="text-xs text-gray-500 text-center pt-1">
                  +{project.requiredRoles.length - 2} more roles
                </div>
              )}
            </div>
          </div>
        )}

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <FiDollarSign className="w-4 h-4 text-blue-600" />
            <div className="flex flex-col">
              <span className="font-medium">${(project.budget || totalRoleBudget).toLocaleString()}</span>
              {totalRoleBudget > 0 && project.budget !== totalRoleBudget && (
                <span className="text-xs text-gray-500">Role total: {totalRoleBudget.toLocaleString()} dt</span>
              )}
            </div>
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
            <FiUsers className="w-4 h-4 text-blue-600" />
            <span>{project.team?.length || 0} team members</span>
          </div>
        </div>

        {/* Proposals Count */}
        {project.proposals && project.proposals.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiUser className="w-4 h-4" />
            <span>{project.proposals.length} proposal{project.proposals.length !== 1 ? 's' : ''}</span>
          </div>
        )}

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