import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ➡️ Create Sale
export const createSale = async (req, res) => {
  try {
    const { customer_id, product_name, quantity, rate_per_unit, sale_date } = req.body;

    const total_amount = parseFloat(quantity) * parseFloat(rate_per_unit);

    const sale = await prisma.sale.create({
      data: {
        customer_id,
        product_name,
        quantity: parseFloat(quantity),
        rate_per_unit: parseFloat(rate_per_unit),
        total_amount,
        sale_date: sale_date ? new Date(sale_date) : new Date(),
      },
      include: { customer: true },
    });

    res.status(201).json(sale);
  } catch (error) {
    console.error("Create Sale Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get All Sales
export const getSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      orderBy: { sale_date: "desc" },
      include: { customer: true },
    });
    res.json(sales);
  } catch (error) {
    console.error("Get Sales Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get Sale by ID
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await prisma.sale.findUnique({
      where: { sale_id: id },
      include: { customer: true },
    });

    if (!sale) return res.status(404).json({ error: "Sale not found" });

    res.json(sale);
  } catch (error) {
    console.error("Get Sale Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Update Sale
export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_id, product_name, quantity, rate_per_unit, sale_date } = req.body;

    const total_amount = parseFloat(quantity) * parseFloat(rate_per_unit);

    const updatedSale = await prisma.sale.update({
      where: { sale_id: id },
      data: {
        customer_id,
        product_name,
        quantity: parseFloat(quantity),
        rate_per_unit: parseFloat(rate_per_unit),
        total_amount,
        sale_date: sale_date ? new Date(sale_date) : new Date(),
      },
      include: { customer: true },
    });

    res.json(updatedSale);
  } catch (error) {
    console.error("Update Sale Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Delete Sale
export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.sale.delete({
      where: { sale_id: id },
    });

    res.json({ message: "Sale deleted successfully" });
  } catch (error) {
    console.error("Delete Sale Error:", error);
    res.status(500).json({ error: error.message });
  }
};
