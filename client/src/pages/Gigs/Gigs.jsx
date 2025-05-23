import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import GigCard from '../../components/gigCard/GigCard';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import { categories } from "../../data";
import { FiChevronDown, FiStar, FiSearch, FiX } from 'react-icons/fi';

export default function Gigs() {
  const [filters, setFilters] = useState({
    search: '',
    min: '',
    max: '',
    category: '',
    rating: '',
    sort: 'sales'
  });

  const [openSort, setOpenSort] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ['gigs', filters],
    queryFn: () => 
      newRequest.get('/gigs', {
        params: {
          search: filters.search || undefined,
          min: filters.min || undefined,
          max: filters.max || undefined,
          category: filters.category || undefined,
          rating: filters.rating || undefined,
          sort: filters.sort
        }
      }).then((res) => res.data),
  });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      min: '',
      max: '',
      category: '',
      rating: '',
      sort: 'sales'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Section */}
        <div className="mb-12 bg-white rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Discover Gigs</h2>
            <button
              onClick={clearFilters}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center"
            >
              Clear all
              <FiX className="ml-1 h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative col-span-1 md:col-span-2">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search gigs..."
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

            {/* Rating Select */}
<div className="relative">
  <select
    value={filters.rating}
    onChange={(e) => handleFilterChange('rating', e.target.value)}
    className="w-full py-2.5 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500"
  >
    <option value="">All Ratings</option>
    {[5, 4, 3, 2, 1].map((rating) => (
      <option key={rating} value={rating}>
        {'★'.repeat(rating)} ({rating})
      </option>
    ))}
  </select>
</div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price Range */}
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.min}
                onChange={(e) => handleFilterChange('min', e.target.value)}
                className="w-full py-2 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-400">–</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.max}
                onChange={(e) => handleFilterChange('max', e.target.value)}
                className="w-full py-2 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenSort(!openSort)}
                className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
              >
                <span className="text-gray-700">
                  Sort: {filters.sort === 'sales' ? 'Best Selling' : 'Newest'}
                </span>
                <FiChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openSort ? 'rotate-180' : ''}`} />
              </button>

              <Transition
                show={openSort}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <div className="absolute z-10 mt-2 w-full origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        handleFilterChange('sort', 'sales');
                        setOpenSort(false);
                      }}
                      className="w-full px-4 py-2.5 text-left rounded-lg hover:bg-gray-100"
                    >
                      Best Selling
                    </button>
                    <button
                      onClick={() => {
                        handleFilterChange('sort', 'createdAt');
                        setOpenSort(false);
                      }}
                      className="w-full px-4 py-2.5 text-left rounded-lg hover:bg-gray-100"
                    >
                      Newest Arrivals
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-48 w-full" />
                  <div className="p-4 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="mb-4 text-red-500">
                  <FiX className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Error</h3>
                <p className="text-gray-500">Please try again later</p>
              </div>
            </div>
          ) : data?.length > 0 ? (
            data.map((gig) => (
              <GigCard 
                key={gig._id}
                item={{
                  ...gig,
                  img: gig.coverImage,
                  price: gig.plans?.length > 0 
                    ? `From $${Math.min(...gig.plans.map(p => p.price))}` 
                    : "N/A",
                  averageRating: gig.starNumber > 0 
                    ? `${(gig.totalStars / gig.starNumber).toFixed(1)}`
                    : "0.0"
                }}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="mb-4 text-gray-400">
                  <FiSearch className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}