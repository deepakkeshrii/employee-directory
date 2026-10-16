
const Employee = require("../models/Employee");

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create an employee
const createEmployee = async (req, res) => {
  try {
    console.log("POST body received:", req.body);

    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        message: "Name, email, and role are required",
      });
    }

    const employee = new Employee({ name, email, role });
    const savedEmployee = await employee.save();

    console.log("Employee saved:", savedEmployee);

    return res.status(201).json({
      message: "Employee saved successfully",
      employee: savedEmployee,
    });
  } catch (error) {
    console.error("Save error:", error);

    return res.status(error.code === 11000 ? 409 : 400).json({
      message: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
