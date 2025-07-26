import { useChat } from "./ChatContext";
import Sidebar from "./Sidebar";
import NewChatSidebar from "./NewSidebar";
import UserProfileModal from "./UserProfileModal";
import MainChatBox from "./MainChatBox";
import Map from "./Map";

const ChatInterface = () => {
  const { showMap } = useChat();

  return (
    <div className="h-screen flex bg-gray-100">
      {showMap ? (
        <Map />
      ) : (
        <>
          <Sidebar />
          <NewChatSidebar />
          <UserProfileModal />
          <MainChatBox />
        </>
      )}
    </div>
  );
};

export default ChatInterface;
