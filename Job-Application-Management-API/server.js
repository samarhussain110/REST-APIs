const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/jobApplications")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err.message));

const applicationSchema = new mongoose.Schema({
  applicationCode: String,
  candidateName: String,
  email: String,
  phone: String,
  jobTitle: String,
  department: String,
  employmentType: String,
  experienceYears: Number,
  expectedSalary: Number,
  appliedDate: String,
  interviewDate: String,
  applicationStatus: String,
  resumeFileName: String,
  recruiterName: String,
  workMode: String,
  noticePeriod: String,
  source: String,
  notes: String
});

const JobApplication = mongoose.model(
  "JobApplication",
  applicationSchema
);

// GET: All job applications
app.get("/applications", async (req, res) => {
  try {
    const applications = await JobApplication.find();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: One application by ID
app.get("/applications/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add one application
app.post("/applications", async (req, res) => {
  try {
    const application = new JobApplication(req.body);
    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST: Add multiple applications
app.post("/applications/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of applications"
      });
    }

    const applications = await JobApplication.insertMany(req.body);
    res.status(201).json({
      message: "Applications added successfully",
      count: applications.length,
      data: applications
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update an application
app.put("/applications/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Remove an application
app.delete("/applications/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const application = await JobApplication.findByIdAndDelete(
      req.params.id
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});