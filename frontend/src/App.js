import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard'; // Main dashboard page
import Preferences from './pages/Preferences'; // Preferences page
import Notifications from './components/Notifications'; // Notification system

/**
 * Main application component with routing and global notifications.
 */
function App() {
  return (
    <Router>
      {/* Global Notifications */}
      <Notifications />

      {/* App Routing */}
      <Routes>
        {/* Dashboard Route */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Preferences Route */}
        <Route path="/preferences" element={<Preferences />} />
      </Routes>
    </Router>
  );
}

export default App;
