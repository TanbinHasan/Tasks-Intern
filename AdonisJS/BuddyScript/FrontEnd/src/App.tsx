import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect, useState, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LogIn from './components/LogIn';
import Register from './components/Register';
import Feed from './components/Feed';
import { isLoggedIn, selectUser, selectUserLoading } from './store/slices/userSlice';
import { updateTimeAgo, fetchPosts } from './store/slices/postSlice';
import { AppDispatch, RootState } from './store';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    // Check authentication status when component mounts
    dispatch(isLoggedIn());
    
    // Add meta tag to prevent caching
    const metaNoCache = document.createElement('meta');
    metaNoCache.setAttribute('http-equiv', 'Cache-Control');
    metaNoCache.setAttribute('content', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    document.head.appendChild(metaNoCache);
    
    return () => {
      // Remove meta tag on cleanup
      if (metaNoCache.parentNode) {
        metaNoCache.parentNode.removeChild(metaNoCache);
      }
    };
  }, [dispatch]);

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
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
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Check if user is logged in when app initializes
    dispatch(isLoggedIn());
    
    // Fetch posts data from API
    dispatch(fetchPosts());

    // Set up timer for updating timeAgo
    const intervalId = setInterval(() => {
      dispatch(updateTimeAgo());
    }, 60000);

    setIsInitialized(true);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <BrowserRouter>
      {isInitialized ? <AppRoutes /> : <div>Loading...</div>}
    </BrowserRouter>
  );
}

export default App;