import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const activeUser = localStorage.getItem('activeUser');
    if (activeUser) {
      setUser(JSON.parse(activeUser));
    }
  }, []);

  const login = (email, password) => {
    const storedUser = JSON.parse(localStorage.getItem(email));
    if (storedUser && storedUser.password === password) {
      setUser(storedUser);
      return true;
    }
    return false;
  }

  const setActiveUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('activeUser', JSON.stringify(updatedUser));

    // Store posts in localStorage if 'Remember Me' is true
    if (updatedUser.rememberMe) {
      localStorage.setItem(updatedUser.email + '_posts', JSON.stringify(updatedUser.posts || []));
    }
  }

  const addPost = (postContent, mediaType) => {
    if (user?.rememberMe) {
      const newPost = { content: postContent, mediaType };
      const updatedPosts = [...(user.posts || []), newPost];

      // Update user object with new posts
      const updatedUser = { ...user, posts: updatedPosts };
      setActiveUser(updatedUser); // Store updated user with posts in localStorage
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('activeUser');
    localStorage.removeItem('active');
    localStorage.removeItem('rememberedUser');
  }

  return (
    <UserContext.Provider value={{ user, login, setActiveUser, addPost, logout }}>
      {children}
    </UserContext.Provider>
  );
}