import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const { MONGO_URI } = process.env;
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); 
  }
};

export default connectDB;
