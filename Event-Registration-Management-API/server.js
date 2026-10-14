const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/eventregistrations")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Error:", err.message));

const registrationSchema = new mongoose.Schema({
  registrationCode: String,
  attendeeName: String,
  email: String,
  phone: String,
  eventName: String,
  eventCategory: String,
  venue: String,
  eventDate: String,
  ticketType: String,
  ticketPrice: Number,
  numberOfGuests: Number,
  paymentStatus: String,
  registrationStatus: String,
  registrationDate: String,
  checkInStatus: String,
  specialRequirements: String
});

const Registration = mongoose.model("Registration", registrationSchema);

// GET: All registrations
app.get("/registrations", async (req, res) => {
  try {
    const data = await Registration.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Registration by ID
app.get("/registrations/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid registration ID" });
    }

    const data = await Registration.findById(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add one registration
app.post("/registrations", async (req, res) => {
  try {
    const data = await Registration.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST: Add multiple registrations
app.post("/registrations/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of registrations"
      });
    }

    const data = await Registration.insertMany(req.body);
    res.status(201).json({
      message: "Registrations added successfully",
      count: data.length,
      data
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update registration
app.put("/registrations/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid registration ID" });
    }

    const data = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!data) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Remove registration
app.delete("/registrations/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid registration ID" });
    }

    const data = await Registration.findByIdAndDelete(req.params.id);

    if (!data) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json({ message: "Registration deleted successfully", data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});