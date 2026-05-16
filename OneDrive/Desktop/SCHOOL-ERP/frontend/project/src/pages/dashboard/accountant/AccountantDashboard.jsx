// // import React from "react";
// // import AccountantSidebar from "./AccountantSidebar";
// // import AccountantNavbar from "./AccountantNavbar";
// // import AccountantHome from "./AccountantHome";

// // export default function AccountantDashboard() {
// //   return (
// //     <div className="flex h-screen bg-gray-100">
      
// //       {/* Sidebar */}
// //       <AccountantSidebar />

// //       {/* Main Content */}
// //       <div className="flex-1 flex flex-col overflow-hidden">

// //         {/* Navbar */}
// //         <AccountantNavbar />

// //         {/* Page Content */}
// //         <div className="p-6 overflow-y-auto">
// //           <AccountantHome />
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }




// import React from "react";

// const AccountantDashboard = () => {

//   const dashboardCards = [
//     {
//       title: "Today's Fee Collection",
//       amount: "₹45,000",
//       bg: "bg-blue-500",
//     },
//     {
//       title: "Pending Fees",
//       amount: "₹2,10,000",
//       bg: "bg-red-500",
//     },
//     {
//       title: "Monthly Expenses",
//       amount: "₹85,000",
//       bg: "bg-yellow-500",
//     },
//     {
//       title: "Teacher Salary Paid",
//       amount: "₹1,50,000",
//       bg: "bg-green-500",
//     },
//     {
//       title: "School Balance",
//       amount: "₹5,75,000",
//       bg: "bg-purple-500",
//     },
//     {
//       title: "Total Transactions",
//       amount: "1,250",
//       bg: "bg-gray-700",
//     },
//   ];

//   const recentTransactions = [
//     {
//       id: 1,
//       name: "Aman Kumar",
//       type: "Fee Payment",
//       amount: "₹12,000",
//       mode: "UPI",
//       date: "15 May 2026",
//       status: "Paid",
//     },
//     {
//       id: 2,
//       name: "Rohit Sharma",
//       type: "Salary Payment",
//       amount: "₹35,000",
//       mode: "Bank Transfer",
//       date: "14 May 2026",
//       status: "Paid",
//     },
//     {
//       id: 3,
//       name: "Electricity Bill",
//       type: "Expense",
//       amount: "₹8,500",
//       mode: "Cash",
//       date: "13 May 2026",
//       status: "Completed",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">

//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-8">

//         <div>
//           <h1 className="text-4xl font-bold text-gray-800">
//             Accountant Dashboard
//           </h1>

//           <p className="text-gray-500 mt-2">
//             Welcome to School Financial Management System
//           </p>
//         </div>

//         <div className="bg-white shadow px-5 py-3 rounded-xl">
//           <h2 className="font-semibold text-gray-700">
//             Accountant Panel
//           </h2>
//         </div>
//       </div>

//       {/* DASHBOARD CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//         {dashboardCards.map((card, index) => (

//           <div
//             key={index}
//             className={`${card.bg} text-white rounded-2xl shadow-lg p-6`}
//           >

//             <h2 className="text-lg font-medium">
//               {card.title}
//             </h2>

//             <p className="text-3xl font-bold mt-4">
//               {card.amount}
//             </p>

//           </div>

//         ))}

//       </div>

//       {/* QUICK ACTIONS */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">

//         <h2 className="text-2xl font-bold mb-6 text-gray-800">
//           Quick Actions
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

//           <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold">
//             Collect Fee
//           </button>

//           <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-semibold">
//             Pay Salary
//           </button>

//           <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-xl font-semibold">
//             Add Expense
//           </button>

//           <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-semibold">
//             Generate Report
//           </button>

//         </div>
//       </div>

//       {/* RECENT TRANSACTIONS */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">

//         <div className="flex justify-between items-center mb-6">

//           <h2 className="text-2xl font-bold text-gray-800">
//             Recent Transactions
//           </h2>

//           <button className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded-lg">
//             View All
//           </button>

//         </div>

//         <div className="overflow-x-auto">

//           <table className="w-full">

//             <thead>

//               <tr className="bg-gray-100 text-left">

//                 <th className="p-4">Name</th>
//                 <th className="p-4">Type</th>
//                 <th className="p-4">Amount</th>
//                 <th className="p-4">Mode</th>
//                 <th className="p-4">Date</th>
//                 <th className="p-4">Status</th>

//               </tr>

//             </thead>

//             <tbody>

//               {recentTransactions.map((transaction) => (

