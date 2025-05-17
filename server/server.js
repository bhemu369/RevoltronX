require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const blogRoutes = require('./routes/blogRoutes');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', blogRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Blog Editor API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 