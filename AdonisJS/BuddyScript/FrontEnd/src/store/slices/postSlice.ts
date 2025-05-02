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
  likes: number | any[];
  replies: Reply[];
  user?: {
    id: number;
    name: string;
  };
}

export interface Like {
  id: number;
  postId: number;
  userId?: number; // Make it optional with the ? mark
  timestamp: number;
  createdAt: string;
  user?: {
    id: number;
    name: string;
  };
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
  commentCount?: number;
  hasMoreComments?: boolean;
}

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  commentsLoading: { [key: number]: boolean };
  pagination: {
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
  };
}

interface LikeActionPayload {
  postId: number;
  isLiked: boolean;
  currentUser?: {
    id: number;
    name: string;
    email?: string;
  };
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
  error: null,
  commentsLoading: {},
  pagination: {
    currentPage: 1,
    totalPages: 1,
    hasMore: false
  }
};

export const fetchPosts = createAsyncThunk(
  'post/fetchPosts',
  async (page: number = 1, { rejectWithValue, dispatch, getState, signal }) => {
    try {
      // Check if we're already fetching this page
      const state = getState() as RootState;
      const currentUser = state.user.user;

      // Skip fetching if we already have this page (to prevent duplicate requests)
      if (page > 1 && state.post.pagination.currentPage >= page) {
        console.log(`Page ${page} already loaded, skipping fetch`);
        return {
          posts: [],
          pagination: state.post.pagination
        };
      }

      console.log(`Fetching posts for page ${page}...`);
      const response = await fetch(`${conf.apiUrl}/posts?page=${page}&limit=5`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        signal, // Pass the AbortController signal to allow cancellation
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const responseData = await response.json();

      if (!responseData.data) {
        console.error('Invalid response format:', responseData);
        return { posts: [], pagination: { currentPage: page, totalPages: 1, hasMore: false } };
      }

      const posts = responseData.data;
      const meta = responseData.meta || {
        currentPage: page,
        lastPage: 1,
        hasMore: false
      };

      // Update state with like information from post data
      if (currentUser && currentUser.id) {
        for (const post of posts) {
          if (post.isLikedByCurrentUser !== undefined) {
            dispatch(setReaction({
              type: 'post',
              id: post.id,
              hasReacted: post.isLikedByCurrentUser
            }));
          }
        }
      }

      // Process and return the posts with the pagination metadata
      const processedPosts = Array.isArray(posts)
        ? posts.map((post: Post) => ({
          ...updatePostTimeAgo(post),
          commentCount: post.commentCount || 0,
          hasMoreComments: (post.commentCount || 0) > 10,
        }))
        : [];

      return {
        posts: processedPosts,
        pagination: {
          currentPage: meta.currentPage,
          totalPages: meta.lastPage || 1,
          hasMore: meta.hasMore
        }
      };
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
        return rejectWithValue('Fetch aborted');
      }

      console.error('Error fetching posts:', error);
      return rejectWithValue(error.message || 'Failed to fetch posts');
    }
  }
);


