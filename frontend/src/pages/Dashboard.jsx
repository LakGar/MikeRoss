import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authServices"; // Import the auth service

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    authService.logout(); // Clear the token from localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => handleNavigation("/profile")}
          style={buttonStyle}
        >
          Profile
        </button>
        <button onClick={() => handleNavigation("/upload")} style={buttonStyle}>
          Upload Document
        </button>
        <button onClick={() => handleNavigation("/search")} style={buttonStyle}>
          Search Documents
        </button>
      </div>

      {/* Logout Button */}
      <div style={{ marginTop: "40px" }}>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  margin: "10px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
};

const logoutButtonStyle = {
  ...buttonStyle,
  backgroundColor: "#e74c3c", // Red color for logout
  color: "white",
};

export default Dashboard;
