const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: ''
  },
  content: {
    type: String,
    trim: true,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Blog', blogSchema); 