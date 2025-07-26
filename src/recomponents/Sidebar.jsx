import { useChat } from "./ChatContext";
import { Search, Edit, Settings } from "lucide-react";

const Sidebar = () => {
  const {
    showNewChat,
    isMobile,
    showChat,
    chats,
    searchQuery,
    sidebarOpen,
    showProfileModal,
    setSearchQuery,
    handleChatSelect,
    handleNewChatToggle,
    handleProfileToggle,
  } = useChat();

  // Safe filtered chats
  const filteredChats = chats?.filter((chat) =>
    chat?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`${
        isMobile
          ? showChat
            ? "hidden"
            : "w-full fixed inset-0 z-40"
          : sidebarOpen
          ? "w-80"
          : "w-0"
      } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col h-full`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">💎</span>
            </div>
            <span className="font-semibold text-lg text-gray-800">
              Billo chat
            </span>
          </div>
          <button
            onClick={handleProfileToggle}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Settings className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
          </button>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="font-medium text-gray-700">Chats</span>
          <div className="flex space-x-2 ml-auto">
            <Edit
              className="w-4 h-4 text-gray-600 cursor-pointer hover:text-gray-800"
              onClick={handleNewChatToggle}
            />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats?.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No chats found</div>
        ) : (
          filteredChats?.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                chat.active
                  ? "bg-purple-100 border-l-4 border-l-purple-500"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-medium text-sm">
                    {chat.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {chat.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {chat.message}
                    </p>
                    {chat.type === "group" && (
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                        Group
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
