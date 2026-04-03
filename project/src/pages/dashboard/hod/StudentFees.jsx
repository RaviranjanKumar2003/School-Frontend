// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function StudentFees() {

//   const [fees, setFees] = useState([]);
//   const [filter, setFilter] = useState("ALL");
//   const [search, setSearch] = useState("");

//   // Fetch Data
//   const fetchFees = async () => {
//     let url = "http://localhost:8080/api/fees/all";

//     if (filter === "PAID") url = "http://localhost:8080/api/fees/paid";
//     if (filter === "PENDING") url = "http://localhost:8080/api/fees/pending";

//     const res = await axios.get(url);
//     setFees(res.data);
//   };

//   useEffect(() => {
//     fetchFees();
//   }, [filter]);

//   // Search
//   const handleSearch = async () => {
//     if (!search) return fetchFees();
//     const res = await axios.get(`http://localhost:8080/api/fees/search/${search}`);
//     setFees(res.data);
//   };

//   return (
//     <div className="p-6">

//       <h2 className="text-2xl font-bold mb-4">💰 Students Fees</h2>

//       {/* Filters */}
//       <div className="flex gap-3 mb-4">
//         <button onClick={() => setFilter("ALL")} className="bg-gray-500 text-white px-4 py-2 rounded">All</button>
//         <button onClick={() => setFilter("PAID")} className="bg-green-500 text-white px-4 py-2 rounded">Paid</button>
//         <button onClick={() => setFilter("PENDING")} className="bg-red-500 text-white px-4 py-2 rounded">Pending</button>
//       </div>

//       {/* Search */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search student..."
//           className="border p-2 rounded w-60"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button onClick={handleSearch} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
//           Search
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto bg-white shadow rounded">
//         <table className="w-full text-left">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-3">Name</th>
//               <th>Class</th>
//               <th>Total</th>
//               <th>Paid</th>
//               <th>Pending</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {fees.map((f) => (
//               <tr key={f.id} className="border-b">
//                 <td className="p-3">{f.studentName}</td>
//                 <td>{f.className}</td>
//                 <td>{f.totalFee}</td>
//                 <td>{f.paidAmount}</td>
//                 <td>{f.pendingAmount}</td>
//                 <td>
//                   {f.status === "PAID" ? (
//                     <span className="bg-green-500 text-white px-2 py-1 rounded">Paid</span>
//                   ) : (
//                     <span className="bg-red-500 text-white px-2 py-1 rounded">Pending</span>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function StudentFees() {

//   const [fees, setFees] = useState([]);
//   const [filter, setFilter] = useState("ALL");
//   const [summary, setSummary] = useState({});
//   const [search, setSearch] = useState("");

//   // ✅ FETCH FEES
//   const fetchFees = async () => {
//     let url = "http://localhost:8080/api/fees/all";

//     if (filter === "PAID") url = "http://localhost:8080/api/fees/paid";
//     if (filter === "PENDING") url = "http://localhost:8080/api/fees/pending";

//     const res = await axios.get(url);
//     setFees(res.data);
//   };

//   // ✅ FETCH SUMMARY
//   const fetchSummary = async () => {
//     const res = await axios.get("http://localhost:8080/api/fees/summary");
//     setSummary(res.data);
//   };

//   useEffect(() => {
//     fetchFees();
//     fetchSummary();
//   }, [filter]);

//   // ✅ SEARCH
//   const handleSearch = async () => {
//     if (!search) return fetchFees();
//     const res = await axios.get(`http://localhost:8080/api/fees/search/${search}`);
//     setFees(res.data);
//   };

//   // ✅ REMINDER
//   const sendReminder = async (id) => {
//     await axios.post(`http://localhost:8080/api/fees/reminder/${id}`);
//     alert("Reminder Sent");
//   };

//   return (
//     <div className="p-6">

//       <h2 className="text-2xl font-bold mb-6">💰 Student Fees Dashboard</h2>

//       {/* 🔥 SUMMARY CARDS */}
//       <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

//         <div className="bg-blue-500 text-white p-4 rounded">
//           <h4>Total</h4>
//           <p className="text-xl">{summary.total}</p>
//         </div>

