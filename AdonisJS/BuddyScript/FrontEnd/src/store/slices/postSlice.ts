import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import conf from '../../conf/conf';
import { setReaction } from './userSlice';

// Define types
export interface MediaItem {
  id?: number;
  post_id?: number;
  type: string;
  url: string;
}

export interface Reply {
  id: number;
  comment_id: number;
  user_id: number;
  text: string;
  timestamp: number;
  timeAgo: string;
  likes: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Comment {
  username: string;
  id: number;
  post_id: number;
  user_id: number;
  text: string;
  timestamp: number;
  timeAgo: string;
  likes: number;
  replies: Reply[];
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Like {
  id: number;
  postId: number;
  userId: number;
  timestamp: number;
  createdAt: string;
}

export interface Post {
  id: number;
  user_id: number;
  text: string;
  timestamp: number;
  timeAgo: string;
  likes: Like[];
  comments: Comment[];
  mediaItems?: MediaItem[];
  user?: {
    id: number;
    name: string;
    email: string;
  };
  isLikedByCurrentUser?: boolean;
}

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

interface LikeActionPayload {
  postId: number;
  isLiked: boolean;
}

// Helper functions
const timeAgo = (timestamp: number): string => {
  if (!timestamp) return 'Just now';
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp * 1000) / 1000);
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

const updatePostTimeAgo = (post: Post): Post => {
  // Check if post is valid
  if (!post) return post;

  return {
    ...post,
    timeAgo: timeAgo(post.timestamp),
    comments: Array.isArray(post.comments)
      ? post.comments.map(comment => ({
        ...comment,
        timeAgo: timeAgo(comment.timestamp),
        replies: Array.isArray(comment.replies)
          ? comment.replies.map(reply => ({
            ...reply,
            timeAgo: timeAgo(reply.timestamp),
          }))
          : []
      }))
      : []
  };
};

const initialState: PostState = {
  posts: [],
  loading: false,
  error: null
};

export const fetchPosts = createAsyncThunk(
  'post/fetchPosts',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const currentUser = state.user.user;
      
      // Check if posts are already loaded and not currently loading
      if (state.post.posts.length > 0 && !state.post.loading) {
        console.log('Posts already loaded, skipping fetch');
        return state.post.posts;
      }
      
      console.log('Fetching posts from API');
      // Get all posts
      const response = await fetch(`${conf.apiUrl}/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const responseData = await response.json();

      if (!responseData.data) {
        console.error('Invalid response format:', responseData);
        return []; 
      }

      const posts = responseData.data;
      
      // If user is logged in, check which posts they've liked
      if (currentUser && currentUser.id) {
        for (const post of posts) {
          // If post already has isLikedByCurrentUser flag, sync it to Redux store
          if (post.isLikedByCurrentUser !== undefined) {
            dispatch(setReaction({
              type: 'post',
              id: post.id,
              hasReacted: post.isLikedByCurrentUser
            }));
          }
        }
      }

      return Array.isArray(posts)
        ? posts.map((post: Post) => updatePostTimeAgo(post))
        : [];
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      return rejectWithValue(error.message || 'Failed to fetch posts');
    }
  }
);

export const fetchPostById = createAsyncThunk(
  'post/fetchPostById',
  async (postId: number, { rejectWithValue, dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const currentUser = state.user.user;
      
      // Check if we already have the complete post data
      const existingPost = state.post.posts.find(p => p.id === postId);
      if (existingPost && existingPost.comments && existingPost.comments.length > 0) {
        console.log(`Post ${postId} already loaded with comments, skipping fetch`);
        return existingPost;
      }
      
      console.log(`Fetching post ${postId} from API`);
      const response = await fetch(`${conf.apiUrl}/posts/${postId}/full`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }

      const responseData = await response.json();
      const post = responseData.data;

      // If user is logged in and post has isLikedByCurrentUser flag, sync it to Redux
      if (currentUser && currentUser.id && post && post.isLikedByCurrentUser !== undefined) {
        dispatch(setReaction({
          type: 'post',
          id: post.id,
          hasReacted: post.isLikedByCurrentUser
        }));
      }

      return updatePostTimeAgo(post);
    } catch (error: any) {
      console.error(`Error fetching post ${postId}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch post');
    }
  }
);

