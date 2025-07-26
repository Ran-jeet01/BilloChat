import { useChat } from "./ChatContext";
import {
  Search,
  Edit,
  Filter,
  Menu,
  Bell,
  Phone,
  MapPin,
  Mic,
  Send,
  ChevronLeft,
  Settings,
} from "lucide-react";

const MainChatBox = () => {
  const {
    isMobile,
    showChat,
    messages,
    messageInput,
    showMap,
    activeChat,
    chatType,
    setMessageInput,
    handleSendMessage,
    handleBackToChats,
    setShowMap,
  } = useChat();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!activeChat) {
    return (
      <div
        className={`flex-1 flex items-center justify-center bg-gray-50 ${
          isMobile && !showChat ? "hidden" : "flex"
        }`}
      >
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-500 text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a chat to start messaging
          </h3>
          <p className="text-gray-500">
            Choose from your existing conversations or start a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 flex flex-col ${
        isMobile && !showChat ? "hidden" : "flex"
      }`}
    >
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        {isMobile && (
          <button
            onClick={handleBackToChats}
            className="mr-2 p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">
              {activeChat.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{activeChat.name}</h2>
            <p className="text-sm text-gray-500">
              {chatType === "group" ? "Group" : "Online"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={() => setShowMap(true)}
          >
            <MapPin className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
          </button>
          <button className="ml-8 mr-4 p-1 hover:bg-gray-100 rounded-full">
            <Settings className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isSent ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isSent
                  ? "bg-purple-500 text-white"
                  : "bg-white text-gray-800 shadow-sm"
              }`}
            >
              {!message.isSent && message.senderName && (
                <p className="text-xs text-gray-400 mb-1">
                  {message.senderName}
                </p>
              )}
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.isSent ? "text-purple-200" : "text-gray-500"
                }`}
              >
                {message.timestamp?.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 bg-gray-100 rounded-full border-none outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <Mic className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={handleSendMessage}
            className="p-3 bg-purple-500 rounded-full hover:bg-purple-600 transition-colors"
            disabled={!messageInput.trim()}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainChatBox;
