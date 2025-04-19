import React, { useState } from 'react';
import { Transition } from '@headlessui/react';
import GigCard from '../../components/gigCard/GigCard';
import { gig } from '../../data';

export default function Gigs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('sales');
  const [openSort, setOpenSort] = useState(false);
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  // Filter and sort logic
  const filteredGigs = gig
    .filter(item => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        item.title.toLowerCase().includes(term) ||
        item.desc.toLowerCase().includes(term) ||
        item.username.toLowerCase().includes(term);
      
      const minPrice = minBudget ? Number(minBudget) : -Infinity;
      const maxPrice = maxBudget ? Number(maxBudget) : Infinity;
      
      return matchesSearch && item.price >= minPrice && item.price <= maxPrice;
    })
    .sort((a, b) => sort === 'sales' ? b.star - a.star : b.id - a.id);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto mt-16">
        {/* Filters Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">
          {/* Search and Price Filter */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <input
              type="text"
              placeholder="Search gigs by title, description, or seller..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:max-w-md bg-white border border-gray-300 rounded-full px-6 py-2 focus:ring-2 focus:ring-blue-500"
            />
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min $"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                className="w-24 bg-white border border-gray-300 rounded-full px-4 py-2"
              />
              <span className="text-gray-400">–</span>
              <input
                type="number"
                placeholder="Max $"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-24 bg-white border border-gray-300 rounded-full px-4 py-2"
              />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenSort(!openSort)}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-full px-6 py-2"
            >
              <span>Sort by:</span>
              <span className="font-semibold">
                {sort === 'sales' ? 'Best Selling' : 'Newest Arrivals'}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${openSort ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <Transition
              show={openSort}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg">
                <button
                  onClick={() => { setSort('sales'); setOpenSort(false); }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-t-xl"
                >
                  Best Selling
                </button>
                <button
                  onClick={() => { setSort('newest'); setOpenSort(false); }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 rounded-b-xl"
                >
                  Newest Arrivals
                </button>
              </div>
            </Transition>
          </div>
        </div>

        {/* Gigs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGigs.length > 0 ? (
            filteredGigs.map((gigItem) => (
              <GigCard 
                key={gigItem.id}
                item={{
                  ...gigItem,
                  img: gigItem.cover,
                  deliveryTime: `${gigItem.delivery} Day Delivery`
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">No gigs found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}