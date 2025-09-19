"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import MilkRateForm from "../components/MilkRateForm";
import MilkRateHistory from "../components/MilkRateHistory";
import { Edit, Trash2, Clock, PlusCircle } from "lucide-react";

export default function MilkRatesPage() {
  const [milkRates, setMilkRates] = useState([]);
  const [filteredRates, setFilteredRates] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMilkRate, setEditMilkRate] = useState(null);
  const [historyMilkType, setHistoryMilkType] = useState(null);

  useEffect(() => {
    fetchMilkRates();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, milkRates]);

  const fetchMilkRates = async () => {
    try {
      const res = await api.get("/api/milkrates");
      setMilkRates(res.data);
      setFilteredRates(res.data);
    } catch (error) {
      console.error("Error fetching milk rates:", error);
    }
  };

  const applyFilters = () => {
    let data = [...milkRates];
    if (search) {
      data = data.filter((r) =>
        r.milk_type.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredRates(data);
  };

  const deleteMilkRate = async (id) => {
    if (!confirm("Are you sure you want to delete this milk rate?")) return;
    try {
      await api.delete(`/api/milkrates/${id}`);
      fetchMilkRates();
    } catch (error) {
      console.error("Error deleting milk rate:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Milk Rates</h1>
        <button
          onClick={() => {
            setEditMilkRate(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          <PlusCircle size={18} />
          Add Milk Rate
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by milk type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3 shadow-sm"
        />
      </div>

      {/* Milk Rate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRates.length > 0 ? (
          filteredRates.map((r) => (
            <div
              key={r.rate_id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {r.milk_type}
              </h2>
              <p className="text-sm text-gray-600">
                Effective from:{" "}
                {new Date(r.effective_from).toLocaleDateString()}
              </p>
              <p className="mt-2 text-sm font-medium text-blue-700">
                ₹{r.rate_per_litre} / Litre
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setHistoryMilkType(r.milk_type)}
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  <Clock size={14} /> History
                </button>
                <button
                  onClick={() => {
                    setEditMilkRate(r);
                    setShowForm(true);
                  }}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => deleteMilkRate(r.rate_id)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No milk rates found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <MilkRateForm
          milkRate={editMilkRate}
          onClose={() => setShowForm(false)}
          onSaved={fetchMilkRates}
        />
      )}

      {/* History Modal */}
      {historyMilkType && (
        <MilkRateHistory
          milkType={historyMilkType}
          onClose={() => setHistoryMilkType(null)}
        />
      )}
    </div>
  );
}
