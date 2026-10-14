const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/reminders")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

const reminderSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  reminderDate: String,
  reminderTime: String,
  priority: String,
  status: String,
  repeat: String,
});

const Reminder = mongoose.model("Reminder", reminderSchema);

// GET: Get all reminders
app.get("/reminders", async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Get reminder by ID
app.get("/reminders/:id", async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json(reminder);
  } catch (err) {
    res.status(400).json({ message: "Invalid reminder ID" });
  }
});

// POST: Add one reminder
app.post("/reminders", async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    const savedReminder = await reminder.save();
    res.status(201).json(savedReminder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST: Add multiple reminders
app.post("/reminders/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of reminders",
      });
    }

    const reminders = await Reminder.insertMany(req.body);
    res.status(201).json(reminders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update a reminder
app.put("/reminders/:id", async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json(reminder);
  } catch (err) {
    res.status(400).json({ message: "Unable to update reminder" });
  }
});

// DELETE: Delete a reminder
app.delete("/reminders/:id", async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json({
      message: "Reminder deleted successfully",
      reminder,
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid reminder ID" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});