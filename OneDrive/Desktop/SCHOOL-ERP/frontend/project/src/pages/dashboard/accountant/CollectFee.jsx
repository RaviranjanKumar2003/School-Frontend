// import React, { useState } from "react";

// const CollectFee = () => {

//   const [feeData, setFeeData] = useState({
//     studentName: "",
//     rollNumber: "",
//     className: "",
//     totalFees: "",
//     paidAmount: "",
//     remainingAmount: "",
//     fine: "",
//     discount: "",
//     paymentMode: "",
//     paymentDate: "",
//   });

//   const handleChange = (e) => {

//     const { name, value } = e.target;

//     setFeeData({
//       ...feeData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = (e) => {

//     e.preventDefault();

//     console.log("Fee Submitted:", feeData);

//     alert("Fee Collected Successfully");
//   };

//   return (

//     <div className="min-h-screen bg-gray-100 p-6">

//       {/* PAGE HEADER */}
//       <div className="mb-8">

//         <h1 className="text-4xl font-bold text-gray-800">
//           Collect Student Fee
//         </h1>

//         <p className="text-gray-500 mt-2">
//           Manage student fee payments and receipts
//         </p>

//       </div>

//       {/* FORM CONTAINER */}
//       <div className="bg-white rounded-2xl shadow-lg p-8">

//         <form onSubmit={handleSubmit}>

//           {/* STUDENT DETAILS */}
//           <div className="mb-10">

//             <h2 className="text-2xl font-bold text-gray-800 mb-6">
//               Student Information
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//               {/* STUDENT NAME */}
//               <div>

//                 <label className="block mb-2 font-medium text-gray-700">
//                   Student Name
//                 </label>

//                 <input
//                   type="text"
//                   name="studentName"
//                   value={feeData.studentName}
//                   onChange={handleChange}
//                   placeholder="Enter Student Name"
//                   className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />

//               </div>

//               {/* ROLL NUMBER */}
//               <div>

//                 <label className="block mb-2 font-medium text-gray-700">
//                   Roll Number
//                 </label>

//                 <input
//                   type="text"
//                   name="rollNumber"
//                   value={feeData.rollNumber}
//                   onChange={handleChange}
//                   placeholder="Enter Roll Number"
//                   className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />

//               </div>

//               {/* CLASS */}
//               <div>

//                 <label className="block mb-2 font-medium text-gray-700">
//                   Class
//                 </label>

//                 <input
//                   type="text"
//                   name="className"
//                   value={feeData.className}
//                   onChange={handleChange}
//                   placeholder="Enter Class"
//                   className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />

//               </div>

//               {/* TOTAL FEES */}
//               <div>

//                 <label className="block mb-2 font-medium text-gray-700">
//                   Total Fees
//                 </label>

//                 <input
//                   type="number"
//                   name="totalFees"
//                   value={feeData.totalFees}
//                   onChange={handleChange}
//                   placeholder="Enter Total Fees"
//                   className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />

//               </div>

//             </div>

//           </div>

//           {/* PAYMENT DETAILS */}
//           <div className="mb-10">

//             <h2 className="text-2xl font-bold text-gray-800 mb-6">
//               Payment Details
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//               {/* PAID AMOUNT */}
//               <div>

//                 <label className="block mb-2 font-medium text-gray-700">
//                   Paid Amount
//                 </label>

//                 <input
//                   type="number"
//                   name="paidAmount"
//                   value={feeData.paidAmount}
//                   onChange={handleChange}
//                   placeholder="Enter Paid Amount"
//                   className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-green-500"
//                   required
//                 />

//               </div>

//               {/* REMAINING AMOUNT */}
//               <div>

//                 <label className="block mb-2 font-medium text-gray-700">
//                   Remaining Amount
//                 </label>

//                 <input
//                   type="number"
//                   name="remainingAmount"
//                   value={feeData.remainingAmount}
//                   onChange={handleChange}
//                   placeholder="Enter Remaining Amount"
//                   className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-red-500"
//                 />

//               </div>

//               {/* FINE */}
//               <div>

//                 <label className="block mb-2 font-medium text-gray-700">
//                   Fine
//                 </label>

//                 <input
//                   type="number"
//                   name="fine"
//                   value={feeData.fine}
//                   onChange={handleChange}
//                   placeholder="Enter Fine"
//                   className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                 />

//               </div>

//               {/* DISCOUNT */}
//               <div>

//                 <label className="block mb-2 font-medium text-gray-700">
//                   Discount
//                 </label>

//                 <input
//                   type="number"
//                   name="discount"
//                   value={feeData.discount}
//                   onChange={handleChange}
//                   placeholder="Enter Discount"
//                   className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 />

//               </div>

//               {/* PAYMENT MODE */}
//               <div>

//                 <label className="block mb-2 font-medium text-gray-700">
//                   Payment Mode
//                 </label>

//                 <select
//                   name="paymentMode"
//                   value={feeData.paymentMode}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 >

//                   <option value="">
//                     Select Payment Mode
//                   </option>

//                   <option value="Cash">
//                     Cash
//                   </option>

