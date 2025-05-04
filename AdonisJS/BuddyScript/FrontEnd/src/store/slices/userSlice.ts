import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import conf from '../../conf/conf';
import { clearPostState } from './postSlice'; // Import clearPostState action

// Define types
export interface User {
  id?: number;
  name?: string;
  email?: string;
}

interface UserState {
  user: User | null;
  userReactions: Record<string, boolean>;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  user: null,
  userReactions: {},
  loading: false,
  error: null
};

// Login payload interface
interface LoginCredentials {
  email: string;
  password: string;
}

// Reaction payload interface
interface ReactionPayload {
  type: string;
  id: number;
  hasReacted: boolean;
}

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: LoginCredentials, { rejectWithValue, dispatch }) => {
    try {
      // IMPORTANT: Clear everything first to prevent previous user data from showing
      dispatch(clearUserState());
      
      const response = await fetch(`${conf.apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        return rejectWithValue(errorData.message || "Invalid credentials");
      }

      const userData = await response.json();
      console.log("Login successful, user data:", userData);
      
      return userData;
    } catch (error) {
      console.error("Error during login:", error);
      return rejectWithValue("Login failed");
    }
  }
);

export const isLoggedIn = createAsyncThunk(
  'user/isLoggedIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${conf.apiUrl}/auth/is-logged-in`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.log('User is not logged in, status:', response.status);
        return rejectWithValue('Not authenticated');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Auth check error:', error);
      return rejectWithValue('Authentication check failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      console.log('Attempting to logout...'); 
      
      dispatch(clearUserState());
      dispatch(clearPostState());
      
      const response = await fetch(`${conf.apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        console.error('Logout failed with status:', response.status);
        return rejectWithValue('Logout failed');
      }

      return null;
    } catch (error) {
      console.error('Logout error:', error);
      return rejectWithValue('Logout failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },

    clearUserState: (state) => {
      state.user = null;
      state.userReactions = {};
      state.loading = false;
      state.error = null;
    },

    setReaction: (state, action: PayloadAction<ReactionPayload>) => {
      const { type, id, hasReacted } = action.payload;
      if (!state.user) return;
      const reactionKey = `${type}_${id}`;
      state.userReactions[reactionKey] = hasReacted;
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.userReactions = {}; // Reset reactions on login
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(isLoggedIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(isLoggedIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(isLoggedIn.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.userReactions = {}; // Clear reactions if not logged in
      })
      
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.userReactions = {};
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setUser, clearUserState, setReaction, clearError } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.user;
export const selectUserReactions = (state: RootState) => state.user.userReactions;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

export const selectHasReacted = (state: RootState, type: string, id: number) => {
  if (!state.user.user) return false;
  const reactionKey = `${type}_${id}`;
  return !!state.user.userReactions[reactionKey];
};

export default userSlice.reducer;