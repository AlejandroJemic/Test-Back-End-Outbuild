const request = require('supertest');
const app = require('../app');

describe('Schedule API Tests', () => {
  let createdScheduleId;

  it('should create an empty schedule', async () => {
    const response = await request(app).post('/schedules').send({
      userId: 1,
      name: 'Test Schedule',
      imageUrl: 'http://example.com/image.jpg',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Test Schedule');
    createdScheduleId = response.body.id;
  });

  it('should return a schedule with activities', async () => {
    const response = await request(app).get(`/schedules/${createdScheduleId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('activities');
    expect(Array.isArray(response.body.activities)).toBe(true);
  });

  it('should add an activity to a schedule', async () => {
    const activity = {
      scheduleId: createdScheduleId,
      name: 'New Activity',
      startDate: '2024-10-15T10:00:00Z',
      endDate: '2024-10-15T11:00:00Z',
    };

    const response = await request(app).post('/activities').send(activity);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('name', 'New Activity');
  });

  it('should add multiple activities to a schedule', async () => {
    const activities = {
      scheduleId: createdScheduleId,
      activities: [
        {
          name: 'Activity 1',
          startDate: '2024-10-16T10:00:00Z',
          endDate: '2024-10-16T11:00:00Z',
        },
        {
          name: 'Activity 2',
          startDate: '2024-10-17T10:00:00Z',
          endDate: '2024-10-17T11:00:00Z',
        },
      ],
    };

    const response = await request(app)
      .post('/activities/bulk')
      .send(activities);

    expect(response.status).toBe(201);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
  });
});
