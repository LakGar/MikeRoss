import React from "react";
import "./TopNav.css";
import { FaBell, FaCog, FaSignOutAlt, FaSearch } from "react-icons/fa";

const TopNav = () => {
  return (
    <div className="top-nav">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search documents..."
        />
        <FaSearch className="search-icon" />
      </div>
      <div className="nav-icons">
        <FaBell className="icon" />
        <FaCog className="icon" />
        <FaSignOutAlt className="icon" />
        <div className="user-profile">
          <img
            className="user-img"
            src="https://plus.unsplash.com/premium_photo-1724296697228-ae418d019540?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="User"
          />
          <span className="user-name">Lakshay</span>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
