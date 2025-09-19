import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ➡️ Create Purchase
export const createPurchase = async (req, res) => {
  try {
    const { supplier_id, milk_type, quantity_litres, rate } = req.body;

    const total_cost = parseFloat(quantity_litres) * parseFloat(rate);

    const purchase = await prisma.supplierPurchase.create({
      data: {
        supplier_id,
        milk_type,
        quantity_litres: parseFloat(quantity_litres),
        rate: parseFloat(rate),
        total_cost,
      },
      include: { supplier: true },
    });

    res.status(201).json(purchase);
  } catch (error) {
    console.error("Create Purchase Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get All Purchases
export const getPurchases = async (req, res) => {
  try {
    const purchases = await prisma.supplierPurchase.findMany({
      orderBy: { purchase_id: "desc" },
      include: { supplier: true },
    });
    res.json(purchases);
  } catch (error) {
    console.error("Get Purchases Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get Purchase by ID
export const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const purchase = await prisma.supplierPurchase.findUnique({
      where: { purchase_id: id },
      include: { supplier: true },
    });

    if (!purchase) return res.status(404).json({ error: "Purchase not found" });

    res.json(purchase);
  } catch (error) {
    console.error("Get Purchase Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Update Purchase
export const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplier_id, milk_type, quantity_litres, rate } = req.body;

    const total_cost = parseFloat(quantity_litres) * parseFloat(rate);

    const updatedPurchase = await prisma.supplierPurchase.update({
      where: { purchase_id: id },
      data: {
        supplier_id,
        milk_type,
        quantity_litres: parseFloat(quantity_litres),
        rate: parseFloat(rate),
        total_cost,
      },
      include: { supplier: true },
    });

    res.json(updatedPurchase);
  } catch (error) {
    console.error("Update Purchase Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Delete Purchase
export const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.supplierPurchase.delete({
      where: { purchase_id: id },
    });

    res.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.error("Delete Purchase Error:", error);
    res.status(500).json({ error: error.message });
  }
};
