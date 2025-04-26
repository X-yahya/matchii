import { useState } from 'react';
import { format } from 'date-fns';

export default function Messages() {
  const [activeConversation, setActiveConversation] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  
  // Updated sample data with service details
  const conversations = [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        pp: "https://picsum.photos/50?random=1",
        role: "buyer"
      },
      service: {
        name: "Professional Web Design Package",
        startDate: "2024-03-15",
        deliveryDate: "2024-04-05",
        price: 299
      },
      lastMessage: "Looking forward to seeing the first draft!",
      timestamp: "10:45 AM",
      unread: 2
    },
    {
      id: 2,
      user: {
        name: "Mike Chen",
        pp: "https://picsum.photos/50?random=2",
        role: "seller"
      },
      service: {
        name: "Mobile App Development",
        startDate: "2024-03-20",
        deliveryDate: "2024-05-01",
        price: 599
      },
      lastMessage: "I've sent the revised proposal",
      timestamp: "9:30 AM",
      unread: 0
    },
  ];

  const messages = {
    1: [
      {
        id: 1,
        text: "Hi! I'm interested in your web design package",
        sender: "Sarah Johnson",
        timestamp: "10:30 AM",
        isMe: false
      },
      {
        id: 2,
        text: "Great! When can we schedule a consultation?",
        sender: "You",
        timestamp: "10:35 AM",
        isMe: true
      }
    ],
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages[activeConversation].length + 1,
        text: newMessage,
        sender: "You",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      messages[activeConversation].push(newMsg);
      setNewMessage('');
    }
  };

  // Date formatting helper
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-12 h-[calc(100vh-160px)]">
      <div className="flex h-full bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-96 border-r">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-260px)]">
            {conversations.map((convo) => (
              <div
                key={convo.id}
                onClick={() => setActiveConversation(convo.id)}
                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                  activeConversation === convo.id ? 'bg-blue-50' : ''
                }`}
              >
                <img
                  src={convo.user.pp}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{convo.user.name}</h3>
                    <span className="text-sm text-gray-500">{convo.timestamp}</span>
                  </div>
                  <div className="mb-1">
                    <p className="text-sm font-medium text-gray-600 truncate">
                      {convo.service.name}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 truncate">{convo.lastMessage}</p>
                    {convo.unread > 0 && (
                      <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                        {convo.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header with Service Details */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={conversations.find(c => c.id === activeConversation).user.pp}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">
                        {conversations.find(c => c.id === activeConversation).user.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {conversations.find(c => c.id === activeConversation).user.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {conversations.find(c => c.id === activeConversation).service.name}
                    </p>
                    <div className="text-xs text-gray-500">
                      <span className="mr-4">Start: {formatDate(conversations.find(c => c.id === activeConversation).service.startDate)}</span>
                      <span>Delivery: {formatDate(conversations.find(c => c.id === activeConversation).service.deliveryDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages[activeConversation].map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.isMe
                          ? 'bg-blue-500 text-white'
                          : 'bg-white border border-gray-200'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}