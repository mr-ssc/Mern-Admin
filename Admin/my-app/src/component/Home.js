import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get("https://mern-backend-sable.vercel.app/api/users/total-users");
        setTotalUsers(response.data.totalUsers); // Set total user count
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };
    

    const fetchTotalProducts = async () => {
      try {
        const response = await axios.get("https://mern-backend-sable.vercel.app/api/product");
        if (response.data && Array.isArray(response.data)) {
          setTotalProducts(response.data.length);
        }
      } catch (error) {
        console.error("Error fetching product count:", error);
      }
    };

    // Get admin email from localStorage (assuming it's stored after signin)
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (storedAdmin && storedAdmin.email) {
      setAdminEmail(storedAdmin.email);
    }

    fetchTotalUsers();
    fetchTotalProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="home">
        <h2>Welcome Admin</h2>
        <p>{adminEmail}</p> {/* Display signed-in admin's email */}

        <div className="home-container">

          <Link to={"/Users"}>
            <div className="home-box">
              <p>Total Users</p>
              <span>{totalUsers}</span>
            </div>
          </Link>

          <Link to={"/Products"}>
            <div className="home-box">
              <p>Total Products</p>
              <span>{totalProducts}</span>
            </div>
          </Link>

          <div className="home-box">
            <p>Total Orders</p>
            <span>890</span>
          </div>
        </div>
      </div >
    </>
  );
};

export default Home;
