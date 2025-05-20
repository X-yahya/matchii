import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();
  const messagesContainerRef = useRef(null);

  // Fetch messages
  const { isLoading, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: () => newRequest.get(`/messages/${id}`).then((res) => res.data),
  });

  // Fetch conversation data with corrected endpoint
  const { data: conversationData } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () => 
      newRequest.get(`/conversations/single/${id}`).then((res) => res.data),
  });

  // Get other user ID safely
  const otherUserId = conversationData?.sellerId === currentUser?._id 
    ? conversationData?.buyerId 
    : conversationData?.sellerId;

  // Fetch other user data
  const { data: otherUser } = useQuery({
    queryKey: ["user", otherUserId],
    queryFn: () => 
      otherUserId 
        ? newRequest.get(`/users/${otherUserId}`).then((res) => res.data)
        : Promise.resolve(null),
    enabled: !!otherUserId,
  });

  // Message mutation
  const mutation = useMutation({
    mutationFn: (message) => newRequest.post(`/messages`, message),
    onSuccess: () => queryClient.invalidateQueries(["messages"]),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ conversationId: id, desc: e.target[0].value });
    e.target[0].value = "";
  };

  // Improved scroll behavior
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sf-pro flex flex-col">
      <div className="max-w-3xl mx-auto flex flex-col w-full h-[80vh]">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Link 
            to="/messages" 
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Messages
          </Link>
          <span className="text-sm text-gray-400 mx-2">/</span>
          <span className="text-sm text-gray-700">
            {otherUser?.username || "User"}
          </span>
        </div>

        {/* User Info Box */}
        <div className="flex items-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4 mb-2">
          <img
            src={otherUser?.image || "/default-avatar.png"}
            alt={otherUser?.username || "User"}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <span className="text-lg font-semibold text-gray-900">
              {otherUser?.username || "Loading..."}
            </span>
           
          </div>
        </div>

        {/* Messages Container */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4"
        >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="h-20 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 rounded-xl border border-red-100 text-red-600">
              Error loading messages
            </div>
          ) : (
            <div className="space-y-6">
              {data.map((m) => (
                <div
                  key={m._id}
                  className={`flex ${m.userId === currentUser?._id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl ${
                      m.userId === currentUser?._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <p className="text-sm leading-5">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        <form 
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4"
        >
          <div className="flex gap-4">
            <textarea
              placeholder="Type your message..."
              className="flex-1 p-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="2"
            />
            <button
              type="submit"
              className="self-end px-6 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Message;