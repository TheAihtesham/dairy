"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Factory,
  Milk,
  Package,
  Boxes,
  DollarSign,
  Truck,
  ClipboardList,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <Home size={18} /> },
    { name: "Employees", path: "/employees", icon: <Users size={18} /> },
    { name: "Suppliers", path: "/suppliers", icon: <Factory size={18} /> },
    { name: "Customers", path: "/customers", icon: <Users size={18} /> },
    { name: "Milk Rates", path: "/milkrates", icon: <Milk size={18} /> },
    { name: "Products", path: "/products", icon: <Package size={18} /> },
    { name: "Inventory", path: "/inventory", icon: <Boxes size={18} /> },
    { name: "Sales", path: "/sales", icon: <DollarSign size={18} /> },
    { name: "Deliveries", path: "/deliveries", icon: <Truck size={18} /> },
    { name: "Purchases", path: "/purchases", icon: <ClipboardList size={18} /> },
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen flex flex-col shadow-sm">
      {/* Brand Header */}
      <div className="p-5 text-2xl font-extrabold text-blue-700 border-b border-gray-200 flex items-center gap-2">
         Dairy Management
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors ${
                  pathname === item.path
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

     
    </div>
  );
}
