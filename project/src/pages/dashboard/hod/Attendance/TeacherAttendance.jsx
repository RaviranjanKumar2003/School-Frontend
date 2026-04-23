import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherAttendance() {
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [viewData, setViewData] = useState([]);
  const [date, setDate] = useState("");
  const [mode, setMode] = useState("take");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  // ================= FETCH TEACHERS =================
  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/professors");

      const formatted = res.data.map((t) => ({
        ...t,
        groupedAssignments: groupAssignments(t.assignments),
      }));

      setTeachers(formatted);

      const initial = {};
      formatted.forEach((t) => {
        initial[t.id] = "Present";
      });
      setAttendance(initial);

    } catch (err) {
      console.error(err);
    }
  };

  // ================= GROUP CLASS =================
  const groupAssignments = (assignments = []) => {
    const map = {};

    assignments.forEach((a) => {
      if (!map[a.className]) map[a.className] = [];
      map[a.className].push(a.subjectName);
    });

    return Object.entries(map).map(([cls, subs]) => ({
      className: cls,
      subjects: subs,
    }));
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (id, value) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ================= SAVE =================
  const handleSubmit = async () => {
    if (!date) {
      alert("⚠ Select date");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8080/api/attendance/teacher/save",
        teachers.map((t) => ({
          teacherId: t.id,
          status: attendance[t.id],
          date: date,
        }))
      );

      alert("✅ Attendance Saved");
      setMode("view");
      setViewData([]);

    } catch (err) {
      console.error(err);
      alert("❌ Error saving");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH ATTENDANCE =================
  const fetchAttendance = async () => {
    if (!date) {
      alert("⚠ Select date");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/attendance/teacher?date=${date}`
      );

      // 🔥 MERGE WITH TEACHERS DATA
      const merged = res.data.map((a) => {
        const teacher = teachers.find((t) => t.id === a.teacherId);

        return {
          ...a,
          name: teacher?.name,
          email: teacher?.email,
          groupedAssignments: teacher?.groupedAssignments || [],
        };
      });

      setViewData(merged);

    } catch (err) {
      console.error(err);
      alert("❌ Error fetching");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-3">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-4 text-lg font-bold">
          Teacher Attendance
        </div>

        {/* MODE SWITCH */}
        <div className="flex justify-center gap-2 p-3 border-b">
          <button
            onClick={() => setMode("take")}
            className={`px-3 py-1 rounded-full text-sm ${
              mode === "take"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Take
          </button>

          <button
            onClick={() => setMode("view")}
            className={`px-3 py-1 rounded-full text-sm ${
              mode === "view"
                ? "bg-purple-600 text-white"
                : "bg-gray-200"
            }`}
          >
            View
          </button>
        </div>

        {/* DATE */}
        <div className="p-3 flex justify-between items-center">
          <span className="text-sm font-medium">📅 Date</span>
          <input
            type="date"
            className="border px-2 py-1 rounded-lg text-sm"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* ================= TAKE MODE ================= */}
        {mode === "take" && (
          <div className="p-3 space-y-3">

            {teachers.map((t, i) => (
              <div key={t.id} className="bg-gray-50 rounded-xl p-3 shadow-sm">

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-sm">
                      {i + 1}. {t.name}
                    </h3>
                    <p className="text-xs text-gray-500">{t.email}</p>
                  </div>

                  <select
                    value={attendance[t.id]}
                    onChange={(e) => handleChange(t.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded ${
                      attendance[t.id] === "Present"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    <option>Present</option>
                    <option>Absent</option>
                  </select>
                </div>

                <div className="text-xs mt-2 text-gray-700">
                  {t.groupedAssignments.map((g, idx) => (
                    <div key={idx}>
                      <b>{g.className}</b> - {g.subjects.join(", ")}
                    </div>
                  ))}
                </div>

              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg"
            >
              {loading ? "Saving..." : "Submit Attendance"}
            </button>

          </div>
        )}

        {/* ================= VIEW MODE ================= */}
        {mode === "view" && (
          <div className="p-3">

            <button
              onClick={fetchAttendance}
              disabled={loading}
              className="w-full mb-3 bg-purple-600 text-white py-2 rounded-lg"
            >
              {loading ? "Loading..." : "Get Attendance"}
            </button>

            {viewData.length === 0 && !loading && (
              <p className="text-center text-gray-500 text-sm">
                No data found
              </p>
            )}

            {viewData.map((a, i) => (
              <div key={i} className="bg-white border rounded-xl p-3 mb-2 shadow-sm">

                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-sm">
                      {a.name}
                    </h3>
                    <p className="text-xs text-gray-500">{a.email}</p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      a.status === "Present"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.status}
                  </span>
                </div>

                <div className="text-xs mt-2 text-gray-700">
                  {a.groupedAssignments.map((g, idx) => (
                    <div key={idx}>
                      <b>{g.className}</b> - {g.subjects.join(", ")}
                    </div>
                  ))}
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}