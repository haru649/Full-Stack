import React from "react";
import API from "../api/api";
import { toast } from "react-toastify";

export default function ProductTable({ products, setEditingProduct, setShowForm, fetchProducts }) {
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await API.delete(`/products/${id}`);
        toast.success("Deleted successfully");
        fetchProducts();
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Title</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Discount %</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((p, index) => (
            <tr key={p.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="px-6 py-4 text-sm text-gray-800">{p.id}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{p.title}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{p.price}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{p.discount_percentage}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{p.quantity}</td>
              <td className="px-6 py-4 flex space-x-2">
                <button
                  onClick={() => { setEditingProduct(p); setShowForm(true); }}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
