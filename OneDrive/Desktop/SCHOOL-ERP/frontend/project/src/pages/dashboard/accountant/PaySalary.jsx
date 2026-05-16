import React, { useState } from "react";
import api from "../../../API/ApiStore";

const PaySalary = () => {
  const [formData, setFormData] = useState({
    teacherId: "",
    month: "",
    basicSalary: "",
    bonus: "",
    deduction: "",
    finalSalary: "",
    paymentDate: "",
    paymentStatus: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedData = {
      ...formData,
      [name]: value,
    };

    if (
      name === "basicSalary" ||
      name === "bonus" ||
      name === "deduction"
    ) {
      const basic = Number(
        name === "basicSalary"
          ? value
          : updatedData.basicSalary || 0
      );

      const bonus = Number(
        name === "bonus"
          ? value
          : updatedData.bonus || 0
      );

      const deduction = Number(
        name === "deduction"
          ? value
          : updatedData.deduction || 0
      );

      updatedData.finalSalary = basic + bonus - deduction;
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      teacherId: Number(formData.teacherId),
      month: formData.month,
      basicSalary: Number(formData.basicSalary),
      bonus: Number(formData.bonus || 0),
      deduction: Number(formData.deduction || 0),
      finalSalary: Number(formData.finalSalary),
      paymentDate: formData.paymentDate,
      paymentStatus: formData.paymentStatus,
    };

    try {
      setLoading(true);

      await api.post("/salary/pay", payload);

      alert("Salary paid successfully");

      setFormData({
        teacherId: "",
        month: "",
        basicSalary: "",
        bonus: "",
        deduction: "",
        finalSalary: "",
        paymentDate: "",
        paymentStatus: "",
      });
    } catch (error) {
      console.error("Salary payment error:", error);
      alert("Salary payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Pay Teacher Salary
        </h1>

        <p className="text-gray-500 mt-2">
          Manage teacher salary payments
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* TEACHER ID */}
            <Input
              label="Teacher ID"
              type="number"
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              required
            />

            {/* MONTH */}
            <Input
              label="Month"
              type="text"
              name="month"
              value={formData.month}
              onChange={handleChange}
              placeholder="Example: May 2026"
              required
            />

            {/* BASIC SALARY */}
            <Input
              label="Basic Salary"
              type="number"
              name="basicSalary"
              value={formData.basicSalary}
              onChange={handleChange}
              required
            />

            {/* BONUS */}
            <Input
              label="Bonus"
              type="number"
              name="bonus"
              value={formData.bonus}
              onChange={handleChange}
            />

            {/* DEDUCTION */}
            <Input
              label="Deduction"
              type="number"
              name="deduction"
              value={formData.deduction}
              onChange={handleChange}
            />

            {/* FINAL SALARY */}
            <Input
              label="Final Salary"
              type="number"
              name="finalSalary"
              value={formData.finalSalary}
              onChange={handleChange}
              readOnly
            />

            {/* PAYMENT DATE */}
            <Input
              label="Payment Date"
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              required
            />

            {/* STATUS */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Payment Status
              </label>

              <select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              >
                <option value="">Select Status</option>
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Processing..." : "Pay Salary"}
          </button>
        </form>
      </div>
    </div>
  );
};

const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  required,
  readOnly,
  placeholder,
}) => {
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
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full border rounded-lg p-3 ${
          readOnly ? "bg-gray-100" : ""
        }`}
      />
    </div>
  );
};

export default PaySalary;