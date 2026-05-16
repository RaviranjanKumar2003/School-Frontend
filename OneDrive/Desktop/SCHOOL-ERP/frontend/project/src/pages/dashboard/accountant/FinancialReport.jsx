// import React, { useEffect, useState } from "react";
// import api from "../../../API/ApiStore";

// const FinancialReport = () => {
//   const [fees, setFees] = useState([]);
//   const [salaries, setSalaries] = useState([]);
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchReportData = async () => {
//     try {
//       const feeRes = await api.get("/fees/all");
//       const salaryRes = await api.get("/salary/all");
//       const expenseRes = await api.get("/expense/all");

//       setFees(feeRes.data || []);
//       setSalaries(salaryRes.data || []);
//       setExpenses(expenseRes.data || []);
//     } catch (error) {
//       console.error("Financial report fetch error:", error);
//       alert("Financial report load failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReportData();
//   }, []);

//   const totalFeeCollection = fees.reduce(
//     (sum, fee) => sum + Number(fee.paidAmount || 0),
//     0
//   );

//   const totalPendingFees = fees.reduce(
//     (sum, fee) => sum + Number(fee.remainingAmount || 0),
//     0
//   );

//   const totalSalaryPaid = salaries.reduce(
//     (sum, salary) => sum + Number(salary.finalSalary || 0),
//     0
//   );

//   const totalExpenses = expenses.reduce(
//     (sum, expense) => sum + Number(expense.amount || 0),
//     0
//   );

//   const totalOutflow = totalSalaryPaid + totalExpenses;
//   const netBalance = totalFeeCollection - totalOutflow;

//   if (loading) {
//     return <div className="p-6 text-xl">Loading financial report...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="mb-6">
//         <h1 className="text-4xl font-bold text-gray-800">
//           Financial Report
//         </h1>
//         <p className="text-gray-500 mt-2">
//           Complete school income, expense, salary and balance report
//         </p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <ReportCard title="Total Fee Collection" value={`₹${totalFeeCollection}`} />
//         <ReportCard title="Pending Fees" value={`₹${totalPendingFees}`} />
//         <ReportCard title="Salary Paid" value={`₹${totalSalaryPaid}`} />
//         <ReportCard title="Other Expenses" value={`₹${totalExpenses}`} />
//         <ReportCard title="Total Outflow" value={`₹${totalOutflow}`} />
//         <ReportCard title="Net Balance" value={`₹${netBalance}`} />
//       </div>

//       <div className="bg-white rounded-xl shadow p-6 mb-6">
//         <h2 className="text-2xl font-bold mb-4">Summary</h2>

//         <div className="space-y-4">
//           <SummaryRow label="Total Income from Fees" value={`₹${totalFeeCollection}`} />
//           <SummaryRow label="Pending Fee Amount" value={`₹${totalPendingFees}`} />
//           <SummaryRow label="Total Salary Paid" value={`₹${totalSalaryPaid}`} />
//           <SummaryRow label="Total Expenses" value={`₹${totalExpenses}`} />
//           <SummaryRow label="Final School Balance" value={`₹${netBalance}`} bold />
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <div className="p-6 border-b">
//           <h2 className="text-2xl font-bold">Report Breakdown</h2>
//         </div>

//         <table className="w-full border">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3 text-left">Section</th>
//               <th className="p-3 text-left">Records</th>
//               <th className="p-3 text-left">Amount</th>
//             </tr>
//           </thead>

//           <tbody>
//             <tr className="border-t">
//               <td className="p-3">Fee Collection</td>
//               <td className="p-3">{fees.length}</td>
//               <td className="p-3 text-green-600 font-semibold">
//                 ₹{totalFeeCollection}
//               </td>
//             </tr>

//             <tr className="border-t">
//               <td className="p-3">Pending Fees</td>
//               <td className="p-3">
//                 {
//                   fees.filter(
//                     (fee) =>
//                       fee.paymentStatus === "PENDING" ||
//                       fee.paymentStatus === "PARTIAL" ||
//                       Number(fee.remainingAmount || 0) > 0
//                   ).length
//                 }
//               </td>
//               <td className="p-3 text-red-600 font-semibold">
//                 ₹{totalPendingFees}
//               </td>
//             </tr>

//             <tr className="border-t">
//               <td className="p-3">Salary Payments</td>
//               <td className="p-3">{salaries.length}</td>
//               <td className="p-3 text-blue-600 font-semibold">
//                 ₹{totalSalaryPaid}
//               </td>
//             </tr>

//             <tr className="border-t">
//               <td className="p-3">Expenses</td>
//               <td className="p-3">{expenses.length}</td>
//               <td className="p-3 text-yellow-600 font-semibold">
//                 ₹{totalExpenses}
//               </td>
//             </tr>

//             <tr className="border-t bg-gray-50">
//               <td className="p-3 font-bold">Net Balance</td>
//               <td className="p-3 font-bold">-</td>
//               <td
//                 className={`p-3 font-bold ${
//                   netBalance >= 0 ? "text-green-600" : "text-red-600"
//                 }`}
//               >
//                 ₹{netBalance}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// const ReportCard = ({ title, value }) => {
//   return (
//     <div className="bg-white rounded-xl shadow p-6">
//       <h2 className="text-gray-500">{title}</h2>
//       <p className="text-3xl font-bold mt-3">{value}</p>
//     </div>
//   );
// };

// const SummaryRow = ({ label, value, bold }) => {
//   return (
//     <div className="flex justify-between border-b pb-3">
//       <span className={bold ? "font-bold" : "font-medium"}>{label}</span>
//       <span className={bold ? "font-bold text-green-600" : "font-semibold"}>
//         {value}
//       </span>
//     </div>
//   );
// };

// export default FinancialReport;




import React, { useEffect, useState } from "react";
import api from "../../../API/ApiStore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const FinancialReport = () => {
  const [fees, setFees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReportData = async () => {
    try {
      const feeRes = await api.get("/fees/all");
      const salaryRes = await api.get("/salary/all");
      const expenseRes = await api.get("/expense/all");

      setFees(feeRes.data || []);
      setSalaries(salaryRes.data || []);
      setExpenses(expenseRes.data || []);
    } catch (error) {
      console.error("Financial report fetch error:", error);
      alert("Financial report load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const totalFeeCollection = fees.reduce(
    (sum, fee) => sum + Number(fee.paidAmount || 0),
    0
  );

  const totalPendingFees = fees.reduce(
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

  const totalOutflow = totalSalaryPaid + totalExpenses;
  const netBalance = totalFeeCollection - totalOutflow;

  const pendingFeeRecords = fees.filter(
    (fee) =>
      fee.paymentStatus === "PENDING" ||
      fee.paymentStatus === "PARTIAL" ||
      Number(fee.remainingAmount || 0) > 0
  ).length;

  const downloadPDF = () => {
    const accountant =
      JSON.parse(localStorage.getItem("accountant")) || {};

    const schoolAdmin =
      JSON.parse(localStorage.getItem("schoolAdminData")) || {};

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text(
      schoolAdmin?.schoolName || "School ERP",
      14,
      20
    );

    doc.setFontSize(11);
    doc.text(
      schoolAdmin?.schoolAddress ||
        schoolAdmin?.address ||
        "School Address Not Available",
      14,
      28
    );

    doc.text(
      `Phone: ${schoolAdmin?.phone || "N/A"}`,
      14,
      36
    );

    doc.text(
      `Email: ${schoolAdmin?.email || "N/A"}`,
      14,
      44
    );

    doc.setFontSize(16);
    doc.text("Financial Report", 14, 56);

    doc.setFontSize(11);
    doc.text(
      `School Admin: ${schoolAdmin?.fullName || schoolAdmin?.name || "N/A"}`,
      14,
      66
    );

    doc.text(
      `Accountant Name: ${accountant?.fullName || accountant?.name || "N/A"}`,
      14,
      74
    );

    doc.text(
      `Accountant ID: ${accountant?.id || "N/A"}`,
      14,
      82
    );

    doc.text(
      `Generated Date: ${new Date().toLocaleDateString()}`,
      14,
      90
    );

    autoTable(doc, {
      startY: 100,
      head: [["Section", "Records", "Amount"]],
      body: [
        ["Fee Collection", fees.length, `Rs. ${totalFeeCollection}`],
        ["Pending Fees", pendingFeeRecords, `Rs. ${totalPendingFees}`],
        ["Salary Payments", salaries.length, `Rs. ${totalSalaryPaid}`],
        ["Expenses", expenses.length, `Rs. ${totalExpenses}`],
        ["Total Outflow", "-", `Rs. ${totalOutflow}`],
        ["Net Balance", "-", `Rs. ${netBalance}`],
      ],
    });

    doc.save("financial-report.pdf");
  };

  if (loading) {
    return <div className="p-6 text-xl">Loading financial report...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            Financial Report
          </h1>

          <p className="text-gray-500 mt-2">
            Complete school income, expense, salary and balance report
          </p>
        </div>

        <button
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold"
        >
          Download PDF Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <ReportCard title="Total Fee Collection" value={`₹${totalFeeCollection}`} />
        <ReportCard title="Pending Fees" value={`₹${totalPendingFees}`} />
        <ReportCard title="Salary Paid" value={`₹${totalSalaryPaid}`} />
        <ReportCard title="Other Expenses" value={`₹${totalExpenses}`} />
        <ReportCard title="Total Outflow" value={`₹${totalOutflow}`} />
        <ReportCard title="Net Balance" value={`₹${netBalance}`} />
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Summary</h2>

        <div className="space-y-4">
          <SummaryRow label="Total Income from Fees" value={`₹${totalFeeCollection}`} />
          <SummaryRow label="Pending Fee Amount" value={`₹${totalPendingFees}`} />
          <SummaryRow label="Total Salary Paid" value={`₹${totalSalaryPaid}`} />
          <SummaryRow label="Total Expenses" value={`₹${totalExpenses}`} />
          <SummaryRow label="Final School Balance" value={`₹${netBalance}`} bold />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Report Breakdown</h2>
        </div>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Section</th>
              <th className="p-3 text-left">Records</th>
              <th className="p-3 text-left">Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-3">Fee Collection</td>
              <td className="p-3">{fees.length}</td>
              <td className="p-3 text-green-600 font-semibold">
                ₹{totalFeeCollection}
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-3">Pending Fees</td>
              <td className="p-3">{pendingFeeRecords}</td>
              <td className="p-3 text-red-600 font-semibold">
                ₹{totalPendingFees}
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-3">Salary Payments</td>
              <td className="p-3">{salaries.length}</td>
              <td className="p-3 text-blue-600 font-semibold">
                ₹{totalSalaryPaid}
              </td>
            </tr>

            <tr className="border-t">
              <td className="p-3">Expenses</td>
              <td className="p-3">{expenses.length}</td>
              <td className="p-3 text-yellow-600 font-semibold">
                ₹{totalExpenses}
              </td>
            </tr>

            <tr className="border-t bg-gray-50">
              <td className="p-3 font-bold">Net Balance</td>
              <td className="p-3 font-bold">-</td>
              <td
                className={`p-3 font-bold ${
                  netBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ₹{netBalance}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </div>
  );
};

const SummaryRow = ({ label, value, bold }) => {
  return (
    <div className="flex justify-between border-b pb-3">
      <span className={bold ? "font-bold" : "font-medium"}>
        {label}
      </span>

      <span className={bold ? "font-bold text-green-600" : "font-semibold"}>
        {value}
      </span>
    </div>
  );
};

export default FinancialReport;