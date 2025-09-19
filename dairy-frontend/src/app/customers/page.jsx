"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import CustomerForm from "../components/CustomerForm";
import CustomerDetails from "../components/CustomerDetails";
import { Eye, Edit, Trash2, UserPlus } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [viewCustomerId, setViewCustomerId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, customers]);

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/api/customers");
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const applyFilters = () => {
    let data = [...customers];
    if (search) {
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.type.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredCustomers(data);
  };

  const deleteCustomer = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await api.delete(`/api/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Customers</h1>
        <button
          onClick={() => {
            setEditCustomer(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          <UserPlus size={18} />
          Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3 shadow-sm"
        />
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((c) => (
            <div
              key={c.customer_id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">{c.name}</h2>
              <p className="text-sm text-gray-600">{c.type}</p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Contact:</span> {c.contact}
              </p>
              <p className="text-sm">
                <span className="font-medium">Address:</span> {c.address}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setViewCustomerId(c.customer_id)}
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  <Eye size={14} /> View
                </button>
                <button
                  onClick={() => {
                    setEditCustomer(c);
                    setShowForm(true);
                  }}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => deleteCustomer(c.customer_id)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No customers found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <CustomerForm
          customer={editCustomer}
          onClose={() => setShowForm(false)}
          onSaved={fetchCustomers}
        />
      )}

      {/* Customer Details Modal */}
      {viewCustomerId && (
        <CustomerDetails
          customerId={viewCustomerId}
          onClose={() => setViewCustomerId(null)}
        />
      )}
    </div>
  );
}
