import React, { useState, useEffect } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

export default function ProductForm({ product, closeForm, fetchProducts }) {
  const [formData, setFormData] = useState({ title: "", price: "", discount_percentage: "", quantity: "" });

  useEffect(() => {
    if (product) setFormData({ ...product });
  }, [product]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product) await API.put(`/products/${product.id}`, formData);
      else await API.post("/products", formData);
      toast.success("Saved successfully");
      fetchProducts();
      closeForm();
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">{product ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full border rounded px-3 py-2"/>
          <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" required className="w-full border rounded px-3 py-2"/>
          <input name="discount_percentage" type="number" value={formData.discount_percentage} onChange={handleChange} placeholder="Discount %" className="w-full border rounded px-3 py-2"/>
          <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Quantity" required className="w-full border rounded px-3 py-2"/>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={closeForm} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
