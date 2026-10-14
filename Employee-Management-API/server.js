
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/employees")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((error) => console.log("MongoDB Connection Error:", error));

// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  department: {
    type: String
  },
  designation: {
    type: String
  },
  salary: {
    type: Number
  },
  joiningDate: {
    type: Date
  },
  status: {
    type: String
  }
});

// Employee Model
const Employee = mongoose.model("Employee", employeeSchema);

// Home Route
app.get("/", (req, res) => {
  res.send("Employee Management API is Running");
});

// GET All Employees
app.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET Single Employee
app.get("/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: "Invalid employee ID" });
  }
});

// POST Create Employee
app.post("/employees", async (req, res) => {
  try {
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();

    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// POST Bulk Insert Employees
app.post("/employees/bulk", async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({
        message: "Please send an array of employees"
      });
    }

    const employees = await Employee.insertMany(req.body);

    res.status(201).json({
      message: "Employees added successfully",
      count: employees.length,
      data: employees
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT Update Employee
app.put("/employees/:id", async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE Employee
app.delete("/employees/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
      data: deletedEmployee
    });
  } catch (error) {
    res.status(400).json({ message: "Invalid employee ID" });
  }
});

// Start Server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
