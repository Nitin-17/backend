const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: String,
  price: Number,
  location: String,
  type: {
    type: String,
    enum: ["Apartment", "House", "Land", "Commercial"],
    default: "Apartment",
  },
  listedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["available", "sold", "pending"],
    default: "available",
  },
});

module.exports = mongoose.model("Property", propertySchema);
