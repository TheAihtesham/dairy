import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ➡️ Create Supplier
export const createSupplier = async (req, res) => {
  try {
    const { name, contact, address, milk_type, rate_per_litre } = req.body;

    const supplier = await prisma.supplier.create({
      data: {
        name,
        contact,
        address,
        milk_type,
        rate_per_litre: parseFloat(rate_per_litre),
      },
    });

    res.status(201).json(supplier);
  } catch (error) {
    console.error("Create Supplier Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get All Suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: "asc" },
      include: { purchases: true }, // show supplier purchases
    });
    res.json(suppliers);
  } catch (error) {
    console.error("Get Suppliers Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get Supplier by ID
export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await prisma.supplier.findUnique({
      where: { supplier_id: id },
      include: { purchases: true },
    });

    if (!supplier) return res.status(404).json({ error: "Supplier not found" });

    res.json(supplier);
  } catch (error) {
    console.error("Get Supplier Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Update Supplier
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contact, address, milk_type, rate_per_litre } = req.body;

    const updatedSupplier = await prisma.supplier.update({
      where: { supplier_id: id },
      data: {
        name,
        contact,
        address,
        milk_type,
        rate_per_litre: rate_per_litre ? parseFloat(rate_per_litre) : undefined,
      },
    });

    res.json(updatedSupplier);
  } catch (error) {
    console.error("Update Supplier Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Delete Supplier
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.supplier.delete({
      where: { supplier_id: id },
    });

    res.json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Delete Supplier Error:", error);
    res.status(500).json({ error: error.message });
  }
};
