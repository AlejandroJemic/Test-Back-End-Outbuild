const pool = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * Creates a new user in the database.
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<import('../../types').User>} The newly created user.
 */
async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (name, email, password) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const result = await pool.query(query, [name, email, hashedPassword]);
  return result.rows[0];
}

/**
 * Retrieves a user from the database given their ID.
 * @param {number} userId - The ID of the user to retrieve.
 * @returns {Promise<import('../../types').User>} The user with the given ID.
 */
async function getUserById(userId) {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [userId]);
  return result.rows[0];
}

/**
 * Retrieves a user from the database given their email.
 * @param {string} email - The email address of the user to retrieve.
 * @returns {Promise<import('../../types').User>} The user with the given email.
 */
async function getUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
}

module.exports = { createUser, getUserById, getUserByEmail };
