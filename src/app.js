const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const winston = require('./config/winston');
const routes = require('./routes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware for logging requests
app.use(morgan('combined', { stream: winston.stream }));

// Middleware for parsing JSON
app.use(express.json());

// Routes
app.use('/api', routes);

module.exports = app;
