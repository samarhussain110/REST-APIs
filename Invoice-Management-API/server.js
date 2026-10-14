const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/invoices")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: String,
  customerName: String,
  customerEmail: String,
  issueDate: String,
  dueDate: String,
  items: [
    {
      itemName: String,
      quantity: Number,
      unitPrice: Number
    }
  ],
  subtotal: Number,
  taxAmount: Number,
  discount: Number,
  totalAmount: Number,
  paymentStatus: String,
  paymentMethod: String,
  notes: String
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

// GET all invoices
app.get("/invoices", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET invoice by ID
app.get("/invoices/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a single invoice
app.post("/invoices", async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    const savedInvoice = await invoice.save();
    res.status(201).json(savedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST multiple invoices
app.post("/invoices/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of invoices"
      });
    }

    const invoices = await Invoice.insertMany(req.body);
    res.status(201).json({
      message: "Invoices added successfully",
      count: invoices.length,
      data: invoices
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update invoice
app.put("/invoices/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE invoice
app.delete("/invoices/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});