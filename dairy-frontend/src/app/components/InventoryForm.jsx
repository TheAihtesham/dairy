"use client";
import { useState, useEffect } from "react";
import api from "../lib/api";

export default function InventoryForm({ item, onClose, onSaved }) {
  const [form, setForm] = useState({
    product_name: "",
    quantity: "",
    unit: "",
  });

  useEffect(() => {
    if (item) {
      setForm({
        product_name: item.product_name,
        quantity: item.quantity,
        unit: item.unit,
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (item) {
        // Edit
        await api.put(`/api/inventory/${item.inventory_id}`, form);
      } else {
        // Add new
        await api.post("/api/inventory", form);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving inventory:", error);
      alert("Failed to save inventory. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          {item ? "Edit Inventory" : "Add Inventory"}
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
              placeholder="Product Name"
              value={form.product_name}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
              placeholder="Quantity"
              value={form.quantity}
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
              placeholder="Unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
              {item ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
