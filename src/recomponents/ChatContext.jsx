import { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../Firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "./AuthProvider";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { currentUser, userData, getAllUsers, updateProfile } = useAuth();
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
  const [tempInfo, setTempInfo] = useState({});
  const [contacts, setContacts] = useState([]);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [chatType, setChatType] = useState(null);
  const [groupLocations, setGroupLocations] = useState({});
  const [privateLocations, setPrivateLocations] = useState({});
  const [activeDart, setActiveDart] = useState(null);

  // Initialize user info
  useEffect(() => {
    if (userData) {
      setTempInfo({
        name: userData.username || `${userData.firstName} ${userData.lastName}`,
        about: userData.status || "Hey there! I am using Billo Chat",
        phone: userData.phone || "",
      });
    }
  }, [userData]);

  function combineKeys(a, b) {
    const sorted = [a, b].sort();
    return sorted[0] + sorted[1];
  }

  // Load all contacts
  useEffect(() => {
    const loadContacts = async () => {
      if (!currentUser) return;
      const allUsers = await getAllUsers();
      const otherUsers = allUsers.filter(
        (user) => user.uid !== currentUser.uid
      );
      setContacts(otherUsers);
    };
    loadContacts();
  }, [currentUser, getAllUsers]);

  // Get latest message for a chat
  const getLatestMessage = async (chatId, chatType) => {
    try {
      let messagesRef;
      if (chatType === "group") {
        messagesRef = query(
          collection(db, "groups", chatId, "messages"),
          orderBy("timestamp", "desc"),
          limit(1)
        );
      } else {
        messagesRef = query(
          collection(db, "peoples", chatId, "messages"),
          orderBy("timestamp", "desc"),
          limit(1)
        );
      }

      const snapshot = await getDocs(messagesRef);
      if (!snapshot.empty) {
        const latestMessage = snapshot.docs[0].data();
        return {
          content: latestMessage.content,
          timestamp: latestMessage.timestamp,
          time: formatTime(latestMessage.timestamp),
        };
      }
      return null;
    } catch (error) {
      console.error("Error getting latest message:", error);
      return null;
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (diff < 48 * 60 * 60 * 1000) return "Yesterday";
    return date.toLocaleDateString();
  };

  // Load and enrich chats with latest messages
  const loadAndEnrichChats = async (groups, peoples) => {
    const enrichedChats = [];

    for (const group of groups) {
      const latestMessage = await getLatestMessage(group.id, "group");
      enrichedChats.push({
        ...group,
        name: group.groupName,
        message: latestMessage?.content || "No messages yet",
        time: latestMessage?.time || "",
        timestamp: latestMessage?.timestamp || group.joinedAt,
        type: "group",
      });
    }

    for (const people of peoples) {
      const latestMessage = await getLatestMessage(people.id, "private");
      enrichedChats.push({
        ...people,
        name: people.peerName,
        message: latestMessage?.content || "No messages yet",
        time: latestMessage?.time || "",
        timestamp: latestMessage?.timestamp || people.chatStartedAt,
        type: "private",
      });
    }

    enrichedChats.sort((a, b) => {
      const timestampA = a.timestamp?.toDate
        ? a.timestamp.toDate()
        : new Date(a.timestamp || 0);
      const timestampB = b.timestamp?.toDate
        ? b.timestamp.toDate()
        : new Date(b.timestamp || 0);
      return timestampB - timestampA;
    });

    return enrichedChats;
  };

  // Load user's chats
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeGroups = onSnapshot(
      collection(db, "users", currentUser.uid, "groups"),
      async (snapshot) => {
        const groups = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "group",
        }));

        const peoplesSnapshot = await getDocs(
          collection(db, "users", currentUser.uid, "peoples")
        );
        const peoples = peoplesSnapshot.docs.map((doc) => ({
          id: combineKeys(doc.id, currentUser.uid),
          ...doc.data(),
          type: "private",
        }));

        const enrichedChats = await loadAndEnrichChats(groups, peoples);
        setChats(enrichedChats);
      }
    );

    const unsubscribePeoples = onSnapshot(
      collection(db, "users", currentUser.uid, "peoples"),
      async (snapshot) => {
        const peoples = snapshot.docs.map((doc) => ({
          id: combineKeys(doc.id, currentUser.uid),
          ...doc.data(),
          type: "private",
        }));

        const groupsSnapshot = await getDocs(
          collection(db, "users", currentUser.uid, "groups")
        );
        const groups = groupsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "group",
        }));

        const enrichedChats = await loadAndEnrichChats(groups, peoples);
        setChats(enrichedChats);
      }
    );

    return () => {
      unsubscribeGroups();
      unsubscribePeoples();
    };
  }, [currentUser]);

  // Load messages for active chat
  useEffect(() => {
    if (!activeChat || !currentUser) return;

    let unsubscribe;

    if (chatType === "group") {
      unsubscribe = onSnapshot(
        query(
          collection(db, "groups", activeChat.id, "messages"),
          orderBy("timestamp", "asc")
        ),
        (snapshot) => {
          const msgs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isSent: doc.data().senderId === currentUser.uid,
          }));
          setMessages(msgs);
        }
      );
    } else if (chatType === "private") {
      unsubscribe = onSnapshot(
        query(
          collection(db, "peoples", activeChat.id, "messages"),
          orderBy("timestamp", "asc")
        ),
        (snapshot) => {
          const msgs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isSent: doc.data().senderId === currentUser.uid,
          }));
          setMessages(msgs);
        }
      );
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeChat, chatType, currentUser]);

  // Handle window resize
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

  // Location sharing functions
  const shareLocationWithGroup = async (groupId) => {
    if (!currentUser || !userPosition) return false;

    try {
      const locationRef = doc(
        db,
        "groups",
        groupId,
        "locations",
        currentUser.uid
      );
      await setDoc(locationRef, {
        latitude: userPosition[0],
        longitude: userPosition[1],
        timestamp: serverTimestamp(),
        userId: currentUser.uid,
        userName:
          userData.username || `${userData.firstName} ${userData.lastName}`,
      });
      return true;
    } catch (error) {
      console.error("Error sharing location:", error);
      return false;
    }
  };

  const shareLocationPrivate = async (chatId) => {
    if (!currentUser || !userPosition) return false;

    try {
      const locationRef = doc(
        db,
        "peoples",
        chatId,
        "locations",
        currentUser.uid
      );
      await setDoc(locationRef, {
        latitude: userPosition[0],
        longitude: userPosition[1],
        timestamp: serverTimestamp(),
        userId: currentUser.uid,
        userName:
          userData.username || `${userData.firstName} ${userData.lastName}`,
      });
      return true;
    } catch (error) {
      console.error("Error sharing location:", error);
      return false;
    }
  };

  const placeGroupDart = async (groupId, position) => {
    try {
      const dartRef = doc(db, "groups", groupId, "shared", "dart");
      if (position) {
        await setDoc(dartRef, {
          latitude: position[0],
          longitude: position[1],
          timestamp: serverTimestamp(),
          placedBy: currentUser.uid,
        });
      } else {
        await deleteDoc(dartRef);
      }
      return true;
    } catch (error) {
      console.error("Error placing dart:", error);
      return false;
    }
  };

  const placePrivateDart = async (chatId, position) => {
    try {
      const dartRef = doc(db, "peoples", chatId, "shared", "dart");
      if (position) {
        await setDoc(dartRef, {
          latitude: position[0],
          longitude: position[1],
          timestamp: serverTimestamp(),
          placedBy: currentUser.uid,
        });
      } else {
        await deleteDoc(dartRef);
      }
      return true;
    } catch (error) {
      console.error("Error placing dart:", error);
      return false;
    }
  };

  // Set up real-time location and dart listeners
  useEffect(() => {
    if (!activeChat) return;

    let unsubscribeLocations;
    let unsubscribeDart;

    if (chatType === "group") {
      unsubscribeLocations = onSnapshot(
        collection(db, "groups", activeChat.id, "locations"),
        (snapshot) => {
          const locations = {};
          snapshot.forEach((doc) => {
            locations[doc.id] = doc.data();
          });
          setGroupLocations(locations);
        }
      );

      unsubscribeDart = onSnapshot(
        doc(db, "groups", activeChat.id, "shared", "dart"),
        (doc) => {
          if (doc.exists()) {
            setActiveDart(doc.data());
          } else {
            setActiveDart(null);
          }
        }
      );
    } else if (chatType === "private") {
      unsubscribeLocations = onSnapshot(
        collection(db, "peoples", activeChat.id, "locations"),
        (snapshot) => {
          const locations = {};
          snapshot.forEach((doc) => {
            locations[doc.id] = doc.data();
          });
          setPrivateLocations(locations);
        }
      );

      unsubscribeDart = onSnapshot(
        doc(db, "peoples", activeChat.id, "shared", "dart"),
        (doc) => {
          if (doc.exists()) {
            setActiveDart(doc.data());
          } else {
            setActiveDart(null);
          }
        }
      );
    }

    return () => {
      if (unsubscribeLocations) unsubscribeLocations();
      if (unsubscribeDart) unsubscribeDart();
    };
  }, [activeChat, chatType]);

  // Initialize user position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserPosition([latitude, longitude]);
        setAccuracy(accuracy);
      },
      (error) => {
        console.error("Error getting location:", error);
        setUserPosition([51.505, -0.09]);
      }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);
  //log out handling
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

 

  const startTracking = () => {
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setUserPosition([latitude, longitude]);
          setAccuracy(accuracy);

          if (activeChat) {
            if (chatType === "group") {
              shareLocationWithGroup(activeChat.id);
            } else if (chatType === "private") {
              shareLocationPrivate(activeChat.id);
            }
          }

          if (mapRef.current && isTracking) {
            mapRef.current.flyTo([latitude, longitude], 15);
          }
        },
        (error) => {
          console.error("Error watching position:", error);
          setIsTracking(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );
      setIsTracking(true);
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  };

  // Chat functions
  const toggleSidebar = () => {
    if (isMobile) {
      setShowChat(false);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleBackToChats = () => {
    setShowChat(false);
    setActiveChat(null);
  };

  const handleChatSelect = async (chat) => {
    setActiveChat(chat);
    setChatType(chat.type);

    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat || !currentUser) return;

    const message = {
      senderId: currentUser.uid,
      senderName:
        userData.username || `${userData.firstName} ${userData.lastName}`,
      content: messageInput,
      timestamp: serverTimestamp(),
      type: "text",
      status: "sent",
    };

    try {
      if (chatType === "group") {
        await setDoc(
          doc(collection(db, "groups", activeChat.id, "messages")),
          message
        );
      } else if (chatType === "private") {
        await setDoc(
          doc(collection(db, "peoples", activeChat.id, "messages")),
          message
        );
      }
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleNewChatToggle = () => {
    setShowNewChat(!showNewChat);
  };

  const handleProfileToggle = () => {
    setShowProfileModal(!showProfileModal);
  };

  const startPrivateChat = async (contact) => {
    if (!currentUser) return;

    const chatId = combineKeys(contact.id, currentUser.uid);

    try {
      const chatRef = doc(db, "peoples", chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participant1: currentUser.uid,
          participant2: contact.id,
          createdAt: serverTimestamp(),
        });

        await setDoc(doc(db, "users", currentUser.uid, "peoples", contact.id), {
          peerId: contact.id,
          peerName:
            contact.username || `${contact.firstName} ${contact.lastName}`,
          chatStartedAt: serverTimestamp(),
        });

        await setDoc(doc(db, "users", contact.id, "peoples", currentUser.uid), {
          peerId: currentUser.uid,
          peerName:
            userData.username || `${userData.firstName} ${userData.lastName}`,
          chatStartedAt: serverTimestamp(),
        });
      }

      setActiveChat({
        id: chatId,
        name: contact.username || `${contact.firstName} ${contact.lastName}`,
        type: "private",
      });
      setChatType("private");
      setShowNewChat(false);
      setShowChat(true);
    } catch (error) {
      console.error("Error starting private chat:", error);
    }
  };

  const createGroup = async (groupName, participants) => {
    if (!currentUser || !participants || participants.length === 0) return;

    try {
      const groupRef = doc(collection(db, "groups"));
      await setDoc(groupRef, {
        groupName,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp(),
        description: "",
        members: [currentUser.uid, ...participants.map((p) => p.id)],
      });

      const groupData = {
        groupId: groupRef.id,
        groupName,
        joinedAt: serverTimestamp(),
        role: "member",
      };

      await setDoc(doc(db, "users", currentUser.uid, "groups", groupRef.id), {
        ...groupData,
        role: "admin",
      });

      for (const participant of participants) {
        await setDoc(
          doc(db, "users", participant.id, "groups", groupRef.id),
          groupData
        );
      }

      setActiveChat({
        id: groupRef.id,
        name: groupName,
        type: "group",
      });
      setChatType("group");
      setShowNewChat(false);
      setShowChat(true);

      return groupRef.id;
    } catch (error) {
      console.error("Error creating group:", error);
      return null;
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    try {
      await updateProfile(currentUser.uid, {
        username: tempInfo.name,
        status: tempInfo.about,
        phone: tempInfo.phone,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelEdit = () => {
    setTempInfo({
      name: userData.username || `${userData.firstName} ${userData.lastName}`,
      about: userData.status || "Hey there! I am using Billo Chat",
      phone: userData.phone || "",
    });
    setIsEditing(false);
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
    activeChat,
    chatType,
    groupLocations,
    privateLocations,
    activeDart,
    setShowNewChat,
    setSearchQuery,
    setMessageInput,
    setShowProfileModal,
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
    userData,
    tempInfo,
    setTempInfo,
    setIsDartMode,
    startPrivateChat,
    createGroup,
    handleSaveProfile,
    handleCancelEdit,
    placeGroupDart,
    placePrivateDart,
    shareLocationWithGroup,
    shareLocationPrivate,
    handleLogout,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatProvider;
