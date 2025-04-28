import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect, useState, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LogIn from './components/LogIn';
import Register from './components/Register';
import Feed from './components/Feed';
import { 
  isLoggedIn, 
  selectUser, 
  selectUserLoading, 
  clearUserState
} from './store/slices/userSlice';
import { 
  updateTimeAgo, 
  fetchPosts, 
  clearPostState,
  selectAllPosts
} from './store/slices/postSlice';
import { AppDispatch } from './store';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const user = useSelector(selectUser);
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/feed" replace /> : <LogIn />} />
      <Route path="/register" element={user ? <Navigate to="/feed" replace /> : <Register />} />
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
  const user = useSelector(selectUser);
  const posts = useSelector(selectAllPosts);
  
  // Use ref to track if auth and post fetching has been initiated
  const authInitiated = React.useRef<boolean>(false);
  const postsFetchInitiated = React.useRef<boolean>(false);

  // Initialize app only once
  useEffect(() => {
    const initializeApp = async () => {
      // Check if app is already initialized in this session
      if (sessionStorage.getItem('app_initialized')) {
        setIsInitialized(true);
        return;
      }

      // Clear state on first visit
      dispatch(clearUserState());
      dispatch(clearPostState());
      sessionStorage.setItem('app_initialized', 'true');
      
      setIsInitialized(true);
    };
    
    initializeApp();
  }, [dispatch]);

  // Authentication check - run only once
  useEffect(() => {
    if (!authInitiated.current && isInitialized) {
      authInitiated.current = true;
      dispatch(isLoggedIn()).catch(error => {
        console.error("Authentication check failed:", error);
        // Reset flag on error to allow retry
        authInitiated.current = false;
      });
    }
  }, [dispatch, isInitialized]);

  // Fetch posts - only when user is authenticated and posts haven't been fetched
  useEffect(() => {
    if (user && !postsFetchInitiated.current && posts.length === 0) {
      postsFetchInitiated.current = true;
      dispatch(fetchPosts()).catch(error => {
        console.error("Error fetching posts:", error);
        // Reset flag on error to allow retry
        postsFetchInitiated.current = false;
      });
    }
  }, [user, posts.length, dispatch]);

  // Reset posts fetch flag when user logs out
  useEffect(() => {
    if (!user) {
      postsFetchInitiated.current = false;
    }
  }, [user]);

  // Update time ago periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(updateTimeAgo());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  // Handle page refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('refreshing', 'true');
      
      setTimeout(() => {
        sessionStorage.removeItem('refreshing');
      }, 1000);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (!isInitialized) {
    return <div className="loading-container">Loading application...</div>;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;