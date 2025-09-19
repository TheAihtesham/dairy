import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ➡️ Create Employee
export const createEmployee = async (req, res) => {
  try {
    const { name, role, contact, address, salary, joining_date } = req.body;

    const employee = await prisma.employee.create({
      data: {
        name,
        role,
        contact,
        address,
        salary: parseFloat(salary),
        joining_date: new Date(joining_date),
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error("Create Employee Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get All Employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { joining_date: "desc" },
    });
    res.json(employees);
  } catch (error) {
    console.error("Get Employees Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get Employee by ID
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { employee_id: id },
    });

    if (!employee) return res.status(404).json({ error: "Employee not found" });

    res.json(employee);
  } catch (error) {
    console.error("Get Employee Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Update Employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, contact, address, salary, joining_date } = req.body;

    const updatedEmployee = await prisma.employee.update({
      where: { employee_id: id },
      data: {
        name,
        role,
        contact,
        address,
        salary: salary ? parseFloat(salary) : undefined,
        joining_date: joining_date ? new Date(joining_date) : undefined,
      },
    });

    res.json(updatedEmployee);
  } catch (error) {
    console.error("Update Employee Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.employee.delete({
      where: { employee_id: id },
    });

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error("Delete Employee Error:", error);
    res.status(500).json({ error: error.message });
  }
};
