import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import moment from "moment";
import { FiMessageSquare, FiClock, FiAlertCircle, FiChevronRight } from "react-icons/fi";

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
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6 px-2">Messages</h1>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-white/80 backdrop-blur-sm rounded-xl p-4 animate-pulse"
              >
                <div className="flex gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50/50 backdrop-blur-sm rounded-xl flex items-center gap-3 text-red-600">
            <FiAlertCircle className="flex-shrink-0" />
            <span className="text-sm">Failed to load conversations</span>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm ring-1 ring-black/5">
            {conversations?.map((c) => {
              const convId = c.id || c._id;
              const isUnread = currentUser.isSeller 
                ? !c.readBySeller 
                : !c.readByBuyer;

              return (
                <Link
                  to={`/message/${convId}`}
                  key={convId}
                  className="group block px-5 py-4 hover:bg-gray-50/50 transition-all duration-200 ease-out border-b border-gray-100/50 last:border-0"
                  onClick={() => handleRead(convId)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={c.otherUserAvatar || "/default-avatar.png"}
                        alt={c.otherUserName}
                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-black/5"
                      />
                      {isUnread && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-sky-500 rounded-full ring-2 ring-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-base ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                            {c.otherUserName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <FiClock className="w-4 h-4" />
                          <span className="text-xs">
                            {moment(c.updatedAt).format("h:mm A")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <p className={`text-sm truncate ${isUnread ? 'text-gray-900' : 'text-gray-500'}`}>
                          {c.lastMessage?.substring(0, 60) || "Start a conversation"}
                        </p>
                        {isUnread && (
                          <span className="ml-auto w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                        )}
                        <FiChevronRight className="w-5 h-5 text-gray-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
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