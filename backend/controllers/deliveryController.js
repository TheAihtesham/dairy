import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ➡️ Create Delivery
export const createDelivery = async (req, res) => {
  try {
    const { customer_id, milk_type, quantity_litres, rate_per_litre } = req.body;

    const total_amount = parseFloat(quantity_litres) * parseFloat(rate_per_litre);

    const delivery = await prisma.delivery.create({
      data: {
        customer_id,
        milk_type,
        quantity_litres: parseFloat(quantity_litres),
        rate_per_litre: parseFloat(rate_per_litre),
        total_amount,
      },
      include: { customer: true },
    });

    res.status(201).json(delivery);
  } catch (error) {
    console.error("Create Delivery Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get All Deliveries
export const getDeliveries = async (req, res) => {
  try {
    const deliveries = await prisma.delivery.findMany({
      orderBy: { delivery_id: "desc" },
      include: { customer: true },
    });
    res.json(deliveries);
  } catch (error) {
    console.error("Get Deliveries Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get Delivery by ID
export const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await prisma.delivery.findUnique({
      where: { delivery_id: id },
      include: { customer: true },
    });

    if (!delivery) return res.status(404).json({ error: "Delivery not found" });

    res.json(delivery);
  } catch (error) {
    console.error("Get Delivery Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Update Delivery
export const updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, milk_type, quantity_litres, rate_per_litre } = req.body;

    const total_amount = parseFloat(quantity_litres) * parseFloat(rate_per_litre);

    const updatedDelivery = await prisma.delivery.update({
      where: { delivery_id: id },
      data: {
        customer_id,
        milk_type,
        quantity_litres: parseFloat(quantity_litres),
        rate_per_litre: parseFloat(rate_per_litre),
        total_amount,
      },
      include: { customer: true },
    });

    res.json(updatedDelivery);
  } catch (error) {
    console.error("Update Delivery Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Delete Delivery
export const deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.delivery.delete({
      where: { delivery_id: id },
    });

    res.json({ message: "Delivery deleted successfully" });
  } catch (error) {
    console.error("Delete Delivery Error:", error);
    res.status(500).json({ error: error.message });
  }
};
