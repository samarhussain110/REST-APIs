const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/contacts")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  alternatePhone: String,
  category: String,
  company: String,
  address: String,
  notes: String,
});

const Contact = mongoose.model("Contact", contactSchema);

// GET: Get all contacts
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Get contact by ID
app.get("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: "Invalid contact ID" });
  }
});

// POST: Add one contact
app.post("/contacts", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST: Add multiple contacts
app.post("/contacts/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of contacts",
      });
    }

    const contacts = await Contact.insertMany(req.body);
    res.status(201).json(contacts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update a contact
app.put("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(contact);
  } catch (err) {
    res.status(400).json({ message: "Unable to update contact" });
  }
});

// DELETE: Delete a contact
app.delete("/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({
      message: "Contact deleted successfully",
      contact,
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid contact ID" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});