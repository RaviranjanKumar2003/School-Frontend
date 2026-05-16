import { useState, useEffect } from "react";

import TeacherAttendance from "@/pages/dashboard/hod/Attendance/TeacherAttendance";
import StuAttendance from "@/pages/dashboard/hod/Attendance/StuAttendance";
import PrincipalAttendance from "@/pages/dashboard/SchoolAdmin/PrincipalAttendance";

export default function HODAttendance() {

  const [activeTab, setActiveTab] = useState("teacher");

  const [role, setRole] = useState("");

  // ✅ GET ROLE
  useEffect(() => {

    const userRole =
      localStorage.getItem("userRole");

    setRole(userRole?.toLowerCase());

  }, []);

  // ✅ CHECK SCHOOL ADMIN
  const isSchoolAdmin =
    role === "schooladmin";

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Attendance Management
      </h2>

      {/* ================= BUTTONS ================= */}

      <div className="flex gap-4 flex-wrap">

        {/* TEACHER */}
        <button
          onClick={() =>
            setActiveTab("teacher")
          }
          className={`px-6 py-3 rounded transition font-semibold
          ${
            activeTab === "teacher"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
          }`}
        >
          Teacher Attendance
        </button>

        {/* STUDENT */}
        <button
          onClick={() =>
            setActiveTab("student")
          }
          className={`px-6 py-3 rounded transition font-semibold
          ${
            activeTab === "student"
              ? "bg-green-600 text-white shadow-lg"
              : "bg-green-100 text-green-600 hover:bg-green-200"
          }`}
        >
          Student Attendance
        </button>

        {/* ⭐ PRINCIPAL ONLY FOR SCHOOL ADMIN */}
        {isSchoolAdmin && (

          <button
            onClick={() =>
              setActiveTab("principal")
            }
            className={`px-6 py-3 rounded transition font-semibold
            ${
              activeTab === "principal"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-purple-100 text-purple-600 hover:bg-purple-200"
            }`}
          >
            Principal Attendance
          </button>

        )}

      </div>

      {/* ================= CONTENT ================= */}

      <div className="mt-6">

        {activeTab === "teacher" && (
          <TeacherAttendance />
        )}

        {activeTab === "student" && (
          <StuAttendance />
        )}

        {activeTab === "principal" &&
          isSchoolAdmin && (
            <PrincipalAttendance />
        )}

      </div>

    </div>
  );
}