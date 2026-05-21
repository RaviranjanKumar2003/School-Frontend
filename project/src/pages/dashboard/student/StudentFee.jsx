import React, { useEffect, useState } from "react";
import { Typography, Card } from "@material-tailwind/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StudentFee = () => {
  const [student, setStudent] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [fee, setFee] = useState(null);

  useEffect(() => {
    const studentId = localStorage.getItem("id");

    if (!studentId) {
      console.log("❌ No studentId found");
      return;
    }

    // ✅ STUDENT API
    fetch(`http://localhost:8080/api/students/by-id/${studentId}`)
      .then((res) => res.json())
      .then((data) => setStudent(data))
      .catch(() => setStudent({}));

    // ✅ PERFORMANCE API
    fetch(`http://localhost:8080/api/performance/${studentId}`)
      .then((res) => res.json())
      .then((data) => setPerformance(Array.isArray(data) ? data : []))
      .catch(() => setPerformance([]));

    // ✅ FEE API (🔥 IMPORTANT)
    fetch(`http://localhost:8080/api/fees/history/${studentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setFee(data[data.length - 1]); // latest fee
        }
      })
      .catch((err) => console.log(err));

  }, []);

  if (!student) {
    return (
      <Typography className="text-center mt-10">
        Loading dashboard...
      </Typography>
    );
  }

  const isDue = fee?.pendingAmount > 0;

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">

      {/* 🔥 HEADER */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">
          Welcome, {student.studName || "Student"} 👋
        </h1>
        <p className="text-sm opacity-90 mt-1">
          Here is your dashboard overview
        </p>
      </div>

      {/* 🔥 CARDS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <Card className="p-5 shadow rounded-xl border-t-4 border-blue-500">
          <Typography className="text-gray-500 text-sm">Total Fees</Typography>
          <Typography className="font-bold text-xl mt-1 text-blue-600">
            ₹{fee?.totalFee ?? 0}
          </Typography>
        </Card>

        <Card className="p-5 shadow rounded-xl border-t-4 border-green-500">
          <Typography className="text-gray-500 text-sm">Paid Fees</Typography>
          <Typography className="font-bold text-xl mt-1 text-green-600">
            ₹{fee?.paidAmount ?? 0}
          </Typography>
        </Card>

        <Card className="p-5 shadow rounded-xl border-t-4 border-red-500">
          <Typography className="text-gray-500 text-sm">Due Fees</Typography>
          <Typography className="font-bold text-xl mt-1 text-red-500">
            ₹{fee?.pendingAmount ?? 0}
          </Typography>
        </Card>

        <Card className="p-5 shadow rounded-xl border-t-4 border-gray-500">
          <Typography className="text-gray-500 text-sm">Student</Typography>
          <Typography className="font-bold text-xl mt-1">
            {student.studName || "N/A"}
          </Typography>
        </Card>

      </div>

      {/* 🔔 FEE REMINDER */}
      {isDue && (
        <div className="bg-red-100 border-l-4 border-red-500 p-5 rounded-xl shadow flex justify-between items-center flex-wrap">

          <div>
            <h2 className="text-red-600 font-semibold text-lg">
              ⚠️ Fee Reminder
            </h2>

            <p className="text-gray-700">
              You have pending fee of{" "}
              <span className="font-bold text-red-600">
                ₹{fee?.pendingAmount}
              </span>
            </p>
          </div>

          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Pay Now
          </button>

        </div>
      )}

      {/* 📊 PERFORMANCE */}
      <Card className="p-5 shadow rounded-xl border">
        <Typography className="mb-4 font-semibold">
          Performance Overview
        </Typography>

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
          <Typography className="text-gray-500">
            ⚠️ Performance not available
          </Typography>
        )}
      </Card>

    </div>
  );
}

export default StudentFee;