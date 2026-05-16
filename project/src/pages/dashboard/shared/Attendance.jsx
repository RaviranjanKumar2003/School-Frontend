import { useState, useEffect } from "react";

import TeacherAttendance from "@/pages/dashboard/hod/Attendance/TeacherAttendance";
import StuAttendance from "@/pages/dashboard/hod/Attendance/StuAttendance";
import PrincipalAttendance from "@/pages/dashboard/SchoolAdmin/PrincipalAttendance";
import MyAttendance from "@/pages/dashboard/professor/MyAttendance";

export default function HODAttendance() {
  const [activeTab, setActiveTab] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")?.toLowerCase();
    setRole(userRole);

    // 👉 DEFAULT TAB BASED ON ROLE
    if (userRole === "teacher" || userRole === "professor") {
      setActiveTab("student"); // teacher first sees student attendance
    } else if (userRole === "student") {
      setActiveTab("my"); // student only my attendance
    } else {
      setActiveTab("teacher"); // hod / admin default
    }
  }, []);

  const isSchoolAdmin = role === "schooladmin";
  const isTeacher = role === "teacher" || role === "professor";
  const isStudent = role === "student";
  const isHod = role === "hod";

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Attendance Management
      </h2>

      {/* ================= BUTTONS ================= */}
      <div className="flex gap-4 flex-wrap">

        {/* ================= HOD / ADMIN ================= */}
        {(isHod || isSchoolAdmin) && (
          <>
            <button
              onClick={() => setActiveTab("teacher")}
              className={`px-6 py-3 rounded font-semibold transition
              ${
                activeTab === "teacher"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
            >
              Teacher Attendance
            </button>

            <button
              onClick={() => setActiveTab("student")}
              className={`px-6 py-3 rounded font-semibold transition
              ${
                activeTab === "student"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-green-100 text-green-600 hover:bg-green-200"
              }`}
            >
              Student Attendance
            </button>
          </>
        )}

        {/* ================= TEACHER ================= */}
        {isTeacher && (
          <>
            <button
              onClick={() => setActiveTab("student")}
              className={`px-6 py-3 rounded font-semibold transition
              ${
                activeTab === "student"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-green-100 text-green-600 hover:bg-green-200"
              }`}
            >
              Student Attendance
            </button>

            <button
              onClick={() => setActiveTab("my")}
              className={`px-6 py-3 rounded font-semibold transition
              ${
                activeTab === "my"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
              }`}
            >
              My Attendance
            </button>
          </>
        )}

        {/* ================= STUDENT ================= */}
        {isStudent && (
          <button
            onClick={() => setActiveTab("my")}
            className={`px-6 py-3 rounded font-semibold transition
            ${
              activeTab === "my"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
            }`}
          >
            My Attendance
          </button>
        )}

        {/* ================= PRINCIPAL (ADMIN) ================= */}
        {isSchoolAdmin && (
          <button
            onClick={() => setActiveTab("principal")}
            className={`px-6 py-3 rounded font-semibold transition
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

        {/* HOD + ADMIN */}
        {(isHod || isSchoolAdmin) && activeTab === "teacher" && (
          <TeacherAttendance />
        )}

        {(isHod || isSchoolAdmin) && activeTab === "student" && (
          <StuAttendance />
        )}

        {isSchoolAdmin && activeTab === "principal" && (
          <PrincipalAttendance />
        )}

        {/* TEACHER */}
        {isTeacher && activeTab === "student" && (
          <StuAttendance />
        )}

        {isTeacher && activeTab === "my" && (
          <MyAttendance />
        )}

        {/* STUDENT */}
        {isStudent && activeTab === "my" && (
          <MyAttendance />
        )}

      </div>
    </div>
  );
}