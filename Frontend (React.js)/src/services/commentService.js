import axios from 'axios';

const API_URL = 'http://localhost:5000/api/blogs';

// Get comments for a blog
const getComments = async (blogId) => {
  const response = await axios.get(API_URL + '/' + blogId + '/comments');
  return response.data;
};

// Add comment
const addComment = async (blogId, content, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.post(API_URL + '/' + blogId + '/comments', { content }, config);
  return response.data;
};

// Delete comment
const deleteComment = async (commentId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.delete('http://localhost:5000/api/comments/' + commentId, config);
  return response.data;
};

const commentService = {
  getComments,
  addComment,
  deleteComment
};

export default commentService;
