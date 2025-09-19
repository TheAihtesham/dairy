"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function PurchaseForm({ purchase, onClose, onSaved }) {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    supplier_id: "",
    milk_type: "",
    quantity_litres: "",
    rate: "",
  });

  useEffect(() => {
    fetchSuppliers();
    if (purchase) {
      setForm({
        supplier_id: purchase.supplier_id || "",
        milk_type: purchase.milk_type || "",
        quantity_litres: purchase.quantity_litres ?? "",
        rate: purchase.rate ?? "",
      });
    }
  }, [purchase]);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/api/suppliers");
      setSuppliers(res.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (purchase && purchase.purchase_id) {
        await api.put(`/api/purchases/${purchase.purchase_id}`, form);
      } else {
        await api.post("/api/purchases", form);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving purchase:", error);
      alert("Failed to save purchase. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          {purchase && purchase.purchase_id ? "Edit Purchase" : "Add Purchase"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Supplier Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier
            </label>
            <select
              name="supplier_id"
              value={form.supplier_id || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded shadow-sm"
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s.supplier_id} value={s.supplier_id}>
                  {s.name}
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
              name="rate"
              value={form.rate}
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
