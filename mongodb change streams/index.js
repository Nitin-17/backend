require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const { listenToPropertyChanges } = require("./services/changeStreamService");

const app = express();
const PORT = 3000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB Atlas");

    listenToPropertyChanges();
    app.listen(PORT, () => {
      console.log(`Server running at PORT ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

start();
