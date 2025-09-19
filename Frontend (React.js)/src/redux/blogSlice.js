import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from '../services/blogService';

const initialState = {
  blogs: [],
  blog: null,
  pagination: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: ''
};

// Get all blogs
export const getBlogs = createAsyncThunk(
  'blogs/getAll',
  async (queryParams, thunkAPI) => {
    try {
      return await blogService.getBlogs(queryParams);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single blog
export const getBlog = createAsyncThunk(
  'blogs/getOne',
  async (id, thunkAPI) => {
    try {
      return await blogService.getBlog(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create blog
export const createBlog = createAsyncThunk(
  'blogs/create',
  async (blogData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await blogService.createBlog(blogData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update blog
export const updateBlog = createAsyncThunk(
  'blogs/update',
  async ({ id, blogData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await blogService.updateBlog(id, blogData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete blog
export const deleteBlog = createAsyncThunk(
  'blogs/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await blogService.deleteBlog(id, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Like blog
export const likeBlog = createAsyncThunk(
  'blogs/like',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await blogService.likeBlog(id, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const blogSlice = createSlice({
  name: 'blogs',
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
      .addCase(getBlogs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blogs = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blog = action.payload.data;
      })
      .addCase(getBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blogs.unshift(action.payload.data);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blog = action.payload.data;
        state.blogs = state.blogs.map(blog =>
          blog._id === action.payload.data._id ? action.payload.data : blog
        );
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBlog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload.id);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        if (state.blog && state.blog._id === action.payload.data._id) {
          state.blog = action.payload.data;
        }
        state.blogs = state.blogs.map(blog =>
          blog._id === action.payload.data._id ? action.payload.data : blog
        );
      });
  }
});

export const { reset } = blogSlice.actions;
export default blogSlice.reducer;
