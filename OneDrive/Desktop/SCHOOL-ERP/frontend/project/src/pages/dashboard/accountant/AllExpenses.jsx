import React, { useEffect, useState } from "react";
import api from "../../../API/ApiStore";

const AllExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expense/all");
      setExpenses(response.data || []);
    } catch (error) {
      console.error("Fetch expenses error:", error);
      alert("Expenses load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalExpense = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          All Expenses
        </h1>
        <p className="text-gray-500 mt-2">
          View all school expense records
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-gray-500">Total Expenses</h2>
        <p className="text-3xl font-bold mt-3 text-red-600">
          ₹{totalExpense}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="p-6">Loading expenses...</div>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Bill</th>
              </tr>
            </thead>

            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td className="p-4 text-center" colSpan="7">
                    No expenses found
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{expense.id}</td>
                    <td className="p-3 font-medium">{expense.title}</td>
                    <td className="p-3">{expense.category}</td>
                    <td className="p-3 font-semibold text-red-600">
                      ₹{expense.amount}
                    </td>
                    <td className="p-3">{expense.expenseDate}</td>
                    <td className="p-3">{expense.description}</td>
                    <td className="p-3">
                      {expense.billImage ? (
                        <a
                          href={expense.billImage}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        "No Bill"
                      )}
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

export default AllExpenses;