"use client";
import { useState, useEffect } from "react";
import api from "../lib/api";

export default function ProductForm({ product, onClose, onSaved }) {
  const [milkRates, setMilkRates] = useState([]);
  const [form, setForm] = useState({
    product_name: "",
    milk_used_litres: "",
    quantity_produced: "",
    unit: "",
    cost_of_production: "",
    rate_id: "",
  });

  useEffect(() => {
    fetchMilkRates();
    if (product) {
      setForm({
        product_name: product.product_name,
        milk_used_litres: product.milk_used_litres,
        quantity_produced: product.quantity_produced,
        unit: product.unit,
        cost_of_production: product.cost_of_production,
        rate_id: product.rate_id,
      });
    }
  }, [product]);

  const fetchMilkRates = async () => {
    try {
      const res = await api.get("/api/milkrates");
      setMilkRates(res.data);
    } catch (error) {
      console.error("Error fetching milk rates:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) {
        await api.put(`/api/products/${product.manufacturing_id}`, form);
      } else {
        await api.post("/api/products", form);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          {product ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Milk Used */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Milk Used (Litres)
            </label>
            <input
              type="number"
              step="0.01"
              name="milk_used_litres"
              value={form.milk_used_litres}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Quantity Produced */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity Produced
            </label>
            <input
              type="number"
              step="0.01"
              name="quantity_produced"
              value={form.quantity_produced}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit (e.g. kg, litre, packet)
            </label>
            <input
              type="text"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost of Production
            </label>
            <input
              type="number"
              step="0.01"
              name="cost_of_production"
              value={form.cost_of_production}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Milk Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Milk Rate
            </label>
            <select
              name="rate_id"
              value={form.rate_id}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="">Select Milk Rate</option>
              {milkRates.map((rate) => (
                <option key={rate.rate_id} value={rate.rate_id}>
                  {rate.milk_type} – ₹{rate.rate_per_litre} (from{" "}
                  {new Date(rate.effective_from).toLocaleDateString()})
                </option>
              ))}
            </select>
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
              {product ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
