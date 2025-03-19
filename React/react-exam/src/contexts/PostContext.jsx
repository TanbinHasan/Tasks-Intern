import React, { createContext, useContext, useState, useEffect } from 'react';

const PostContext = createContext();

export const usePostContext = () => {
  return useContext(PostContext);
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]); // Initialize posts as an array

  // Helper function to format time (e.g., "5 minutes ago")
  const timeAgo = (timestamp) => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);

    if (minutes < 1) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Function to update timeAgo for all posts
  const updateTimeAgo = () => {
    const updatedPosts = posts.map(post => ({
      ...post,
      timeAgo: timeAgo(post.timestamp)
    }));

    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts)); // Store posts in localStorage
  };

  const addPost = (text, mediaType, mediaFile, email) => {
    const timestamp = Date.now(); // Capture current time for the timestamp
    
    const newPostId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;
    
    const newPost = {
      id: newPostId,
      text,
      mediaType,
      mediaFile, // Ensure the media file is passed here
      email,
      likes: 0,
      comments: [],
      timestamp,
      timeAgo: timeAgo(timestamp),
    };
    
    const updatedPosts = [newPost, ...posts]; // Add new post at the beginning
    
    console.log('Updated posts:', updatedPosts); // Verify mediaFile is stored correctly
    
    localStorage.setItem('posts', JSON.stringify(updatedPosts)); // Store updated posts in localStorage
    setPosts(updatedPosts);
  };
  
  const likePost = (id) => {
    const updatedPosts = posts.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );

    localStorage.setItem('posts', JSON.stringify(updatedPosts)); // Store updated posts in localStorage
    setPosts(updatedPosts);
  };

  const addComment = (id, comment) => {
    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        const updatedComments = [comment, ...post.comments]; // Add new comment at the top
        return { ...post, comments: updatedComments };
      }
      return post;
    });

    localStorage.setItem('posts', JSON.stringify(updatedPosts)); // Store updated posts in localStorage
    setPosts(updatedPosts);
  };

  // Load posts from localStorage on initial render
  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts)); // Ensure the posts are loaded as an array
    }
  }, []);

  // Update timeAgo every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (posts.length > 0) {
        updateTimeAgo();
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [posts]);

  return (
    <PostContext.Provider value={{ posts, addPost, likePost, addComment }}>
      {children}
    </PostContext.Provider>
  );
};