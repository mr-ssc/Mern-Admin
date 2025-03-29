import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Product.css"
import Navbar from "../Navbar";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    image: null,
    original_price: "",
    discount_price: "",
    category_id: "",
    category_name: "",
    subcategory_id: "",
    subcategory_name: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchSubcategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8888/api/product");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const res = await axios.get("http://localhost:8888/api/subcategory");
      setSubcategories(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else if (e.target.name === "subcategory_id") {
      const selectedSubcategory = subcategories.find(
        (sub) => sub._id === e.target.value
      );
      setFormData({
        ...formData,
        subcategory_id: selectedSubcategory._id,
        subcategory_name: selectedSubcategory.name,
        category_id: selectedSubcategory.category_id._id,
        category_name: selectedSubcategory.category_id.name,
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      if (editingProduct) {
        await axios.put(
          `http://localhost:8888/api/product/${editingProduct._id}`,
          formDataToSend
        );
      } else {
        await axios.post("http://localhost:8888/api/product", formDataToSend);
      }

      fetchProducts();
      setEditingProduct(null);
      setFormData({
        name: "",
        image: null,
        original_price: "",
        discount_price: "",
        category_id: "",
        category_name: "",
        subcategory_id: "",
        subcategory_name: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      image: null,
      original_price: product.original_price,
      discount_price: product.discount_price,
      category_id: product.category_id,
      category_name: product.category_name,
      subcategory_id: product.subcategory_id,
      subcategory_name: product.subcategory_name,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8888/api/product/${id}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="product-container">
      <h2>{editingProduct ? "Edit Product" : "Create Product"}</h2>
      <p>*1mb Size Jpeg, jpg, png.</p>
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input type="file" name="image" onChange={handleChange} required />

        <input
          type="number"
          name="original_price"
          placeholder="Original Price"
          value={formData.original_price}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="discount_price"
          placeholder="Discount Price"
          value={formData.discount_price}
          onChange={handleChange}
          required
        />

        <select name="subcategory_id" onChange={handleChange} required>
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="category_name"
          value={formData.category_name}
          readOnly
          placeholder="Category Name (Auto-filled)"
        />

        <button type="submit">
          {editingProduct ? "Update Product" : "Create Product"}
        </button>
      </form>

      <h2>Product List</h2>
      <table border="1" className="product-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Name</th>
            <th>Image</th>
            <th>Original Price</th>
            <th>Discount Price</th>
            <th>Subcategory</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>
                <img src={product.image} alt={product.name} width="50" />
              </td>
              <td>{product.original_price}</td>
              <td>{product.discount_price}</td>
              <td>{product.subcategory_name}</td>
              <td>{product.category_name}</td>
              <td>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Product;
