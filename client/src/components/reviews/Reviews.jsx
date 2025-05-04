// Reviews.jsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import newRequest from "../../utils/newRequest";
import Review from "../review/Review";

const Reviews = ({ gigId }) => {
  const queryClient = useQueryClient();

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
    const star = formData.get("star");
    mutation.mutate({ gigId, desc, star });
    e.target.reset();
  };

  return (
    <div className="space-y-8 mt-12">
      <h2 className="text-2xl font-bold">Reviews</h2>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 p-4 rounded-xl">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500">Error loading reviews</div>
      ) : reviews?.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <Review key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet</p>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Add a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="desc"
            placeholder="Write your opinion..."
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="star"
            required
            className="block w-full p-2 border border-gray-300 rounded-lg"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value} Star{value !== 1 && 's'}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reviews;