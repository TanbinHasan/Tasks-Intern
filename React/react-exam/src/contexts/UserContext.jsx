import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children, onInitialized }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const syncWithLocalStorage = () => {
      const activeUser = localStorage.getItem('activeUser');
      if (activeUser) {
        try {
          const userData = JSON.parse(activeUser);
          setUser(userData);
        } catch (e) {
          console.error("Failed to parse user data", e);
          localStorage.removeItem('activeUser');
          setUser(null);
        }
      } else {
        setUser(null);
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
  }, []);

  const login = (email, password) => {
    const storedUser = JSON.parse(localStorage.getItem(email));
    if (storedUser && storedUser.password === password) {
      const userData = { email, password };
      setUser(userData);
      localStorage.setItem('activeUser', JSON.stringify(userData));
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
    localStorage.removeItem('activeUser');
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ user, login, setActiveUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};