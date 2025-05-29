import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";
import { FiAlertCircle, FiLock, FiStar, FiCheckCircle, FiXCircle } from "react-icons/fi";

const Reviews = ({ gigId }) => {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  // Check purchase status
  const { data: hasPurchased } = useQuery({
    queryKey: ["purchaseCheck", gigId],
    queryFn: () => newRequest.get(`/orders/check/${gigId}`),
    enabled: !!currentUser?._id,
    retry: 2
  });

  // Get existing reviews
  const { 
    isLoading, 
    error, 
    data: reviews 
  } = useQuery({
    queryKey: ["reviews", gigId],
    queryFn: () => newRequest.get(`/reviews/${gigId}`),
    select: (res) => res.data, // <-- This extracts the array
    onError: (err) => {
      console.error("Failed to load reviews:", err);
    }
  });

  // Review mutation
  const mutation = useMutation({
    mutationFn: (review) => newRequest.post("/reviews", review),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", gigId]);
      setSelectedRating(0);
      setHoverRating(0);
      setFormError(null);
    },
    onError: (err) => {
      setFormError(err.response?.data?.message || "Failed to submit review");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    
    const desc = e.target.desc.value.trim();
    const star = parseInt(selectedRating);

    // Frontend validation
    if (!desc || desc.length < 10) {
      setFormError("Review text must be at least 10 characters");
      return;
    }

    if (isNaN(star) || star < 1 || star > 5) {
      setFormError("Please select a valid rating (1-5 stars)");
      return;
    }

    mutation.mutate({ 
      gigId: gigId.toString(),
      desc,
      star 
    });
  };

  const RatingStars = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => setSelectedRating(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className={`text-2xl transition-colors ${
            star <= (hoverRating || selectedRating)
              ? "text-yellow-400"
              : "text-gray-300"
          } ${mutation.isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={mutation.isLoading}
        >
          <FiStar />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">
        {selectedRating ? `${selectedRating}/5` : "Rate your experience"}
      </span>
    </div>
  );

  const existingReview = reviews?.find(
    (review) => review.userId === currentUser?._id
  );

  return (
    <div className="space-y-10 mt-12">
      <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 rounded-xl flex items-center gap-3">
          <FiAlertCircle className="text-red-500" />
          <span className="text-red-600">Error loading reviews</span>
        </div>
      ) : reviews?.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Review key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-500">No reviews yet - be the first!</p>
        </div>
      )}

      {/* Review Form */}
      {currentUser ? (
        !hasPurchased?.data ? (
          <div className="bg-yellow-50 p-4 rounded-xl flex items-center gap-3">
            <FiLock className="w-5 h-5 text-yellow-600" />
            <p className="text-yellow-700">
              You must purchase this service to leave a review
            </p>
          </div>
        ) : existingReview ? (
          <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3">
            <FiCheckCircle className="w-5 h-5 text-blue-600" />
            <p className="text-blue-700">You've already reviewed this service</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <RatingStars />
              
              <textarea
                name="desc"
                placeholder="Share your experience (minimum 10 characters)..."
                className="w-full p-3 border border-gray-200 rounded-lg"
                rows="4"
                minLength="10"
                required
                disabled={mutation.isLoading}
              />

              {formError && (
                <div className="p-3 bg-red-50 rounded-lg flex items-center gap-2">
                  <FiXCircle className="text-red-500 flex-shrink-0" />
                  <span className="text-red-600">{formError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={mutation.isLoading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
              >
                {mutation.isLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )
      ) : (
        <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
          <FiLock className="w-5 h-5 text-gray-600" />
          <p className="text-gray-700">
            Please login to leave a review
          </p>
        </div>
      )}
    </div>
  );
};

export default Reviews;