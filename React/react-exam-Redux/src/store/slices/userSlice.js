import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state based on your UserContext
const initialState = {
  user: null,
  userReactions: {},
};

// Async thunks for actions that were in UserContext
export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const storedUserJSON = localStorage.getItem(email);
      if (!storedUserJSON) {
        console.error("No user found with this email");
        return rejectWithValue("Invalid email or password");
      }
      const storedUser = JSON.parse(storedUserJSON);
      if (storedUser && storedUser.password === password) {
        // Store active user in localStorage
        localStorage.setItem('activeUser', JSON.stringify(storedUser));
        
        // Load user's reactions
        const savedReactions = localStorage.getItem(`userReactions_${email}`);
        const reactions = savedReactions ? JSON.parse(savedReactions) : {};
        
        return {
          user: storedUser,
          userReactions: reactions
        };
      }
      return rejectWithValue("Invalid email or password");
    } catch (error) {
      console.error("Error during login:", error);
      return rejectWithValue("Login failed");
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('activeUser', JSON.stringify(action.payload));
    },

    logoutUser: (state) => {
      state.user = null;
      state.userReactions = {};
      localStorage.removeItem('activeUser');
    },

    setReaction: (state, action) => {
      const { type, id, hasReacted } = action.payload;
      if (!state.user || !state.user.email) return;
      const reactionKey = `${type}_${id}`;
      state.userReactions[reactionKey] = hasReacted;
      // Save to localStorage
      localStorage.setItem(`userReactions_${state.user.email}`, JSON.stringify(state.userReactions));
    },

    syncWithLocalStorage: (state) => {
      const activeUser = localStorage.getItem('activeUser');
      if (activeUser) {
        try {
          const userData = JSON.parse(activeUser);
          state.user = userData;
          if (userData && userData.email) {
            const savedReactions = localStorage.getItem(`userReactions_${userData.email}`);
            if (savedReactions) {
              state.userReactions = JSON.parse(savedReactions);
            } else {
              state.userReactions = {};
            }
          }
        } catch (e) {
          console.error("Failed to parse user data", e);
          localStorage.removeItem('activeUser');
          state.user = null;
          state.userReactions = {};
        }
      } else {
        state.user = null;
        state.userReactions = {};
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userReactions = action.payload.userReactions;
      });
  }
});

// Export actions
export const { setUser, logoutUser, setReaction, syncWithLocalStorage } = userSlice.actions;

// Export selectors
export const selectUser = (state) => state.user.user;
export const selectUserReactions = (state) => state.user.userReactions;

// Selector for checking if user has reacted to content
export const selectHasReacted = (state, type, id) => {
  if (!state.user.user || !state.user.user.email) return false;
  const reactionKey = `${type}_${id}`;
  return !!state.user.userReactions[reactionKey];
};

export default userSlice.reducer;