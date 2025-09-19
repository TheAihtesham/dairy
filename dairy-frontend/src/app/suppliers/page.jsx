"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import SupplierForm from "../components/SupplierForm";
import { Edit, Trash2, UserPlus } from "lucide-react";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, suppliers]);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/api/suppliers");
      setSuppliers(res.data);
      setFilteredSuppliers(res.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const applyFilters = () => {
    let data = [...suppliers];

    if (search) {
      data = data.filter(
        (sup) =>
          sup.name.toLowerCase().includes(search.toLowerCase()) ||
          sup.milk_type.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredSuppliers(data);
  };

  const deleteSupplier = async (id) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await api.delete(`/api/suppliers/${id}`);
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Suppliers</h1>
        <button
          onClick={() => {
            setEditSupplier(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          <UserPlus size={18} />
          Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or milk type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3 shadow-sm"
        />
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.length > 0 ? (
          filteredSuppliers.map((sup) => (
            <div
              key={sup.supplier_id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {sup.name}
              </h2>
              <p className="text-sm text-gray-600">{sup.milk_type}</p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Contact:</span> {sup.contact}
              </p>
              <p className="text-sm">
                <span className="font-medium">Address:</span> {sup.address}
              </p>
              <p className="text-sm">
                <span className="font-medium">Rate/Litre:</span> ₹
                {sup.rate_per_litre}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditSupplier(sup);
                    setShowForm(true);
                  }}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => deleteSupplier(sup.supplier_id)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No suppliers found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <SupplierForm
          supplier={editSupplier}
          onClose={() => setShowForm(false)}
          onSaved={fetchSuppliers}
        />
      )}
    </div>
  );
}
