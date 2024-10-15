const pool = require('../config/db');
const { scheduleToDTO, scheduleWithActivitiesToDTO } = require('../models/dto');

/**
 * Creates a new schedule in the database and returns a DTO.
 * @param {number} userId - The ID of the user that owns the schedule.
 * @param {string} name - The name of the schedule.
 * @param {string} imageUrl - The URL of the image associated with the schedule.
 * @returns {Promise<Object>} The newly created schedule DTO.
 */
async function createSchedule(userId, name, imageUrl) {
  const query = `
    INSERT INTO schedules (user_id, name, image_url) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, name, imageUrl]);
  return scheduleToDTO(result.rows[0]);
}

/**
 * Retrieves all schedules for a user and returns them as DTOs.
 * @param {number} userId - The ID of the user to retrieve schedules for.
 * @returns {Promise<Array>} An array of schedule DTOs.
 */
async function getSchedulesByUserId(userId) {
  const query = 'SELECT * FROM schedules WHERE user_id = $1';
  const result = await pool.query(query, [userId]);

  return result.rows.map(scheduleToDTO);
}

/**
 * Retrieves a schedule and its associated activities and returns them as DTOs.
 * @param {number} scheduleId - The ID of the schedule to retrieve.
 * @returns {Promise<Object>} The schedule with activities DTO.
 */
async function getScheduleWithActivities(scheduleId) {
  const scheduleQuery = 'SELECT * FROM schedules WHERE id = $1';
  const activitiesQuery = 'SELECT * FROM activities WHERE schedule_id = $1';

  const scheduleResult = await pool.query(scheduleQuery, [scheduleId]);
  const activitiesResult = await pool.query(activitiesQuery, [scheduleId]);

  if (scheduleResult.rows.length === 0) {
    throw new Error('Schedule not found');
  }

  return scheduleWithActivitiesToDTO(
    scheduleResult.rows[0],
    activitiesResult.rows
  );
}

module.exports = {
  createSchedule,
  getSchedulesByUserId,
  getScheduleWithActivities,
};
