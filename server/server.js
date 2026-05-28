const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const jobRoutes = require('./routes/jobRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const cron = require('node-cron');
const ingestData = require('./utils/dataIngestion');

// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Run data ingestion immediately on server startup
    // (This is perfect for free hosting like Render that wakes up when the site is loaded)
    console.log('Running data ingestion on server startup...');
    ingestData(true).catch(console.error);

  } catch (err) {
    console.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/jobs', jobRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('GeoJob India API is running');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
