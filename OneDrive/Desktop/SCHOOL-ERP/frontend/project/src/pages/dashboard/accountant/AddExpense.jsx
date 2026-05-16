// import React, { useState } from "react";
// import api from "../../../API/ApiStore";

// const AddExpense = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     category: "",
//     amount: "",
//     description: "",
//     expenseDate: "",
//     billImage: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const payload = {
//       title: formData.title,
//       category: formData.category,
//       amount: Number(formData.amount),
//       description: formData.description,
//       expenseDate: formData.expenseDate,
//       billImage: formData.billImage,
//     };

//     try {
//       setLoading(true);

//       await api.post("/expense/add", payload);

//       alert("Expense added successfully");

//       setFormData({
//         title: "",
//         category: "",
//         amount: "",
//         description: "",
//         expenseDate: "",
//         billImage: "",
//       });
//     } catch (error) {
//       console.error("Add expense error:", error);
//       alert("Expense add failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold text-gray-800">
//           Add Expense
//         </h1>

//         <p className="text-gray-500 mt-2">
//           Add school expense details
//         </p>
//       </div>

//       <div className="bg-white rounded-xl shadow p-6">
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <Input
//               label="Expense Title"
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">
//                 Category
//               </label>

//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full border rounded-lg p-3"
//                 required
//               >
//                 <option value="">Select Category</option>
//                 <option value="Electricity">Electricity</option>
//                 <option value="Water Bill">Water Bill</option>
//                 <option value="Internet">Internet</option>
//                 <option value="Furniture">Furniture</option>
//                 <option value="Stationary">Stationary</option>
//                 <option value="Maintenance">Maintenance</option>
//                 <option value="Transport">Transport</option>
//                 <option value="Event">Event</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>

//             <Input
//               label="Amount"
//               type="number"
//               name="amount"
//               value={formData.amount}
//               onChange={handleChange}
//               required
//             />

//             <Input
//               label="Expense Date"
//               type="date"
//               name="expenseDate"
//               value={formData.expenseDate}
//               onChange={handleChange}
//               required
//             />

//             <Input
//               label="Bill Image URL"
//               type="text"
//               name="billImage"
//               value={formData.billImage}
//               onChange={handleChange}
//               placeholder="Optional"
//             />

//             <div className="md:col-span-2">
//               <label className="block mb-2 font-medium text-gray-700">
//                 Description
//               </label>

//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 rows="4"
//                 className="w-full border rounded-lg p-3"
//                 placeholder="Enter expense description"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
//           >
//             {loading ? "Saving..." : "Add Expense"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// const Input = ({
//   label,
//   type,
//   name,
//   value,
//   onChange,
//   required,
//   placeholder,
// }) => {
//   return (
//     <div>
//       <label className="block mb-2 font-medium text-gray-700">
//         {label}
//       </label>

//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         required={required}
//         placeholder={placeholder}
//         className="w-full border rounded-lg p-3"
//       />
//     </div>
//   );
// };

// export default AddExpense;






import React, { useState } from "react";
import api from "../../../API/ApiStore";

const AddExpense = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    description: "",
    expenseDate: "",
    billImage: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBillImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({
        ...formData,
        billImage: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      category: formData.category,
      amount: Number(formData.amount),
      description: formData.description,
      expenseDate: formData.expenseDate,
      billImage: formData.billImage,
    };

    try {
      setLoading(true);

      await api.post("/expense/add", payload);

      alert("Expense added successfully");

      setFormData({
        title: "",
        category: "",
        amount: "",
        description: "",
        expenseDate: "",
        billImage: "",
      });
    } catch (error) {
      console.error("Add expense error:", error);
      alert("Expense add failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Add Expense
        </h1>

        <p className="text-gray-500 mt-2">
          Add school expense details
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Expense Title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              >
                <option value="">Select Category</option>
                <option value="Electricity">Electricity</option>
                <option value="Water Bill">Water Bill</option>
                <option value="Internet">Internet</option>
                <option value="Furniture">Furniture</option>
                <option value="Stationary">Stationary</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Transport">Transport</option>
                <option value="Event">Event</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Input
              label="Amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />

            <Input
              label="Expense Date"
              type="date"
              name="expenseDate"
              value={formData.expenseDate}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Upload Bill Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleBillImageChange}
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full border rounded-lg p-3"
                placeholder="Enter expense description"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? "Saving..." : "Add Expense"}
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
        placeholder={placeholder}
        className="w-full border rounded-lg p-3"
      />
    </div>
  );
};

export default AddExpense;