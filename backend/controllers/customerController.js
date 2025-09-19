import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ➡️ Create Customer
export const createCustomer = async (req, res) => {
  try {
    const { name, contact, address, type } = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        contact,
        address,
        type,
      },
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Create Customer Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get All Customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { name: "asc" },
      include: { sales: true, deliveries: true }, // include relations
    });
    res.json(customers);
  } catch (error) {
    console.error("Get Customers Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get Customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { customer_id: id },
      include: { sales: true, deliveries: true },
    });

    if (!customer) return res.status(404).json({ error: "Customer not found" });

    res.json(customer);
  } catch (error) {
    console.error("Get Customer Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Update Customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, address, type } = req.body;

    const updatedCustomer = await prisma.customer.update({
      where: { customer_id: id },
      data: {
        name,
        contact,
        address,
        type,
      },
    });

    res.json(updatedCustomer);
  } catch (error) {
    console.error("Update Customer Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Delete Customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.customer.delete({
      where: { customer_id: id },
    });

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Delete Customer Error:", error);
    res.status(500).json({ error: error.message });
  }
};
