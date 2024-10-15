const pool = require('../config/db');

/**
 * Creates a new activity in the database.
 * @param {number} scheduleId - The ID of the schedule this activity belongs to.
 * @param {string} name - The name of the activity.
 * @param {Date} startDate - The start date of the activity.
 * @param {Date} endDate - The end date of the activity.
 * @returns {Promise<import('../../types').Activity>} The newly created activity.
 */
async function createActivity(scheduleId, name, startDate, endDate) {
  const query = `
      INSERT INTO activities (schedule_id, name, start_date, end_date) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;
    `;
  const result = await pool.query(query, [
    scheduleId,
    name,
    startDate,
    endDate,
  ]);
  return result.rows[0];
}

/**
 * Creates multiple activities in the database.
 * @param {number} scheduleId - The ID of the schedule this activity belongs to.
 * @param {Array<import('../../types').Activity>} activities - The activities to create.
 * @returns {Promise<void>} A promise that resolves when all activities have been created.
 */
async function createMultipleActivities(scheduleId, activities) {
  const query = `
      INSERT INTO activities (schedule_id, name, start_date, end_date) 
      VALUES ($1, $2, $3, $4)
    `;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const activity of activities) {
      await client.query(query, [
        scheduleId,
        activity.name,
        activity.startDate,
        activity.endDate,
      ]);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Retrieves a page of activities for a given schedule.
 * @param {number} scheduleId - The ID of the schedule to retrieve activities for.
 * @param {number} [page=1] - The page of activities to retrieve.
 * @param {number} [limit=10] - The number of activities to retrieve per page.
 * @returns {Promise<import('../../types').Activity[]>} The retrieved activities.
 */
async function getActivitiesByScheduleId(scheduleId, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const query =
    'SELECT * FROM activities WHERE schedule_id = $1 LIMIT $2 OFFSET $3';
  const result = await pool.query(query, [scheduleId, limit, offset]);
  return result.rows;
}

module.exports = {
  createActivity,
  createMultipleActivities,
  getActivitiesByScheduleId
};