export const createPost = createAsyncThunk(
  'post/createPost',
  async (postData: { text: string, mediaItems?: MediaItem[] }, { rejectWithValue, getState }) => {
    try {
      // First create the post
      const postResponse = await fetch(`${conf.apiUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text: postData.text })
      });

      if (!postResponse.ok) {
        const errorData = await postResponse.json();
        console.error('Server error:', errorData);
        throw new Error(errorData.message || 'Failed to create post');
      }

      const post = await postResponse.json();
      const postId = post.data.id;

      // If there are media items, create them
      if (postData.mediaItems && postData.mediaItems.length > 0) {
        for (const mediaItem of postData.mediaItems) {
          const mediaResponse = await fetch(`${conf.apiUrl}/media`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              post_id: postId,
              type: mediaItem.type,
              url: mediaItem.url
            })
          });

          if (!mediaResponse.ok) {
            console.error('Failed to add media item');
          }
        }
      }

      // Immediately fetch the complete post with user data
      try {
        const fullPostResponse = await fetch(`${conf.apiUrl}/posts/${postId}/full`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (fullPostResponse.ok) {
          const fullPostData = await fullPostResponse.json();
          return updatePostTimeAgo(fullPostData.data);
        }
      } catch (error) {
        console.error('Error fetching complete post:', error);
        // Continue with fallback below
      }

      // Fallback: Get the current user from Redux state to include with the post
      const state = getState() as RootState;
      const currentUser = state.user.user;

      // Create a properly typed user object from the current user
      const userObject = currentUser ? {
        id: currentUser.id || 0,
        name: currentUser.name || 'Current User',
        email: currentUser.email || ''
      } : undefined;

      // Return the new post with user information from Redux state
      return {
        id: postId,
        user_id: post.data.user_id || (currentUser?.id || 0),
        text: postData.text,
        timestamp: Math.floor(Date.now() / 1000),
        timeAgo: 'Just now',
        likes: [],
        comments: [],
        mediaItems: postData.mediaItems || [],
        user: userObject
      };
    } catch (error: any) {
      console.error('Error creating post:', error);
      return rejectWithValue(error.message || 'Failed to create post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async (postData: { id: number, text: string, mediaItems?: MediaItem[] }, { rejectWithValue }) => {
    try {
      // Update the post text
      const postResponse = await fetch(`${conf.apiUrl}/posts/${postData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ text: postData.text })
      });

      if (!postResponse.ok) {
        throw new Error('Failed to update post');
      }

      // For media items, we'd need proper endpoints to handle updates
      // This would typically involve deleting old media and adding new ones
      // Simplified version here assumes backend handles this

      // Fetch the updated post
      const updatedPostResponse = await fetch(`${conf.apiUrl}/posts/${postData.id}/full`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!updatedPostResponse.ok) {
        throw new Error('Failed to fetch updated post');
      }

      const updatedPostData = await updatedPostResponse.json();
      return updatePostTimeAgo(updatedPostData.data);
    } catch (error: any) {
      console.error(`Error updating post ${postData.id}:`, error);
      return rejectWithValue(error.message || 'Failed to update post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${conf.apiUrl}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      return postId;
    } catch (error: any) {
      console.error(`Error deleting post ${postId}:`, error);
      return rejectWithValue(error.message || 'Failed to delete post');
    }
  }
);

export const likePost = createAsyncThunk<LikeActionPayload, number>(
  'post/likePost',
  async (postId, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState;
    const user = state.user.user;
    const post = state.post.posts.find(p => p.id === postId);
    
    if (!user) return rejectWithValue('User not logged in') as any;
    
    if (post?.isLikedByCurrentUser) {
      const result = await dispatch(unlikePost(postId));
      return result.payload as LikeActionPayload;
    }
    
    try {
      const response = await fetch(`${conf.apiUrl}/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user_id: user.id })
      });

      if (!response.ok) {
        if (response.status === 400) {
          return { postId, isLiked: true };
        }
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to like post") as any;
      }

      // Update user reactions in Redux
      dispatch(setReaction({
        type: 'post',
        id: postId,
        hasReacted: true
      }));

      return { postId, isLiked: true };
    } catch (error: any) {
      console.error(`Error liking post ${postId}:`, error);
      return rejectWithValue(error.message || 'Failed to like post') as any;
    }
  }
);

export const unlikePost = createAsyncThunk<LikeActionPayload, number>(
  'post/unlikePost',
  async (postId, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as RootState;
    const user = state.user.user;
    
    if (!user) return rejectWithValue('User not logged in') as any;
    
    try {
      const response = await fetch(`${conf.apiUrl}/posts/${postId}/like`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user_id: user.id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || "Failed to unlike post") as any;
      }

      // Update user reactions in Redux
      dispatch(setReaction({
        type: 'post',
        id: postId,
        hasReacted: false
      }));

      return { postId, isLiked: false };
    } catch (error: any) {
      console.error(`Error unliking post ${postId}:`, error);
      return rejectWithValue(error.message || 'Failed to unlike post') as any;
    }
  }
);

export const addComment = createAsyncThunk(
  'post/addComment',
  async (commentData: { postId: number, text: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const user = state.user.user;
      
      if (!user?.id) {
        return rejectWithValue('User not authenticated');
      }
      
      const response = await fetch(`${conf.apiUrl}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          post_id: commentData.postId,
          text: commentData.text,
          user_id: user.id  // Include user_id in the request
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to add comment');
      }

      // Fetch updated post with new comment
      const postResponse = await fetch(`${conf.apiUrl}/posts/${commentData.postId}/full`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!postResponse.ok) {
        throw new Error('Failed to fetch updated post');
      }

      const postData = await postResponse.json();
      return {
        postId: commentData.postId,
        post: updatePostTimeAgo(postData.data)
      };
    } catch (error: any) {
      console.error(`Error adding comment to post ${commentData.postId}:`, error);
      return rejectWithValue(error.message || 'Failed to add comment');
    }
  }
);

