import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/protectedRoutes";
import Profile from "./pages/Profile";
import DocumentUpload from "./pages/DocumentUpload";
import DocumentSearch from "./pages/DocumentSearch";
import DocumentAnalyze from "./pages/DocumentAnalyze";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={Dashboard} />}
        />
        <Route
          path="/upload"
          element={<ProtectedRoute element={DocumentUpload} />}
        />
        <Route
          path="/search"
          element={<ProtectedRoute element={DocumentSearch} />}
        />
        <Route
          path="/analysis"
          element={<ProtectedRoute element={DocumentAnalyze} />}
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
