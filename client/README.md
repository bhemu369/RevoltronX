# Blog Editor Frontend

This is the frontend of the Blog Editor platform built with React and Vite.

## Setup and Running

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

3. Build for production:
```
npm run build
```

## Project Structure

- `src/components/` - Reusable UI components
  - `Navbar.jsx` - Navigation bar
  - `BlogCard.jsx` - Card component for displaying blog previews
- `src/pages/` - Page components
  - `BlogList.jsx` - Page showing all blogs (drafts and published)
  - `BlogEditor.jsx` - Page for creating and editing blogs
- `src/utils/` - Utility functions
  - `api.js` - API integrations
  - `debounce.js` - Debounce function for auto-save

## Features

- Blog editor with title, content, and tags inputs
- Auto-save functionality
  - Debounced auto-save after 5 seconds of inactivity
  - Interval auto-save every 30 seconds
- Toast notifications for save status
- Responsive UI with TailwindCSS 