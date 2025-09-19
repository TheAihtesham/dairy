"use client";
import { useState, useEffect } from "react";
import api from "../lib/api";

export default function MilkRateForm({ milkRate, onClose, onSaved }) {
  const [form, setForm] = useState({
    milk_type: "",
    rate_per_litre: "",
    effective_from: "",
  });

  useEffect(() => {
    if (milkRate) {
      setForm({
        milk_type: milkRate.milk_type || "",
        rate_per_litre: milkRate.rate_per_litre || "",
        effective_from: milkRate.effective_from
          ? new Date(milkRate.effective_from).toISOString().slice(0, 10)
          : "",
      });
    }
  }, [milkRate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (milkRate) {
        await api.put(`/api/milkrates/${milkRate.rate_id}`, form);
      } else {
        await api.post("/api/milkrates", form);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving milk rate:", error);
      alert("Failed to save milk rate. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          {milkRate ? "Edit Milk Rate" : "Add Milk Rate"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Milk Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Milk Type
            </label>
            <input
              type="text"
              name="milk_type"
              value={form.milk_type || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Rate per litre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate per Litre
            </label>
            <input
              type="number"
              step="0.01"
              name="rate_per_litre"
              value={form.rate_per_litre || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Effective from date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effective From
            </label>
            <input
              type="date"
              name="effective_from"
              value={form.effective_from || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

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
              {milkRate ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
