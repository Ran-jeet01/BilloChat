import React, { useState } from "react";
import { X, Edit, LogOut, Phone, User, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "./ChatContext";

const UserProfileModal = () => {
  const {
    isOpen,
    onClose,
    isEditing,
    setIsEditing,
    userInfo,
    setUserInfo,
    tempInfo,
    setTempInfo,
  } = useChat();

  const handleEdit = () => {
    setIsEditing(true);
    setTempInfo(userInfo);
  };

  const handleSave = () => {
    setUserInfo(tempInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempInfo(userInfo);
    setIsEditing(false);
  };

  const handleLogout = () => {
    alert("Logging out...");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Profile Picture - Changed to match first design */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center shadow-lg mb-4">
                <span className="text-white font-medium text-3xl">
                  {userInfo.name[0]}
                </span>
              </div>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Name Section - Modified from first design */}
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
                    {userInfo.name}
                  </h3>
                  <button
                    onClick={handleEdit}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* About Section - Modified from first design */}
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
                  <p className="text-gray-700 px-1 flex-1">{userInfo.about}</p>
                  <button
                    onClick={handleEdit}
                    className="text-gray-600 hover:text-gray-800 transition-colors ml-2"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Phone Section - Modified from first design */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-500">
                <Phone className="w-5 h-5" />
                <span className="text-sm font-medium">Phone number</span>
              </div>
              <p className="text-gray-700 px-1">{userInfo.phone}</p>
            </div>

            {/* Divider - Added from first design */}
            <div className="w-full h-px bg-gray-200"></div>

            {/* Action Buttons - Modified from first design */}
            <div className="pt-4 space-y-3">
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
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
