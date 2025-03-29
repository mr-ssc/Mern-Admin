import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import "./SubCategory.css"; // Import the CSS file for styling
import Compressor from "compressorjs"; // Import the image compressor library

const SubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", category_id: "", category_name: "", image: null });
  const [editingId, setEditingId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false); // State to track upload status

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8888/api/subcategory");
      setSubCategories(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8888/api/category");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle Image Selection and Compression
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage && selectedImage.size > 1024 * 1024) { // 1MB = 1024 * 1024 bytes
      alert("Image size should not exceed 1MB.");
      e.target.value = ""; // Clear the file input
      setFormData({ ...formData, image: null }); // Reset the image state
    } else {
      new Compressor(selectedImage, {
        quality: 0.6, // Adjust the quality as needed
        success: (compressedImage) => {
          setFormData({ ...formData, image: compressedImage });
        },
        error: (err) => {
          console.error("Error compressing image:", err);
        },
      });
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "category_id") {
      const selectedCategory = categories.find(cat => cat._id === e.target.value);
      setFormData({ ...formData, category_id: selectedCategory._id, category_name: selectedCategory.name });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));

    try {
      setIsUploading(true); // Start upload
      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      };

      if (editingId) {
        await axios.put(`http://localhost:8888/api/subcategory/${editingId}`, formDataToSend, config);
      } else {
        await axios.post("http://localhost:8888/api/subcategory", formDataToSend, config);
      }
      setFormData({ name: "", category_id: "", category_name: "", image: null });
      setEditingId(null);
      fetchSubCategories();
    } catch (error) {
      console.error("Error saving subcategory:", error);
    } finally {
      setIsUploading(false); // End upload
    }
  };

  const handleEdit = (subCategory) => {
    setFormData({
      name: subCategory.name,
      category_id: subCategory.category_id,
      category_name: subCategory.category_name,
      image: null,
    });
    setEditingId(subCategory._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8888/api/subcategory/${id}`);
      fetchSubCategories();
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className={`subcategory-container ${isUploading ? "blur-background" : ""}`}>
        <h2>SubCategory Management</h2>
        <p>*1mb Size Jpeg, jpg, png.</p>

        <form onSubmit={handleSubmit} className="subcategory-form">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="SubCategory Name" required />
          <select name="category_id" value={formData.category_id} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          {editingId && (
            <div>
              <strong>Current Category:</strong> {formData.category_name}
            </div>
          )}
          <input type="file" name="image" onChange={handleImageChange} required={!editingId} />
          <button type="submit" className="submit-button">{editingId ? "Update" : "Add"} SubCategory</button>
          {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
        </form>

        <h2>SubCategory List</h2>

        <table className="subcategory-table">
          <thead>
            <tr>
              <th>SR No</th>
              <th>Name</th>
              <th>Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((sub, index) => (
              <tr key={sub._id} className="subcategory-row">
                <td>{index + 1}</td>
                <td>{sub.name}</td>
                <td>{sub.category_name}</td>
                <td>
                  <img src={sub.image} alt={sub.name} className="subcategory-image" loading="lazy" />
                </td>
                <td>
                  <button onClick={() => handleEdit(sub)} className="edit-button">Edit</button>
                  <button onClick={() => handleDelete(sub._id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Loading Spinner */}
        {isUploading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default SubCategory;