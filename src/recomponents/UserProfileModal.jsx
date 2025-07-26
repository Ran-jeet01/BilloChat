import React from "react";
import { X, Edit, LogOut, Phone, User, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "./ChatContext";

const UserProfileModal = () => {
  const {
    showProfileModal,
    setShowProfileModal,
    isEditing,
    setIsEditing,
    userData,
    tempInfo,
    setTempInfo,
    handleSaveProfile,
    handleCancelEdit,
    handleLogout,
    logout,
  } = useChat();

  // const handleLogout = () => {
  //   logout();
  //   setShowProfileModal(false);
  // };

  return (
    <AnimatePresence>
      {showProfileModal && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed inset-0 bg-white z-50 flex flex-col sm:absolute sm:top-4 sm:left-4 sm:right-auto sm:bottom-auto sm:w-96 sm:h-[calc(100vh-2rem)] sm:max-h-[96vh] sm:rounded-2xl sm:shadow-2xl sm:border sm:border-gray-200/50"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200/50 flex-shrink-0 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                <span className="text-white font-medium text-3xl">
                  {tempInfo.name[0]}
                </span>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Name Section */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-500">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Name</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={tempInfo.name}
                  onChange={(e) =>
                    setTempInfo({ ...tempInfo, name: e.target.value })
                  }
                  className="w-full text-lg font-semibold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 px-1">
                    {tempInfo.name}
                  </h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* About Section */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-500">
                <Info className="w-5 h-5" />
                <span className="text-sm font-medium">About</span>
              </div>
              {isEditing ? (
                <textarea
                  value={tempInfo.about}
                  onChange={(e) =>
                    setTempInfo({ ...tempInfo, about: e.target.value })
                  }
                  className="w-full text-gray-700 bg-gray-50 border border-gray-300 rounded-lg p-3 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-700 px-1 flex-1">{tempInfo.about}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-600 hover:text-gray-800 transition-colors ml-2"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Phone Section */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-500">
                <Phone className="w-5 h-5" />
                <span className="text-sm font-medium">Phone number</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={tempInfo.phone}
                  onChange={(e) =>
                    setTempInfo({ ...tempInfo, phone: e.target.value })
                  }
                  className="w-full text-gray-700 bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-700 px-1">
                  {tempInfo.phone || "Not provided"}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200"></div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <span>Log out</span>
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserProfileModal;
