import React from "react";
import { useChat } from "./ChatContext";
import { SearchIcon, X } from "lucide-react";

const NewChatSidebar = () => {
  const { isVisible, onClose, newChatSearch, setNewChatSearch, contacts } =
    useChat();
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col sm:absolute sm:top-16 sm:left-4 sm:right-auto sm:bottom-auto sm:w-96 sm:h-[600px] sm:max-h-[80vh] sm:rounded-lg sm:shadow-xl sm:border sm:border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">New chat</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or number"
            value={newChatSearch}
            onChange={(e) => setNewChatSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* New Group Option */}
        <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer active:bg-gray-100 transition-colors">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">👥</span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">New group</h3>
          </div>
        </div>
      </div>

      {/* Contacts Section */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="px-4 py-2 flex-shrink-0 bg-white border-b border-gray-100">
          <p className="text-sm text-gray-500 font-medium">All contacts</p>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="pb-2">
            {contacts
              .filter((contact) =>
                contact.name.toLowerCase().includes(newChatSearch.toLowerCase())
              )
              .map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors"
                  onClick={() => {
                    onClose();
                    // Handle contact selection
                  }}
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-gray-600 font-medium text-sm">
                      {contact.name
                        .split(" ")
                        .map((word) => word[0]?.toUpperCase())
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {contact.status}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatSidebar;
