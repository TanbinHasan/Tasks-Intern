import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children, onInitialized }) => {
  const [user, setUser] = useState(null);
  const [userReactions, setUserReactions] = useState({});

  useEffect(() => {
    const syncWithLocalStorage = () => {
      const activeUser = localStorage.getItem('activeUser');
      if (activeUser) {
        try {
          const userData = JSON.parse(activeUser);
          setUser(userData);
          
          // Load user's reactions if user is logged in
          if (userData && userData.email) {
            const savedReactions = localStorage.getItem(`userReactions_${userData.email}`);
            if (savedReactions) {
              setUserReactions(JSON.parse(savedReactions));
            } else {
              setUserReactions({});
            }
          }
        } catch (e) {
          console.error("Failed to parse user data", e);
          localStorage.removeItem('activeUser');
          setUser(null);
          setUserReactions({});
        }
      } else {
        setUser(null);
        setUserReactions({});
      }
    };

    const handleStorageChange = (event) => {
      if (event.key === 'activeUser') {
        syncWithLocalStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    syncWithLocalStorage();
    
    // Signal that the user context is initialized
    if (onInitialized) {
      onInitialized();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [onInitialized]);

  const login = (email, password) => {
    const storedUser = JSON.parse(localStorage.getItem(email));
    if (storedUser && storedUser.password === password) {
      const userData = { email, password };
      setUser(userData);
      localStorage.setItem('activeUser', JSON.stringify(userData));
      
      // Load user's reactions
      const savedReactions = localStorage.getItem(`userReactions_${email}`);
      if (savedReactions) {
        setUserReactions(JSON.parse(savedReactions));
      } else {
        setUserReactions({});
      }
      
      return true;
    }
    return false;
  };

  const setActiveUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('activeUser', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    setUserReactions({});
    localStorage.removeItem('activeUser');
    window.location.href = '/';
  };

  // Use useCallback to memoize the functions to prevent unnecessary re-renders
  const hasReacted = useCallback((type, id) => {
    if (!user || !user.email) return false;
    const reactionKey = `${type}_${id}`;
    return !!userReactions[reactionKey];
  }, [user, userReactions]);

  // Track if a user has reacted to a specific content
  const setReaction = useCallback((type, id, hasReacted) => {
    if (!user || !user.email) return false;
    
    const reactionKey = `${type}_${id}`;
    
    // Only update if the reaction state has actually changed
    if (userReactions[reactionKey] === hasReacted) {
      return true; // No change needed, return early
    }
    
    setUserReactions(prevReactions => {
      const updatedReactions = {
        ...prevReactions,
        [reactionKey]: hasReacted
      };
      
      // Save to localStorage
      localStorage.setItem(`userReactions_${user.email}`, JSON.stringify(updatedReactions));
      return updatedReactions;
    });
    
    return true;
  }, [user, userReactions]);

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      setActiveUser, 
      logout,
      setReaction,
      hasReacted
    }}>
      {children}
    </UserContext.Provider>
  );
};