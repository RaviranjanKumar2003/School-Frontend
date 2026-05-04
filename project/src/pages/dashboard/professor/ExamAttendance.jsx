import React, { useEffect, useState } from "react";
import axios from "axios";

const ExamAttendance = () => {

  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("image"+students);

  const teacherData = JSON.parse(localStorage.getItem("professorData"));
  const teacherId = teacherData?.id;

  // 🔥 load classes
  useEffect(() => {
    axios.get("http://localhost:8080/api/classes")
      .then(res => setClasses(res.data))
      .catch(() => alert("❌ Error loading classes"));
  }, []);

  // 🔥 FIXED MESSAGE FUNCTION
  const getErrorMessage = (err) => {
    if (typeof err === "string") return err;

    if (err?.response?.data) {
      if (typeof err.response.data === "string") {
        return err.response.data;
      }
      return err.response.data.message || "❌ Something went wrong";
    }

    return "❌ Server error";
  };

  // 🔥 load students
  const loadStudents = async () => {
    if (!classId) return alert("⚠️ Please select a class");

    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/exam-schedule/class/${classId}/${teacherId}`
      );

      if (res.data.length === 0) {
        alert("❌ No students or no exam for today");
      }

      setStudents(res.data);

    } catch (err) {
      alert(getErrorMessage(err)); // ✅ FIXED MESSAGE
      setStudents([]);
    }

    setLoading(false);
  };

  // 🔥 mark attendance
  const mark = async (id, status) => {
    try {
      await axios.put(
        "http://localhost:8080/api/exam-schedule/exam_attendance",
        {
          id,
          examStatus: status
        }
      );

      setStudents(prev =>
        prev.map(s =>
          s.id === id ? { ...s, examStatus: status } : s
        )
      );

    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-center mb-6">
        📋 Exam Attendance
      </h1>

      {/* SELECT */}
      <div className="flex flex-col md:flex-row gap-3 justify-center mb-6">

        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="p-3 rounded-lg border shadow focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Class</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>
              Class {c.className}
            </option>
          ))}
        </select>

        <button
          onClick={loadStudents}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          Load Students
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-gray-500">
          Loading...
        </div>
      )}

      {/* STUDENTS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {students.map(s => (

          <div
            key={s.id}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition duration-300"
          >

            {/* 🔥 IMAGE + NAME */}
            <div className="flex items-center gap-3">

              <img
               src={`http://localhost:8080/api/students/image/get/${s.studentId}`}
               alt="student"
               className="w-12 h-12 rounded-full border object-cover"
               onError={(e) => {
               e.target.onerror = null;
               e.target.src = "/user.png";
               }}
              />
              <div>
                <h2 className="text-lg font-semibold text-blue-600">
                  {s.studentName}
                </h2>
              </div>
            </div>

            <h className="text-1xl mt-10 text-gray-800">
                Exam Sub: {s.subjectName}
            </h>

            {/* STATUS */}
            <p className="text-1xl mt-3">
              Status:
              <span className={`ml-2 font-bold ${
                s.examStatus === "PRESENT"
                  ? "text-green-600"
                  : s.examStatus === "ABSENT"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}>
                {s.examStatus || "PENDING"}
              </span>
            </p>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-4">

              <button
                onClick={() => mark(s.id, "PRESENT")}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
              >
                PRESENT
              </button>

              <button
                onClick={() => mark(s.id, "ABSENT")}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
              >
                ABSENT
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* EMPTY */}
      {!loading && students.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          No students found
        </div>
      )}

    </div>
  );
};

export default ExamAttendance;