//                 <tr
//                   key={transaction.id}
//                   className="border-b hover:bg-gray-50"
//                 >

//                   <td className="p-4 font-medium">
//                     {transaction.name}
//                   </td>

//                   <td className="p-4">
//                     {transaction.type}
//                   </td>

//                   <td className="p-4 font-semibold">
//                     {transaction.amount}
//                   </td>

//                   <td className="p-4">
//                     {transaction.mode}
//                   </td>

//                   <td className="p-4">
//                     {transaction.date}
//                   </td>

//                   <td className="p-4">

//                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
//                       {transaction.status}
//                     </span>

//                   </td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>

//         </div>
//       </div>

//       {/* FINANCIAL SUMMARY */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

//         {/* LEFT */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">

//           <h2 className="text-2xl font-bold text-gray-800 mb-5">
//             Financial Summary
//           </h2>

//           <div className="space-y-5">

//             <div className="flex justify-between border-b pb-3">
//               <span className="font-medium">Total Income</span>
//               <span className="font-bold text-green-600">
//                 ₹8,50,000
//               </span>
//             </div>

//             <div className="flex justify-between border-b pb-3">
//               <span className="font-medium">Total Expenses</span>
//               <span className="font-bold text-red-500">
//                 ₹2,75,000
//               </span>
//             </div>

//             <div className="flex justify-between border-b pb-3">
//               <span className="font-medium">Salary Paid</span>
//               <span className="font-bold text-blue-600">
//                 ₹1,50,000
//               </span>
//             </div>

//             <div className="flex justify-between">
//               <span className="font-medium">Net Balance</span>
//               <span className="font-bold text-purple-600">
//                 ₹4,25,000
//               </span>
//             </div>

//           </div>

//         </div>

//         {/* RIGHT */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">

//           <h2 className="text-2xl font-bold text-gray-800 mb-5">
//             Notifications
//           </h2>

//           <div className="space-y-4">

//             <div className="bg-red-100 text-red-700 p-4 rounded-xl">
//               25 students have pending fees.
//             </div>

//             <div className="bg-yellow-100 text-yellow-700 p-4 rounded-xl">
//               Electricity bill payment due tomorrow.
//             </div>

//             <div className="bg-blue-100 text-blue-700 p-4 rounded-xl">
//               Monthly report generation pending.
//             </div>

//             <div className="bg-green-100 text-green-700 p-4 rounded-xl">
//               Teacher salaries paid successfully.
//             </div>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default AccountantDashboard;








import React, { useEffect, useState } from "react";
import api from "../../../API/ApiStore";

const AccountantDashboard = () => {
  const [fees, setFees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const feeRes = await api.get("/fees/all");
      const salaryRes = await api.get("/salary/all");
      const expenseRes = await api.get("/expense/all");

      setFees(feeRes.data || []);
      setSalaries(salaryRes.data || []);
      setExpenses(expenseRes.data || []);
    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalFeeCollection = fees.reduce(
    (sum, fee) => sum + Number(fee.paidAmount || 0),
    0
  );

  const pendingFees = fees.reduce(
    (sum, fee) => sum + Number(fee.remainingAmount || 0),
    0
  );

  const totalSalaryPaid = salaries.reduce(
    (sum, salary) => sum + Number(salary.finalSalary || 0),
    0
  );

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount || 0),
    0
  );

  const schoolBalance = totalFeeCollection - totalSalaryPaid - totalExpenses;

  if (loading) {
    return <div className="p-6 text-xl">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Accountant Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          School finance overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Total Fee Collection" value={`₹${totalFeeCollection}`} />
        <DashboardCard title="Pending Fees" value={`₹${pendingFees}`} />
        <DashboardCard title="Salary Paid" value={`₹${totalSalaryPaid}`} />
        <DashboardCard title="Total Expenses" value={`₹${totalExpenses}`} />
        <DashboardCard title="School Balance" value={`₹${schoolBalance}`} />
        <DashboardCard title="Total Fee Records" value={fees.length} />
      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Fee Records</h2>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Student ID</th>
                <th className="p-3 text-left">Paid</th>
                <th className="p-3 text-left">Remaining</th>
                <th className="p-3 text-left">Mode</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {fees.slice(0, 5).map((fee) => (
                <tr key={fee.id} className="border-t">
                  <td className="p-3">{fee.studentId}</td>
                  <td className="p-3">₹{fee.paidAmount}</td>
                  <td className="p-3">₹{fee.remainingAmount}</td>
                  <td className="p-3">{fee.paymentMode}</td>
                  <td className="p-3">{fee.paymentStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  );
};

export default AccountantDashboard;