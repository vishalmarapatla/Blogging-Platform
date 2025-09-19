import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from '../services/commentService';

const initialState = {
  comments: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

// Get comments for a blog
export const getComments = createAsyncThunk(
  'comments/getAll',
  async (blogId, thunkAPI) => {
    try {
      return await commentService.getComments(blogId);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add comment
export const addComment = createAsyncThunk(
  'comments/create',
  async ({ blogId, content }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await commentService.addComment(blogId, content, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete comment
export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (commentId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await commentService.deleteComment(commentId, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = action.payload.data;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments.unshift(action.payload.data);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.comments = state.comments.filter(comment => comment._id !== action.payload.id);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { reset } = commentSlice.actions;
export default commentSlice.reducer;
