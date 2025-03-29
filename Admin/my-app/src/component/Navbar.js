import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Navbar.css';
import adminlogo from "./Img/admin-logo.png"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <nav className="navbar">
                <div className="logo">
                    <Link to={"/Home"}>
                    <img src= {adminlogo} alt="Logo" />
                    </Link>
                </div>

                {/* Hamburger Menu for Mobile */}
                <div className="hamburger" onClick={toggleMenu}>
                    <i className={isMenuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>

                {/* Nav Links */}
                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <li>
                        <Link to="/Home">
                            <i className="fas fa-home"></i> Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/Manage_Product">
                            <i className="fas fa-box"></i> Manage Product
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            <i className="fas fa-list"></i> Manage Order
                        </Link>
                    </li>
                    <li>
                        <Link to="#">
                            <i className="fas fa-comment"></i> Feedback
                        </Link>
                    </li>


                    {/* Logout Button */}
                    <Link to="/">
                    <button className="logout-btn">
                        <i className="fas fa-sign-out-alt"></i> Log Out
                    </button>
                    </Link>
                </ul>


            </nav>
        </>
    );
};

export default Navbar;