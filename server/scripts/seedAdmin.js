import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import User from '../models/userModel.js'; // Import your user model

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const { MONGO_URI } = process.env;
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('password', 10);

    const admin = new User({
      username: 'admin',
      password: hashedPassword, 
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();
  await seedAdmin();
};

run();
