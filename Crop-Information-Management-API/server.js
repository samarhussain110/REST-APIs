const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/cropinformation")
  .then(() => console.log("MongoDB Connected: cropinformation"))
  .catch((err) => console.log("MongoDB Error:", err));

// Crop Schema
const cropSchema = new mongoose.Schema({
  cropCode: String,
  cropName: String,
  scientificName: String,
  cropFamily: String,
  cropCategory: String,
  suitableSeason: String,
  idealTemperatureC: Number,
  soilType: String,
  soilPHMin: Number,
  soilPHMax: Number,
  waterRequirement: String,
  sowingMonths: [String],
  harvestDurationDays: Number,
  seedRateKgPerAcre: Number,
  expectedYieldKgPerAcre: Number,
  commonGrowingRegions: [String],
  growthHabit: String,
  sunlightRequirement: String,
  rotationRecommendation: String,
  cultivationNotes: String
});

const Crop = mongoose.model("Crop", cropSchema);

// GET: All crops
app.get("/crops", async (req, res) => {
  try {
    const crops = await Crop.find();
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: One crop by ID
app.get("/crops/:id", async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.json(crop);
  } catch (err) {
    res.status(400).json({ message: "Invalid crop ID" });
  }
});

// POST: Add one crop
app.post("/crops", async (req, res) => {
  try {
    const crop = new Crop(req.body);
    const savedCrop = await crop.save();
    res.status(201).json(savedCrop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST: Add multiple crops
app.post("/crops/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        message: "Please send a non-empty JSON array of crops."
      });
    }

    const savedCrops = await Crop.insertMany(req.body);
    res.status(201).json({
      message: "Crops added successfully",
      count: savedCrops.length,
      data: savedCrops
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update a crop
app.put("/crops/:id", async (req, res) => {
  try {
    const updatedCrop = await Crop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCrop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.json(updatedCrop);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Delete a crop
app.delete("/crops/:id", async (req, res) => {
  try {
    const deletedCrop = await Crop.findByIdAndDelete(req.params.id);

    if (!deletedCrop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    res.json({ message: "Crop deleted successfully", data: deletedCrop });
  } catch (err) {
    res.status(400).json({ message: "Invalid crop ID" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});