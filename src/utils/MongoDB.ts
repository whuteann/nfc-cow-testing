import mongoose from "mongoose";

const { MONGODB_URI } = process.env;

declare global {
  var mongoose: any;
}

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!)
    .then((mongoose: any) => {
      return mongoose
    })
  }

  cached.conn = await cached.promise;
  return cached.conn;
}