export const addReply = createAsyncThunk(
  'post/addReply',
  async (replyData: { postId: number, commentId: number, text: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const user = state.user.user;
      
      if (!user?.id) {
        return rejectWithValue('User not authenticated');
      }
      
      const response = await fetch(`${conf.apiUrl}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          comment_id: replyData.commentId,
          text: replyData.text,
          user_id: user.id  // Include user_id in the request
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to add reply');
      }

      // Fetch updated post with new reply
      const postResponse = await fetch(`${conf.apiUrl}/posts/${replyData.postId}/full`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!postResponse.ok) {
        throw new Error('Failed to fetch updated post');
      }

      const postData = await postResponse.json();
      return {
        postId: replyData.postId,
        post: updatePostTimeAgo(postData.data)
      };
    } catch (error: any) {
      console.error(`Error adding reply to comment ${replyData.commentId}:`, error);
      return rejectWithValue(error.message || 'Failed to add reply');
    }
  }
);


export const likeComment = createAsyncThunk(
  'post/likeComment',
  async (data: { postId: number, commentId: number }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const user = state.user.user;
      
      if (!user?.id) {
        return rejectWithValue('User not authenticated');
      }
      
      const response = await fetch(`${conf.apiUrl}/comments/${data.commentId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to like comment');
      }

      // Fetch updated post with liked comment
      const postResponse = await fetch(`${conf.apiUrl}/posts/${data.postId}/full`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!postResponse.ok) {
        throw new Error('Failed to fetch updated post');
      }

      const postData = await postResponse.json();
      
      // Also update user's reaction in the state
      return {
        postId: data.postId,
        post: updatePostTimeAgo(postData.data),
        commentId: data.commentId,
        isLiked: true
      };
    } catch (error: any) {
      console.error(`Error liking comment ${data.commentId}:`, error);
      return rejectWithValue(error.message || 'Failed to like comment');
    }
  }
);

export const unlikeComment = createAsyncThunk(
  'post/unlikeComment',
  async (data: { postId: number, commentId: number }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const user = state.user.user;
      
      if (!user?.id) {
        return rejectWithValue('User not authenticated');
      }
      
      const response = await fetch(`${conf.apiUrl}/comments/${data.commentId}/like`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to unlike comment');
      }

      // Fetch updated post with unliked comment
      const postResponse = await fetch(`${conf.apiUrl}/posts/${data.postId}/full`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!postResponse.ok) {
        throw new Error('Failed to fetch updated post');
      }

      const postData = await postResponse.json();
      
      // Also update user's reaction in the state
      return {
        postId: data.postId,
        post: updatePostTimeAgo(postData.data),
        commentId: data.commentId,
        isLiked: false
      };
    } catch (error: any) {
      console.error(`Error unliking comment ${data.commentId}:`, error);
      return rejectWithValue(error.message || 'Failed to unlike comment');
    }
  }
);

