import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect, useState, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LogIn from './components/LogIn';
import Register from './components/Register';
import Feed from './components/Feed';
import { syncWithLocalStorage, selectUser } from './store/slices/userSlice';
import { loadPostsFromStorage, updateTimeAgo } from './store/slices/postSlice';
import { AppDispatch, RootState } from './store';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const checkAuth = () => {
      const activeUser = localStorage.getItem('activeUser');
      setIsAuthenticated(!!activeUser);
      setIsLoading(false);
    };

    // Your existing meta tag and event listener code remains the same
    const metaNoCache = document.createElement('meta');
    metaNoCache.setAttribute('http-equiv', 'Cache-Control');
    metaNoCache.setAttribute('content', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    document.head.appendChild(metaNoCache);
    
    // Rest of the useEffect remains the same
    
    // Initial check
    checkAuth();
    
    return () => {
      // Your existing cleanup code
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
    // Initialize Redux store with localStorage data
    dispatch(syncWithLocalStorage());
    dispatch(loadPostsFromStorage());

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