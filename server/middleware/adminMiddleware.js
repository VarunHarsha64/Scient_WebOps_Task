import bcrypt from 'bcryptjs';
import User from '../models/userModel.js'; // Import your user model

const isAdmin = async (req, res, next) => {
  const { AdminUsername, AdminPassword } = req.body;
  const username = AdminUsername;
  const password = AdminPassword;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    console.log(user);
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default isAdmin;
