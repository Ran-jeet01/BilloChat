import React, { useState } from "react";
import { useChat } from "./ChatContext";
import { SearchIcon, X, Users } from "lucide-react";

const NewChatSidebar = () => {
  const {
    showNewChat,
    setShowNewChat,
    newChatSearch,
    setNewChatSearch,
    contacts,
    startPrivateChat,
    createGroup,
  } = useChat();

  const [selectedContacts, setSelectedContacts] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const toggleContactSelection = (contact) => {
    setSelectedContacts((prev) => {
      if (prev.some((c) => c.id === contact.id)) {
        return prev.filter((c) => c.id !== contact.id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedContacts.length === 0) return;

    await createGroup(groupName, selectedContacts);
    setSelectedContacts([]);
    setGroupName("");
    setIsCreatingGroup(false);
  };

  if (!showNewChat) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col sm:absolute sm:top-16 sm:left-4 sm:right-auto sm:bottom-auto sm:w-96 sm:h-[600px] sm:max-h-[80vh] sm:rounded-lg sm:shadow-xl sm:border sm:border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {isCreatingGroup ? "New group" : "New chat"}
          </h2>
          <button
            onClick={() => {
              setShowNewChat(false);
              setIsCreatingGroup(false);
              setSelectedContacts([]);
            }}
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
            placeholder={
              isCreatingGroup ? "Search contacts" : "Search name or number"
            }
            value={newChatSearch}
            onChange={(e) => setNewChatSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none outline-none focus:bg-white focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Group Creation Section */}
        {isCreatingGroup && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-100 rounded-lg border-none outline-none focus:bg-white focus:ring-2 focus:ring-purple-500 mb-3"
            />
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                >
                  <span className="text-sm">
                    {contact.username ||
                      `${contact.firstName} ${contact.lastName}`}
                  </span>
                  <button
                    onClick={() => toggleContactSelection(contact)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedContacts.length === 0}
              className="w-full bg-purple-500 text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Group
            </button>
          </div>
        )}

        {/* New Group Option */}
        {!isCreatingGroup && (
          <div
            className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer active:bg-gray-100 transition-colors"
            onClick={() => setIsCreatingGroup(true)}
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">New group</h3>
            </div>
          </div>
        )}
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
                (contact.username || `${contact.firstName} ${contact.lastName}`)
                  .toLowerCase()
                  .includes(newChatSearch.toLowerCase())
              )
              .map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center space-x-3 p-4 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors"
                  onClick={() => {
                    if (isCreatingGroup) {
                      toggleContactSelection(contact);
                    } else {
                      startPrivateChat(contact);
                      setShowNewChat(false);
                    }
                  }}
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-gray-600 font-medium text-sm">
                      {(
                        contact.username ||
                        `${contact.firstName} ${contact.lastName}`
                      )
                        .split(" ")
                        .map((word) => word[0]?.toUpperCase())
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {contact.username ||
                        `${contact.firstName} ${contact.lastName}`}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {contact.status || "Hey there! I am using Billo Chat"}
                    </p>
                  </div>
                  {isCreatingGroup && (
                    <input
                      type="checkbox"
                      checked={selectedContacts.some(
                        (c) => c.id === contact.id
                      )}
                      onChange={() => toggleContactSelection(contact)}
                      className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChatSidebar;
