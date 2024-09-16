import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import DocumentUpload from "./pages/DocumentUpload";
import DocumentSearch from "./pages/DocumentSearch";
import ProtectedRoute from "./component/ProtectedRoute"; // Import the ProtectedRoute component
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        {/* Protected routes */}
        <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={Dashboard} />}
        />
        <Route
          path="/search"
          element={<ProtectedRoute element={DocumentSearch} />}
        />
        <Route
          path="/upload"
          element={<ProtectedRoute element={DocumentUpload} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
