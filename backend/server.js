import express from "express";
import cors from "cors";
import employeeRoutes from "./routes/employeeRoute.js";
import supplierRoutes from "./routes/supplierRoute.js";
import customerRoutes from "./routes/customerRoute.js";
import milkRateRoutes from "./routes/milkRateRoute.js";
import productRoutes from "./routes/productRoute.js";
import inventoryRoutes from "./routes/inventoryRoute.js";
import saleRoutes from "./routes/saleRoute.js";
import deliveryRoute from "./routes/deliveryRoute.js"
import purchaseRoutes from "./routes/purchaseRoute.js"

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/milkrates", milkRateRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/deliveries", deliveryRoute);
app.use("/api/purchases", purchaseRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
