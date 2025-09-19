"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import DeliveryForm from "../components/DeliveryForm";
import { Truck, PlusCircle, Edit, Trash2 } from "lucide-react";

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [search, setSearch] = useState("");
  const [editDelivery, setEditDelivery] = useState(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, deliveries]);

  const fetchDeliveries = async () => {
    try {
      const res = await api.get("/api/deliveries");
      setDeliveries(res.data);
      setFilteredDeliveries(res.data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    }
  };

  const applyFilters = () => {
    let data = [...deliveries];
    if (search) {
      data = data.filter(
        (d) =>
          d.milk_type.toLowerCase().includes(search.toLowerCase()) ||
          d.customer?.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredDeliveries(data);
  };

  const deleteDelivery = async (id) => {
    if (!confirm("Are you sure you want to delete this delivery?")) return;
    try {
      await api.delete(`/api/deliveries/${id}`);
      fetchDeliveries();
    } catch (error) {
      console.error("Error deleting delivery:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <Truck size={28} /> Deliveries
        </h1>
        <button
          onClick={() => setEditDelivery({})}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          <PlusCircle size={18} /> Add Delivery
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by customer or milk type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3 shadow-sm"
        />
      </div>

      {/* Deliveries Table */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg shadow-sm bg-white">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="border p-3 text-left">Customer</th>
              <th className="border p-3 text-left">Milk Type</th>
              <th className="border p-3 text-left">Quantity (L)</th>
              <th className="border p-3 text-left">Rate/Litre</th>
              <th className="border p-3 text-left">Total</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((d) => (
                <tr key={d.delivery_id} className="hover:bg-gray-50 transition">
                  <td className="border p-2">{d.customer?.name}</td>
                  <td className="border p-2">{d.milk_type}</td>
                  <td className="border p-2">{d.quantity_litres}</td>
                  <td className="border p-2">₹{d.rate_per_litre}</td>
                  <td className="border p-2 font-semibold text-green-700">
                    ₹{d.total_amount}
                  </td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button
                      onClick={() => setEditDelivery(d)}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => deleteDelivery(d.delivery_id)}
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
                  No deliveries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {editDelivery && (
        <DeliveryForm
          delivery={editDelivery}
          onClose={() => setEditDelivery(null)}
          onSaved={fetchDeliveries}
        />
      )}
    </div>
  );
}
