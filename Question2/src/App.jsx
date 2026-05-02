import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AllNotifications } from './pages/AllNotifications';
import { PriorityInbox } from './pages/PriorityInbox';
import { Log } from "../../logging_middleware/index.js";

function App() {
  const [readStatus, setReadStatus] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('notifications_read_status');
    if (saved) {
      try {
        setReadStatus(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load read status");
      }
    }
  }, []);

  const markAsRead = async (id) => {
    if (!readStatus[id]) {
      const newStatus = { ...readStatus, [id]: true };
      setReadStatus(newStatus);
      localStorage.setItem('notifications_read_status', JSON.stringify(newStatus));
      await Log("frontend", "info", "state", "Marked notification as read");
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={<AllNotifications readStatus={readStatus} markAsRead={markAsRead} />} 
            />
            <Route 
              path="/priority" 
              element={<PriorityInbox readStatus={readStatus} markAsRead={markAsRead} />} 
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
