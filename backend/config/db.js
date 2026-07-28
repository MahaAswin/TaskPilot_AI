import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Connection Error: ${error.message}`);
    // Do not crash the application instantly, but log the issue
    // In local demo Mode, the application can still function using fallback simulation logic
  }
};

export default connectDB;
