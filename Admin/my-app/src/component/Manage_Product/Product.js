import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Product.css";
import Navbar from "../Navbar";

const Product = () => {
  const [state, setState] = useState({
    products: [],
    subcategories: [],
    loading: false,
    formData: {
      name: "",
      image: null,
      original_price: "",
      discount_price: "",
      category_id: "",
      category_name: "",
      subcategory_id: "",
      subcategory_name: "",
    },
    editingId: null
  });

  const API_URL = "https://mern-backend-sable.vercel.app/api/product";
  const SUBCAT_URL = "https://mern-backend-sable.vercel.app/api/subcategory";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const [productsRes, subcatRes] = await Promise.all([
        axios.get(API_URL),
        axios.get(SUBCAT_URL)
      ]);
      setState(prev => ({
        ...prev,
        products: productsRes.data,
        subcategories: subcatRes.data,
        loading: false
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setState(prev => ({
        ...prev,
        formData: { ...prev.formData, image: files[0] }
      }));
    } else if (name === "subcategory_id") {
      const selectedSub = state.subcategories.find(sub => sub._id === value);
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          subcategory_id: selectedSub._id,
          subcategory_name: selectedSub.name,
          category_id: selectedSub.category_id._id,
          category_name: selectedSub.category_id.name,
        }
      }));
    } else {
      setState(prev => ({
        ...prev,
        formData: { ...prev.formData, [name]: value }
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true }));

    const formData = new FormData();
    Object.entries(state.formData).forEach(([key, val]) => val !== null && formData.append(key, val));

    try {
      if (state.editingId) {
        await axios.put(`${API_URL}/${state.editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const resetForm = () => {
    setState(prev => ({
      ...prev,
      formData: {
        name: "",
        image: null,
        original_price: "",
        discount_price: "",
        category_id: "",
        category_name: "",
        subcategory_id: "",
        subcategory_name: "",
      },
      editingId: null
    }));
  };

  const handleEdit = (product) => {
    setState(prev => ({
      ...prev,
      formData: {
        name: product.name,
        image: null,
        original_price: product.original_price,
        discount_price: product.discount_price,
        category_id: product.category_id,
        category_name: product.category_name,
        subcategory_id: product.subcategory_id,
        subcategory_name: product.subcategory_name,
      },
      editingId: product._id
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    setState(prev => ({ ...prev, loading: true }));
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const { products, subcategories, loading, formData, editingId } = state;

  return (
    <>
      <Navbar />
      <div className="product-container">
        <div className={`form-container ${editingId ? 'editing' : ''}`}>
          <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              required
            />

            <label className="file-label">
              {formData.image?.name || "Choose Image"}
              <input
                type="file"
                name="image"
                onChange={handleChange}
                accept="image/*"
                required={!editingId}
              />
            </label>

            <div className="price-row">
              <input
                type="number"
                name="original_price"
                value={formData.original_price}
                onChange={handleChange}
                placeholder="Original Price"
                required
              />
              <input
                type="number"
                name="discount_price"
                value={formData.discount_price}
                onChange={handleChange}
                placeholder="Discount Price"
                required
              />
            </div>

            <select
              name="subcategory_id"
              value={formData.subcategory_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Subcategory</option>
              {subcategories.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.name}</option>
              ))}
            </select>

            <input
              name="category_name"
              value={formData.category_name}
              readOnly
              placeholder="Category (auto)"
            />

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : editingId ? "Update" : "Create"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="product-list">
          <h2>Products List ({products.length})</h2>

          {loading && !products.length ? (
            <div className="loader">Loading...</div>
          ) : products.length ? (
            <div className="table-wrap">
              <table >
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Prices</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod, i) => (
                    <tr key={prod._id}>
                      <td data-label="Sr No.">{i + 1}</td>
                      <td data-label="Name">{prod.name}</td>
                      <td data-label="Image">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          onError={(e) => e.target.src = "https://via.placeholder.com/50"}
                        />
                      </td>
                      <td data-label="Prices">
                        <span className="original-price">₹{prod.original_price}</span>
                        <span className="discount-price">₹{prod.discount_price}</span>
                      </td>
                      <td data-label="Category">
                        <div>{prod.subcategory_name}</div>
                        <small>{prod.category_name}</small>
                      </td>
                      <td data-label="Actions">
                        <button onClick={() => handleEdit(prod)}>Edit</button>
                        <button onClick={() => handleDelete(prod._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty">No products found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;