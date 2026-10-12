import User from '../models/User.js';

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    // Simulated network delay (2 seconds)
    setTimeout(() => res.status(200).json(users), 2000);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

export { getUsers, getUserById };