import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || "5001";
const MONGO_URI = process.env.MONGO_URI || "";

console.log("Connecting to MongoDB...");

function sanitizeUri(uri: string) {
  try {
    const withoutCreds = uri.replace(/:\/\/.*@/, '://');
    const parts = withoutCreds.split('/');
    return parts[0];
  } catch {
    return uri;
  }
}

if (!MONGO_URI || (!MONGO_URI.startsWith('mongodb://') && !MONGO_URI.startsWith('mongodb+srv://'))) {
  console.error('❌ Invalid or missing MONGO_URI environment variable.');
  if (MONGO_URI) console.error('Provided value (sanitized):', sanitizeUri(MONGO_URI));
  console.error('Expected connection string to start with "mongodb://" or "mongodb+srv://".');
  console.error('Create a .env file with a line like: MONGO_URI=mongodb+srv://user:pass@cluster0.mongodb.net/mydb');
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("💡 Tips: Check your MongoDB Atlas IP whitelist settings");
  });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down...");
  mongoose.disconnect();
  process.exit(0);
});

