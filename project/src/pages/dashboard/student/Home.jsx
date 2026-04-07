// import React, { useEffect, useState } from "react";
// import { Typography, Card } from "@material-tailwind/react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// export function Home() {
//   const [student, setStudent] = useState(null);
//   const [performance, setPerformance] = useState([]);

//   useEffect(() => {
//     const studentId = localStorage.getItem("studentId");

//     if (!studentId) {
//       console.log("❌ No studentId found");
//       return;
//     }

//     // ✅ Student API
//     fetch(`http://localhost:8080/api/students/${studentId}`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Student API failed");
//         return res.json();
//       })
//       .then((data) => {
//         console.log("✅ Student:", data);
//         setStudent(data);
//       })
//       .catch((err) => {
//         console.error("Student Error:", err);
//         setStudent({}); // fallback
//       });

//     // ✅ Performance API (optional)
//     fetch(`http://localhost:8080/api/performance/${studentId}`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Performance API not found");
//         return res.json();
//       })
//       .then((data) => {
//         setPerformance(Array.isArray(data) ? data : []);
//       })
//       .catch((err) => {
//         console.warn("⚠️ Performance API missing:", err.message);
//         setPerformance([]);
//       });

//   }, []);

//   // 🔄 Loading
//   if (!student) {
//     return (
//       <Typography className="text-center mt-10">
//         Loading dashboard...
//       </Typography>
//     );
//   }

//   return (
//     <div className="mt-8 px-4">

//       {/* 🔥 TOP CARDS */}
//       <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

//         <Card className="p-4 border">
//           <Typography>Total Fees</Typography>
//           <Typography className="font-bold">
//             ₹{student.totalFees ?? 0}
//           </Typography>
//         </Card>
//         <Card className="p-4 border">
//           <Typography>Paid Fees</Typography>
//           <Typography className="font-bold text-green-600">
//             ₹{student.paidFees ?? 0}
//           </Typography>
//         </Card>

//         <Card className="p-4 border">
//           <Typography>Due Fees</Typography>
//           <Typography className="font-bold text-red-500">
//             ₹{student.dueFees ?? 0}
//           </Typography>
//         </Card>

//         <Card className="p-4 border">
//           <Typography>Student Name</Typography>
//           <Typography className="font-bold">
//             {student.studName || "N/A"}
//           </Typography>
//         </Card>

//       </div>

//       {/* 🔥 GRAPH */}
//       <div className="mt-8">
//         <Card className="p-4 border">
//           <Typography className="mb-4">
//             Performance Overview
//           </Typography>

//           {performance.length > 0 ? (
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={performance}>
//                 <XAxis dataKey="month" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="score"
//                   stroke="#2563eb"
//                   strokeWidth={3}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           ) : (
//             <Typography className="text-gray-500">
//               ⚠️ Performance API not ready
//             </Typography>
//           )}
//         </Card>
//       </div>

//     </div>

//   );
// }

// export default Home;






















import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    const studentId = localStorage.getItem("id");

    if (!studentId) return;

    // ✅ Student Data
    fetch(`http://localhost:8080/api/students/${studentId}`)
      .then((res) => res.json())
      .then((data) => setStudent(data))
      .catch(() => setStudent({}));

    // ✅ Performance Data
    fetch(`http://localhost:8080/api/performance/${studentId}`)
      .then((res) => res.json())
      .then((data) => setPerformance(Array.isArray(data) ? data : []))
      .catch(() => setPerformance([]));
  }, []);

  if (!student) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* 🔥 HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back, {student.studName || "Student"}
        </p>
      </div>

      {/* 🔥 TOP CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="p-5 rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow">
          <p className="text-sm">Attendance</p>
          <h2 className="text-2xl font-bold">92%</h2>
          <p className="text-xs">Last week +2.5%</p>
        </div>

        <div className="p-5 rounded-xl text-white bg-gradient-to-r from-green-400 to-teal-500 shadow">
          <p className="text-sm">Upcoming Exams</p>
          <h2 className="text-2xl font-bold">2</h2>
        </div>

        <div className="p-5 rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow">
          <p className="text-sm">Pending Fees</p>
          <h2 className="text-2xl font-bold">
            ₹{student.dueFees ?? 0}
          </h2>
        </div>

        <div className="p-5 rounded-xl text-white bg-gradient-to-r from-gray-600 to-gray-800 shadow">
          <p className="text-sm">Assignments</p>
          <h2 className="text-2xl font-bold">0</h2>
        </div>

      </div>

      {/* 🔥 MIDDLE SECTION */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">

        {/* 📅 CLASSES */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Today's Classes</h2>
          <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
            No classes today
          </div>
        </div>

        {/* 📄 ASSIGNMENTS */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold">Assignments</h2>
          <p className="text-gray-400 text-sm mt-2">
            No assignments available
          </p>
        </div>

        {/* 📊 RESULTS */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Exam Results</h2>

          <div className="mb-3">
            <p className="text-sm">Mathematics</p>
            <div className="w-full bg-gray-200 h-2 rounded">
              <div className="bg-green-500 h-2 rounded w-[85%]"></div>
            </div>
          </div>

          <div>
            <p className="text-sm">Science</p>
            <div className="w-full bg-gray-200 h-2 rounded">
              <div className="bg-yellow-500 h-2 rounded w-[75%]"></div>
            </div>
          </div>

        </div>

      </div>

      {/* 🔥 GRAPH */}
      <div className="mt-6 bg-white p-5 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Performance Overview</h2>
        {performance.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performance}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">
            ⚠️ Performance API not ready
          </p>
        )}
      </div>
      {/* 🔥 BOTTOM */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">

        {/* 📊 ATTENDANCE */}
        <div className="bg-white p-5 rounded-xl shadow text-center">
          <h2 className="font-semibold mb-3">Attendance</h2>

          <div className="w-32 h-32 mx-auto rounded-full border-8 border-green-500 flex items-center justify-center text-xl font-bold">
            92%
          </div>
        </div>

        {/* 🔔 NOTICES */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Notices</h2>
          <p className="text-gray-400 text-sm">
            No new notices
          </p>
        </div>

        {/* 📄 EXTRA */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Quick Info</h2>
          <p className="text-sm text-gray-600">
            Course: BCA <br />
            Semester: 4
          </p>
        </div>
      </div>
    </div>
  );
}
