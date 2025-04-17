// Slide.jsx
import { useRef } from 'react';
import { motion } from 'framer-motion';
import CatCard from '../catCard/CatCard';

const Slide = ({ categories }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ 
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4">
      {/* Navigation Arrows */}
      <div className="flex justify-between absolute inset-y-0 w-full -translate-y-1/2 top-1/2 z-10">
        <button
          onClick={() => scroll('left')}
          className="h-12 w-12 rounded-full bg-white shadow-lg hover:shadow-xl -translate-x-12 flex items-center justify-center transition-all hover:scale-105"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => scroll('right')}
          className="h-12 w-12 rounded-full bg-white shadow-lg hover:shadow-xl translate-x-12 flex items-center justify-center transition-all hover:scale-105"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Carousel Container */}
      <motion.div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {categories?.map((category, index) => (
          <CatCard
            key={index}
            category={category}
            items={category?.items || []}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Slide;