const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/expenses")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log(err));

const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  type: String,
  category: String,
  paymentMethod: String,
  date: String,
  description: String,
});

const Expense = mongoose.model("Expense", expenseSchema);

// GET: Get all expenses
app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Get expense by ID
app.get("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (err) {
    res.status(400).json({ message: "Invalid expense ID" });
  }
});

// POST: Add one expense
app.post("/expenses", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST: Add multiple expenses
app.post("/expenses/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of expenses",
      });
    }

    const expenses = await Expense.insertMany(req.body);
    res.status(201).json(expenses);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Update an expense
app.put("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (err) {
    res.status(400).json({ message: "Unable to update expense" });
  }
});

// DELETE: Delete an expense
app.delete("/expenses/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully", expense });
  } catch (err) {
    res.status(400).json({ message: "Invalid expense ID" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});