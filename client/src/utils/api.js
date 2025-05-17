import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Blog endpoints
export const fetchBlogs = () => API.get('/blogs');
export const fetchBlogById = (id) => API.get(`/blogs/${id}`);
export const saveDraft = (blogData) => API.post('/blogs/save-draft', blogData);
export const publishBlog = (blogData) => API.post('/blogs/publish', blogData);

export default API; 