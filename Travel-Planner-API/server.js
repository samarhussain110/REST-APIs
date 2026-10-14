const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/travelplanner")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const tripSchema = new mongoose.Schema({
  tripCode: String,
  travelerName: String,
  travelerEmail: String,
  destination: String,
  country: String,
  tripType: String,
  startDate: String,
  endDate: String,
  travelersCount: Number,
  budgetPKR: Number,
  transportMode: String,
  accommodationType: String,
  bookingStatus: String,
  travelStatus: String,
  activities: [String],
  notes: String
});

const Trip = mongoose.model("Trip", tripSchema);

// GET all trips
app.get("/trips", async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one trip by ID
app.get("/trips/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST one trip
app.post("/trips", async (req, res) => {
  try {
    const trip = new Trip(req.body);
    const savedTrip = await trip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST multiple trips
app.post("/trips/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of trips"
      });
    }

    const trips = await Trip.insertMany(req.body);
    res.status(201).json({
      message: "Trips inserted successfully",
      count: trips.length,
      data: trips
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a trip
app.put("/trips/:id", async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(updatedTrip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a trip
app.delete("/trips/:id", async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);

    if (!deletedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});