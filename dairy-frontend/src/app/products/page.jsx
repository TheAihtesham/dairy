"use client";
import { useEffect, useState } from "react";
import api from "../lib/api";
import ProductForm from "../components/ProductForm";
import { Edit, Trash2, PlusCircle, Package } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, products]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products");
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const applyFilters = () => {
    let data = [...products];
    if (search) {
      data = data.filter((p) =>
        p.product_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredProducts(data);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <Package size={26} /> Products
        </h1>
        <button
          onClick={() => {
            setEditProduct(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
        >
          <PlusCircle size={18} /> Add Product
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

      {/* Products Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border rounded-lg">
          <thead>
            <tr className="bg-blue-50 text-blue-700">
              <th className="p-2 border">Product Name</th>
              <th className="p-2 border">Quantity Produced</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Milk Used (L)</th>
              <th className="p-2 border">Cost of Production</th>
              <th className="p-2 border">Milk Rate</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr
                  key={p.manufacturing_id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="p-2 border font-semibold">
                    {p.product_name}
                  </td>
                  <td className="p-2 border">{p.quantity_produced}</td>
                  <td className="p-2 border">{p.unit}</td>
                  <td className="p-2 border">{p.milk_used_litres}</td>
                  <td className="p-2 border text-blue-700 font-medium">
                    ₹{p.cost_of_production}
                  </td>
                  <td className="p-2 border text-sm text-gray-600">
                    {p.milkRate?.milk_type} – ₹{p.milkRate?.rate_per_litre}
                  </td>
                  <td className="p-2 border flex gap-2">
                    <button
                      onClick={() => {
                        setEditProduct(p);
                        setShowForm(true);
                      }}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm transition"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.manufacturing_id)}
                      className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-4 text-gray-500"
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <ProductForm
          product={editProduct}
          onClose={() => setShowForm(false)}
          onSaved={fetchProducts}
        />
      )}
    </div>
  );
}
