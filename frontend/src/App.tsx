import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useChat } from './context/ChatContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ChatWindow from './pages/ChatWindow';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { username } = useChat();
  if (!username) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat/:groupId" 
          element={
            <ProtectedRoute>
              <ChatWindow />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
