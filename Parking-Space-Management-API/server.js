const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Connect MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/parkingspace")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err.message));

// Parking Schema
const parkingSchema = new mongoose.Schema({
  slotCode: String,
  parkingArea: String,
  floorNumber: Number,
  vehicleType: String,
  vehicleNumber: String,
  hourlyRate: Number,
  entryTime: String,
  exitTime: String,
  availabilityStatus: String,
  paymentStatus: String
});

const Parking = mongoose.model("Parking", parkingSchema);

// GET: All parking records
app.get("/parking", async (req, res) => {
  try {
    const records = await Parking.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: One parking record
app.get("/parking/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid record ID" });
    }

    const record = await Parking.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add one parking record
app.post("/parking", async (req, res) => {
  try {
    const record = await Parking.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST: Add multiple parking records
app.post("/parking/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of parking records"
      });
    }

    const records = await Parking.insertMany(req.body);
    res.status(201).json({
      message: "Parking records added successfully",
      count: records.length,
      data: records
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update a parking record
app.put("/parking/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid record ID" });
    }

    const record = await Parking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Remove a parking record
app.delete("/parking/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid record ID" });
    }

    const record = await Parking.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Parking record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
