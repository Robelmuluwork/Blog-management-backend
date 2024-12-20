const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs"); 

// Generate token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, secret, { expiresIn });
};

const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });
    if (userExists) {
      return res.status(400).json({ message: "User or email already exists" });
    }
    const user = await User.create({ username, email, password });
    await user.save();
    return res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user with password matching
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
