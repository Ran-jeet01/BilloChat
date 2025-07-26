// import { BrowserRouter } from "react-router-dom";
// // import Login from "./components/Login";
// // import Signup from "./components/Signup";
// import { Routes, Route } from "react-router-dom";
// import { ChatProvider } from "./components/ChatContext";
// import ChatInterface from "./components/ChatInterface";
// import { AuthProvider } from "./components/AuthProvider";

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <ChatProvider>
//           <Routes>
//             <Route path="/" element={<ChatInterface />} />
//           </Routes>
//         </ChatProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;

// src/App.js
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
                    {/* Wrapping ChatInterface in ErrorBoundary to catch errors */}
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
