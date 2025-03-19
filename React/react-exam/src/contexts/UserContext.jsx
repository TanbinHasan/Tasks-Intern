import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const activeUser = localStorage.getItem('activeUser');
    if (activeUser) {
      setUser(JSON.parse(activeUser));
    }
  }, []);

  // Login function to authenticate user using email and password
  const login = (email, password) => {
    const storedUser = JSON.parse(localStorage.getItem(email));
    if (storedUser && storedUser.password === password) {
      setUser({ email, password });  // Store only email and password
      localStorage.setItem('activeUser', JSON.stringify({ email, password }));
      return true;
    }
    return false;
  };

  // Set the active user
  const setActiveUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('activeUser', JSON.stringify(updatedUser)); // Store only email and password
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('activeUser');
  };

  return (
    <UserContext.Provider value={{ user, login, setActiveUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};