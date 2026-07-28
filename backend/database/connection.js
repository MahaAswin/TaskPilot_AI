import mongoose from 'mongoose';

/**
 * Enterprise database connection setup.
 */
export const connectDB = async () => {
  const dbUri = process.env.MONGODB_URI;

  if (!dbUri) {
    console.warn('[Database Warning] MONGODB_URI is not set. Offline simulations will be active.');
    return;
  }

  try {
    const conn = await mongoose.connect(dbUri);
    console.log(`[Database] Mongoose Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // In enterprise architectures, we log and exit or retry
    process.exit(1);
  }
};

export default connectDB;
