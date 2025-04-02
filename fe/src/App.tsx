import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./pages/auth/login";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home";
import Register from "./pages/auth/register";
import AuthLayout from "./components/authLayout";
import { Toaster } from "./components/ui/sonner";
import Profile from "./pages/profile";
import Navbar from "./components/navbar";
import CreateBlog from "./pages/generateBlog";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