export const likeReply = createAsyncThunk(
  'post/likeReply',
  async (data: { postId: number, commentId: number, replyId: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${conf.apiUrl}/replies/${data.replyId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to like reply');
      }

      // Fetch updated post with liked reply
      const postResponse = await fetch(`${conf.apiUrl}/posts/${data.postId}/full`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!postResponse.ok) {
        throw new Error('Failed to fetch updated post');
      }

      const postData = await postResponse.json();
      return {
        postId: data.postId,
        post: updatePostTimeAgo(postData.data)
      };
    } catch (error: any) {
      console.error(`Error liking reply ${data.replyId}:`, error);
      return rejectWithValue(error.message || 'Failed to like reply');
    }
  }
);

export const unlikeReply = createAsyncThunk(
  'post/unlikeReply',
  async (data: { postId: number, commentId: number, replyId: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${conf.apiUrl}/replies/${data.replyId}/like`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to unlike reply');
      }

      // Fetch updated post with unliked reply
      const postResponse = await fetch(`${conf.apiUrl}/posts/${data.postId}/full`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!postResponse.ok) {
        throw new Error('Failed to fetch updated post');
      }

      const postData = await postResponse.json();
      return {
        postId: data.postId,
        post: updatePostTimeAgo(postData.data)
      };
    } catch (error: any) {
      console.error(`Error unliking reply ${data.replyId}:`, error);
      return rejectWithValue(error.message || 'Failed to unlike reply');
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    updateTimeAgo: (state) => {
      if (state.posts.length > 0) {
        state.posts = state.posts.map(post => updatePostTimeAgo(post));
      }
    },
    syncPostLikes: (state, action: PayloadAction<{postId: number, isLiked: boolean}>) => {
      const { postId, isLiked } = action.payload;
      const post = state.posts.find(p => p.id === postId);
      if (post) {
        post.isLikedByCurrentUser = isLiked;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearPostState, (state) => {
        state.posts = [];
        state.loading = false;
        state.error = null;
      })
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch post by ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        const postIndex = state.posts.findIndex(post => post.id === action.payload.id);
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload;
        } else {
          state.posts.unshift(action.payload);
        }
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const postIndex = state.posts.findIndex(post => post.id === action.payload.id);
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(post => post.id !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(likePost.fulfilled, (state, action: PayloadAction<LikeActionPayload>) => {
        const { postId, isLiked } = action.payload;
        const postIndex = state.posts.findIndex(p => p.id === postId);
        
        if (postIndex !== -1) {
          // Update like status
          state.posts[postIndex].isLikedByCurrentUser = isLiked;
          // Increment likes count if needed
          if (isLiked) state.posts[postIndex].likes.length += 1;
        }
      })
      .addCase(unlikePost.fulfilled, (state, action: PayloadAction<LikeActionPayload>) => {
        const { postId, isLiked } = action.payload;
        const postIndex = state.posts.findIndex(p => p.id === postId);
        
        if (postIndex !== -1) {
          // Update like status
          state.posts[postIndex].isLikedByCurrentUser = isLiked;
          // Decrement likes count if needed
          if (!isLiked && state.posts[postIndex].likes.length > 0) 
            state.posts[postIndex].likes.length -= 1;
        }
      })

      // Add comment
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, post } = action.payload;
        const postIndex = state.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex] = post;
        }
      })

      // Add reply
      .addCase(addReply.fulfilled, (state, action) => {
        const { postId, post } = action.payload;
        const postIndex = state.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex] = post;
        }
      })

      // Like/unlike comment
      .addCase(likeComment.fulfilled, (state, action) => {
        const { postId, post } = action.payload;
        const postIndex = state.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex] = post;
        }
      })
      .addCase(unlikeComment.fulfilled, (state, action) => {
        const { postId, post } = action.payload;
        const postIndex = state.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex] = post;
        }
      })

      // Like/unlike reply
      .addCase(likeReply.fulfilled, (state, action) => {
        const { postId, post } = action.payload;
        const postIndex = state.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex] = post;
        }
      })
      .addCase(unlikeReply.fulfilled, (state, action) => {
        const { postId, post } = action.payload;
        const postIndex = state.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex] = post;
        }
      });
  }
});

// Export actions
export const {
  updateTimeAgo, syncPostLikes
} = postSlice.actions;

// Export selectors
export const selectAllPosts = (state: RootState) => state.post.posts;
export const selectPostById = (state: RootState, postId: number) =>
  state.post.posts.find(post => post.id === postId);
export const selectPostsLoading = (state: RootState) => state.post.loading;
export const selectPostsError = (state: RootState) => state.post.error;
export const clearPostState = createAction('post/clearPostState');
export default postSlice.reducer;