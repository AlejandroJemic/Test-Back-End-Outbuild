// src/dto/scheduleDto.js

/**
 * Transforms a schedule entity to a DTO.
 * @param {Object} schedule - The schedule entity from the database.
 * @returns {Object} The transformed schedule DTO.
 */
function scheduleToDTO(schedule) {
  return {
    id: schedule.id,
    name: schedule.name,
    imageUrl: schedule.image_url, // Map camelCase for consistency
    createdAt: schedule.created_at,
  };
}

/**
 * Transforms a schedule with its activities to a DTO.
 * @param {Object} schedule - The schedule entity from the database.
 * @param {Array} activities - The activities associated with the schedule.
 * @returns {Object} The transformed schedule with activities DTO.
 */
function scheduleWithActivitiesToDTO(schedule, activities) {
  return {
    id: schedule.id,
    name: schedule.name,
    imageUrl: schedule.image_url,
    createdAt: schedule.created_at,
    activities: activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      startDate: activity.start_date,
      endDate: activity.end_date,
    })),
  };
}

module.exports = {
  scheduleToDTO,
  scheduleWithActivitiesToDTO,
};
