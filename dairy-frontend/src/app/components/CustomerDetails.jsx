"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";

export default function CustomerDetails({ customerId, onClose }) {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (customerId) fetchCustomer();
  }, [customerId]);

  const fetchCustomer = async () => {
    try {
      const res = await api.get(`/api/customers/${customerId}`);
      setCustomer(res.data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  if (!customer) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 overflow-auto">
      <div className="bg-white p-6 rounded shadow-md w-[800px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Customer Details</h2>

        {/* Basic Info */}
        <div className="mb-6">
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Contact:</strong> {customer.contact}</p>
          <p><strong>Address:</strong> {customer.address}</p>
          <p><strong>Type:</strong> {customer.type}</p>
        </div>

        {/* Sales History */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Sales History</h3>
          {customer.sales.length > 0 ? (
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Product</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Rate</th>
                  <th className="border p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {customer.sales.map((s) => (
                  <tr key={s.sale_id}>
                    <td className="border p-2">
                      {new Date(s.sale_date).toLocaleDateString()}
                    </td>
                    <td className="border p-2">{s.product_name}</td>
                    <td className="border p-2">{s.quantity}</td>
                    <td className="border p-2">₹{s.rate_per_unit}</td>
                    <td className="border p-2">₹{s.total_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No sales records found.</p>
          )}
        </div>

        {/* Deliveries History */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Deliveries History</h3>
          {customer.deliveries.length > 0 ? (
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Milk Type</th>
                  <th className="border p-2">Quantity (L)</th>
                  <th className="border p-2">Rate</th>
                  <th className="border p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {customer.deliveries.map((d) => (
                  <tr key={d.delivery_id}>
                    <td className="border p-2">{d.milk_type}</td>
                    <td className="border p-2">{d.quantity_litres}</td>
                    <td className="border p-2">₹{d.rate_per_litre}</td>
                    <td className="border p-2">₹{d.total_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No deliveries records found.</p>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
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
