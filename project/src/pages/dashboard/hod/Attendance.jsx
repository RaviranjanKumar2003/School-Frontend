import { useEffect, useState } from "react";
import axios from "axios";

export default function Attendance() {
  const [activeTab, setActiveTab] = useState("teacher");
  const [selectedClass, setSelectedClass] = useState(null);

  // 🔥 Teacher Data
  const [teacherData, setTeacherData] = useState([]);
  const [loadingTeacher, setLoadingTeacher] = useState(false);

  // 🔥 Student Data
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(false);

  const classes = Array.from({ length: 10 }, (_, i) => i + 1);

  // =========================
  // 🔥 FETCH TEACHER ATTENDANCE
  // =========================
  const fetchTeacherAttendance = async () => {
    try {
      setLoadingTeacher(true);
      const res = await axios.get("http://localhost:8080/api/attendance/all");
      setTeacherData(res.data);
    } catch (err) {
      console.error("Teacher Attendance Error:", err);
    } finally {
      setLoadingTeacher(false);
    }
  };

  // =========================
  // 🔥 FETCH STUDENTS BY CLASS (FIXED)
  // =========================
  const fetchStudentsByClass = async (cls) => {
    try {
      setLoadingStudent(true);

      // ✅ FIX: correct API
      const studentRes = await axios.get(
        `http://localhost:8080/api/attendance/students/${cls}`
      );

      const attendanceRes = await axios.get(
        `http://localhost:8080/api/attendance/class/${cls}`
      );

      const studentsData = studentRes.data;
      const attendanceSessions = attendanceRes.data;

      // 🔥 unique dates
      const dates = Array.from(
        new Set(attendanceSessions.map((s) => s.attendanceDate))
      );

      setStudents(studentsData);
      setAttendanceData(attendanceSessions);
      setUniqueDates(dates);
    } catch (err) {
      console.error("Student Attendance Error:", err);
    } finally {
      setLoadingStudent(false);
    }
  };

  useEffect(() => {
    if (activeTab === "teacher") {
      fetchTeacherAttendance();
    }
  }, [activeTab]);

  // 🔥 helper function
  const getStatus = (studentName, date) => {
    const session = attendanceData.find(
      (s) => s.attendanceDate === date
    );

    if (!session) return "-";

    const record = session.attendanceList.find(
      (a) => a.studentName === studentName
    );

    return record ? record.status : "-";
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Attendance Management</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setActiveTab("teacher");
            setSelectedClass(null);
          }}
          className={`px-4 py-2 rounded ${
            activeTab === "teacher"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Teacher Attendance
        </button>

        <button
          onClick={() => setActiveTab("student")}
          className={`px-4 py-2 rounded ${
            activeTab === "student"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Student Attendance
        </button>
      </div>

      {/* ================= TEACHER ================= */}
      {activeTab === "teacher" && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">
            All Teachers Attendance
          </h3>

          {loadingTeacher ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Lecturer</th>
                  <th className="p-2 border">Subject</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Time</th>
                </tr>
              </thead>
              <tbody>
                {teacherData.map((item, i) => (
                  <tr key={i}>
                    <td className="p-2 border">{item.lecturer}</td>
                    <td className="p-2 border">{item.subject}</td>
                    <td className="p-2 border">
                      {new Date(item.attendanceDate).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ================= STUDENT ================= */}
      {activeTab === "student" && (
        <div>
          {!selectedClass ? (
            <>
              <h3 className="text-lg font-semibold mb-4">
                Select Class (1–10)
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {classes.map((cls) => (
                  <div
                    key={cls}
                    onClick={() => {
                      setSelectedClass(cls);
                      fetchStudentsByClass(cls);
                    }}
                    className="p-4 bg-gray-100 rounded text-center cursor-pointer hover:bg-blue-100"
                  >
                    Class {cls}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white p-4 rounded shadow overflow-auto">
              <button
                onClick={() => setSelectedClass(null)}
                className="mb-4 text-blue-500 underline"
              >
                ← Back
              </button>

              <h3 className="text-lg font-semibold mb-4">
                Class {selectedClass} Attendance
              </h3>

              {loadingStudent ? (
                <p>Loading...</p>
              ) : (
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Student Name</th>

                      {uniqueDates.map((date, i) => (
                        <th key={i} className="p-2 border">
                          {new Date(date).toLocaleDateString()}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((stu, i) => (
                      <tr key={i}>
                        <td className="p-2 border">
                          {/* ✅ FIX */}
                          {stu.studName}
                        </td>

                        {uniqueDates.map((date, j) => (
                          <td key={j} className="p-2 border text-center">
                            {getStatus(stu.studName, date)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}