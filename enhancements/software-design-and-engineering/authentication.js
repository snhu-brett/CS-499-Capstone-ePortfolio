const User = require('../models/user');
const passport = require('passport');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail }).exec();

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      hash: ''
    });

    user.setPassword(password);
    await user.save();

    return res.status(201).json({ token: user.generateJWT() });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  req.body.email = req.body.email.trim().toLowerCase();

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Authentication failed', error: err.message });
    }

    if (!user) {
      return res.status(401).json(info || { message: 'Invalid credentials' });
    }

    return res.status(200).json({ token: user.generateJWT() });
  })(req, res);
};

module.exports = {
  register,
  login
};