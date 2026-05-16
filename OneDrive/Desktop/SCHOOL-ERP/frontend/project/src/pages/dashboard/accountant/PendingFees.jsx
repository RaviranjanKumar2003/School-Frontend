import React, { useEffect, useState } from "react";
import api from "../../../API/ApiStore";

const PendingFees = () => {

  const [fees, setFees] = useState([]);

  const [loading, setLoading] = useState(true);

  // FETCH ALL FEES
  const fetchFees = async () => {

    try {

      const response = await api.get("/fees/all");

      // FILTER ONLY PENDING FEES
      const pending = response.data.filter(
        (fee) =>
          fee.paymentStatus === "PENDING" ||
          fee.paymentStatus === "PARTIAL" ||
          fee.remainingAmount > 0
      );

      setFees(pending);

    } catch (error) {

      console.error("Error fetching pending fees:", error);

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    fetchFees();

  }, []);

  // TOTAL PENDING
  const totalPending = fees.reduce(
    (total, fee) => total + fee.remainingAmount,
    0
  );

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>

          <h1 className="text-4xl font-bold text-gray-800">
            Pending Fees
          </h1>

          <p className="text-gray-500 mt-2">
            Manage unpaid student fees
          </p>

        </div>

      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* TOTAL PENDING */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-gray-500 text-lg">
            Total Pending
          </h2>

          <p className="text-3xl font-bold text-red-500 mt-4">
            ₹{totalPending}
          </p>

        </div>

        {/* TOTAL STUDENTS */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-gray-500 text-lg">
            Pending Students
          </h2>

          <p className="text-3xl font-bold text-yellow-500 mt-4">
            {fees.length}
          </p>

        </div>

        {/* OVERDUE */}
        <div className="bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-gray-500 text-lg">
            Overdue Cases
          </h2>

          <p className="text-3xl font-bold text-purple-500 mt-4">
            {
              fees.filter(
                (fee) => fee.paymentStatus === "OVERDUE"
              ).length
            }
          </p>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold text-gray-800">
            Pending Fee Records
          </h2>

        </div>

        {loading ? (

          <div className="p-10 text-center text-lg">
            Loading...
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-gray-100">

                <tr>

                  <th className="text-left p-4">
                    Student ID
                  </th>

                  <th className="text-left p-4">
                    Total Fees
                  </th>

                  <th className="text-left p-4">
                    Paid Amount
                  </th>

                  <th className="text-left p-4">
                    Remaining
                  </th>

                  <th className="text-left p-4">
                    Payment Mode
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>

                  <th className="text-left p-4">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {fees.map((fee) => (

                  <tr
                    key={fee.id}
                    className="border-b hover:bg-gray-50"
                  >

                    {/* STUDENT ID */}
                    <td className="p-4">
                      {fee.studentId}
                    </td>

                    {/* TOTAL */}
                    <td className="p-4 font-semibold">
                      ₹{fee.totalAmount}
                    </td>

                    {/* PAID */}
                    <td className="p-4 text-green-600 font-semibold">
                      ₹{fee.paidAmount}
                    </td>

                    {/* REMAINING */}
                    <td className="p-4 text-red-500 font-semibold">
                      ₹{fee.remainingAmount}
                    </td>

                    {/* MODE */}
                    <td className="p-4">
                      {fee.paymentMode}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium
                        ${
                          fee.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-700"
                            : fee.paymentStatus === "PARTIAL"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >

                        {fee.paymentStatus}

                      </span>

                    </td>

                    {/* DATE */}
                    <td className="p-4">
                      {fee.paymentDate}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default PendingFees;