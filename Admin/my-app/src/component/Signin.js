import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Signin.css"; // Import the CSS file

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post("https://mern-backend-sable.vercel.app/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      toast.success("Login successful!");
      navigate("/Home");
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "Invalid Email or Password!";
      setError(errorMessage);
    }
  };

  return (
    <div className="signin">
      <div className="signin-container">
        <div className="signin-box">
          <h2 className="signin-title">Admin Sign In</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} className="signin-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="signin-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signin-input"
            />
            <button type="submit" className="signin-button">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signin;