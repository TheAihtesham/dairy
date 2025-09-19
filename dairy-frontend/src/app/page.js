"use client";
import { useEffect, useState } from "react";
import api from "./lib/api";
import {
  Users,
  ShoppingCart,
  Package,
  Milk,
  DollarSign,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    employees: 0,
    suppliers: 0,
    customers: 0,
    sales: 0,
    purchases: 0,
    inventory: 0,
    totalSalesRevenue: 0,
    totalPurchaseCost: 0,
  });
  const [barData, setBarData] = useState([]);
  const [milkDistribution, setMilkDistribution] = useState([]);
  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        employeesRes,
        suppliersRes,
        customersRes,
        salesRes,
        purchasesRes,
        inventoryRes,
      ] = await Promise.all([
        api.get("/api/employees"),
        api.get("/api/suppliers"),
        api.get("/api/customers"),
        api.get("/api/sales"),
        api.get("/api/purchases"),
        api.get("/api/inventory"),
      ]);

      // Calculate totals
      const totalSalesRevenue = salesRes.data.reduce(
        (sum, s) => sum + (s.total_amount || 0),
        0
      );
      const totalPurchaseCost = purchasesRes.data.reduce(
        (sum, p) => sum + (p.total_cost || 0),
        0
      );

      setStats({
        employees: employeesRes.data.length,
        suppliers: suppliersRes.data.length,
        customers: customersRes.data.length,
        sales: salesRes.data.length,
        purchases: purchasesRes.data.length,
        inventory: inventoryRes.data.length,
        totalSalesRevenue,
        totalPurchaseCost,
      });

      // Bar Chart (last 7 entries)
      const salesChart = salesRes.data.slice(-7).map((s) => ({
        date: new Date(s.sale_date).toLocaleDateString(),
        sales: s.total_amount,
      }));
      const purchaseChart = purchasesRes.data.slice(-7).map((p) => ({
        date: p.createdAt
          ? new Date(p.createdAt).toLocaleDateString()
          : "N/A",
        purchases: p.total_cost,
      }));

      // Merge sales & purchases into one dataset
      const merged = [];
      [...salesChart, ...purchaseChart].forEach((entry) => {
        const existing = merged.find((m) => m.date === entry.date);
        if (existing) {
          existing.sales = existing.sales || entry.sales || 0;
          existing.purchases = existing.purchases || entry.purchases || 0;
        } else {
          merged.push({
            date: entry.date,
            sales: entry.sales || 0,
            purchases: entry.purchases || 0,
          });
        }
      });
      setBarData(merged);

      // Milk Distribution Pie Chart
      const milkMap = {};
      purchasesRes.data.forEach((p) => {
        milkMap[p.milk_type] =
          (milkMap[p.milk_type] || 0) + p.quantity_litres;
      });
      const milkPie = Object.keys(milkMap).map((type) => ({
        name: type,
        value: milkMap[type],
      }));
      setMilkDistribution(milkPie);

      // Recent Sales
      setRecentSales(salesRes.data.slice(-5).reverse());
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="p-6 space-y-8 overflow-y-auto h-screen scrollbar-hide">
      <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <StatCard title="Employees" value={stats.employees} icon={<Users />} />
        <StatCard title="Suppliers" value={stats.suppliers} icon={<Package />} />
        <StatCard title="Customers" value={stats.customers} icon={<Users />} />
        <StatCard
          title="Sales"
          value={stats.sales}
          icon={<DollarSign />}
          sub={`₹${stats.totalSalesRevenue}`}
        />
        <StatCard
          title="Purchases"
          value={stats.purchases}
          icon={<ShoppingCart />}
          sub={`₹${stats.totalPurchaseCost}`}
        />
        <StatCard title="Inventory" value={stats.inventory} icon={<Milk />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sales vs Purchases Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            Sales vs Purchases (Recent)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3B82F6" name="Sales" />
              <Bar dataKey="purchases" fill="#EF4444" name="Purchases" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Milk Distribution Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Milk Type Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={milkDistribution}
                dataKey="value"
                nameKey="name"
                label
                outerRadius={100}
              >
                {milkDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>
        <table className="w-full  rounded-lg">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.length > 0 ? (
              recentSales.map((s) => (
                <tr
                  key={s.sale_id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="p-2">
                    {new Date(s.sale_date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{s.customer?.name}</td>
                  <td className="p-2">{s.product_name}</td>
                  <td className="p-2 text-right font-semibold text-green-600">
                    ₹{s.total_amount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No recent sales
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ✅ Reusable Stat Card Component */
function StatCard({ title, value, icon, sub }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <div className="text-blue-600">{icon}</div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-xl font-bold">{value}</h3>
        </div>
      </div>
      {sub && (
        <p className="text-sm text-gray-600 font-semibold ml-10">
          {sub}
        </p>
      )}
    </div>
  );
}
