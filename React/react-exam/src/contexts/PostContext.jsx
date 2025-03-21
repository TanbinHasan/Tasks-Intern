import React, { createContext, useContext, useState, useEffect } from 'react';

const PostContext = createContext();

export const usePostContext = () => {
  return useContext(PostContext);
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const timeAgo = (timestamp) => {
    if (!timestamp) return 'Just now';
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

  const updateTimeAgo = () => {
    const updatedPosts = posts.map(post => ({
      ...post,
      timeAgo: timeAgo(post.timestamp),
      comments: post.comments.map(comment => ({
        ...comment,
        timeAgo: timeAgo(comment.timestamp),
        replies: comment.replies ? comment.replies.map(reply => ({
          ...reply,
          timeAgo: timeAgo(reply.timestamp),
        })) : []
      }))
    }));

    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const addPost = (text, mediaType, mediaFile, email, name) => {
    const timestamp = Date.now();
    // console.log(name);
    const newPostId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;
    
    const newPost = {
      id: newPostId,
      text,
      mediaType,
      mediaFile,
      email,
      name,
      likes: 0,
      likedBy: [], // Add this to track who liked the post
      comments: [],
      timestamp,
      timeAgo: timeAgo(timestamp),
    };
    
    const updatedPosts = [newPost, ...posts];
        
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const editPost = (id, newText, newMediaType, newMediaFile) => {
    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          text: newText || post.text,
          mediaType: newMediaType !== undefined ? newMediaType : post.mediaType,
          mediaFile: newMediaFile !== undefined ? newMediaFile : post.mediaFile,
        };
      }
      return post;
    });

    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
    return true;
  };

  const deletePost = (id) => {
    const filteredPosts = posts.filter(post => post.id !== id);
    localStorage.setItem('posts', JSON.stringify(filteredPosts));
    setPosts(filteredPosts);
    return true;
  };

  const likePost = (id, userEmail) => {
    if (!userEmail) return false;

    let newLikeStatus = false;
    
    const updatedPosts = posts.map(post => {
      if (post.id === id) {
        // Initialize likedBy array if it doesn't exist
        const likedBy = Array.isArray(post.likedBy) ? [...post.likedBy] : [];
        
        // Check if user already liked this post
        const userLikedIndex = likedBy.indexOf(userEmail);
        const userLiked = userLikedIndex !== -1;
        
        if (userLiked) {
          // User already liked, so unlike
          likedBy.splice(userLikedIndex, 1);
          newLikeStatus = false;
        } else {
          // User hasn't liked, so add like
          likedBy.push(userEmail);
          newLikeStatus = true;
        }
        
        return { 
          ...post, 
          likes: likedBy.length, 
          likedBy: likedBy 
        };
      }
      return post;
    });

    // Update localStorage immediately
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
    
    return newLikeStatus;
  };

  const addComment = (postId, comment) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = [comment, ...post.comments];
        return { ...post, comments: updatedComments };
      }
      return post;
    });

    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const addReply = (postId, commentId, reply) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            const replies = comment.replies || [];
            return {
              ...comment,
              replies: [reply, ...replies]
            };
          }
          return comment;
        });
        return { ...post, comments: updatedComments };
      }
      return post;
    });

    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const likeComment = (postId, commentId, userEmail) => {
    if (!userEmail) return false;
    
    let newLikeStatus = false;
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            // Initialize likedBy array if it doesn't exist
            const likedBy = Array.isArray(comment.likedBy) ? [...comment.likedBy] : [];
            
            // Check if user already liked this comment
            const userLikedIndex = likedBy.indexOf(userEmail);
            const userLiked = userLikedIndex !== -1;
            
            if (userLiked) {
              // User already liked, so unlike
              likedBy.splice(userLikedIndex, 1);
              newLikeStatus = false;
            } else {
              // User hasn't liked, so add like
              likedBy.push(userEmail);
              newLikeStatus = true;
            }
            
            return { 
              ...comment, 
              likes: likedBy.length, 
              likedBy: likedBy
            };
          }
          return comment;
        });
        return { ...post, comments: updatedComments };
      }
      return post;
    });

    // Update localStorage immediately
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
    
    return newLikeStatus;
  };

  // Load posts from localStorage on mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error("Failed to parse posts data", e);
        localStorage.removeItem('posts');
        setPosts([]);
      }
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
    <PostContext.Provider value={{ 
      posts, 
      addPost, 
      editPost,
      deletePost,
      likePost, 
      addComment,
      addReply,
      likeComment
    }}>
      {children}
    </PostContext.Provider>
  );
};