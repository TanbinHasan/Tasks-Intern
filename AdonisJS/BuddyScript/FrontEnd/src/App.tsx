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
  clearPostState 
} from './store/slices/postSlice';
import { AppDispatch, RootState } from './store';
import conf from './conf/conf';

// Utility function to fetch user likes for posts
const fetchUserLikes = async (userId: number | undefined, dispatch: AppDispatch) => {
  // Early return if userId is not defined
  if (userId === undefined) return;
  
  try {
    // First get all posts
    const postsResponse = await fetch(`${conf.apiUrl}/posts`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!postsResponse.ok) return;
    
    const postsData = await postsResponse.json();
    if (!postsData.data || !Array.isArray(postsData.data)) return;
    
    // For each post, check if the user has liked it
    for (const post of postsData.data) {
      try {
        const likeResponse = await fetch(`${conf.apiUrl}/posts/${post.id}/like`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (likeResponse.ok) {
          const likeData = await likeResponse.json();
          
          if (likeData.data && typeof likeData.data.liked === 'boolean') {
            // Update Redux store with the like status
            dispatch({
              type: 'user/setReaction',
              payload: {
                type: 'post',
                id: post.id,
                hasReacted: likeData.data.liked
              }
            });
          }
        }
      } catch (error) {
        console.error(`Error checking like for post ${post.id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error fetching user likes:', error);
  }
};

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  const dispatch = useDispatch<AppDispatch>();
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuth = async () => {
      await dispatch(isLoggedIn());
      setAuthChecked(true);
    };
    
    checkAuth();
    
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

  // If user is authenticated, fetch their likes
  useEffect(() => {
    if (user && typeof user.id === 'number') {
      dispatch(fetchPosts());
      fetchUserLikes(user.id, dispatch);
    }
  }, [user, dispatch]);

  // Show loading state until auth check completes
  if (loading || !authChecked) {
    return <div>Loading...</div>;
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  
  // Handle redirect logic in routes directly
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

  // Handle initial auth check and app setup
  useEffect(() => {
    const initializeApp = async () => {
      // Clear state on initialization to ensure clean start
      // Only clear states if this is a fresh session, not a refresh
      if (!sessionStorage.getItem('app_initialized')) {
        dispatch(clearUserState());
        dispatch(clearPostState());
        sessionStorage.setItem('app_initialized', 'true');
      }
      
      // Check if user is logged in when app initializes
      await dispatch(isLoggedIn());
      
      // Set up timer for updating timeAgo
      const intervalId = setInterval(() => {
        dispatch(updateTimeAgo());
      }, 60000);

      setIsInitialized(true);
      
      return () => clearInterval(intervalId);
    };
    
    initializeApp();
  }, [dispatch]);

  // Setup event listener for page refreshes
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Keep the session initialized flag during refreshes
      // But we'll clear it if they actually leave the page
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

  // Fetch posts and likes when user is loaded
  useEffect(() => {
    if (user && typeof user.id === 'number' && isInitialized) {
      // Fetch posts for the authenticated user
      dispatch(fetchPosts());
      
      // Wait a bit to ensure posts are loaded, then fetch likes
      const timer = setTimeout(() => {
        fetchUserLikes(user.id, dispatch);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [user, isInitialized, dispatch]);

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