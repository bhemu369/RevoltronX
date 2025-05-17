const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Get all blogs
router.get('/blogs', blogController.getBlogs);

// Get blog by ID
router.get('/blogs/:id', blogController.getBlogById);

// Save draft
router.post('/blogs/save-draft', blogController.saveDraft);

// Publish blog
router.post('/blogs/publish', blogController.publishBlog);

// Delete blog
router.delete('/blogs/:id', blogController.deleteBlog);

module.exports = router; 