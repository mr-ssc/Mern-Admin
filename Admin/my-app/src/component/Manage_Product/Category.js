import { useEffect, useState } from "react";
import axios from "axios";
import "../Manage_Product/Category.css"; // Import the CSS file
import Navbar from "../Navbar";
import Compressor from "compressorjs"; // Import the image compressor library

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false); // State to track upload status

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:8888/api/category");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle Image Selection and Compression
    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage && selectedImage.size > 1024 * 1024) { // 1MB = 1024 * 1024 bytes
            alert("Image size should not exceed 1MB.");
            e.target.value = ""; // Clear the file input
            setImage(null); // Reset the image state
        } else {
            new Compressor(selectedImage, {
                quality: 0.6, // Adjust the quality as needed
                success: (compressedImage) => {
                    setImage(compressedImage);
                },
                error: (err) => {
                    console.error("Error compressing image:", err);
                },
            });
        }
    };

    // Handle Create / Update Category
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || (!editingId && !image)) {
            alert("Please provide a category name and image.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        if (image) formData.append("image", image);

        try {
            setIsUploading(true); // Start upload
            const config = {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            };

            if (editingId) {
                // Update Category
                await axios.put(`http://localhost:8888/api/category/${editingId}`, formData, config);
                setEditingId(null);
            } else {
                // Create Category
                await axios.post("http://localhost:8888/api/category", formData, config);
            }

            setName("");
            setImage(null);
            setUploadProgress(0);
            fetchCategories(); // Refresh List
        } catch (error) {
            console.error("Error saving category:", error);
        } finally {
            setIsUploading(false); // End upload
        }
    };

    // Handle Edit
    const handleEdit = (category) => {
        setEditingId(category._id);
        setName(category.name);
        setImage(null); // Keep existing image unless changed
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await axios.delete(`http://localhost:8888/api/category/${id}`);
                fetchCategories(); // Refresh List
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    return (
        <>
            <Navbar />

            <div className={`category-container ${isUploading ? "blur-background" : ""}`}>
                <h2>Category Management</h2>

                <p>*1mb Size Jpeg , jpg , png .</p>

                {/* Category Form */}
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="category-form">
                    <input
                        type="text"
                        placeholder="Category Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input type="file" onChange={handleImageChange} required={!editingId} accept="image/jpeg, image/jpg, image/png" />
                    <button type="submit">{editingId ? "Update" : "Create"} Category</button>
                    {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
                </form>

                {/* Category List */}
                <h2>Category List</h2>

                <table className="category-table">
                    <thead>
                        <tr>
                            <th>Sr. No</th>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={category._id}>
                                <td>{index + 1}</td>
                                <td>{category.name}</td>
                                <td>
                                    {category.image && (
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="category-image"
                                            loading="lazy" // Lazy loading
                                        />
                                    )}
                                </td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(category)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(category._id)}>Delete</button>
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

export default Category;