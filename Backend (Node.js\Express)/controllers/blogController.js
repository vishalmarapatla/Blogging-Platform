const Blog = require('../models/Blog');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const cloudinary = require('../utils/cloudinary');

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = asyncHandler(async (req, res) => {
  req.body.author = req.user.id;
  
  // Handle image upload if provided
  if (req.files && req.files.coverImage) {
    const result = await cloudinary.uploader.upload(req.files.coverImage.tempFilePath, {
      folder: 'blog_covers'
    });
    req.body.coverImage = result.secure_url;
  }

  const blog = await Blog.create(req.body);

  res.status(201).json({
    success: true,
    data: blog
  });
});

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = asyncHandler(async (req, res) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Blog.find(JSON.parse(queryStr)).populate({
    path: 'author',
    select: 'username profilePicture'
  });

  // Search functionality
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    query = query.find({
      $or: [
        { title: searchRegex },
        { content: searchRegex }
      ]
    });
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Blog.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const blogs = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: blogs.length,
    pagination,
    data: blogs
  });
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate({
      path: 'author',
      select: 'username profilePicture bio'
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username profilePicture'
      }
    });

  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }

  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = asyncHandler(async (req, res) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }

  // Make sure user is blog owner
  if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Not authorized to update this blog' });
  }

  // Handle image upload if provided
  if (req.files && req.files.coverImage) {
    const result = await cloudinary.uploader.upload(req.files.coverImage.tempFilePath, {
      folder: 'blog_covers'
    });
    req.body.coverImage = result.secure_url;
  }

  req.body.updatedAt = Date.now();

  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: blog
  });
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }

  // Make sure user is blog owner
  if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Not authorized to delete this blog' });
  }

  await blog.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Like/Unlike a blog
// @route   PUT /api/blogs/:id/like
// @access  Private
exports.likeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' });
  }

  // Check if the blog has already been liked by this user
  const isLiked = blog.likes.includes(req.user.id);

  if (isLiked) {
    // Unlike the blog
    blog.likes = blog.likes.filter(like => like.toString() !== req.user.id);
  } else {
    // Like the blog
    blog.likes.push(req.user.id);
  }

  await blog.save();

  res.status(200).json({
    success: true,
    data: blog,
    isLiked: !isLiked
  });
});
