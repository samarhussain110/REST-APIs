const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/foodorders")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

const foodOrderSchema = new mongoose.Schema({
  orderNumber: String,
  customerName: String,
  customerPhone: String,
  foodItems: [
    {
      foodName: String,
      quantity: Number,
      unitPrice: Number,
      customizations: String
    }
  ],
  restaurantName: String,
  orderType: String,
  deliveryAddress: String,
  orderDate: String,
  deliverySlot: String,
  subtotal: Number,
  deliveryFee: Number,
  packagingFee: Number,
  grandTotal: Number,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  specialInstructions: String
});

const FoodOrder = mongoose.model("FoodOrder", foodOrderSchema);

// GET all food orders
app.get("/food-orders", async (req, res) => {
  try {
    const orders = await FoodOrder.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET food order by ID
app.get("/food-orders/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await FoodOrder.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Food order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a single food order
app.post("/food-orders", async (req, res) => {
  try {
    const order = new FoodOrder(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST multiple food orders
app.post("/food-orders/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of food orders"
      });
    }

    const orders = await FoodOrder.insertMany(req.body);

    res.status(201).json({
      message: "Food orders added successfully",
      count: orders.length,
      data: orders
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a food order
app.put("/food-orders/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await FoodOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Food order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a food order
app.delete("/food-orders/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await FoodOrder.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Food order not found" });
    }

    res.json({ message: "Food order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});