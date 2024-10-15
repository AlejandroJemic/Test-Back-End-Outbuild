const express = require('express');
const router = express.Router();
const {
  createSchedule,
  getScheduleWithActivities,
} = require('../controllers/scheduleController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, async (req, res) => {
  const { userId, name, imageUrl } = req.body;
  try {
    const schedule = await createSchedule(userId, name, imageUrl);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create schedule' });
  }
});

router.get('/user/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const schedules = await getSchedulesByUserId(userId);
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get schedules by user' });
  }
});

router.get('/:scheduleId', authenticateToken, async (req, res) => {
  const { scheduleId } = req.params;
  try {
    const schedule = await getScheduleWithActivities(scheduleId);
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get schedule' });
  }
});

module.exports = router;
