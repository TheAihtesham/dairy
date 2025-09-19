"use client";
import { useState, useEffect } from "react";
import api from "../lib/api";

export default function EmployeeForm({ employee, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: "",
    role: "",
    contact: "",
    address: "",
    salary: "",
    joining_date: "",
  });

  useEffect(() => {
    if (employee) {
      setForm({
        ...employee,
        salary: employee.salary || "",
        joining_date: employee.joining_date
          ? employee.joining_date.split("T")[0]
          : "",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employee) {
        await api.put(`/api/employees/${employee.employee_id}`, form);
      } else {
        await api.post("/api/employees", form);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error("Error saving employee:", error);
      alert("Failed to save employee. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "name", label: "Full Name", type: "text" },
            { name: "role", label: "Role", type: "text" },
            { name: "contact", label: "Contact", type: "text" },
            { name: "address", label: "Address", type: "text" },
            { name: "salary", label: "Salary", type: "number" },
            { name: "joining_date", label: "Joining Date", type: "date" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
            </div>
          ))}

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
              {employee ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
