import React, { useEffect, useState } from "react";
import api from "../../../API/ApiStore";

export default function Accountants() {
  const [accountants, setAccountants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    salary: "",
    joiningDate: "",
    active: true,
    role: "ACCOUNTANT",
  });

  const fetchAccountants = async () => {
    try {
      const response = await api.get("/accountant/all");
      setAccountants(response.data || []);
    } catch (error) {
      console.error("Fetch accountants error:", error);
      alert("Accountants load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountants();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      salary: Number(formData.salary || 0),
      role: "ACCOUNTANT",
    };

    try {
      setSaving(true);
      await api.post("/accountant/create", payload);

      alert("Accountant created successfully");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        salary: "",
        joiningDate: "",
        active: true,
        role: "ACCOUNTANT",
      });

      fetchAccountants();
    } catch (error) {
      console.error("Create accountant error:", error);
      alert("Accountant create failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this accountant?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/accountant/delete/${id}`);
      alert("Accountant deleted successfully");
      fetchAccountants();
    } catch (error) {
      console.error("Delete accountant error:", error);
      alert("Accountant delete failed");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Accountants Management
        </h1>

        <p className="mt-3 text-gray-500 text-lg">
          Create and manage school accountants.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create Accountant
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <Input
              label="Salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              required
            />

            <Input
              label="Joining Date"
              name="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Role
              </label>

              <input
                type="text"
                value="ACCOUNTANT"
                readOnly
                className="w-full border rounded-lg p-3 bg-gray-100"
              />
            </div>

            <div className="flex items-center gap-3 mt-8">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-5 h-5"
              />

              <label className="font-medium text-gray-700">
                Active Accountant
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create Accountant"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            All Accountants
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-lg">Loading accountants...</div>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Salary</th>
                <th className="p-4 text-left">Joining Date</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {accountants.length === 0 ? (
                <tr>
                  <td className="p-4 text-center" colSpan="9">
                    No accountants found
                  </td>
                </tr>
              ) : (
                accountants.map((accountant) => (
                  <tr key={accountant.id} className="border-t hover:bg-gray-50">
                    <td className="p-4">{accountant.id}</td>
                    <td className="p-4">{accountant.fullName}</td>
                    <td className="p-4">{accountant.email}</td>
                    <td className="p-4">{accountant.phone}</td>
                    <td className="p-4">₹{accountant.salary}</td>
                    <td className="p-4">{accountant.joiningDate}</td>
                    <td className="p-4">{accountant.role}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          accountant.active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {accountant.active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(accountant.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
}) {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border rounded-lg p-3"
      />
    </div>
  );
}