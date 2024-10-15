const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const scheduleRoutes = require('./schedules');
const activityRoutes = require('./activities');

// Routes
router.use('/users', userRoutes);
router.use('/schedules', scheduleRoutes);
router.use('/activities', activityRoutes);

module.exports = router;
