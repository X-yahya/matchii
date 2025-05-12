import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";

const Reviews = ({ gigId }) => {
  const queryClient = useQueryClient();
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);

  const { isLoading, error, data: reviews } = useQuery({
    queryKey: ["reviews", gigId],
    queryFn: () => newRequest.get(`/reviews/${gigId}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (review) => newRequest.post("/reviews", review),
    onSuccess: () => queryClient.invalidateQueries(["reviews", gigId]),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const desc = formData.get("desc");
    const star = selectedRating;
    
    if (star === 0) {
      alert("Please select a rating before submitting");
      return;
    }

    mutation.mutate({ gigId, desc, star });
    e.target.reset();
    setSelectedRating(0);
    setHoverRating(0);
  };

  const RatingStars = () => {
    const stars = [1, 2, 3, 4, 5];
    
    return (
      <div className="flex items-center gap-2">
        {stars.map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setSelectedRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className={`transition-all duration-200 ${
              star <= (hoverRating || selectedRating)
                ? "text-yellow-400 scale-110"
                : "text-gray-300"
            }`}
            aria-label={`Rate ${star} stars`}
          >
            <svg
              className="w-10 h-10 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </button>
        ))}
        <div className="ml-3 text-lg font-medium text-gray-600">
          {selectedRating > 0 ? `${selectedRating}/5` : "Tap to rate"}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 mt-12">
      <h2 className="text-[28px] font-semibold text-gray-900">Customer Reviews</h2>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse p-5 rounded-2xl bg-gray-50 border border-gray-100"
            >
              <div className="h-4 bg-gray-200/80 rounded-full w-32 mb-3"></div>
              <div className="h-3 bg-gray-200/60 rounded-full w-4/5 mb-2"></div>
              <div className="h-3 bg-gray-200/60 rounded-full w-3/5"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 bg-red-50/90 p-5 rounded-2xl border border-red-100">
          <div className="bg-red-100 p-2 rounded-full">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <p className="text-red-600 font-medium">Error loading reviews</p>
        </div>
      ) : reviews?.length > 0 ? (
        <div className="space-y-8">
          {reviews.map((review) => (
            <Review key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 space-y-2">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
          </svg>
          <p className="text-gray-500 font-medium">Be the first to share your experience</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Share Your Experience</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            name="desc"
            placeholder="Share detailed thoughts about your experience..."
            required
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[15px] leading-snug placeholder-gray-400"
            rows="4"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Service Rating
            </label>
            <RatingStars />
            <input type="hidden" name="star" value={selectedRating} required />
          </div>

          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-700 text-white py-4 rounded-xl transition-all duration-200 font-medium shadow-sm relative"
          >
            {mutation.isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Submit Review
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;