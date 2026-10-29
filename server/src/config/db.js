import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hotelpro';

  // If memory DB explicitly requested
  if (process.env.USE_MEMORY_DB === 'true') {
    return await connectMemoryDB();
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000, // Quick timeout to fallback if no local mongod
    });
    console.log(`[DB] Connected to MongoDB at: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.warn(`[DB] Could not connect to MongoDB URI (${uri}): ${err.message}`);
    console.log('[DB] Initializing embedded MongoDB memory engine for seamless local operation...');
    return await connectMemoryDB();
  }
};

const connectMemoryDB = async () => {
  try {
    if (!mongoMemoryServer) {
      mongoMemoryServer = await MongoMemoryServer.create();
    }
    const memUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`[DB] Successfully connected to embedded MongoDB instance at ${memUri}`);
    return conn;
  } catch (memErr) {
    console.error(`[DB] Critical Error: Failed to start embedded MongoDB: ${memErr.message}`);
    throw memErr;
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
