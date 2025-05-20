import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import moment from "moment";

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {};
  const queryClient = useQueryClient();

  const { isLoading, error, data: conversations } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => newRequest.get("/conversations").then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (id) => newRequest.put(`/conversations/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["conversations"]),
  });

  const handleRead = (id) => mutation.mutate(id);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Messages</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 text-red-600 rounded-xl border border-red-200">
            Failed to load conversations
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            {conversations?.map((c) => {
              const convId = c.id || c._id;
              const isUnread = currentUser.isSeller 
                ? !c.readBySeller 
                : !c.readByBuyer;

              return (
                <Link
                  to={`/message/${convId}`}
                  key={convId}
                  className="group block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  onClick={() => handleRead(convId)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={c.otherUserAvatar || "/default-avatar.png"}
                        alt={c.otherUserName}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                      {isUnread && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-base font-semibold text-gray-900">
                          {c.otherUserName}
                          {isUnread && (
                            <span className="ml-2 w-2 h-2 bg-red-500 rounded-full inline-block" />
                          )}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {moment(c.updatedAt).format("h:mm A")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {c.lastMessage?.substring(0, 60) || "No messages yet"}
                        {isUnread && (
                          <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        )}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;