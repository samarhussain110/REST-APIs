
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// MongoDB Connection
mongoose
    .connect("mongodb://127.0.0.1:27017/notes")
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((error) => console.log("MongoDB Connection Error:", error));

// Notes Schema

const noteSchema = new mongoose.Schema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  subject: {
    type: String
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Notes Model
const Note = mongoose.model("Note", noteSchema);

// Home Route
app.get("/", (req, res) => {
    res.send("Notes Management API is Running");
});

// GET All Notes
app.get("/notes", async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET Single Note
app.get("/notes/:id", async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(400).json({ message: "Invalid note ID" });
    }
});

// POST Create Note
app.post("/notes", async (req, res) => {
    try {
        const note = new Note(req.body);
        const savedNote = await note.save();

        res.status(201).json(savedNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST Bulk Insert Notes
app.post("/notes/bulk", async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({
                message: "Please send an array of notes"
            });
        }

        const notes = await Note.insertMany(req.body);

        res.status(201).json({
            message: "Notes added successfully",
            count: notes.length,
            data: notes
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT Update Note
app.put("/notes/:id", async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE Note
app.delete("/notes/:id", async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.status(200).json({
            message: "Note deleted successfully",
            data: deletedNote
        });
    } catch (error) {
        res.status(400).json({ message: "Invalid note ID" });
    }
});

// Start Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
