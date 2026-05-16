import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEye } from "react-icons/fa";

function AttendanceFlow() {

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [mode, setMode] = useState("");
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [takenInfo, setTakenInfo] = useState(null);

  // ================= LOAD CLASSES =================
  useEffect(() => {
    const stored = localStorage.getItem("professorData");

    if (!stored) return;

    const prof = JSON.parse(stored);
    const assignments = Array.isArray(prof.assignments) ? prof.assignments : [];

    const unique = new Map();

    assignments.forEach((item) => {
      if (!item.classId) return;

      if (!unique.has(item.classId)) {
        unique.set(item.classId, {
          classId: Number(item.classId),
          className: item.className || "Unnamed Class",
        });
      }
    });

    setClasses(Array.from(unique.values()));
  }, []);

  // ================= LOAD STUDENTS =================
  const loadStudents = async (classId, type) => {

    if (!classId) return;

    setSelectedClass(classId);
    setMode(type);
    setStudents([]);
    setAttendance({});
    setDate("");
    setTakenInfo(null);

    if (type !== "take") return;

    try {
      const res = await axios.get(
        `http://localhost:8080/api/students/class/${classId}`
      );

      setStudents(res.data);

      const init = {};
      res.data.forEach((s) => {
        init[s.id] = "Present";
      });

      setAttendance(init);

    } catch (err) {
      console.error(err);
    }
  };

  // ================= VIEW =================
  const loadAttendanceByDate = async () => {

    if (!selectedClass || !date) {
      alert("Select Class + Date");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/stu-attendance?classNumber=${selectedClass}&date=${date}`
      );

      if (!res.data || res.data.length === 0) {
        alert("No attendance found");
        setStudents([]);
        return;
      }

      const mapped = res.data.map((s) => ({
        id: s.studentId,
        studName: s.studentName,
        studLastName: s.studentLastName,
        email: s.email,
        studRollNo: s.studRollNo,
      }));

      setStudents(mapped);

      const att = {};
      res.data.forEach((s) => {
        att[s.studentId] = s.status === "P" ? "Present" : "Absent";
      });

      setAttendance(att);

      setTakenInfo({
        name: res.data[0]?.takenByName || "Unknown",
        role: res.data[0]?.takenByRole || "Unknown",
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= CHANGE =================
  const handleChange = (id, value) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ================= SAVE =================
  const handleSubmit = async () => {

    if (!selectedClass || !date) {
      alert("Select Class + Date");
      return;
    }

    const payload = students.map((s) => ({
      studentId: s.id,
      status: attendance[s.id] === "Present" ? "P" : "A",
    }));

    setLoading(true);

    try {
      await axios.post(
        `http://localhost:8080/api/stu-attendance/save?classNumber=${selectedClass}&date=${date}`,
        payload
      );

      alert("✅ Attendance Saved");

    } catch (err) {
      console.error(err);
      alert("Error saving attendance");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setSelectedClass(null);
    setMode("");
    setStudents([]);
    setAttendance({});
    setDate("");
    setTakenInfo(null);
  };

  return (
    <div className="min-h-[70%] p-3">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="bg-blue-600 text-white text-center py-4 text-lg font-bold">
          Teacher Attendance
        </div>

        {/* CLASS LIST */}
        {!selectedClass && (
          <div className="p-3 space-y-3">

            {classes.length === 0 && (
              <p className="text-center text-red-500">No classes found</p>
            )}

            {classes.map((cls) => (
              <div
                key={cls.classId}
                className="bg-gray-50 p-4 rounded-xl shadow flex justify-between items-center"
              >
                <h3 className="font-semibold text-sm">
                  {cls.className}
                </h3>

                <div className="flex gap-2">
                  <button
                    onClick={() => loadStudents(cls.classId, "take")}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                  >
                    <FaPlus /> Take
                  </button>

                  <button
                    onClick={() => loadStudents(cls.classId, "view")}
                    className="bg-purple-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1"
                  >
                    <FaEye /> View
                  </button>
                </div>
              </div>
            ))}

          </div>
        )}

        {/* STUDENT SECTION */}
        {selectedClass && (
          <div className="p-3">

            <button
              onClick={goBack}
              className="mb-3 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm"
            >
              ← Back
            </button>

            <h3 className="text-center font-semibold mb-3">
              {mode === "take" ? "Take Attendance" : "View Attendance"}
            </h3>

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

            {mode === "view" && takenInfo && (
              <div className="text-center mb-3 text-sm text-gray-700 bg-yellow-100 p-2 rounded">
                📌 Taken by: <b>{takenInfo.name}</b> ({takenInfo.role})
              </div>
            )}

            <div className="space-y-3">
              {students.map((stu) => (
                <div
                  key={stu.id}
                  className="bg-gray-50 p-3 rounded-lg shadow flex justify-between"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {stu.studName} {stu.studLastName}
                    </p>
                    <p className="text-xs">{stu.email}</p>
                    <p className="text-xs">Roll: {stu.studRollNo}</p>
                  </div>

                  {mode === "take" ? (
                    <select
                      value={attendance[stu.id]}
                      onChange={(e) =>
                        handleChange(stu.id, e.target.value)
                      }
                      className={`p-2 rounded text-white ${
                        attendance[stu.id] === "Present"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      <option className="text-black">Present</option>
                      <option className="text-black">Absent</option>
                    </select>
                  ) : (
                    <span>{attendance[stu.id]}</span>
                  )}
                </div>
              ))}
            </div>

            {mode === "take" && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-6 py-2 rounded"
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

export default AttendanceFlow;