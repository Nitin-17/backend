require("dotenv").config();
const express = require("express");
const Redis = require("ioredis");
const axios = require("axios");

const app = express();
const PORT = 3000;

// 🔐 Redis connection (change host if running inside EC2 itself)
const redis = new Redis({
  host: process.env.EC2IP, // Use '127.0.0.1' if running on EC2 itself
  port: 6379,
  //password: "YourSecurePassword123!", // Set in redis.conf
  // optional: enable TLS if needed (for production)
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Try fetching from Redis cache
    const cacheKey = `user:${userId}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log("Cache hit ✅");
      return res.json({ from: "cache", data: JSON.parse(cachedData) });
    }

    // Simulate external API (use jsonplaceholder for demo)
    console.log("Cache miss - Fetching from API...");
    const { data } = await axios.get(
      `https://fakestoreapi.in/api/users/${userId}`
    );

    // Store in Redis with TTL (60 seconds)
    await redis.set(cacheKey, JSON.stringify(data), "EX", 86400);

    res.json({ from: "API", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  Route to clear cache manually
app.get("/clear-cache/:id", async (req, res) => {
  const userId = req.params.id;
  const cacheKey = `user:${userId}`;
  await redis.del(cacheKey);
  res.json({ message: `Cache cleared for user ${userId}` });
});

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
