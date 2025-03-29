import React from 'react';
import Navbar from '../Navbar';
import './Manage_Product.css'; // Import the CSS file
import { Link } from 'react-router-dom'; // Import Link from react-router-dom


const Manage_Product = () => {
  return (
    <>
      <Navbar />

      <div className="product-container">
        <Link to="/Category">
          <button className="product-box">
            <i className="fa-solid fa-table-cells"></i>
            Category
          </button>
        </Link>

        <Link to="/SubCategory">
          <button className="product-box">
            <i className="fa-solid fa-table-cells-large"></i>
            SubCategory
          </button>
        </Link>

        <Link to="/Products">
          <button className="product-box">
            <i className="fa-solid fa-box"></i>
            Products
          </button>
        </Link>

      </div>
    </>
  );
};

export default Manage_Product;