//         <div className="bg-green-500 text-white p-4 rounded">
//           <h4>Paid</h4>
//           <p className="text-xl">{summary.paidCount}</p>
//         </div>

//         <div className="bg-red-500 text-white p-4 rounded">
//           <h4>Pending</h4>
//           <p className="text-xl">{summary.pendingCount}</p>
//         </div>

//         <div className="bg-indigo-500 text-white p-4 rounded">
//           <h4>Collection</h4>
//           <p className="text-xl">₹{summary.totalCollectionAmount}</p>
//         </div>

//         <div className="bg-yellow-500 text-white p-4 rounded">
//           <h4>Dues</h4>
//           <p className="text-xl">₹{summary.totalPendingAmount}</p>
//         </div>

//       </div>

//       {/* 🔥 FILTER */}
//       <div className="flex gap-3 mb-4">
//         <button onClick={() => setFilter("ALL")} className="bg-gray-500 text-white px-4 py-2 rounded">All</button>
//         <button onClick={() => setFilter("PAID")} className="bg-green-500 text-white px-4 py-2 rounded">Paid</button>
//         <button onClick={() => setFilter("PENDING")} className="bg-red-500 text-white px-4 py-2 rounded">Pending</button>
//       </div>

//       {/* 🔍 SEARCH */}
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search student..."
//           className="border p-2 rounded w-60"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button onClick={handleSearch} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
//           Search
//         </button>
//       </div>

//       {/* 📊 TABLE */}
//       <div className="overflow-auto bg-white shadow rounded">
//         <table className="w-full text-center">
//           <thead className="bg-gray-200">
//             <tr>
//               <th>Name</th>
//               <th>Class</th>
//               <th>Total</th>
//               <th>Paid</th>
//               <th>Pending</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {fees.map((f) => (
//               <tr
//                 key={f.id}
//                 className={`border-b ${
//                   f.status === "PENDING" ? "bg-red-50" : "bg-green-50"
//                 }`}
//               >
//                 <td>{f.studentName}</td>
//                 <td>{f.className}</td>
//                 <td>{f.totalFee}</td>
//                 <td>{f.paidAmount}</td>
//                 <td>{f.pendingAmount}</td>

//                 <td>
//                   {f.status === "PAID" ? (
//                     <span className="bg-green-500 text-white px-2 py-1 rounded">Paid</span>
//                   ) : (
//                     <span className="bg-red-500 text-white px-2 py-1 rounded">Pending</span>
//                   )}
//                 </td>

//                 <td>
//                   {f.status === "PENDING" && (
//                     <button
//                       onClick={() => sendReminder(f.studentId)}
//                       className="bg-yellow-500 text-white px-3 py-1 rounded"
//                     >
//                       Reminder
//                     </button>
//                   )}
//                 </td>

//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//     </div>
//   );
// }



import { useEffect, useState } from "react";
import axios from "axios";

