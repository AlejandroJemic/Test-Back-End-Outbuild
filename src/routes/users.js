const express = require('express');
const router = express.Router();
const { getUserById, createUser,getUserByEmail } = require('../controllers/userController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// GET user by ID
router.get('/:id', getUserById);

// POST user
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  // Validación básica
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: 'Name, email, and password are required' });
  }

  try {
    const user = await createUser(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    if (error.code === '23505') {
      // Código de error para duplicados (violación de unicidad)
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.post('/login', loginUser);

router.post('/logout', logoutUser);

/**
 * Login function to authenticate users with email and password.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email }, // Payload
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
}

/**
 * Logout function (client-side token invalidation).
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
function logoutUser(req, res) {
  // For logout, we simply invalidate the token on the client-side
  res.json({ message: 'Logout successful' });
}

module.exports = router;
