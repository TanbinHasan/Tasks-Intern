import { createSlice } from '@reduxjs/toolkit';

// Helper functions from your PostContext
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

const updatePostTimeAgo = (post) => ({
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
});

const initialState = {
  posts: [],
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    
    addPost: (state, action) => {
      const { text, email, name } = action.payload;
      const timestamp = Date.now();
      const newPostId = state.posts.length > 0 
        ? Math.max(...state.posts.map(post => post.id)) + 1 
        : 1;
      
      // Create base post object
      const newPost = {
        id: newPostId,
        text,
        email,
        name,
        likes: 0,
        likedBy: [],
        comments: [],
        timestamp,
        timeAgo: timeAgo(timestamp),
      };
      
      // Handle multiple media items
      if (action.payload.mediaItems && action.payload.mediaItems.length > 0) {
        newPost.mediaItems = action.payload.mediaItems;
        
        // For backward compatibility, also set mediaType and mediaUrl if there's only one item
        if (action.payload.mediaItems.length === 1) {
          const firstItem = action.payload.mediaItems[0];
          newPost.mediaType = firstItem.type;
          newPost.mediaUrl = firstItem.url;
        }
      } 
      // Handle single media (backward compatibility)
      else if (action.payload.mediaType && action.payload.mediaData) {
        newPost.mediaType = action.payload.mediaType;
        newPost.mediaUrl = action.payload.mediaData.url || null;
        // Create mediaItems array for consistent structure
        newPost.mediaItems = [{
          type: action.payload.mediaType,
          url: action.payload.mediaData.url || null
        }];
      } else {
        // No media
        newPost.mediaItems = [];
      }
      
      state.posts.unshift(newPost);
      localStorage.setItem('posts', JSON.stringify(state.posts));
    },

    editPost: (state, action) => {
      const { id, newText } = action.payload;
      const index = state.posts.findIndex(post => post.id === id);
      
      if (index !== -1) {
        const post = state.posts[index];
        const updatedPost = {
          ...post,
          text: newText !== undefined ? newText : post.text,
        };
        
        // Handle multiple media items
        if (action.payload.newMediaItems !== undefined) {
          updatedPost.mediaItems = action.payload.newMediaItems;
          
          // For backward compatibility, also update single media fields
          if (action.payload.newMediaItems.length === 1) {
            const firstItem = action.payload.newMediaItems[0];
            updatedPost.mediaType = firstItem.type;
            updatedPost.mediaUrl = firstItem.url;
          } else if (action.payload.newMediaItems.length === 0) {
            updatedPost.mediaType = null;
            updatedPost.mediaUrl = null;
          }
        } 
        // Handle single media (backward compatibility)
        else if (action.payload.newMediaType !== undefined) {
          updatedPost.mediaType = action.payload.newMediaType;
          updatedPost.mediaUrl = action.payload.newMediaUrl?.url || action.payload.newMediaUrl;
          
          // Update mediaItems array for consistency
          if (updatedPost.mediaType && updatedPost.mediaUrl) {
            updatedPost.mediaItems = [{ 
              type: updatedPost.mediaType, 
              url: updatedPost.mediaUrl 
            }];
          } else {
            updatedPost.mediaItems = [];
          }
        }
        
        state.posts[index] = updatedPost;
        localStorage.setItem('posts', JSON.stringify(state.posts));
      }
    },

    deletePost: (state, action) => {
      const id = action.payload;
      state.posts = state.posts.filter(post => post.id !== id);
      localStorage.setItem('posts', JSON.stringify(state.posts));
    },

    likePost: (state, action) => {
      const { id, userEmail } = action.payload;
      if (!userEmail) return;
      const index = state.posts.findIndex(post => post.id === id);
      if (index !== -1) {
        const post = state.posts[index];
        // Initialize likedBy array if it doesn't exist
        const likedBy = Array.isArray(post.likedBy) ? [...post.likedBy] : [];
        // Check if user already liked this post
        const userLikedIndex = likedBy.indexOf(userEmail);
        const userLiked = userLikedIndex !== -1;
        if (userLiked) {
          // User already liked, so unlike
          likedBy.splice(userLikedIndex, 1);
        } else {
          // User hasn't liked, so add like
          likedBy.push(userEmail);
        }
        state.posts[index] = {
          ...post,
          likes: likedBy.length,
          likedBy: likedBy
        };
        localStorage.setItem('posts', JSON.stringify(state.posts));
      }
    },

    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      // Ensure comment has likedBy array
      const commentWithLikes = {
        ...comment,
        likes: 0,
        likedBy: []
      };
      const index = state.posts.findIndex(post => post.id === postId);
      if (index !== -1) {
        const post = state.posts[index];
        state.posts[index] = {
          ...post,
          comments: [commentWithLikes, ...post.comments]
        };
        localStorage.setItem('posts', JSON.stringify(state.posts));
      }
    },

    addReply: (state, action) => {
      const { postId, commentId, reply } = action.payload;
      // Ensure reply has likedBy array
      const replyWithLikes = {
        ...reply,
        likes: 0,
        likedBy: []
      };
      const postIndex = state.posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        const post = state.posts[postIndex];
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            const replies = comment.replies || [];
            return {
              ...comment,
              replies: [replyWithLikes, ...replies]
            };
          }
          return comment;
        });
        state.posts[postIndex] = {
          ...post,
          comments: updatedComments
        };
        localStorage.setItem('posts', JSON.stringify(state.posts));
      }
    },

    likeComment: (state, action) => {
      const { postId, commentId, userEmail } = action.payload;
      if (!userEmail) return;
      const postIndex = state.posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        const post = state.posts[postIndex];
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
            } else {
              // User hasn't liked, so add like
              likedBy.push(userEmail);
            }
            return {
              ...comment,
              likes: likedBy.length,
              likedBy: likedBy
            };
          }
          return comment;
        });
        state.posts[postIndex] = {
          ...post,
          comments: updatedComments
        };
        localStorage.setItem('posts', JSON.stringify(state.posts));
      }
    },

    likeReply: (state, action) => {
      const { postId, commentId, replyId, userEmail } = action.payload;
      if (!userEmail) return;
      const postIndex = state.posts.findIndex(post => post.id === postId);
      if (postIndex !== -1) {
        const post = state.posts[postIndex];
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            const updatedReplies = (comment.replies || []).map(reply => {
              if (reply.id === replyId) {
                // Initialize likedBy array if it doesn't exist
                const likedBy = Array.isArray(reply.likedBy) ? [...reply.likedBy] : [];
                // Check if user already liked this reply
                const userLikedIndex = likedBy.indexOf(userEmail);
                const userLiked = userLikedIndex !== -1;
                if (userLiked) {
                  // User already liked, so unlike
                  likedBy.splice(userLikedIndex, 1);
                } else {
                  // User hasn't liked, so add like
                  likedBy.push(userEmail);
                }
                return {
                  ...reply,
                  likes: likedBy.length,
                  likedBy: likedBy
                };
              }
              return reply;
            });
            return {
              ...comment,
              replies: updatedReplies
            };
          }
          return comment;
        });
        state.posts[postIndex] = {
          ...post,
          comments: updatedComments
        };
        localStorage.setItem('posts', JSON.stringify(state.posts));
      }
    },

    updateTimeAgo: (state) => {
      if (state.posts.length > 0) {
        state.posts = state.posts.map(post => updatePostTimeAgo(post));
        localStorage.setItem('posts', JSON.stringify(state.posts));
      }
    },

    loadPostsFromStorage: (state) => {
      const savedPosts = localStorage.getItem('posts');
      if (savedPosts) {
        try {
          state.posts = JSON.parse(savedPosts);
        } catch (e) {
          console.error("Failed to parse posts data", e);
          localStorage.removeItem('posts');
          state.posts = [];
        }
      }
    }
  }
});

// Export actions
export const { 
  setPosts,
  addPost,
  editPost,
  deletePost,
  likePost,
  addComment,
  addReply,
  likeComment,
  likeReply,
  updateTimeAgo,
  loadPostsFromStorage
} = postSlice.actions;

// Export selectors
export const selectAllPosts = (state) => state.post.posts;
export const selectPostById = (state, postId) => state.post.posts.find(post => post.id === postId);

export default postSlice.reducer;