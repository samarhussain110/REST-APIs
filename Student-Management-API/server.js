const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/students")
.then(() => {
    console.log("MongoDB Connected Successfully!");
})
.catch((error) => {
    console.log("Failed: ", error);
});

// Schema
const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    course: String,
    marks: Number
});

// Model
const Student = mongoose.model("Student", studentSchema);


app.post("/students/bulk", async (req, res) => {
    const students = await Student.insertMany(req.body);
    res.json({
        message: "40 students added successfully!",
        total: students.length,
        students: students
    });
});


// GET STUDENTS
app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// ADD STUDENT
app.post("/students", async (req, res) => {
    const student = await Student.create(req.body);
    res.json(student);
});

// UPDATE STUDENT
app.put("/students/:id", async (req, res) => {
    const updateStd = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updateStd);
});

// DELETE STUDENT
app.delete("/students/:id", async (req, res) => {
    const delStd = await Student.findByIdAndDelete(
        req.params.id
    );

    res.json(delStd);
});

// Listening
app.listen(3000, () => {
    console.log("App is listening on port 3000");
});