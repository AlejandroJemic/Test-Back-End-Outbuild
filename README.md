
# API Development Guidelines - Outbuild

This document outlines the quality standards for developing scalable and secure APIs using **Node.js**, **Express**, and **PostgreSQL** to  handle large datasets and follow best practices to ensure performance, security, and maintainability.

### Quality Requirements

1. **Scalability**
   - Design the API to scale horizontally/vertically to handle growing traffic and data.
   - Implement **pagination** and **batch processing** for large data queries.

2. **Security**
   - Apply strong **input validation** to prevent SQL injection and XSS attacks.
   - Use **secure authentication** (JWT, OAuth2) and encrypt sensitive data in transit (HTTPS) and at rest.
   - Hash passwords securely using **bcrypt**.

3. **Handling Large Datasets**
   - Use **indexing** and query optimization in PostgreSQL.
   - Implement server-side **filtering** and **sorting** to avoid overloading the API with large responses.

4. **Software Principles**
   - Follow **SOLID** principles for modular, maintainable code.
   - Implement clear separation between controllers, services, and models (e.g., **Service/Repository Pattern**).

5. **Test-Driven Development (TDD)**
   - Follow **TDD** using tools like **Jest** or **Mocha** for unit and integration tests.
   - Ensure thorough test coverage.

6. **Error Handling**
   - Centralize error handling using Express middleware and provide clear HTTP status codes.
   - Log and monitor errors in production (e.g., **Sentry**, **Loggly**).

7. **Logging**
   - Implement robust **logging** using tools like **Winston** or **Morgan** for tracking API activity.
   - Avoid logging sensitive information.

8. **Architecture**
   - Maintain a **clean, decoupled architecture**. Controllers handle HTTP, services handle business logic, and repositories manage database interactions.
   - Consider **caching** (e.g., **Redis**) for performance optimization.
  

# API Documentation

## Users

### Get User by ID
- **Endpoint**: `GET /users/:id`
- **Description**: Retrieve a user by their ID.
- **Parameters**:
  - `id` (path) - ID of the user to retrieve.
- **Responses**:
  - `200 OK`: User retrieved successfully.
  - `404 Not Found`: User not found.

### Create User
- **Endpoint**: `POST /users`
- **Description**: Add a new user to the system.
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Responses**:
  - `201 Created`: User created successfully.
  - `400 Bad Request`: Name, email, and password are required.
  - `409 Conflict`: Email already exists.
  - `500 Internal Server Error`: Failed to create user.

## Schedules

### Create Schedule
- **Endpoint**: `POST /schedules`
- **Description**: Create a new schedule for a user.
- **Request Body**:
  ```json
  {
    "userId": 1,
    "name": "Weekly Meeting",
    "imageUrl": "http://example.com/image.jpg"
  }
  ```
- **Responses**:
  - `201 Created`: Schedule created successfully.
  - `400 Bad Request`: User ID, name, and image URL are required.
  - `500 Internal Server Error`: Failed to create schedule.

### Get Schedule by ID
- **Endpoint**: `GET /schedules/:scheduleId`
- **Description**: Retrieve a schedule by its ID along with its activities.
- **Parameters**:
  - `scheduleId` (path) - ID of the schedule to retrieve.
- **Responses**:
  - `200 OK`: Schedule retrieved successfully with activities.
  - `404 Not Found`: Schedule not found.

## Activities

### Add Activity to Schedule
- **Endpoint**: `POST /activities`
- **Description**: Add a new activity to a schedule.
- **Request Body**:
  ```json
  {
    "scheduleId": 1,
    "name": "Project Update",
    "startDate": "2024-10-15T10:00:00Z",
    "endDate": "2024-10-15T11:00:00Z"
  }
  ```
- **Responses**:
  - `201 Created`: Activity added successfully.
  - `400 Bad Request`: Schedule ID, name, start date, and end date are required.
  - `404 Not Found`: Schedule not found.
  - `500 Internal Server Error`: Failed to add activity.

### Add Multiple Activities to Schedule
- **Endpoint**: `POST /activities/bulk`
- **Description**: Add multiple activities to a schedule.
- **Request Body**:
  ```json
  {
    "scheduleId": 1,
    "activities": [
      {
        "name": "Activity 1",
        "startDate": "2024-10-15T10:00:00Z",
        "endDate": "2024-10-15T11:00:00Z"
      },
      {
        "name": "Activity 2",
        "startDate": "2024-10-16T10:00:00Z",
        "endDate": "2024-10-16T11:00:00Z"
      }
    ]
  }
  ```
- **Responses**:
  - `201 Created`: Activities added successfully.
  - `400 Bad Request`: Schedule ID and activities are required.
  - `404 Not Found`: Schedule not found.
  - `500 Internal Server Error`: Failed to add activities.

### Get Activities by Schedule ID
- **Endpoint**: `GET /schedules/:scheduleId/activities`
- **Description**: Retrieve activities for a specific schedule.
- **Parameters**:
  - `scheduleId` (path) - ID of the schedule.
- **Query Parameters**:
  - `page` (optional) - Page number for pagination.
  - `limit` (optional) - Number of activities per page.
- **Responses**:
  - `200 OK`: Activities retrieved successfully.
  - `404 Not Found`: Schedule not found.
  - `500 Internal Server Error`: Failed to get activities.

