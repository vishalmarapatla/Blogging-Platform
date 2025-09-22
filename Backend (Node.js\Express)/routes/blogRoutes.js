const express = require('express');
const { 
  getBlogs, 
  getBlog, 
  createBlog, 
  updateBlog, 
  deleteBlog,
  likeBlog
} = require('../controllers/blogController');

const { protect } = require('../middleware/auth');

// Include comment router
const commentRouter = require('./commentRoutes');

const router = express.Router();

// Re-route into comment router
router.use('/:blogId/comments', commentRouter);

router
  .route('/')
  .get(getBlogs)
  .post(protect, createBlog);

router
  .route('/:id')
  .get(getBlog)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

router.route('/:id/like').put(protect, likeBlog);

module.exports = router;
