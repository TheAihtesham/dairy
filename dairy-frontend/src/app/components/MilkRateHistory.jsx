"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function MilkRateHistory({ milkType, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (milkType) fetchHistory();
  }, [milkType]);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/api/milkrates");
      // Filter only selected milk type
      const filtered = res.data
        .filter((r) => r.milk_type.toLowerCase() === milkType.toLowerCase())
        .sort(
          (a, b) =>
            new Date(b.effective_from).getTime() -
            new Date(a.effective_from).getTime()
        );
      setHistory(filtered);
    } catch (error) {
      console.error("Error fetching milk rate history:", error);
    }
  };

  if (!milkType) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 overflow-auto">
      <div className="bg-white p-6 rounded shadow-md w-[700px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          Milk Rate History – {milkType}
        </h2>

        {history.length > 0 ? (
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Effective From</th>
                <th className="border p-2">Rate per Litre</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r) => (
                <tr key={r.rate_id}>
                  <td className="border p-2">
                    {new Date(r.effective_from).toLocaleDateString()}
                  </td>
                  <td className="border p-2">₹{r.rate_per_litre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No history available for this milk type.</p>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
