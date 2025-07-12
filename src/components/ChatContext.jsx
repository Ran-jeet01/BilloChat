import { createContext, useContext, useState, useEffect, useRef } from "react";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [dartLocations, setDartLocations] = useState([]);
  const [isDartMode, setIsDartMode] = useState(false);
  const mapRef = useRef();
  const watchIdRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "Ranjit Pouel",
    about: "Hey there! I like cutting wood.",
    phone: "+977 97*********",
  });
  const [tempInfo, setTempInfo] = useState(userInfo);

  // Sample data
  const chats = [
    {
      id: 1,
      name: "Sameer Mocha",
      message: "K yo ta timro arajya?",
      time: "5:10 PM",
      active: true,
    },
    { id: 2, name: "Billa bakchod", message: "K vanya yaar", time: "5:10 PM" },
    { id: 3, name: "Billa Bakchod", message: "K vanya yaar", time: "5:10 PM" },
    { id: 4, name: "Billa pakchod", message: "K vanya yaar", time: "5:10 PM" },
    { id: 5, name: "Billa Bakchod", message: "K vanya yaar", time: "5:10 PM" },
    { id: 6, name: "Billa Bakchod", message: "K vanya yaar", time: "5:10 PM" },
    { id: 7, name: "Billa Bakchod", message: "K vanya yaar", time: "5:10 PM" },
    { id: 8, name: "Billa Bakchod", message: "K vanya yaar", time: "5:10 PM" },
  ];

  const contacts = [
    {
      id: 1,
      name: "Sujal Poudel",
      status: "Hey there! I am using Billa chat",
    },
    {
      id: 2,
      name: "Sisan Yaman",
      status: "Hey there! I am using Billa chat",
    },
    {
      id: 3,
      name: "Biswas Madhesi",
      status: "Hey there! I am using Billa chat",
    },
    {
      id: 4,
      name: "Srijan Rantalo",
      status: "Hey there! I am using Billa chat",
    },
    {
      id: 5,
      name: "Srijan Rantalo",
      status: "Hey there! I am using Billa chat",
    },
    {
      id: 6,
      name: "Srijan Rantalo",
      status: "Hey there! I am using Billa chat",
    },
    {
      id: 7,
      name: "Srijan Rantalo",
      status: "Hey there! I am using Billa chat",
    },
    {
      id: 8,
      name: "Srijan Rantalo",
      status: "Hey there! I am using Billa chat",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Sameer Mocha",
      text: "K yo ghnrai thik yo kotthamdu viyaa",
      time: "8:03 pm",
      isSent: true,
    },
    {
      id: 2,
      text: "Mero ni huni ni yo katto kham!",
      time: "8:03 pm",
      isSent: false,
    },
    {
      id: 3,
      sender: "Surja Banchhari",
      text: "ta mycca testa vanni alp pes khelna",
      time: "8:03 pm",
      isSent: true,
    },
    {
      id: 4,
      text: "Hello macha khani sable ?",
      time: "8:10 pm",
      isSent: false,
    },
    {
      id: 5,
      text: "Hello macha khani sable ?",
      time: "8:10 pm",
      isSent: false,
    },
    {
      id: 6,
      text: "Hello macha khani sable ?",
      time: "8:10 pm",
      isSent: false,
    },
    {
      id: 7,
      text: "Hello macha khani sable ?",
      time: "8:10 pm",
      isSent: false,
    },
    {
      id: 8,
      text: "Hello macha khani sable ?",
      time: "8:10 pm",
      isSent: false,
    },
    {
      id: 9,
      text: "Hello macha khani sable ?",
      time: "8:10 pm",
      isSent: false,
    },
    {
      id: 10,
      text: "Hello macha khani sable ?",
      time: "8:10 pm",
      isSent: false,
    },
    {
      id: 11,
      text: "Hello macha khani sable ?",
      time: "8:10 pm",
      isSent: false,
    },
    {
      id: 12,
      text: "Hello macha khani sable ?",
      time: "8:10 pm",
      isSent: false,
    },
    {
      id: 13,
      text: "Hello macha khani sable ?",
      time: "8:10 pm",
      isSent: false,
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
        setShowChat(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setShowChat(false);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleBackToChats = () => {
    setShowChat(false);
  };

  const handleChatSelect = () => {
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const handleNewChatToggle = () => {
    setShowNewChat(!showNewChat);
  };

  const handleProfileToggle = () => {
    setShowProfileModal(!showProfileModal);
  };

  const value = {
    sidebarOpen,
    searchQuery,
    messageInput,
    isMobile,
    showChat,
    showNewChat,
    newChatSearch,
    showProfileModal,
    showMap,
    chats,
    contacts,
    messages,
    setSearchQuery,
    setMessageInput,
    setNewChatSearch,
    setShowMap,
    toggleSidebar,
    handleBackToChats,
    handleChatSelect,
    handleSendMessage,
    handleNewChatToggle,
    handleProfileToggle,
    menuOpen,
    setMenuOpen,
    userPosition,
    setUserPosition,
    accuracy,
    setAccuracy,
    isTracking,
    setIsTracking,
    dartLocations,
    setDartLocations,
    isDartMode,
    mapRef,
    watchIdRef,
    isEditing,
    setIsEditing,
    userInfo,
    setUserInfo,
    tempInfo,
    setTempInfo,
    setIsDartMode,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
