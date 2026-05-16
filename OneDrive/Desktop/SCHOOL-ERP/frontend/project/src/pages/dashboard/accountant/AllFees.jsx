import React, { useEffect, useState } from "react";
import api from "../../../API/ApiStore";

const AllFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFees = async () => {
    try {
      const response = await api.get("/fees/all");
      setFees(response.data || []);
    } catch (error) {
      console.error("Fetch fees error:", error);
      alert("Fees load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        All Fee Records
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="p-6">Loading fees...</div>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Student ID</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Paid</th>
                <th className="p-3 text-left">Remaining</th>
                <th className="p-3 text-left">Fine</th>
                <th className="p-3 text-left">Discount</th>
                <th className="p-3 text-left">Mode</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Receipt</th>
              </tr>
            </thead>

            <tbody>
              {fees.length === 0 ? (
                <tr>
                  <td className="p-4 text-center" colSpan="11">
                    No fee records found
                  </td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{fee.id}</td>
                    <td className="p-3">{fee.studentId}</td>
                    <td className="p-3">₹{fee.totalAmount}</td>
                    <td className="p-3 text-green-600">₹{fee.paidAmount}</td>
                    <td className="p-3 text-red-600">₹{fee.remainingAmount}</td>
                    <td className="p-3">₹{fee.fine || 0}</td>
                    <td className="p-3">₹{fee.discount || 0}</td>
                    <td className="p-3">{fee.paymentMode}</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {fee.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3">{fee.paymentDate}</td>
                    <td className="p-3">{fee.receiptNumber}</td>
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

export default AllFees;