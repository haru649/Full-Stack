import React, { useEffect, useState } from "react";
import API from "../api/api";

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ title: "", price: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products.");
    }
  };

  const handleAddOrUpdate = async () => {
    if (!newProduct.title || !newProduct.price) {
      alert("Please enter both title and price.");
      return;
    }

    try {
      if (editingId) {
        // Update product
        await API.put(`/products/${editingId}`, newProduct);
        alert("Product updated successfully!");
      } else {
        // Add product
        await API.post("/products", newProduct);
        alert("Product added successfully!");
      }
      setNewProduct({ title: "", price: "" });
      setEditingId(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to save product.");
    }
  };

  const handleEdit = (product) => {
    setNewProduct({ title: product.title, price: product.price });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const styles = {
    container: {
      padding: 30,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "#f7f9fc",
      minHeight: "100vh",
    },
    heading: {
      textAlign: "center",
      marginBottom: 20,
      fontSize: "2rem",
      color: "#333",
      letterSpacing: "1px",
    },
    form: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 30,
      gap: 10,
      flexWrap: "wrap",
    },
    input: {
      padding: 12,
      fontSize: 16,
      borderRadius: 8,
      border: "1px solid #ccc",
      width: 220,
    },
    addButton: {
      padding: "12px 25px",
      background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      color: "white",
      fontWeight: "bold",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "#fff",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    },
    tableHeader: {
      background: "#6a11cb",
      color: "white",
      textAlign: "left",
      padding: "12px 15px",
      fontSize: 16,
    },
    tableRow: {
      transition: "background 0.2s",
    },
    tableCell: {
      padding: "15px 15px", // bigger row height
      fontSize: 15,
      borderBottom: "1px solid #eee",
    },
    editButton: {
      padding: "6px 12px",
      marginRight: 5,
      border: "none",
      borderRadius: 5,
      background: "#2575fc",
      color: "#fff",
      cursor: "pointer",
    },
    deleteButton: {
      padding: "6px 12px",
      border: "none",
      borderRadius: 5,
      background: "#fc5c5c",
      color: "#fff",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Product Management</h1>

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Product Title"
          value={newProduct.title}
          onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Price"
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
        />
        <button style={styles.addButton} onClick={handleAddOrUpdate}>
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>ID</th>
            <th style={styles.tableHeader}>Title</th>
            <th style={styles.tableHeader}>Price ($)</th>
            <th style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={styles.tableRow}>
              <td style={styles.tableCell}>{p.id}</td>
              <td style={styles.tableCell}>{p.title}</td>
              <td style={styles.tableCell}>{parseFloat(p.price).toFixed(2)}</td>
              <td style={styles.tableCell}>
                <button style={styles.editButton} onClick={() => handleEdit(p)}>
                  Edit
                </button>
                <button style={styles.deleteButton} onClick={() => handleDelete(p.id)}>
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

export default ProductManagement;
