import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import React, { useEffect, useState } from 'react';
import LogIn from './components/LogIn';
import { UserProvider, useUser } from './contexts/UserContext';
import Register from './components/Register';
import Feed from './components/Feed';
import { PostProvider } from './contexts/PostContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = () => {
      const activeUser = localStorage.getItem('activeUser');
      setIsAuthenticated(!!activeUser);
      setIsLoading(false);
    };

    const metaNoCache = document.createElement('meta');
    metaNoCache.setAttribute('http-equiv', 'Cache-Control');
    metaNoCache.setAttribute('content', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    document.head.appendChild(metaNoCache);
    
    const metaNoStore = document.createElement('meta');
    metaNoStore.setAttribute('http-equiv', 'Pragma');
    metaNoStore.setAttribute('content', 'no-cache');
    document.head.appendChild(metaNoStore);
    
    const metaExpires = document.createElement('meta');
    metaExpires.setAttribute('http-equiv', 'Expires');
    metaExpires.setAttribute('content', '0');
    document.head.appendChild(metaExpires);

    const handlePageShow = (event) => {
      if (event.persisted) {
        checkAuth();
      }
    };

    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('load', checkAuth);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('storage', handleStorageChange);
    
    // Initial check
    checkAuth();
    
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('load', checkAuth);
      window.removeEventListener('storage', handleStorageChange);
      document.head.removeChild(metaNoCache);
      document.head.removeChild(metaNoStore);
      document.head.removeChild(metaExpires);
    };
  }, [user]);

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/feed" 
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [isUserInitialized, setIsUserInitialized] = useState(false);

  return (
    <UserProvider onInitialized={() => setIsUserInitialized(true)}>
      <PostProvider>
        <BrowserRouter>
          {isUserInitialized ? <AppRoutes /> : <div>Loading...</div>}
        </BrowserRouter>
      </PostProvider>
    </UserProvider>
  );
}

export default App;