import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../API/ApiStore";

export default function AccountantSignIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const clearOldLoginData = () => {
    localStorage.removeItem("studentData");
    localStorage.removeItem("professorData");
    localStorage.removeItem("hodData");
    localStorage.removeItem("schoolAdminData");
    localStorage.removeItem("adminData");

    localStorage.removeItem("studentToken");
    localStorage.removeItem("professorToken");
    localStorage.removeItem("hodToken");
    localStorage.removeItem("schoolAdminToken");
    localStorage.removeItem("adminToken");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/accountant/login", formData);

      const data = response.data;

      clearOldLoginData();

      localStorage.setItem("userRole", "accountant");
      localStorage.setItem("userId", data.id);
      localStorage.setItem("accountant", JSON.stringify(data));
      localStorage.setItem("accountantToken", data.token || "");

      alert("Login successful");

      navigate("/dashboard/accountant/home");
    } catch (error) {
      console.error("Accountant login error:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Accountant Login
          </h1>

          <p className="text-gray-500 mt-3">
            Login to accountant dashboard
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block mb-2 font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}