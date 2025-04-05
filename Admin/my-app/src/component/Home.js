import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./Home.css";
import { Link } from "react-router-dom";

const Counter = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // in ms
    const incrementTime = 30;
    const steps = Math.ceil(duration / incrementTime);
    const increment = Math.ceil(target / steps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      setCount(start);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
};

const Home = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get("https://mern-backend-sable.vercel.app/api/users/total-users");
        setTotalUsers(response.data.totalUsers);
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

    const fetchTotalOrders = async () => {
      try {
        const response = await axios.get("https://mern-backend-sable.vercel.app/api/orders");
        if (response.data && Array.isArray(response.data)) {
          setTotalOrders(response.data.length);
        }
      } catch (error) {
        console.error("Error fetching order count:", error);
      }
    };

    const storedAdmin = JSON.parse(localStorage.getItem("admin"));
    if (storedAdmin && storedAdmin.email) {
      setAdminEmail(storedAdmin.email);
    }

    fetchTotalUsers();
    fetchTotalProducts();
    fetchTotalOrders();
  }, []);

  return (
    <>
      <Navbar />
      <div className="home">
        <h2>Welcome Admin</h2>
        <p>{adminEmail}</p>

        <div className="home-container">
          <Link to={"/Users"}>
            <div className="home-box">
              <p>Total Users</p>
              <Counter target={totalUsers} />
            </div>
          </Link>

          <Link to={"/Products"}>
            <div className="home-box">
              <p>Total Products</p>
              <Counter target={totalProducts} />
            </div>
          </Link>

          <Link to={"/Order"}>
            <div className="home-box">
              <p>Total Orders</p>
              <Counter target={totalOrders} />
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
