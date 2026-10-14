
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/tasks")
.then(() => {
    console.log("MongoDB Connected Successfully!");
})
.catch((error) => {
    console.log("Failed: ", error);
});

// Task Schema
const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    priority: String,
    status: String,
    dueDate: String,
    category: String
});

// Task Model
const Task = mongoose.model("Task", taskSchema);

// GET ALL TASKS
app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// ADD SINGLE TASK
app.post("/tasks", async (req, res) => {
    const task = await Task.create(req.body);
    res.json(task);
});

// ADD MULTIPLE TASKS
app.post("/tasks/bulk", async (req, res) => {
    const tasks = await Task.insertMany(req.body);
    res.json({
        message: "Tasks added successfully!",
        total: tasks.length,
        tasks: tasks
    });
});

// UPDATE TASK
app.put("/tasks/:id", async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedTask);
});

// DELETE TASK
app.delete("/tasks/:id", async (req, res) => {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.json(deletedTask);
});

// Server
app.listen(3000, () => {
    console.log("App is listening on port 3000");
});
