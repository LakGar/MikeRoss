import React from "react";
import { Navigate } from "react-router-dom";

// A component that checks for authentication (token in localStorage)
const ProtectedRoute = ({ element: Component }) => {
  const token = localStorage.getItem("token");

  // If the token exists, render the passed component
  // If not, redirect the user to the login page ("/auth")
  return token ? <Component /> : <Navigate to="/" />;
};

export default ProtectedRoute;
