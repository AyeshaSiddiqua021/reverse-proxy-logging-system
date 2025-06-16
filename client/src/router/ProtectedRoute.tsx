import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import React from "react";

const verifyToken = (token: string | null) => {
  if (!token) throw new Error("No token");
  try {
    const decoded = jwtDecode(token);
    // Optional: Check if token is expired
    return decoded;
  } catch (err) {
    throw new Error("Invalid token");
  }
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("accessToken");

  try {
    verifyToken(token);
    return <>{children}</>; 
  } catch (err) {
    console.error("Token verification failed:", err);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
