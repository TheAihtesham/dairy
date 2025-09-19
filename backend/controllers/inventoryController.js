import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ➡️ Get All Inventory
export const getInventory = async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: { manufacturing: true },
      orderBy: { product_name: "asc" },
    });
    res.json(inventory);
  } catch (error) {
    console.error("Get Inventory Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get Inventory by ID
export const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.inventory.findUnique({
      where: { inventory_id: id },
      include: { manufacturing: true },
    });

    if (!item) return res.status(404).json({ error: "Inventory item not found" });

    res.json(item);
  } catch (error) {
    console.error("Get Inventory Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Add Inventory Item (rare case, normally added via product creation)
export const addInventory = async (req, res) => {
  try {
    const { product_name, quantity, unit, manufacturing_id } = req.body;

    const item = await prisma.inventory.create({
      data: {
        product_name,
        quantity: parseFloat(quantity),
        unit,
        manufacturing_id,
      },
    });

    res.status(201).json(item);
  } catch (error) {
    console.error("Add Inventory Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Update Inventory (adjust stock)
export const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, quantity, unit } = req.body;

    const updated = await prisma.inventory.update({
      where: { inventory_id: id },
      data: {
        product_name,
        quantity: parseFloat(quantity),
        unit,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("Update Inventory Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Delete Inventory Item
export const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.inventory.delete({
      where: { inventory_id: id },
    });

    res.json({ message: "Inventory item deleted successfully" });
  } catch (error) {
    console.error("Delete Inventory Error:", error);
    res.status(500).json({ error: error.message });
  }
};
