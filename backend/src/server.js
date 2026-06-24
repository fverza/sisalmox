const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./database/connection');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // In production, replace with actual allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Health Check Route
app.get('/api/health', async (req, res) => {
  try {
    // Basic database connection test
    await sequelize.authenticate();
    return res.status(200).json({
      status: 'UP',
      timestamp: new Date(),
      services: {
        database: 'CONNECTED',
        api: 'RUNNING'
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'DOWN',
      timestamp: new Date(),
      services: {
        database: 'DISCONNECTED',
        api: 'RUNNING'
      },
      error: error.message
    });
  }
});

// Test Database Connection on startup
async function testDbConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database on startup:', error);
  }
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  testDbConnection();
});
