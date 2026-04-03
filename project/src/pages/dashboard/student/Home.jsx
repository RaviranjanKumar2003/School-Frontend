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

export function Home() {
  const [student, setStudent] = useState(null);
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
      console.log("❌ No studentId found");
      return;
    }

    // ✅ Student API
    fetch(`http://localhost:8080/api/students/${studentId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Student API failed");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Student:", data);
        setStudent(data);
      })
      .catch((err) => {
        console.error("Student Error:", err);
        setStudent({}); // fallback
      });

    // ✅ Performance API (optional)
    fetch(`http://localhost:8080/api/performance/${studentId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Performance API not found");
        return res.json();
      })
      .then((data) => {
        setPerformance(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.warn("⚠️ Performance API missing:", err.message);
        setPerformance([]);
      });

  }, []);

  // 🔄 Loading
  if (!student) {
    return (
      <Typography className="text-center mt-10">
        Loading dashboard...
      </Typography>
    );
  }

  return (
    <div className="mt-8 px-4">

      {/* 🔥 TOP CARDS */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <Card className="p-4 border">
          <Typography>Total Fees</Typography>
          <Typography className="font-bold">
            ₹{student.totalFees ?? 0}
          </Typography>
        </Card>

        <Card className="p-4 border">
          <Typography>Paid Fees</Typography>
          <Typography className="font-bold text-green-600">
            ₹{student.paidFees ?? 0}
          </Typography>
        </Card>

        <Card className="p-4 border">
          <Typography>Due Fees</Typography>
          <Typography className="font-bold text-red-500">
            ₹{student.dueFees ?? 0}
          </Typography>
        </Card>

        <Card className="p-4 border">
          <Typography>Student Name</Typography>
          <Typography className="font-bold">
            {student.studName || "N/A"}
          </Typography>
        </Card>

      </div>

      {/* 🔥 GRAPH */}
      <div className="mt-8">
        <Card className="p-4 border">
          <Typography className="mb-4">
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
              ⚠️ Performance API not ready
            </Typography>
          )}
        </Card>
      </div>

    </div>

  );
}

export default Home;

