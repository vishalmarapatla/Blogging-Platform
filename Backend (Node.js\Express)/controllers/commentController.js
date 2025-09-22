const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const asyncHandler = require('express-async-handler');

// @desc    Add comment to blog
// @route   POST /api/blogs/:blogId/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.blogId);

  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }

  // Add user and blog to req.body
  req.body.user = req.user.id;
  req.body.blog = req.params.blogId;

  const comment = await Comment.create(req.body);

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc    Get all comments for a blog
// @route   GET /api/blogs/:blogId/comments
// @access  Public
exports.getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ blog: req.params.blogId })
    .populate({
      path: 'user',
      select: 'username profilePicture'
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return res.status(404).json({ success: false, message: 'Comment not found' });
  }

  // Make sure user is comment owner or admin
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Not authorized to delete this comment' });
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
