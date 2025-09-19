import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ➡️ Create Product (Manufacturing + Inventory entry)
export const createProduct = async (req, res) => {
  try {
    const {
      product_name,
      milk_used_litres,
      quantity_produced,
      unit,
      cost_of_production,
      rate_id,
    } = req.body;

    const product = await prisma.productManufacturing.create({
      data: {
        product_name,
        milk_used_litres: parseFloat(milk_used_litres),
        quantity_produced: parseFloat(quantity_produced),
        unit,
        cost_of_production: parseFloat(cost_of_production),
        rate_id,
        inventory: {
          create: {
            product_name,
            quantity: parseFloat(quantity_produced),
            unit,
          },
        },
      },
      include: { milkRate: true, inventory: true },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.productManufacturing.findMany({
      include: { milkRate: true, inventory: true },
      orderBy: { product_name: "asc" },
    });
    res.json(products);
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.productManufacturing.findUnique({
      where: { manufacturing_id: id },
      include: { milkRate: true, inventory: true },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Update Product (and Inventory)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_name,
      milk_used_litres,
      quantity_produced,
      unit,
      cost_of_production,
      rate_id,
    } = req.body;

    const updatedProduct = await prisma.productManufacturing.update({
      where: { manufacturing_id: id },
      data: {
        product_name,
        milk_used_litres: parseFloat(milk_used_litres),
        quantity_produced: parseFloat(quantity_produced),
        unit,
        cost_of_production: parseFloat(cost_of_production),
        rate_id,
        inventory: {
          updateMany: {
            where: { manufacturing_id: id },
            data: {
              product_name,
              quantity: parseFloat(quantity_produced),
              unit,
            },
          },
        },
      },
      include: { milkRate: true, inventory: true },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ➡️ Delete Product (and Inventory)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // delete inventory first (due to relation)
    await prisma.inventory.deleteMany({
      where: { manufacturing_id: id },
    });

    await prisma.productManufacturing.delete({
      where: { manufacturing_id: id },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ error: error.message });
  }
};
