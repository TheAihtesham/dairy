"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import PurchaseForm from "../components/PurchaseForm";
import { ShoppingCart, PlusCircle, Edit, Trash2 } from "lucide-react";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [editPurchase, setEditPurchase] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, purchases]);

  const fetchPurchases = async () => {
    try {
      const res = await api.get("/api/purchases");
      setPurchases(res.data);
      setFilteredPurchases(res.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  const applyFilters = () => {
    let data = [...purchases];
    if (search) {
      data = data.filter(
        (p) =>
          p.milk_type.toLowerCase().includes(search.toLowerCase()) ||
          p.supplier?.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredPurchases(data);
  };

  const deletePurchase = async (id) => {
    if (!confirm("Are you sure you want to delete this purchase?")) return;
    try {
      await api.delete(`/api/purchases/${id}`);
      fetchPurchases();
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <ShoppingCart size={28} /> Purchases
        </h1>
        <button
          onClick={() => setEditPurchase({})}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          <PlusCircle size={18} /> Add Purchase
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by supplier or milk type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3 shadow-sm"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg shadow-sm bg-white">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="border p-3 text-left">Supplier</th>
              <th className="border p-3 text-left">Milk Type</th>
              <th className="border p-3 text-left">Quantity (L)</th>
              <th className="border p-3 text-left">Rate</th>
              <th className="border p-3 text-left">Total Cost</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.length > 0 ? (
              filteredPurchases.map((p) => (
                <tr key={p.purchase_id} className="hover:bg-gray-50 transition">
                  <td className="border p-2">{p.supplier?.name}</td>
                  <td className="border p-2">{p.milk_type}</td>
                  <td className="border p-2">{p.quantity_litres}</td>
                  <td className="border p-2">₹{p.rate}</td>
                  <td className="border p-2 font-semibold text-red-700">
                    ₹{p.total_cost}
                  </td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button
                      onClick={() => setEditPurchase(p)}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => deletePurchase(p.purchase_id)}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No purchases found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {editPurchase && (
        <PurchaseForm
          purchase={editPurchase}
          onClose={() => setEditPurchase(null)}
          onSaved={fetchPurchases}
        />
      )}
    </div>
  );
}
