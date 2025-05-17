const Blog = require('../models/Blog');

// Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ updatedAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

// Get a blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};

// Save or update a draft
exports.saveDraft = async (req, res) => {
  try {
    const { _id, title, content, tags, status } = req.body;
    
    // If blog already exists, update it
    if (_id) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        _id,
        { title, content, tags, status: 'draft' },
        { new: true }
      );
      
      return res.status(200).json(updatedBlog);
    }
    
    // Create new blog draft
    const newBlog = new Blog({
      title,
      content,
      tags,
      status: 'draft'
    });
    
    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error saving draft:', error);
    res.status(500).json({ message: 'Failed to save draft' });
  }
};

// Publish a blog
exports.publishBlog = async (req, res) => {
  try {
    const { _id, title, content, tags } = req.body;
    
    // If blog already exists, update it
    if (_id) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        _id,
        { title, content, tags, status: 'published' },
        { new: true }
      );
      
      return res.status(200).json(updatedBlog);
    }
    
    // Create new published blog
    const newBlog = new Blog({
      title,
      content,
      tags,
      status: 'published'
    });
    
    const publishedBlog = await newBlog.save();
    res.status(201).json(publishedBlog);
  } catch (error) {
    console.error('Error publishing blog:', error);
    res.status(500).json({ message: 'Failed to publish blog' });
  }
}; 