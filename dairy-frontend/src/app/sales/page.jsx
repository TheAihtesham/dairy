"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import SaleForm from "../components/SaleForm";
import { DollarSign, PlusCircle, Edit, Trash2 } from "lucide-react";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [search, setSearch] = useState("");
  const [editSale, setEditSale] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, sales]);

  const fetchSales = async () => {
    try {
      const res = await api.get("/api/sales");
      setSales(res.data);
      setFilteredSales(res.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  const applyFilters = () => {
    let data = [...sales];
    if (search) {
      data = data.filter(
        (s) =>
          s.product_name.toLowerCase().includes(search.toLowerCase()) ||
          s.customer?.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredSales(data);
  };

  const deleteSale = async (id) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;
    try {
      await api.delete(`/api/sales/${id}`);
      fetchSales();
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <DollarSign size={28} /> Sales
        </h1>
        <button
          onClick={() => setEditSale({})}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          <PlusCircle size={18} /> Add Sale
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product or customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3 shadow-sm"
        />
      </div>

      {/* Sales Table */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg shadow-sm bg-white">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="border p-3 text-left">Date</th>
              <th className="border p-3 text-left">Customer</th>
              <th className="border p-3 text-left">Product</th>
              <th className="border p-3 text-left">Quantity</th>
              <th className="border p-3 text-left">Rate</th>
              <th className="border p-3 text-left">Total</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((s) => (
                <tr key={s.sale_id} className="hover:bg-gray-50 transition">
                  <td className="border p-2">
                    {new Date(s.sale_date).toLocaleDateString()}
                  </td>
                  <td className="border p-2">{s.customer?.name}</td>
                  <td className="border p-2">{s.product_name}</td>
                  <td className="border p-2">{s.quantity}</td>
                  <td className="border p-2">₹{s.rate_per_unit}</td>
                  <td className="border p-2 font-semibold text-green-700">
                    ₹{s.total_amount}
                  </td>
                  <td className="border-1 border-gray-400 p-2 flex justify-center gap-2">
                    <button
                      onClick={() => setEditSale(s)}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => deleteSale(s.sale_id)}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No sales found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {editSale && (
        <SaleForm
          sale={editSale}
          onClose={() => setEditSale(null)}
          onSaved={fetchSales}
        />
      )}
    </div>
  );
}
