const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Connect MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/onlinecourseprogress")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err.message));

// Course Progress Schema
const progressSchema = new mongoose.Schema({
  progressCode: String,
  learnerName: String,
  learnerEmail: String,
  courseTitle: String,
  courseCategory: String,
  instructorName: String,
  totalLessons: Number,
  completedLessons: Number,
  progressPercentage: Number,
  studyHours: Number,
  enrollmentDate: String,
  lastAccessDate: String,
  targetCompletionDate: String,
  courseStatus: String,
  certificateIssued: Boolean
});

const Progress = mongoose.model("Progress", progressSchema);

// GET: All progress records
app.get("/progress", async (req, res) => {
  try {
    const records = await Progress.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: One progress record by ID
app.get("/progress/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid record ID" });
    }

    const record = await Progress.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add one progress record
app.post("/progress", async (req, res) => {
  try {
    const record = await Progress.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST: Add multiple progress records
app.post("/progress/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of progress records"
      });
    }

    const records = await Progress.insertMany(req.body);

    res.status(201).json({
      message: "Course progress records added successfully",
      count: records.length,
      data: records
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update a progress record
app.put("/progress/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid record ID" });
    }

    const record = await Progress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Delete a progress record
app.delete("/progress/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid record ID" });
    }

    const record = await Progress.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    res.json({ message: "Progress record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});