export default function StudentFees() {

  const [fees, setFees] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [summary, setSummary] = useState({});
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null); // 🔥 loading state

  const fetchFees = async () => {
    try {
      let url = "http://localhost:8080/api/fees/all";

      if (filter === "PAID") url = "http://localhost:8080/api/fees/paid";
      if (filter === "PENDING") url = "http://localhost:8080/api/fees/pending";

      const res = await axios.get(url);
      console.log("Fees:", res.data);

      setFees(res.data);

    } catch (err) {
      console.log("Fetch Fees Error:", err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/fees/summary");
      setSummary(res.data);
    } catch (err) {
      console.log("Summary Error:", err);
    }
  };

  useEffect(() => {
    fetchFees();
    fetchSummary();
  }, [filter]);

  const handleSearch = async () => {
    try {
      if (!search) return fetchFees();

      const res = await axios.get(
        `http://localhost:8080/api/fees/search/${search}`
      );

      setFees(res.data);

    } catch (err) {
      console.log("Search Error:", err);
    }
  };

  // 🔥 UPDATED REMINDER FUNCTION
  const sendReminder = async (id) => {

    console.log("Clicked Reminder for studentId:", id);

    setLoadingId(id);

    try {

      const res = await axios.post(
        `http://localhost:8080/api/fees/reminder/${id}`
      );

      console.log("Reminder Response:", res.data);

      alert(res.data || "Reminder Sent Successfully");

      // 🔥 refresh data
      fetchFees();

    } catch (err) {

      console.log("Reminder Error:", err);

      if (err.response) {
        alert("Error: " + err.response.data);
      } else {
        alert("Server not responding");
      }

    } finally {
      setLoadingId(null);
    }

  };

  return (
    <div className="p-4 md:p-6">

      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
        💰 Student Fees Dashboard
      </h2>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">

        <div className="bg-blue-500 text-white p-3 md:p-4 rounded text-center">
          <p className="text-sm">Total</p>
          <p className="text-lg md:text-xl font-bold">{summary.totalStudents ?? 0}</p>
        </div>

        <div className="bg-green-500 text-white p-3 md:p-4 rounded text-center">
          <p className="text-sm">Paid</p>
          <p className="text-lg md:text-xl font-bold">{summary.paidStudents ?? 0}</p>
        </div>

        <div className="bg-red-500 text-white p-3 md:p-4 rounded text-center">
          <p className="text-sm">Pending</p>
          <p className="text-lg md:text-xl font-bold">{summary.pendingStudents ?? 0}</p>
        </div>

        <div className="bg-indigo-500 text-white p-3 md:p-4 rounded text-center">
          <p className="text-sm">Collection</p>
          <p className="text-lg md:text-xl font-bold">₹{summary.totalCollectionAmount ?? 0}</p>
        </div>

        <div className="bg-yellow-500 text-white p-3 md:p-4 rounded text-center">
          <p className="text-sm">Dues</p>
          <p className="text-lg md:text-xl font-bold">₹{summary.totalPendingAmount ?? 0}</p>
        </div>

      </div>

      {/* FILTER + SEARCH */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter("ALL")} className="bg-gray-500 text-white px-3 py-2 rounded text-sm">All</button>
          <button onClick={() => setFilter("PAID")} className="bg-green-500 text-white px-3 py-2 rounded text-sm">Paid</button>
          <button onClick={() => setFilter("PENDING")} className="bg-red-500 text-white px-3 py-2 rounded text-sm">Pending</button>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search student..."
            className="border p-2 rounded w-full md:w-60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
            Search
          </button>
        </div>

      </div>

      {/* MOBILE VIEW */}
      <div className="block md:hidden space-y-3">
        {fees.map((f) => (
          <div key={f.id} className="bg-white p-4 rounded shadow">

            <p><b>{f.studentName}</b></p>
            <p>Class: {f.className}</p>
            <p>Total: ₹{f.totalFee ?? 0}</p>
            <p>Paid: ₹{f.paidAmount ?? 0}</p>
            <p>Pending: ₹{f.pendingAmount ?? 0}</p>

            <p className={f.status === "PAID" ? "text-green-600" : "text-red-600"}>
              {f.status}
            </p>

            {f.status === "PENDING" && (
              <button
                onClick={() => sendReminder(f.studentId)}
                disabled={loadingId === f.studentId}
                className="bg-yellow-500 text-white px-3 py-1 mt-2 rounded"
              >
                {loadingId === f.studentId ? "Sending..." : "Reminder"}
              </button>
            )}

          </div>
        ))}
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden md:block overflow-auto bg-white shadow rounded">
        <table className="w-full text-center">
          <thead className="bg-gray-200">
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Pending</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {fees.map((f) => (
              <tr key={f.id} className="border-b">
                <td>{f.studentName}</td>
                <td>{f.className}</td>
                <td>{f.totalFee ?? 0}</td>
                <td>{f.paidAmount ?? 0}</td>
                <td>{f.pendingAmount ?? 0}</td>

                <td>
                  {f.status === "PAID" ? "✅ Paid" : "❌ Pending"}
                </td>

                <td>
                  {f.status === "PENDING" && (
                    <button
                      onClick={() => sendReminder(f.studentId)}
                      disabled={loadingId === f.studentId}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      {loadingId === f.studentId ? "Sending..." : "Reminder"}
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}