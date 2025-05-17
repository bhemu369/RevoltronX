# Blog Editor Backend

This is the backend API for the Blog Editor platform built with Node.js, Express, and MongoDB.

## Setup and Running

1. Create a `.env` file in the root directory with the following variables:
```
PORT=4000
MONGO_URI=mongodb://localhost:27017/blog-editor
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm run dev
```

4. Start in production mode:
```
npm start
```

## API Endpoints

### Blogs

- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get a specific blog by ID
- `POST /api/blogs/save-draft` - Save a draft
- `POST /api/blogs/publish` - Publish a blog

## Database Schema

### Blog

- `title` (String) - The blog title
- `content` (String) - The blog content
- `tags` (Array of Strings) - Tags associated with the blog
- `status` (String, enum: ['draft', 'published']) - Publication status
- `createdAt` (Date) - When the blog was created
- `updatedAt` (Date) - When the blog was last updated

## Project Structure

- `config/` - Configuration files
  - `db.js` - Database connection setup
- `controllers/` - Request handlers
  - `blogController.js` - Blog-related controllers
- `models/` - Mongoose models
  - `Blog.js` - Blog schema and model
- `routes/` - API routes
  - `blogRoutes.js` - Blog-related routes
- `middleware/` - Express middleware (for JWT auth if implemented) 