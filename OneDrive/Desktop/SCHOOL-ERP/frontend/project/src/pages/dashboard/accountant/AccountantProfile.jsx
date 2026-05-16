import React, { useEffect, useState } from "react";
import api from "../../../API/ApiStore";

export default function AccountantProfile() {
  const [formData, setFormData] = useState({
    id: "",
    fullName: "",
    email: "",
    phone: "",
    salary: "",
    joiningDate: "",
    role: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accountant = JSON.parse(localStorage.getItem("accountant"));

    if (accountant) {
      setFormData({
        id: accountant.id || "",
        fullName: accountant.fullName || "",
        email: accountant.email || "",
        phone: accountant.phone || "",
        salary: accountant.salary || "",
        joiningDate: accountant.joiningDate || "",
        role: accountant.role || "ACCOUNTANT",
        profileImage: accountant.profileImage || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({
        ...formData,
        profileImage: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.put(
        `/accountant/profile/update/${formData.id}`,
        formData
      );

      localStorage.setItem("accountant", JSON.stringify(response.data));

      alert("Profile updated successfully");

      window.location.reload();
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Accountant Profile
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-6 mb-8">
            <img
              src={
                formData.profileImage ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border"
            />

            <div>
              <label className="block mb-2 font-medium">
                Upload Profile Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded-lg p-3"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              label="Salary"
              name="salary"
              value={formData.salary}
              readOnly
            />

            <Input
              label="Joining Date"
              name="joiningDate"
              value={formData.joiningDate}
              readOnly
            />

            <Input
              label="Role"
              name="role"
              value={formData.role}
              readOnly
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  readOnly,
}) {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`w-full border rounded-lg p-3 ${
          readOnly ? "bg-gray-100" : ""
        }`}
      />
    </div>
  );
}