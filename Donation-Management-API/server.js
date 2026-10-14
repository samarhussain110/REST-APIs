const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Connect MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/donationmanagement")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err.message));

// Donation Schema
const donationSchema = new mongoose.Schema({
  donationCode: String,
  donorName: String,
  donorType: String,
  donationCategory: String,
  donatedItem: String,
  quantity: Number,
  unit: String,
  estimatedValue: Number,
  receivingOrganization: String,
  donationDate: String,
  distributionStatus: String,
  paymentMethod: String,
  remarks: String
});

const Donation = mongoose.model("Donation", donationSchema);

// GET: All donations
app.get("/donations", async (req, res) => {
  try {
    const records = await Donation.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Donation by ID
app.get("/donations/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    const record = await Donation.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add one donation
app.post("/donations", async (req, res) => {
  try {
    const record = await Donation.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST: Add multiple donations
app.post("/donations/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of donation records"
      });
    }

    const records = await Donation.insertMany(req.body);

    res.status(201).json({
      message: "Donations added successfully",
      count: records.length,
      data: records
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update a donation
app.put("/donations/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    const record = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Remove a donation
app.delete("/donations/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    const record = await Donation.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Donation not found" });
    }

    res.json({ message: "Donation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
