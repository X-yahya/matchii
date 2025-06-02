import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import ProjectCard from "../../components/projectCard/ProjectCard"; 
import { FiX, FiSearch, FiChevronDown, FiFilter, FiUser, FiUsers } from "react-icons/fi";
import { categories } from "../../data";

// Common roles for filtering
const commonRoles = [
  
];

export default function Projects() {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minBudget: '',
    maxBudget: '',
    sort: 'newest',
    role: '',
    availableRoles: false
  });
  const [openSort, setOpenSort] = useState(false);
  const [openRoles, setOpenRoles] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minBudget: '',
      maxBudget: '',
      sort: 'newest',
      role: '',
      availableRoles: false
    });
  };

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ["projects", filters],
    queryFn: () => {
      const params = new URLSearchParams();
      for (const key in filters) {
        if (filters[key]) params.append(key, filters[key]);
      }
      return newRequest.get(`/projects?${params.toString()}`).then((res) => res.data);
    },
    keepPreviousData: true,
    staleTime: 300000,
    retry: 2
  });

  const activeFiltersCount = Object.values(filters).filter(value => 
    value && value !== 'newest' && value !== false
  ).length;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Mobile filter button */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow text-gray-700 relative"
          >
            <FiFilter className="h-5 w-5" />
            {showFilters ? "Hide Filters" : "Show Filters"}
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters - Hidden on mobile by default */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block mb-12 bg-white rounded-2xl shadow-sm p-6 space-y-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-semibold text-gray-900">Discover Projects</h2>
              {activeFiltersCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                  {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center"
                disabled={activeFiltersCount === 0}
              >
                Clear all
                <FiX className="ml-1 h-4 w-4" />
              </button>
              <button 
                className="md:hidden text-gray-500 hover:text-gray-700"
                onClick={() => setShowFilters(false)}
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative col-span-1 md:col-span-2">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects and roles..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Select */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="py-2.5 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Role Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenRoles(!openRoles)}
                className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
              >
                <span className="text-gray-700 flex items-center gap-2">
                  <FiUser className="h-4 w-4" />
                  {filters.role || 'Any Role'}
                </span>
                <FiChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openRoles ? 'rotate-180' : ''}`} />
              </button>

              {openRoles && (
                <div className="absolute z-20 mt-2 w-full origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        handleFilterChange('role', '');
                        setOpenRoles(false);
                      }}
                      className="w-full px-4 py-2.5 text-left rounded-lg hover:bg-gray-100"
                    >
                      Any Role
                    </button>
                    {commonRoles.map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          handleFilterChange('role', role);
                          setOpenRoles(false);
                        }}
                        className="w-full px-4 py-2.5 text-left rounded-lg hover:bg-gray-100 text-sm"
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Budget Range */}
            <div className="col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Budget Range</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min $"
                  value={filters.minBudget}
                  onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                  min="0"
                  className="w-full py-2 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-400">–</span>
                <input
                  type="number"
                  placeholder="Max $"
                  value={filters.maxBudget}
                  onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                  min="0"
                  className="w-full py-2 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Available Roles Filter */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Role Status</label>
              <label className="flex items-center space-x-2 py-2.5 px-4 rounded-xl border border-gray-200 bg-white cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={filters.availableRoles}
                  onChange={(e) => handleFilterChange('availableRoles', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <FiUsers className="h-4 w-4" />
                  Open roles only
                </span>
              </label>
            </div>

            {/* Sort Dropdown */}
            <div className="col-span-2 flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <div className="relative">
                <button
                  onClick={() => setOpenSort(!openSort)}
                  className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
                >
                  <span className="text-gray-700">
                    {filters.sort === 'newest' ? 'Newest' : 
                     filters.sort === 'highest' ? 'Highest Budget' : 
                     'Lowest Budget'}
                  </span>
                  <FiChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openSort ? 'rotate-180' : ''}`} />
                </button>

                {openSort && (
                  <div className="absolute z-10 mt-2 w-full origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          handleFilterChange('sort', 'newest');
                          setOpenSort(false);
                        }}
                        className="w-full px-4 py-2.5 text-left rounded-lg hover:bg-gray-100"
                      >
                        Newest
                      </button>
                      <button
                        onClick={() => {
                          handleFilterChange('sort', 'highest');
                          setOpenSort(false);
                        }}
                        className="w-full px-4 py-2.5 text-left rounded-lg hover:bg-gray-100"
                      >
                        Highest Budget
                      </button>
                      <button
                        onClick={() => {
                          handleFilterChange('sort', 'lowest');
                          setOpenSort(false);
                        }}
                        className="w-full px-4 py-2.5 text-left rounded-lg hover:bg-gray-100"
                      >
                        Lowest Budget
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.search && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Search: {filters.search}
                  <button onClick={() => handleFilterChange('search', '')} className="hover:text-blue-900">
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.category && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {filters.category}
                  <button onClick={() => handleFilterChange('category', '')} className="hover:text-blue-900">
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.role && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Role: {filters.role}
                  <button onClick={() => handleFilterChange('role', '')} className="hover:text-blue-900">
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.availableRoles && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Open roles only
                  <button onClick={() => handleFilterChange('availableRoles', false)} className="hover:text-blue-900">
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(filters.minBudget || filters.maxBudget) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Budget: ${filters.minBudget || '0'} - ${filters.maxBudget || '∞'}
                  <button onClick={() => {
                    handleFilterChange('minBudget', '');
                    handleFilterChange('maxBudget', '');
                  }} className="hover:text-blue-900">
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="bg-gray-200 rounded-xl w-16 h-16 mb-4"></div>
              <p className="text-lg text-gray-600">Loading projects...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center py-12">
            <p className="text-lg text-red-600">Error loading projects: {error.message}</p>
          </div>
        ) : (
          <div>
            {projects.length > 0 ? (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-xl font-medium text-gray-700">
                    {projects.length} project{projects.length !== 1 ? 's' : ''} found
                  </h3>
                  {activeFiltersCount > 0 && (
                    <button 
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((proj) => (
                    <ProjectCard key={proj._id} project={proj} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FiSearch className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No projects found</h3>
                  <p className="text-gray-500 mb-4">
                    {activeFiltersCount > 0 
                      ? "Try adjusting your filters to see more results"
                      : "Check back later for new projects matching your criteria"
                    }
                  </p>
                  <button 
                    onClick={clearFilters}
                    className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  >
                    {activeFiltersCount > 0 ? 'Clear All Filters' : 'Browse All Projects'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}