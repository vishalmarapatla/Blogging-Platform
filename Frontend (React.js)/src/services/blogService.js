import axios from 'axios';

const API_URL = 'http://localhost:5000/api/blogs';

// Get all blogs
const getBlogs = async (queryParams = {}) => {
  const response = await axios.get(API_URL, { params: queryParams });
  return response.data;
};

// Get single blog
const getBlog = async (id) => {
  const response = await axios.get(API_URL + '/' + id);
  return response.data;
};

// Create blog
const createBlog = async (blogData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  };
  
  const response = await axios.post(API_URL, blogData, config);
  return response.data;
};

// Update blog
const updateBlog = async (id, blogData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  };
  
  const response = await axios.put(API_URL + '/' + id, blogData, config);
  return response.data;
};

// Delete blog
const deleteBlog = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.delete(API_URL + '/' + id, config);
  return response.data;
};

// Like blog
const likeBlog = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.put(API_URL + '/' + id + '/like', {}, config);
  return response.data;
};

const blogService = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog
};

export default blogService;
