import { useState } from "react";
import TeacherAttendance from "@/pages/dashboard/hod/Attendance/TeacherAttendance";
import StuAttendance from "@/pages/dashboard/hod/Attendance/StuAttendance";

export default function HODAttendance() {
  // ✅ Default teacher selected
  const [activeTab, setActiveTab] = useState("teacher");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Attendance Management</h2>

      <div className="flex gap-4">

        {/* ✅ Teacher Attendance */}
        <button
          onClick={() => setActiveTab("teacher")}
          className={`px-6 py-3 rounded transition font-semibold
            ${
              activeTab === "teacher"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"
            }`}
        >
          Teacher Attendance
        </button>

        {/* ✅ Student Attendance */}
        <button
          onClick={() => setActiveTab("student")}
          className={`px-6 py-3 rounded transition font-semibold
            ${
              activeTab === "student"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-green-100 text-green-600 hover:bg-green-200"
            }`}
        >
          Student Attendance
        </button>

      </div>

      {/* 🔥 Dynamic Section */}
      <div className="mt-6">
        {activeTab === "teacher" && <TeacherAttendance />}
        {activeTab === "student" && <StuAttendance />}
      </div>
    </div>
  );
}