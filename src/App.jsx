import { BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Routes, Route } from "react-router-dom";
import { ChatProvider } from "./components/ChatContext";
import ChatInterface from "./components/ChatInterface";
import AuthProvider from "./components/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
