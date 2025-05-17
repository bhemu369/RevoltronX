import axios from 'axios';

// Use environment variable for API base URL, fall back to /api for development with proxy
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const API = axios.create({
  baseURL,
});

// Blog endpoints
export const fetchBlogs = () => API.get('/blogs');
export const fetchBlogById = (id) => API.get(`/blogs/${id}`);
export const saveDraft = (blogData) => API.post('/blogs/save-draft', blogData);
export const publishBlog = (blogData) => API.post('/blogs/publish', blogData);
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

export default API; 