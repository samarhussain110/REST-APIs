const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/appointments")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

const appointmentSchema = new mongoose.Schema({
  customerName: String,
  email: String,
  phone: String,
  service: String,
  appointmentDate: String,
  appointmentTime: String,
  status: String,
  notes: String,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

// GET: Get all appointments
app.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Get appointment by ID
app.get("/appointments/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: "Invalid appointment ID" });
  }
});

// POST: Create one appointment
app.post("/appointments", async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST: Create multiple appointments
app.post("/appointments/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of appointments",
      });
    }

    const appointments = await Appointment.insertMany(req.body);
    res.status(201).json(appointments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update an appointment
app.put("/appointments/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: "Unable to update appointment" });
  }
});

// DELETE: Delete an appointment
app.delete("/appointments/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment deleted successfully",
      appointment,
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid appointment ID" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});