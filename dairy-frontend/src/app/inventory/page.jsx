"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import InventoryForm from "../components/InventoryForm";
import { Edit, Trash2, PlusCircle, Package } from "lucide-react";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, inventory]);

  const fetchInventory = async () => {
    try {
      const res = await api.get("/api/inventory");
      setInventory(res.data);
      setFilteredInventory(res.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const applyFilters = () => {
    let data = [...inventory];
    if (search) {
      data = data.filter((i) =>
        i.product_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredInventory(data);
  };

  const deleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;
    try {
      await api.delete(`/api/inventory/${id}`);
      fetchInventory();
    } catch (error) {
      console.error("Error deleting inventory:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <Package size={26} /> Inventory
        </h1>
        <button
          onClick={() => {
            setEditItem(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          <PlusCircle size={18} /> Add Inventory
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by product name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3 shadow-sm"
        />
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border rounded-lg">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="p-2 border">Product Name</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Manufactured On</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <tr
                  key={item.inventory_id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="p-2 border font-semibold">{item.product_name}</td>
                  <td className="p-2 border">{item.quantity}</td>
                  <td className="p-2 border">{item.unit}</td>
                  <td className="p-2 border">
                    {item.manufacturing
                      ? new Date(
                          item.manufacturing.createdAt || item.manufacturing_id
                        ).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => {
                        setEditItem(item);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => deleteItem(item.inventory_id)}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No inventory records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <InventoryForm
          item={editItem}
          onClose={() => setShowForm(false)}
          onSaved={fetchInventory}
        />
      )}
    </div>
  );
}
