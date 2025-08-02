const mongoose = require("mongoose");
const Property = require("./models/Property");
require("dotenv").config();

const LOCATIONS = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"];
const TYPES = ["Apartment", "House", "Commercial", "Land"];

let runCount = 0;
const maxRuns = 10;

async function randomInsert() {
  const property = new Property({
    title: `${Math.floor(Math.random() * 5) + 1} BHK in ${
      LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
    }`,
    price: Math.floor(Math.random() * 10000000) + 5000000,
    location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
    type: TYPES[Math.floor(Math.random() * TYPES.length)],
    status: "available",
  });
  await property.save();
  console.log("🟢 Inserted property:", property.title);
}

async function randomUpdate() {
  const props = await Property.find();
  if (props.length === 0) return;

  const randomProp = props[Math.floor(Math.random() * props.length)];
  const newPrice = Math.floor(Math.random() * 5000000) + 5000000;

  await Property.findByIdAndUpdate(randomProp._id, { price: newPrice });
  console.log("🟡 Updated price for:", randomProp.title);
}

async function randomDelete() {
  const props = await Property.find();
  if (props.length === 0) return;

  const randomProp = props[Math.floor(Math.random() * props.length)];
  await Property.findByIdAndDelete(randomProp._id);
  console.log("🔴 Deleted property:", randomProp.title);
}

async function startSimulation() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("⚙️ Connected to MongoDB Atlas. Starting simulation...");

  const insertInterval = setInterval(async () => {
    await randomInsert();
    checkStop();
  }, 5000);

  const updateInterval = setInterval(async () => {
    await randomUpdate();
    checkStop();
  }, 7000);

  const deleteInterval = setInterval(async () => {
    await randomDelete();
    checkStop();
  }, 15000);

  function checkStop() {
    runCount++;
    if (runCount >= maxRuns) {
      clearInterval(insertInterval);
      clearInterval(updateInterval);
      clearInterval(deleteInterval);
      console.log("✅ Simulation completed after", maxRuns, "runs.");
      mongoose.disconnect();
      process.exit(0);
    }
  }
}

startSimulation();
