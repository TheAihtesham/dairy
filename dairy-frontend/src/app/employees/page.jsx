"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import EmployeeForm from "../components/EmployeeForm";
import { Edit, Trash2, UserPlus } from "lucide-react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, filterDate, employees]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/api/employees");
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const applyFilters = () => {
    let data = [...employees];

    if (search) {
      data = data.filter(
        (emp) =>
          emp.name.toLowerCase().includes(search.toLowerCase()) ||
          emp.role.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterDate) {
      data = data.filter(
        (emp) => emp.joining_date && emp.joining_date.startsWith(filterDate)
      );
    }

    setFilteredEmployees(data);
  };

  const deleteEmployee = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/api/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Employees</h1>
        <button
          onClick={() => {
            setEditEmployee(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          <UserPlus size={18} />
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or role"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3 shadow-sm"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border p-2 rounded shadow-sm"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate("")}
            className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded shadow-sm"
          >
            Clear Date
          </button>
        )}
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <div
              key={emp.employee_id}
              className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {emp.name}
              </h2>
              <p className="text-sm text-gray-600">{emp.role}</p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Contact:</span> {emp.contact}
              </p>
              <p className="text-sm">
                <span className="font-medium">Salary:</span> ₹{emp.salary}
              </p>
              <p className="text-sm">
                <span className="font-medium">Joined:</span>{" "}
                {emp.joining_date
                  ? new Date(emp.joining_date).toLocaleDateString()
                  : "-"}
              </p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditEmployee(emp);
                    setShowForm(true);
                  }}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => deleteEmployee(emp.employee_id)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No employees found.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <EmployeeForm
          employee={editEmployee}
          onClose={() => setShowForm(false)}
          onSaved={fetchEmployees}
        />
      )}
    </div>
  );
}
