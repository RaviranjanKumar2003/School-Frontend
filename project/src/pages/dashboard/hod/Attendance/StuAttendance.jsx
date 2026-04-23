import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEye } from "react-icons/fa";

function StuAttendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [mode, setMode] = useState(""); // take | view
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  // ================= LOAD CLASSES =================
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/classes")
      .then((res) => setClasses(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ================= LOAD STUDENTS =================
  const loadStudents = async (classId, type) => {
    setMode(type);
    setSelectedClass(classId);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/students/class/${classId}`
      );

      setStudents(res.data);

      // initialize attendance
      const initial = {};
      res.data.forEach((s) => {
        initial[s.id] = "Present";
      });
      setAttendance(initial);

    } catch (err) {
      console.error(err);
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (id, value) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
  if (!date) {
    alert("⚠ Select Date");
    return;
  }

  setLoading(true);

  try {
    await axios.post(
      "http://localhost:8080/api/attendance/save",
      {
        classNumber: selectedClass,
        date: date,
        students: students.map((s) => ({
          studentId: s.id,
          status: attendance[s.id],
        })),
      }
    );

    alert("✅ Attendance Saved");

  } catch (err) {
    console.error(err);
    alert("❌ Error saving attendance");
  } finally {
    setLoading(false);
  }
};

  // ================= BACK =================
  const goBack = () => {
    setSelectedClass(null);
    setMode("");
    setStudents([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-3">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="bg-blue-600 text-white text-center py-4 text-lg font-bold">
          Student Attendance
        </div>

        {/* ================= CLASS LIST ================= */}
        {!selectedClass && (
          <div className="p-3 space-y-3">

            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-gray-50 p-4 rounded-xl shadow flex justify-between items-center"
              >
                <h3 className="font-semibold text-sm">
                  {cls.className || cls.name}
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => loadStudents(cls.id, "take")}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                  >
                    <FaPlus /> Take
                  </button>

                  <button
                    onClick={() => loadStudents(cls.id, "view")}
                    className="bg-purple-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                  >
                    <FaEye /> View
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}

        {/* ================= STUDENT LIST ================= */}
        {selectedClass && (
          <div className="p-3">

            {/* BACK */}
            <button onClick={goBack} className="mb-3 text-sm text-blue-600">
              ← Back
            </button>

            <h3 className="text-center font-semibold mb-3">
              {mode === "take" ? "Take Attendance" : "View Attendance"}
            </h3>

            {/* DATE (ONLY FOR TAKE) */}
            {mode === "take" && (
              <div className="mb-3 text-center">
                <input
                  type="date"
                  className="border p-2 rounded-lg"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            )}

            {/* STUDENT CARDS */}
            <div className="space-y-3 ">
              {students.map((stu) => (
                <div
                  key={stu.id}
                  className="bg-gray-50 p-3 rounded-lg shadow sm:flex sm:justify-between"
                >
                  {/* INFO */}
                  <div>
                    <p className="font-medium text-sm">
                      {stu.studName} {stu.studLastName}
                    </p>

                    <p className="text-xs text-gray-500">
                      {stu.email}
                    </p>

                    {/* ✅ FIX: ROLL NO ADDED */}
                    <p className="text-xs text-gray-600">
                      Roll No: {stu.studRollNo}
                    </p>
                  </div>

                  {/* TAKE MODE */}
                  {mode === "take" && (
                    <div className="mt-2">
                      <select
                        value={attendance[stu.id]}
                        onChange={(e) =>
                          handleChange(stu.id, e.target.value)
                        }
                        className={`w-full p-2 rounded text-white ${
                          attendance[stu.id] === "Present"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        <option className="text-black">Present</option>
                        <option className="text-black">Absent</option>
                      </select>
                    </div>
                  )}

                  {/* VIEW MODE */}
                  {mode === "view" && (
                    <p className="text-xs mt-2 text-gray-600">
                      Attendance Data (API connect karna hai)
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* SUBMIT BUTTON */}
            {mode === "take" && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded shadow"
                >
                  {loading ? "Saving..." : "Submit Attendance"}
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default StuAttendance;