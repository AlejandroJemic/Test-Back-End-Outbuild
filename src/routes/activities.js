const express = require('express');
const router = express.Router();
const {
  createActivity,
  createMultipleActivities,
  getActivitiesByScheduleId,
} = require('../controllers/activityController');

router.post('/', async (req, res) => {
  const { scheduleId, name, startDate, endDate } = req.body;
  try {
    const activity = await createActivity(scheduleId, name, startDate, endDate);
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

router.post('/bulk', async (req, res) => {
  const { scheduleId, activities } = req.body;
  try {
    await createMultipleActivities(scheduleId, activities);
    res.status(201).json({ message: 'Activities created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create activities' });
  }
});

router.get('/:scheduleId/activities', async (req, res) => {
  const { scheduleId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const activities = await getActivitiesByScheduleId(scheduleId, page, limit);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get activities' });
  }
});

module.exports = router;
