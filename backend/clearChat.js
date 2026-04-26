const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const clearData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("Clearing messages...");
    await mongoose.connection.db.collection("messages").deleteMany({});
    
    console.log("Clearing chats...");
    await mongoose.connection.db.collection("chats").deleteMany({});
    
    console.log("Chat data cleared successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing chat data:", error);
    process.exit(1);
  }
};

clearData();
