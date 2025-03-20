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

  const addPost = (text, mediaType, mediaFile, email) => {
    const timestamp = Date.now();
    
    const newPostId = posts.length > 0 ? Math.max(...posts.map(post => post.id)) + 1 : 1;
    
    const newPost = {
      id: newPostId,
      text,
      mediaType,
      mediaFile,
      email,
      likes: 0,
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

  const likePost = (id) => {
    const updatedPosts = posts.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );

    localStorage.setItem('posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
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

  const likeComment = (postId, commentId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, likes: comment.likes + 1 };
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

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
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