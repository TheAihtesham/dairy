"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function DeliveryForm({ delivery, onClose, onSaved }) {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    customer_id: "",
    milk_type: "",
    quantity_litres: "",
    rate_per_litre: "",
  });

  useEffect(() => {
    fetchCustomers();
    if (delivery) {
      setForm({
        customer_id: delivery.customer_id || "",
        milk_type: delivery.milk_type || "",
        quantity_litres: delivery.quantity_litres ?? "",
        rate_per_litre: delivery.rate_per_litre ?? "",
      });
    }
  }, [delivery]);

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
      if (delivery && delivery.delivery_id) {
        await api.put(`/api/deliveries/${delivery.delivery_id}`, form);
      } else {
        await api.post("/api/deliveries", form);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving delivery:", error);
      alert("Failed to save delivery. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          {delivery && delivery.delivery_id ? "Edit Delivery" : "Add Delivery"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer
            </label>
            <select
              name="customer_id"
              value={form.customer_id || ""}
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

          {/* Milk Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Milk Type
            </label>
            <input
              type="text"
              name="milk_type"
              value={form.milk_type}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm"
              placeholder="e.g. Cow, Buffalo"
              required
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity (Litres)
            </label>
            <input
              type="number"
              step="0.01"
              name="quantity_litres"
              value={form.quantity_litres}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm"
              placeholder="Quantity in Litres"
              required
            />
          </div>

          {/* Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate per Litre
            </label>
            <input
              type="number"
              step="0.01"
              name="rate_per_litre"
              value={form.rate_per_litre}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm"
              placeholder="Rate per Litre"
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
