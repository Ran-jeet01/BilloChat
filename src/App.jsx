import { BrowserRouter } from "react-router-dom";

import Login from "./recomponents/Auth/Login";
import Signup from "./recomponents/Auth/Signup";
import { Routes, Route } from "react-router-dom";
import { ChatProvider } from "./recomponents/ChatContext";
import ChatInterface from "./recomponents/ChatInterface";
import { AuthProvider } from "./recomponents/AuthProvider";
import ProtectedRoute from "./recomponents/ProtectedRoute";
import ErrorBoundary from "./recomponents/ErrorBoundary";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <ChatInterface />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            />
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
