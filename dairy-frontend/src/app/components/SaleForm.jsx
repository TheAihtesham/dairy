"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function SaleForm({ sale, onClose, onSaved }) {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customer_id: "",
    product_name: "",
    quantity: "",
    rate_per_unit: "",
    sale_date: "",
  });

  useEffect(() => {
    fetchCustomers();
    if (sale) {
      setForm({
        customer_id: sale.customer_id || "",
        product_name: sale.product_name || "",
        quantity: sale.quantity || "",
        rate_per_unit: sale.rate_per_unit || "",
        sale_date: sale.sale_date
          ? new Date(sale.sale_date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [sale]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/api/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (sale && sale.sale_id) {
        await api.put(`/api/sales/${sale.sale_id}`, form);
      } else {
        await api.post("/api/sales", form);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving sale:", error);
      alert("Failed to save sale. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          {sale && sale.sale_id ? "Edit Sale" : "Add Sale"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer
            </label>
            <select
              name="customer_id"
              value={form.customer_id}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.customer_id} value={c.customer_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="product_name"
              value={form.product_name}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm"
              placeholder="Product Name"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              step="0.01"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm"
              placeholder="Quantity"
              required
            />
          </div>

          {/* Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate per Unit
            </label>
            <input
              type="number"
              step="0.01"
              name="rate_per_unit"
              value={form.rate_per_unit}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm"
              placeholder="Rate per Unit"
              required
            />
          </div>

          {/* Sale Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sale Date
            </label>
            <input
              type="date"
              name="sale_date"
              value={form.sale_date}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