export const fetchPostComments = createAsyncThunk(
  'post/fetchPostComments',
  async ({ postId, offset = 0, limit = 5 }: { postId: number; offset?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${conf.apiUrl}/posts/${postId}/comments?offset=${offset}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await response.json();
      const comments = data.data || [];

      return {
        postId,
        comments: comments.map((comment: Comment) => ({
          ...comment,
          timeAgo: timeAgo(comment.timestamp),
          replies: Array.isArray(comment.replies)
            ? comment.replies.map(reply => ({
              ...reply,
              timeAgo: timeAgo(reply.timestamp),
            }))
            : []
        })),
        hasMore: data.hasMore || false
      };
    } catch (error: any) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      return rejectWithValue(error.message || 'Failed to fetch comments');
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

      const state = getState() as RootState;
      const currentUser = state.user.user;

      const userObject = currentUser ? {
        id: currentUser.id || 0,
        name: currentUser.name || 'Current User',
        email: currentUser.email || ''
      } : undefined;

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
  async (postData: { id: number, text: string, mediaItems?: MediaItem[] }, { rejectWithValue, getState }) => {
    try {
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

      const state = getState() as RootState;
      const currentPost = state.post.posts.find(p => p.id === postData.id);

      if (!currentPost) {
        throw new Error('Post not found in state');
      }

      const updatedPost: Post = {
        ...currentPost,
        text: postData.text,
        mediaItems: postData.mediaItems || currentPost.mediaItems,
        timestamp: Math.floor(Date.now() / 1000),
      };
      return updatePostTimeAgo(updatedPost);
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

      return {
        postId,
        isLiked: true,
        currentUser: {
          id: user.id || 0,
          name: user.name || 'Anonymous',
          email: user.email
        }
      };
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
    const post = state.post.posts.find(p => p.id === postId);

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

      const currentLikes = post?.likes || [];
      const updatedLikes = currentLikes.filter(like => {
        const likeUserId = like.userId || (like.user && like.user.id);
        return likeUserId !== user.id;
      });

      dispatch(setReaction({
        type: 'post',
        id: postId,
        hasReacted: false
      }));

      return {
        postId,
        isLiked: false,
        updatedLikes
      };
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
      const post = state.post.posts.find(p => p.id === commentData.postId);

      if (!user?.id) {
        return rejectWithValue('User not authenticated');
      }

      if (!post) {
        return rejectWithValue('Post not found in state');
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
          user_id: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to add comment');
      }

      const responseData = await response.json();
      const newComment = responseData.data;

      const commentToAdd: Comment = {
        id: newComment.id,
        post_id: commentData.postId,
        user_id: user.id,
        text: commentData.text,
        timestamp: Math.floor(Date.now() / 1000),
        timeAgo: 'Just now',
        likes: 0,
        replies: [],
        username: user.name || '',
        user: {
          id: user.id,
          name: user.name || '',
        }
      };

      const updatedPost: Post = {
        ...post,
        comments: [commentToAdd, ...post.comments],
        commentCount: (post.commentCount || 0) + 1
      };

      return {
        postId: commentData.postId,
        post: updatePostTimeAgo(updatedPost)
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
      const post = state.post.posts.find(p => p.id === replyData.postId);

      if (!user?.id) {
        return rejectWithValue('User not authenticated');
      }

      if (!post) {
        return rejectWithValue('Post not found in state');
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
          user_id: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to add reply');
      }

      const responseData = await response.json();
      const newReply = responseData.data;
      const replyToAdd: Reply = {
        id: newReply.id,
        comment_id: replyData.commentId,
        user_id: user.id,
        text: replyData.text,
        timestamp: Math.floor(Date.now() / 1000),
        timeAgo: 'Just now',
        likes: 0,
        user: {
          id: user.id,
          name: user.name || '',
        }
      };

      const updatedComments = post.comments.map(comment => {
        if (comment.id === replyData.commentId) {
          return {
            ...comment,
            replies: [replyToAdd, ...(comment.replies || [])]
          };
        }
        return comment;
      });

      const updatedPost: Post = {
        ...post,
        comments: updatedComments
      };

      return {
        postId: replyData.postId,
        post: updatePostTimeAgo(updatedPost)
      };
    } catch (error: any) {
      console.error(`Error adding reply to comment ${replyData.commentId}:`, error);
      return rejectWithValue(error.message || 'Failed to add reply');
    }
  }
);

export const likeComment = createAsyncThunk(
  'post/likeComment',
  async (data: { postId: number, commentId: number }, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const user = state.user.user;
      const post = state.post.posts.find(p => p.id === data.postId);

      if (!user?.id) {
        return rejectWithValue('User not authenticated');
      }

      if (!post) {
        return rejectWithValue('Post not found in state');
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

      const responseData = await response.json();
      const updatedPost = { ...post };
      updatedPost.comments = [...post.comments];
      const commentIndex = updatedPost.comments.findIndex(c => c.id === data.commentId);

      if (commentIndex !== -1) {
        const comment = { ...updatedPost.comments[commentIndex] };
        if (typeof comment.likes === 'number') {
          comment.likes += 1;
        } else if (Array.isArray(comment.likes)) {
          const newLike = {
            id: responseData?.data?.id || Date.now(),
            comment_id: data.commentId,
            user_id: user.id,
            timestamp: Math.floor(Date.now() / 1000),
            user: {
              id: user.id,
              name: user.name || '',
              email: user.email || ''
            }
          };
          comment.likes = [...comment.likes, newLike];
        }
        updatedPost.comments[commentIndex] = comment;
      }

      dispatch(setReaction({
        type: 'comment',
        id: data.commentId,
        hasReacted: true
      }));

      return {
        postId: data.postId,
        post: updatePostTimeAgo(updatedPost),
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
  async (data: { postId: number, commentId: number }, { rejectWithValue, getState, dispatch }) => {
    try {
      const state = getState() as RootState;
      const user = state.user.user;
      const post = state.post.posts.find(p => p.id === data.postId);

      if (!user?.id) {
        return rejectWithValue('User not authenticated');
      }
      
      if (!post) {
        return rejectWithValue('Post not found in state');
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
      
      const updatedPost = {...post};
      updatedPost.comments = [...post.comments];
      
      const commentIndex = updatedPost.comments.findIndex(c => c.id === data.commentId);
      
      if (commentIndex !== -1) {
        const comment = {...updatedPost.comments[commentIndex]};
        
        if (typeof comment.likes === 'number') {
          comment.likes = Math.max(0, comment.likes - 1);
        } else if (Array.isArray(comment.likes)) {
          comment.likes = comment.likes.filter(like => {
            if (typeof like !== 'object' || like === null) return true;
            
            const likeUserId = like.user_id !== undefined ? 
              like.user_id : (like.user && like.user.id);
              
            return likeUserId !== user.id;
          });
        }
        
        updatedPost.comments[commentIndex] = comment;
      }
      
      dispatch(setReaction({
        type: 'comment',
        id: data.commentId,
        hasReacted: false
      }));
      
      return {
        postId: data.postId,
        post: updatePostTimeAgo(updatedPost),
        commentId: data.commentId,
        isLiked: false
      };
    } catch (error: any) {
      console.error(`Error unliking comment ${data.commentId}:`, error);
      return rejectWithValue(error.message || 'Failed to unlike comment');
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
    syncPostLikes: (state, action: PayloadAction<{ postId: number, isLiked: boolean }>) => {
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
        // If it's the first page, replace posts; otherwise, append
        if (action.meta.arg === 1 || action.meta.arg === undefined) {
          state.posts = action.payload.posts;
        } else {
          const existingPostIds = state.posts.map(post => post.id);
          const newPosts = action.payload.posts.filter(
            (post: Post) => !existingPostIds.includes(post.id)
          );
          state.posts = [...state.posts, ...newPosts];
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
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

      .addCase(fetchPostComments.pending, (state, action) => {
        state.commentsLoading[action.meta.arg.postId] = true;
      })
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        const { postId, comments, hasMore } = action.payload;
        const postIndex = state.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          // If offset is 0, replace all comments, otherwise prepend new comments
          const currentComments = action.meta.arg.offset === 0 ? [] : state.posts[postIndex].comments;
          state.posts[postIndex] = {
            ...state.posts[postIndex],
            comments: [...comments, ...currentComments], // Prepend new comments
            hasMoreComments: hasMore
          };
        }
        state.commentsLoading[postId] = false;
      })
      .addCase(fetchPostComments.rejected, (state, action) => {
        state.commentsLoading[action.meta.arg.postId] = false;
      })

      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, isLiked, currentUser } = action.payload;
        const postIndex = state.posts.findIndex(p => p.id === postId);

        if (postIndex !== -1) {
          state.posts[postIndex].isLikedByCurrentUser = isLiked;

          if (isLiked && currentUser) {
            const newLike: Like = {
              id: Date.now(), // Temporary ID
              postId: postId,
              userId: currentUser.id,
              timestamp: Math.floor(Date.now() / 1000),
              createdAt: new Date().toISOString(),
              user: {
                id: currentUser.id,
                name: currentUser.name,
              }
            };

            state.posts[postIndex].likes.push(newLike);
          } else if (isLiked) {
            state.posts[postIndex].likes.length += 1;
          }
        }
      })

      .addCase(unlikePost.fulfilled, (state, action: PayloadAction<LikeActionPayload>) => {
        const { postId, isLiked } = action.payload;
        const postIndex = state.posts.findIndex(p => p.id === postId);

        if (postIndex !== -1) {
          state.posts[postIndex].isLikedByCurrentUser = isLiked;
          if (!isLiked && state.posts[postIndex].likes.length > 0)
            state.posts[postIndex].likes.length -= 1;
        }
      })

      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, post } = action.payload;
        const postIndex = state.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex] = post;
        }
      })

      .addCase(addReply.fulfilled, (state, action) => {
        const { postId, post } = action.payload;
        const postIndex = state.posts.findIndex(p => p.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex] = post;
        }
      })

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
  }
});

// Export actions
export const { updateTimeAgo, syncPostLikes } = postSlice.actions;

// Export selectors
export const selectPagination = (state: RootState) => state.post.pagination;
export const selectAllPosts = (state: RootState) => state.post.posts;
export const selectPostById = (state: RootState, postId: number) => state.post.posts.find(post => post.id === postId);
export const selectPostsLoading = (state: RootState) => state.post.loading;
export const selectPostsError = (state: RootState) => state.post.error;
export const clearPostState = createAction('post/clearPostState');

export default postSlice.reducer;