//                   <option value="UPI">
//                     UPI
//                   </option>

//                   <option value="Bank Transfer">
//                     Bank Transfer
//                   </option>

//                   <option value="Cheque">
//                     Cheque
//                   </option>

//                 </select>

//               </div>

//               {/* PAYMENT DATE */}
//               <div>

//                 <label className="block mb-2 font-medium text-gray-700">
//                   Payment Date
//                 </label>

//                 <input
//                   type="date"
//                   name="paymentDate"
//                   value={feeData.paymentDate}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />

//               </div>

//             </div>

//           </div>

//           {/* ACTION BUTTONS */}
//           <div className="flex flex-wrap gap-4">

//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold"
//             >
//               Collect Fee
//             </button>

//             <button
//               type="button"
//               className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold"
//             >
//               Generate Receipt
//             </button>

//             <button
//               type="reset"
//               className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold"
//             >
//               Reset Form
//             </button>

//           </div>

//         </form>

//       </div>

//     </div>
//   );
// };

// export default CollectFee;





import React, { useState } from "react";
import api from "../../../API/ApiStore";

const CollectFee = () => {
  const [formData, setFormData] = useState({
    studentId: "",
    totalAmount: "",
    paidAmount: "",
    remainingAmount: "",
    fine: "",
    discount: "",
    paymentDate: "",
    receiptNumber: "",
    paymentStatus: "",
    paymentMode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedData = {
      ...formData,
      [name]: value,
    };

    if (name === "totalAmount" || name === "paidAmount" || name === "fine" || name === "discount") {
      const total = Number(name === "totalAmount" ? value : updatedData.totalAmount || 0);
      const paid = Number(name === "paidAmount" ? value : updatedData.paidAmount || 0);
      const fine = Number(name === "fine" ? value : updatedData.fine || 0);
      const discount = Number(name === "discount" ? value : updatedData.discount || 0);

      const remaining = total + fine - discount - paid;

      updatedData.remainingAmount = remaining > 0 ? remaining : 0;

      if (paid <= 0) {
        updatedData.paymentStatus = "PENDING";
      } else if (remaining > 0) {
        updatedData.paymentStatus = "PARTIAL";
      } else {
        updatedData.paymentStatus = "PAID";
      }
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      studentId: Number(formData.studentId),
      totalAmount: Number(formData.totalAmount),
      paidAmount: Number(formData.paidAmount),
      remainingAmount: Number(formData.remainingAmount),
      fine: Number(formData.fine || 0),
      discount: Number(formData.discount || 0),
      paymentDate: formData.paymentDate,
      receiptNumber: formData.receiptNumber,
      paymentStatus: formData.paymentStatus,
      paymentMode: formData.paymentMode,
    };

    try {
      setLoading(true);

      await api.post("/fees/collect", payload);

      alert("Fee collected successfully");

      setFormData({
        studentId: "",
        totalAmount: "",
        paidAmount: "",
        remainingAmount: "",
        fine: "",
        discount: "",
        paymentDate: "",
        receiptNumber: "",
        paymentStatus: "",
        paymentMode: "",
      });
    } catch (error) {
      console.error("Fee collect error:", error);
      alert("Fee collect failed");
    } finally {
      setLoading(false);
    }
  };

  const generateReceiptNumber = () => {
    const receipt = `REC-${Date.now()}`;

    setFormData({
      ...formData,
      receiptNumber: receipt,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Collect Student Fee
        </h1>
        <p className="text-gray-500 mt-2">
          Collect student payment and save it to backend
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Student ID"
              type="number"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
            />

            <Input
              label="Total Amount"
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              required
            />

            <Input
              label="Paid Amount"
              type="number"
              name="paidAmount"
              value={formData.paidAmount}
              onChange={handleChange}
              required
            />

            <Input
              label="Remaining Amount"
              type="number"
              name="remainingAmount"
              value={formData.remainingAmount}
              onChange={handleChange}
              readOnly
            />

            <Input
              label="Fine"
              type="number"
              name="fine"
              value={formData.fine}
              onChange={handleChange}
            />

            <Input
              label="Discount"
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
            />

            <Input
              label="Payment Date"
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Receipt Number
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  name="receiptNumber"
                  value={formData.receiptNumber}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                  required
                />

                <button
                  type="button"
                  onClick={generateReceiptNumber}
                  className="bg-gray-800 text-white px-4 rounded-lg"
                >
                  Generate
                </button>
              </div>
            </div>

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
                <option value="PARTIAL">PARTIAL</option>
                <option value="PENDING">PENDING</option>
                <option value="OVERDUE">OVERDUE</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Payment Mode
              </label>

              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              >
                <option value="">Select Mode</option>
                <option value="CASH">CASH</option>
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">BANK_TRANSFER</option>
                <option value="CHEQUE">CHEQUE</option>
                <option value="ONLINE">ONLINE</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Saving..." : "Collect Fee"}
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
        className={`w-full border rounded-lg p-3 ${
          readOnly ? "bg-gray-100" : ""
        }`}
      />
    </div>
  );
};

export default CollectFee;