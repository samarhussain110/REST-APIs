const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/petcaremanagement")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const petCareSchema = new mongoose.Schema({
  careRecordCode: String,
  petName: String,
  petType: String,
  breed: String,
  petAgeYears: Number,
  ownerName: String,
  ownerEmail: String,
  ownerPhone: String,
  vetClinic: String,
  veterinarianName: String,
  serviceType: String,
  appointmentDate: String,
  vaccinationStatus: String,
  lastVaccinationDate: String,
  nextVaccinationDate: String,
  dietPlan: String,
  exerciseMinutesDaily: Number,
  allergyNotes: String,
  microchipId: String,
  careStatus: String
});

const PetCare = mongoose.model("PetCare", petCareSchema);

// GET all pet care records
app.get("/petcare", async (req, res) => {
  try {
    const records = await PetCare.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one pet care record
app.get("/petcare/:id", async (req, res) => {
  try {
    const record = await PetCare.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST one pet care record
app.post("/petcare", async (req, res) => {
  try {
    const record = new PetCare(req.body);
    const savedRecord = await record.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST multiple records at once
app.post("/petcare/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of records"
      });
    }

    const records = await PetCare.insertMany(req.body);
    res.status(201).json({
      message: "Pet care records inserted successfully",
      count: records.length,
      data: records
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a pet care record
app.put("/petcare/:id", async (req, res) => {
  try {
    const updatedRecord = await PetCare.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a pet care record
app.delete("/petcare/:id", async (req, res) => {
  try {
    const deletedRecord = await PetCare.findByIdAndDelete(req.params.id);

    if (!deletedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Pet care record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});