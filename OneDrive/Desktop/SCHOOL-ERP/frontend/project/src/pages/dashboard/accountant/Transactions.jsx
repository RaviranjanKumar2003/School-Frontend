import React, { useEffect, useState } from "react";
import api from "../../../API/ApiStore";

const Transactions = () => {
  const [fees, setFees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const feeRes = await api.get("/fees/all");
      const salaryRes = await api.get("/salary/all");
      const expenseRes = await api.get("/expense/all");

      setFees(feeRes.data || []);
      setSalaries(salaryRes.data || []);
      setExpenses(expenseRes.data || []);

      const feeTransactions = (feeRes.data || []).map((fee) => ({
        id: `FEE-${fee.id}`,
        type: "FEE_PAYMENT",
        amount: fee.paidAmount,
        mode: fee.paymentMode,
        date: fee.paymentDate,
        reference: fee.receiptNumber,
        status: fee.paymentStatus,
      }));

      const salaryTransactions = (salaryRes.data || []).map((salary) => ({
        id: `SALARY-${salary.id}`,
        type: "SALARY_PAYMENT",
        amount: salary.finalSalary,
        mode: "BANK_TRANSFER",
        date: salary.paymentDate,
        reference: `TEACHER-${salary.teacherId}`,
        status: salary.paymentStatus,
      }));

      const expenseTransactions = (expenseRes.data || []).map((expense) => ({
        id: `EXPENSE-${expense.id}`,
        type: "EXPENSE",
        amount: expense.amount,
        mode: "CASH",
        date: expense.expenseDate,
        reference: expense.title,
        status: "COMPLETED",
      }));

      setTransactions([
        ...feeTransactions,
        ...salaryTransactions,
        ...expenseTransactions,
      ]);
    } catch (error) {
      console.error("Transactions fetch error:", error);
      alert("Transactions load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalIncome = fees.reduce(
    (sum, fee) => sum + Number(fee.paidAmount || 0),
    0
  );

  const totalSalary = salaries.reduce(
    (sum, salary) => sum + Number(salary.finalSalary || 0),
    0
  );

  const totalExpense = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Transactions
        </h1>
        <p className="text-gray-500 mt-2">
          View all finance related transactions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SummaryCard title="Fee Income" value={`₹${totalIncome}`} />
        <SummaryCard title="Salary Paid" value={`₹${totalSalary}`} />
        <SummaryCard title="Expenses" value={`₹${totalExpense}`} />
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        {loading ? (
          <div className="p-6">Loading transactions...</div>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Transaction ID</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Mode</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Reference</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td className="p-4 text-center" colSpan="7">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="p-3">{transaction.id}</td>
                    <td className="p-3">{transaction.type}</td>
                    <td className="p-3 font-semibold">
                      ₹{transaction.amount || 0}
                    </td>
                    <td className="p-3">{transaction.mode}</td>
                    <td className="p-3">{transaction.date}</td>
                    <td className="p-3">{transaction.reference}</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {transaction.status}
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

const SummaryCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  );
};

export default Transactions;