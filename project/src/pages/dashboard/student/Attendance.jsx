import React, { useEffect, useState } from "react";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [view, setView] = useState("daily");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("id");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/stu-attendance/student/${studentId}`
      );
      const data = await res.json();
      setAttendance(data);
      setFiltered(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "monthly") {
      const filteredData = attendance.filter((a) => {
        const d = new Date(a.date);
        return (
          d.getMonth() + 1 === parseInt(month) &&
          d.getFullYear() === parseInt(year)
        );
      });
      setFiltered(filteredData);
    } else {
      setFiltered(attendance);
    }
  }, [view, month, year, attendance]);

  const total = filtered.length;
  const present = filtered.filter((a) => a.status === "P").length;
  const absent = filtered.filter((a) => a.status === "A").length;
  const percentage = total ? ((present / total) * 100).toFixed(1) : 0;

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* HEADER */}
      <div className="bg-white shadow rounded-xl p-4 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-700">
          📊 My Attendance
        </h1>

        <div className="flex gap-2 mt-3 md:mt-0">
          <button
            onClick={() => setView("daily")}
            className={`px-4 py-1 rounded-full text-sm ${
              view === "daily"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Overall
          </button>

          <button
            onClick={() => setView("monthly")}
            className={`px-4 py-1 rounded-full text-sm ${
              view === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* FILTER */}
      {view === "monthly" && (
        <div className="bg-white shadow rounded-xl p-4 flex flex-wrap gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            {[
              "January","February","March","April","May","June",
              "July","August","September","October","November","December"
            ].map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="text-center text-gray-500">Loading...</div>
      )}

      {!loading && (
        <>
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="bg-blue-500 text-white p-4 rounded-xl shadow">
              <p className="text-sm">Total Classes</p>
              <h2 className="text-2xl font-bold">{total}</h2>
            </div>

            <div className="bg-green-500 text-white p-4 rounded-xl shadow">
              <p className="text-sm">Present</p>
              <h2 className="text-2xl font-bold">{present}</h2>
            </div>

            <div className="bg-red-500 text-white p-4 rounded-xl shadow">
              <p className="text-sm">Absent</p>
              <h2 className="text-2xl font-bold">{absent}</h2>
            </div>

            <div className="bg-yellow-400 text-white p-4 rounded-xl shadow">
              <p className="text-sm">Percentage</p>
              <h2 className="text-2xl font-bold">{percentage}%</h2>
            </div>

          </div>

          {/* TABLE */}
          <div className="bg-white shadow rounded-xl overflow-hidden">
            {filtered.length === 0 ? (
              <p className="text-center py-6 text-gray-500">
                No attendance data found
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((a, i) => (
                    <tr
                      key={i}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{a.date}</td>
                      <td
                        className={`p-3 font-semibold ${
                          a.status === "P"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {a.status === "P" ? "Present" : "Absent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Attendance;