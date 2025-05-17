# Blog Editor Platform

A full-stack blog editor platform with auto-save functionality, drafts, and publishing capabilities.

## Features

- Create, edit, and publish blog posts
- Auto-save functionality
  - After 5 seconds of inactivity (debounced)
  - Every 30 seconds (interval fallback)
- Separate views for drafts and published posts
- Tagging system for blogs
- Toast notifications for user feedback

## Tech Stack

### Frontend
- React with Vite
- React Router for navigation
- TailwindCSS for styling
- Axios for API requests
- React Hot Toast for notifications

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT-based authentication (optional)

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```
git clone <repository-url>
cd RevoltronX
```

2. Install dependencies:
```
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Configure the database:
```
# Create a .env file in the server directory
# Add the following environment variables
PORT=4000
MONGO_URI=mongodb://localhost:27017/blog-editor
```

4. Start the development servers:

```
# Start the client (in the client directory)
cd client
npm run dev

# In a separate terminal, start the server
cd server
npm run dev
```

5. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

## API Endpoints

- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get a specific blog
- `POST /api/blogs/save-draft` - Save a draft
- `POST /api/blogs/publish` - Publish a blog

## Project Structure

```
RevoltronX/
├── client/               # Frontend React application
│   ├── public/           # Static files
│   └── src/              # React components and logic
│       ├── components/   # Reusable components
│       ├── pages/        # Page components
│       └── utils/        # Utility functions
│
├── server/               # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── middleware/       # Express middleware
``` 