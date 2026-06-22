import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

//register a new user 
export const registerUser = async (req, res) => {
  const { name, email, password, profileImg } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Create user in database
    const user = await User.create({
      name,
      email,
      password,
      profileImg,
    });

    if (user) {
      // 3. Return user data and JWT token if succeeded
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImg: user.profileImg,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    // 2. Check if user exists and if password is correct
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImg: user.profileImg,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};