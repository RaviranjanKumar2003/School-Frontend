import React, { useEffect, useState } from "react";
import api from "../../../API/ApiStore";

const SalaryHistory = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSalaries = async () => {
    try {
      const response = await api.get("/salary/all");
      setSalaries(response.data || []);
    } catch (error) {
      console.error("Salary history fetch error:", error);
      alert("Salary history load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const totalPaidSalary = salaries.reduce(
    (sum, salary) => sum + Number(salary.finalSalary || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Salary History
        </h1>
        <p className="text-gray-500 mt-2">
          View all teacher salary payment records
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-gray-500">Total Salary Paid</h2>
        <p className="text-3xl font-bold mt-3 text-green-600">
          ₹{totalPaidSalary}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="p-6">Loading salary history...</div>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Salary ID</th>
                <th className="p-3 text-left">Teacher ID</th>
                <th className="p-3 text-left">Month</th>
                <th className="p-3 text-left">Basic</th>
                <th className="p-3 text-left">Bonus</th>
                <th className="p-3 text-left">Deduction</th>
                <th className="p-3 text-left">Final Salary</th>
                <th className="p-3 text-left">Payment Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {salaries.length === 0 ? (
                <tr>
                  <td className="p-4 text-center" colSpan="9">
                    No salary records found
                  </td>
                </tr>
              ) : (
                salaries.map((salary) => (
                  <tr key={salary.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{salary.id}</td>
                    <td className="p-3">{salary.teacherId}</td>
                    <td className="p-3">{salary.month}</td>
                    <td className="p-3">₹{salary.basicSalary}</td>
                    <td className="p-3">₹{salary.bonus || 0}</td>
                    <td className="p-3">₹{salary.deduction || 0}</td>
                    <td className="p-3 font-semibold text-green-600">
                      ₹{salary.finalSalary}
                    </td>
                    <td className="p-3">{salary.paymentDate}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          salary.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {salary.paymentStatus}
                      </span>
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
};

export default SalaryHistory;