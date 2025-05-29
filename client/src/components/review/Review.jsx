import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Review = ({ review }) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(-1);

  const handleImageNavigation = (direction) => {
    setSelectedImgIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % review.gallery.length;
      }
      return (prev - 1 + review.gallery.length) % review.gallery.length;
    });
  };
  

  return (
    <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-300 ease-productive-standard">
      {/* Image Lightbox */}
      {selectedImgIndex !== -1 && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedImgIndex(-1)}
            className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          
          <div className="relative max-w-5xl w-full">
            <img
              src={review.gallery[selectedImgIndex]}
              alt="Review content"
              className="max-h-[90vh] w-full object-contain rounded-2xl"
            />
            
            {review.gallery.length > 1 && (
              <div className="absolute inset-x-0 bottom-8 flex justify-center gap-4">
                <button
                  onClick={() => handleImageNavigation('prev')}
                  className="bg-black/30 hover:bg-black/50 p-4 rounded-full transition-colors"
                >
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <div className="text-white bg-black/30 px-4 py-2 rounded-full text-sm">
                  {selectedImgIndex + 1} / {review.gallery.length}
                </div>
                <button
                  onClick={() => handleImageNavigation('next')}
                  className="bg-black/30 hover:bg-black/50 p-4 rounded-full transition-colors"
                >
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={review.userId?.image || "/default-avatar.png"}
              alt={review.userId?.username || "User"}
              className="w-14 h-14 rounded-3xl object-cover bg-gray-100"
            />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">
              {review.userId?.username || "Unknown User"}
            </h4>
            <p className="text-sm text-gray-400 mt-1">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-2xl transition-all ${i < review.star ? 'text-yellow-400' : 'text-gray-200'}`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Review Content */}
      <p className="text-gray-600 mb-6 text-[15px] leading-relaxed font-[400] tracking-wide">
        {review.desc}
      </p>

      {/* Image Gallery */}
      {review.gallery?.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {review.gallery.map((img, index) => (
            <div 
              key={index}
              className="relative group cursor-zoom-in aspect-square"
              onClick={() => setSelectedImgIndex(index)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <img
                src={img}
                alt={`Review content ${index + 1}`}
                className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-95"
              />
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium bg-black/30 px-2 py-1 rounded-full">
                  View ↗
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helpful Actions */}
     
    </div>
  );
};

export default Review;