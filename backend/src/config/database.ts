import mongoose from "mongoose";

export async function connectToDatabase(): Promise<void> {
  const mongoDbUri = process.env.MONGODB_URI;

  if (!mongoDbUri) {
    throw new Error("MONGODB_URI is missing from the .env file.");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(mongoDbUri);
  console.log("Connected to MongoDB.");
}
