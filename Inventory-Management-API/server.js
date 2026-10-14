const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/inventory")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

const inventorySchema = new mongoose.Schema({
  skuCode: String,
  barcode: String,
  productName: String,
  productType: String,
  supplierName: String,
  warehouseName: String,
  warehouseZone: String,
  shelfNumber: String,
  quantityInStock: Number,
  reorderLevel: Number,
  unitCost: Number,
  unitOfMeasure: String,
  batchNumber: String,
  manufactureDate: String,
  expiryDate: String,
  storageCondition: String,
  stockStatus: String,
  lastStockCheck: String,
  remarks: String
});

const Inventory = mongoose.model("Inventory", inventorySchema);

// GET all inventory items
app.get("/inventory", async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET inventory item by ID
app.get("/inventory/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid inventory ID" });
    }

    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST one inventory item
app.post("/inventory", async (req, res) => {
  try {
    const item = new Inventory(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST multiple inventory items
app.post("/inventory/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of inventory items"
      });
    }

    const items = await Inventory.insertMany(req.body);

    res.status(201).json({
      message: "Inventory items added successfully",
      count: items.length,
      data: items
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update inventory item
app.put("/inventory/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid inventory ID" });
    }

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE inventory item
app.delete("/inventory/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid inventory ID" });
    }

    const item = await Inventory.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({ message: "Inventory item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});