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
    setStudents([]);
    setAttendance({});
    setDate("");

    if (type === "take") {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/students/class/${classId}`
        );

        setStudents(res.data);

        const initial = {};
        res.data.forEach((s) => {
          initial[s.id] = "Present";
        });
        setAttendance(initial);

      } catch (err) {
        console.error(err);
      }
    }
  };

  // ================= LOAD ATTENDANCE (NEW API) =================
  const loadAttendanceByDate = async () => {
    if (!date) {
      alert("⚠ Select Date");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/stu-attendance?classNumber=${selectedClass}&date=${date}`
      );

      if (!res.data || res.data.length === 0) {
        alert("❌ No attendance found");
        setStudents([]);
        return;
      }

      // ✅ mapping from new DTO
      const mappedStudents = res.data.map((s) => ({
        id: s.studentId,
        studName: s.studentName,
        studLastName: s.studentLastName, 
        email: s.email,
        studRollNo: s.studRollNo,
      }));

      setStudents(mappedStudents);

      const attMap = {};
      res.data.forEach((s) => {
        attMap[s.studentId] =
          s.status === "P" ? "Present" : s.status === "A" ? "Absent" : s.status;
      });

      setAttendance(attMap);

    } catch (err) {
      console.error(err);
      alert("❌ Error loading attendance");
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (id, value) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ================= SAVE ATTENDANCE (NEW API) =================
  const handleSubmit = async () => {
    if (!date) {
      alert("⚠ Select Date");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `http://localhost:8080/api/stu-attendance/save?classNumber=${selectedClass}&date=${date}`,
        students.map((s) => ({
          studentId: s.id,
          status: attendance[s.id] === "Present" ? "P" : "A",
        }))
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
    setAttendance({});
    setDate("");
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

        {/* ================= STUDENT SECTION ================= */}
        {selectedClass && (
          <div className="p-3">

            <button onClick={goBack} className="mb-3 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
              ← Back
            </button>

            <h3 className="text-center font-semibold mb-3">
              {mode === "take" ? "Take Attendance" : "View Attendance"}
            </h3>

            {/* DATE INPUT */}
            <div className="mb-3 text-center flex gap-2 justify-center">
              <input
                type="date"
                className="border p-2 rounded-lg"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              {mode === "view" && (
                <button
                  onClick={loadAttendanceByDate}
                  className="bg-purple-600 text-white px-4 rounded"
                >
                  {loading ? "Loading..." : "Load"}
                </button>
              )}
            </div>

            {/* STUDENT LIST */}
            <div className="space-y-3">
              {students.map((stu) => (
                <div
                  key={stu.id}
                  className="bg-gray-50 p-3 rounded-lg shadow sm:flex sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-sm">{stu.studName +" "+stu.studLastName}</p>
                    <p className="text-xs text-gray-600">{stu.email}</p>
                    <p className="text-xs text-gray-600">
                      Roll No: {stu.studRollNo}
                    </p>
                  </div>

                  {mode === "take" && (
                    <select
                      value={attendance[stu.id]}
                      onChange={(e) =>
                        handleChange(stu.id, e.target.value)
                      }
                      className={`mt-2 p-2 rounded text-white  w-full sm:w-auto  ${
                        attendance[stu.id] === "Present"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      <option className="text-black">Present</option>
                      <option className="text-black">Absent</option>
                    </select>
                  )}

                  {mode === "view" && (
                    <p
                      className={`mt-2 font-semibold ${
                        attendance[stu.id] === "Present"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {attendance[stu.id]}
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