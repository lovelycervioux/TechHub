import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClubProvider } from './context/ClubContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import './index.css';

export function App() {
  // Load custom fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <ClubProvider>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LandingPage />} />
      </Routes>
    </ClubProvider>
  );
}

export default App;
