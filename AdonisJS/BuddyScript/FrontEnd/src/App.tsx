import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect, useState, ReactNode, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LogIn from './components/LogIn';
import Register from './components/Register';
import Feed from './components/Feed';
import { 
  isLoggedIn, 
  selectUser, 
  selectUserLoading, 
  clearUserState,
  selectUserReactions
} from './store/slices/userSlice';
import { 
  updateTimeAgo, 
  fetchPosts, 
  clearPostState,
  selectAllPosts
} from './store/slices/postSlice';
import { AppDispatch, RootState } from './store';
import conf from './conf/conf';

const fetchUserLikes = async (userId: number | undefined, dispatch: AppDispatch) => {
  // Early return if userId is not defined
  if (userId === undefined) return;
  
  try {
    console.log('Fetching user likes from API');
    // First get all posts
    const postsResponse = await fetch(`${conf.apiUrl}/posts`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!postsResponse.ok) return;
    
    const postsData = await postsResponse.json();
    if (!postsData.data || !Array.isArray(postsData.data)) return;
    
    // For each post, check if the user has liked it - use Promise.all for better performance
    const likePromises = postsData.data.map(async (post: { id: any; }) => {
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
    });
    
    await Promise.all(likePromises);
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
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    // We only need to track if the auth check is complete, not do another check
    if (!loading) {
      setAuthChecked(true);
    }
  }, [loading]);

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
  const posts = useSelector(selectAllPosts);
  const userReactions = useSelector(selectUserReactions);

  // Handle initial auth check and app setup - only once at startup
  useEffect(() => {
    const initializeApp = async () => {
      console.log("Initializing app");
      
      // Clear state on initialization to ensure clean start
      // Only clear states if this is a fresh session, not a refresh
      if (!sessionStorage.getItem('app_initialized')) {
        console.log("New session - clearing states");
        dispatch(clearUserState());
        dispatch(clearPostState());
        sessionStorage.setItem('app_initialized', 'true');
      } else {
        console.log("Existing session - keeping state");
      }
      
      try {
        // Check if user is logged in when app initializes
        console.log("Checking authentication status");
        await dispatch(isLoggedIn()).unwrap();
      } catch (error) {
        console.error("Authentication check failed:", error);
      }
      
      // Set up timer for updating timeAgo
      const intervalId = setInterval(() => {
        dispatch(updateTimeAgo());
      }, 60000);

      setIsInitialized(true);
      console.log("App initialization completed");
      
      return () => clearInterval(intervalId);
    };
    
    initializeApp();
  }, []); // Empty dependency array means this only runs once

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

  // Fetch posts and likes when user is loaded - but only if we don't have them yet
  useEffect(() => {
    if (user && typeof user.id === 'number' && isInitialized) {
      const loadUserData = async () => {
        // Only fetch posts if we don't have them
        if (posts.length === 0) {
          console.log("Fetching posts for authenticated user");
          await dispatch(fetchPosts());
        } else {
          console.log("Posts already loaded, skipping fetch");
        }
        
        // Only fetch likes if we don't have them
        if (Object.keys(userReactions).length === 0) {
          console.log("Fetching user reactions");
          await fetchUserLikes(user.id, dispatch);
        } else {
          console.log("User reactions already loaded, skipping fetch");
        }
      };
      
      loadUserData();
    }
  }, [user, isInitialized, dispatch, posts.length, userReactions]);

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