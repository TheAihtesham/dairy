import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ➡️ Create Milk Rate
export const createMilkRate = async (req, res) => {
  try {
    const { milk_type, rate_per_litre, effective_from } = req.body;

    const milkRate = await prisma.milkRate.create({
      data: {
        milk_type,
        rate_per_litre: parseFloat(rate_per_litre),
        effective_from: new Date(effective_from),
      },
    });

    res.status(201).json(milkRate);
  } catch (error) {
    console.error("Create MilkRate Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get All Milk Rates
export const getMilkRates = async (req, res) => {
  try {
    const milkRates = await prisma.milkRate.findMany({
      orderBy: { effective_from: "desc" },
      include: { manufacturing: true }, // also show linked manufacturing
    });
    res.json(milkRates);
  } catch (error) {
    console.error("Get MilkRates Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get Milk Rate by ID
export const getMilkRateById = async (req, res) => {
  try {
    const { id } = req.params;

    const milkRate = await prisma.milkRate.findUnique({
      where: { rate_id: id },
      include: { manufacturing: true },
    });

    if (!milkRate) return res.status(404).json({ error: "Milk rate not found" });

    res.json(milkRate);
  } catch (error) {
    console.error("Get MilkRate Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Update Milk Rate
export const updateMilkRate = async (req, res) => {
  try {
    const { id } = req.params;
    const { milk_type, rate_per_litre, effective_from } = req.body;

    const updatedMilkRate = await prisma.milkRate.update({
      where: { rate_id: id },
      data: {
        milk_type,
        rate_per_litre: parseFloat(rate_per_litre),
        effective_from: new Date(effective_from),
      },
    });

    res.json(updatedMilkRate);
  } catch (error) {
    console.error("Update MilkRate Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Delete Milk Rate
export const deleteMilkRate = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.milkRate.delete({
      where: { rate_id: id },
    });

    res.json({ message: "Milk rate deleted successfully" });
  } catch (error) {
    console.error("Delete MilkRate Error:", error);
    res.status(500).json({ error: error.message });
  }
};
