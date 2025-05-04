// Review.jsx
import { useQuery } from "@tanstack/react-query";
import React from "react";
import newRequest from "../../utils/newRequest";

const Review = ({ review }) => {
  const { isLoading, error, data: user } = useQuery({
    queryKey: ["user", review.userId],
    queryFn: () => newRequest.get(`/users/${review.userId}`).then((res) => res.data),
    enabled: !!review.userId, // Only fetch if userId exists
  });
  
  console.log("username" , user?.username);

  return (
    <div className="bg-gray-50 p-4 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          ) : error ? (
            <img
              src="/img/noavatar.jpg"
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <img
              src={user?.img || "/img/noavatar.jpg"}
              alt={user?.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <h4 className="font-medium">
              {isLoading ? (
                <span className="bg-gray-200 animate-pulse rounded-md w-24 h-4 block" />
              ) : error ? (
                "Unknown User"
              ) : (
                user?.username || "Unknown User"
              )}
            </h4>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-lg ${i < review.star ? "text-yellow-400" : "text-gray-300"}`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{review.desc}</p>
      
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>Was this helpful?</span>
        <button className="flex items-center gap-1 hover:text-blue-500">
          <span>👍</span>
          <span>Yes</span>
        </button>
        <button className="flex items-center gap-1 hover:text-red-500">
          <span>👎</span>
          <span>No</span>
        </button>
      </div>
    </div>
  );
};

export default Review;