import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeacherAttendance() {

  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [viewData, setViewData] = useState([]);
  const [date, setDate] = useState("");
  const [mode, setMode] = useState("take");
  const [loading, setLoading] = useState(false);

  // ================= LOGIN USER =================
  const hodData = JSON.parse(
    localStorage.getItem("hodData")
  );

  const schoolAdminData = JSON.parse(
    localStorage.getItem("schoolAdminData")
  );

  const loginUser = hodData || schoolAdminData;

  const schoolId = loginUser?.schoolId || 1;

  // ================= LOAD =================
  useEffect(() => {
    fetchTeachers();
  }, []);

  // ================= FETCH TEACHERS =================
  const fetchTeachers = async () => {

    try {

      const res = await axios.get(
        `http://localhost:8080/api/professors?schoolId=${schoolId}`
      );

      const formatted = res.data.map((t) => ({
        ...t,

        groupedAssignments: groupAssignments(
          t.assignments || []
        ),
      }));

      setTeachers(formatted);

      const initial = {};

      formatted.forEach((t) => {
        initial[t.id] = "P";
      });

      setAttendance(initial);

    } catch (err) {

      console.error("Teacher fetch error:", err);

      alert("Error fetching teachers");
    }
  };

  // ================= GROUP =================
  const groupAssignments = (
    assignments = []
  ) => {

    const map = {};

    assignments.forEach((a) => {

      if (!map[a.className]) {
        map[a.className] = [];
      }

      map[a.className].push(
        a.subjectName
      );
    });

    return Object.entries(map).map(
      ([cls, subs]) => ({
        className: cls,
        subjects: subs,
      })
    );
  };

  // ================= CHANGE =================
  const handleChange = (
    id,
    value
  ) => {

    setAttendance((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ================= SAVE =================
  const handleSubmit = async () => {

    if (!date) {
      alert("Select date");
      return;
    }

    if (!loginUser?.id) {
      alert("Login user not found");
      return;
    }

    setLoading(true);

    try {

      const payload = teachers.map((t) => ({

        teacherId: Number(t.id),

        status: attendance[t.id],

        date: date,

        // 🔥 LOGIN INFO
        createdBy: Number(
          loginUser.id
        ),

        createdByRole: hodData
          ? "HOD"
          : "SCHOOL_ADMIN",

        createdByName:
          loginUser.name ||
          "Unknown",
      }));

      console.log(
        "SAVE PAYLOAD => ",
        payload
      );

      const res = await axios.post(
        `http://localhost:8080/api/attendance/teacher/save?schoolId=${schoolId}`,
        payload
      );

      console.log(res.data);

      alert(
        "Attendance Saved Successfully"
      );

      setMode("view");

      fetchAttendance();

    } catch (err) {

      console.error(
        "Save error:",
        err
      );

      console.log(
        "BACKEND ERROR => ",
        err?.response?.data
      );

      alert(
        err?.response?.data ||
        "Error saving attendance"
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= FETCH ATTENDANCE =================
  const fetchAttendance = async () => {

    if (!date) {
      alert("Select date");
      return;
    }

    setLoading(true);

    try {

      const res = await axios.get(
        `http://localhost:8080/api/attendance/teacher?schoolId=${schoolId}&date=${date}`
      );

      const merged = res.data.map((a) => {

        const teacher = teachers.find(
          (t) =>
            Number(t.id) ===
            Number(a.teacherId)
        );

        return {

          ...a,

          name:
            teacher?.name ||
            a.teacherName ||
            "Unknown",

          email:
            teacher?.email ||
            a.email ||
            "-",

          groupedAssignments:
            teacher?.groupedAssignments ||
            [],
        };
      });

      setViewData(merged);

    } catch (err) {

      console.error(
        "Fetch error:",
        err
      );

      alert(
        "Error fetching attendance"
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= UI =================
  return (

    <div className="p-3">

      <div className="max-h-[90vh] bg-white rounded-2xl shadow-lg overflow-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-4 text-lg font-bold">
          Teacher Attendance
        </div>

        {/* MODE */}
        <div className="flex justify-center gap-2 p-3 border-b">

          <button
            onClick={() =>
              setMode("take")
            }
            className={`px-4 py-1 rounded-full text-sm ${
              mode === "take"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Take
          </button>

          <button
            onClick={() =>
              setMode("view")
            }
            className={`px-4 py-1 rounded-full text-sm ${
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

          <span className="text-sm font-medium">
            📅 Date
          </span>

          <input
            type="date"
            className="border px-3 py-1 rounded-lg text-sm"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
          />

        </div>

        {/* ================= TAKE ================= */}
        {mode === "take" && (

          <div className="p-3 space-y-3">

            {teachers.map((t, i) => (

              <div
                key={t.id}
                className="bg-gray-50 rounded-xl p-3 shadow-sm border"
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h3 className="font-semibold text-sm">
                      {i + 1}. {t.name}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {t.email}
                    </p>

                  </div>

                  <select
                    value={
                      attendance[t.id]
                    }
                    onChange={(e) =>
                      handleChange(
                        t.id,
                        e.target.value
                      )
                    }
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      attendance[t.id] ===
                      "P"
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    <option value="P">
                      Present
                    </option>

                    <option value="A">
                      Absent
                    </option>

                  </select>

                </div>

                <div className="text-xs mt-2 text-gray-700">

                  {t.groupedAssignments.map(
                    (g, idx) => (

                      <div key={idx}>
                        <b>
                          {g.className}
                        </b>

                        {" - "}

                        {g.subjects.join(
                          ", "
                        )}
                      </div>
                    )
                  )}

                </div>

              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg mt-3"
            >
              {loading
                ? "Saving..."
                : "Submit Attendance"}
            </button>

          </div>
        )}

        {/* ================= VIEW ================= */}
        {mode === "view" && (

          <div className="p-3">

            <button
              onClick={fetchAttendance}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg mb-3"
            >
              {loading
                ? "Loading..."
                : "Get Attendance"}
            </button>

            {/* 🔥 TAKEN BY */}
            {viewData.length > 0 && (

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3">

                <div className="text-sm font-semibold text-blue-700">
                  Attendance Taken By
                </div>

                <div className="mt-1 flex items-center gap-2">

                  <span className="text-sm text-gray-700">
                    {
                      viewData[0]
                        ?.createdByName
                    }
                  </span>

                  <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                    {
                      viewData[0]
                        ?.createdByRole
                    }
                  </span>

                </div>

              </div>
            )}

            {/* EMPTY */}
            {viewData.length === 0 &&
              !loading && (

              <p className="text-center text-gray-500 text-sm">
                No data found
              </p>
            )}

            {/* LIST */}
            {viewData.map((a, i) => (

              <div
                key={i}
                className="border rounded-xl p-3 mb-2 bg-white shadow-sm"
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h3 className="font-semibold text-sm">
                      {a.name}
                    </h3>

                    <p className="text-xs text-gray-500">
                      {a.email}
                    </p>

                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      a.status === "P"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.status === "P"
                      ? "Present"
                      : "Absent"}
                  </span>

                </div>

                <div className="text-xs mt-2 text-gray-700">

                  {a.groupedAssignments.map(
                    (g, idx) => (

                      <div key={idx}>
                        <b>
                          {g.className}
                        </b>

                        {" - "}

                        {g.subjects.join(
                          ", "
                        )}
                      </div>
                    )
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}