import React, { useEffect, useState } from "react";
import axios from "axios";

const LiveResult = () => {

  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [statusList, setStatusList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examType, setExamType] = useState("");

  const [examTypes, setExamTypes] = useState([]);

  // 🔥 LOAD CLASSES
  useEffect(() => {
    axios.get("http://localhost:8080/api/classes")
      .then(res => setClasses(res.data))
      .catch(() => alert("Error loading classes"));

     axios.get("http://localhost:8080/api/exam-schedule/exam-types")
    .then(res => setExamTypes(res.data))
    .catch(() => alert("Error loading exam types"));
  }, []);

  // 🔥 LOAD STATUS
  const loadStatus = async () => {
    if (!classId || !examType) {
    return alert("Select class and exam type");
   }

    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/exam-schedule/status/${classId}/${examType}`
      );

      if (res.data.length === 0) {
        alert("❌ No exam data for this class");
      }

      setStatusList(res.data);

    } catch {
      alert("Error loading status");
    }

    setLoading(false);
  };

  // 🔥 PUBLISH RESULT
  const publish = async () => {
    if (!classId || !examType) {
     return alert("Select class and exam type");
    }

    try {
      const res = await axios.put(
        `http://localhost:8080/api/results/publish/class/${classId}/${examType}`
      );

      alert(res.data);
      loadStatus();

    } catch (err) {
      alert(err.response?.data || "Error publishing");
    }
  };

  // 🎨 STATUS COLOR
  const getColor = (status) => {
    if (status === "COMPLETED") return "bg-green-100 text-green-700";
    if (status === "MARKS_PENDING") return "bg-yellow-100 text-yellow-700";
    if (status === "ATTENDANCE_PENDING") return "bg-red-100 text-red-600";
    if (status === "NOT_SCHEDULED") return "bg-gray-200 text-gray-600";
    return "";
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-center mb-6">
        📊 Live Result Control
      </h1>

      {/* SELECT */}
      <div className="flex flex-col md:flex-row gap-3 justify-center mb-8">

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

        <select
         value={examType}
         onChange={(e) => setExamType(e.target.value)}
         className="p-3 rounded-lg border shadow focus:ring-2 focus:ring-green-400"
        >
        <option value="">Select Exam Type</option>

        {examTypes.map((type, i) => (
        <option key={i} value={type}>
        {type.replace("_", " ")}
        </option>
        ))}

</select>

        <button
          onClick={loadStatus}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          Check Status
        </button>

        <button
          onClick={publish}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow"
        >
          Publish
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-gray-500">
          Loading...
        </div>
      )}

      {/* CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {statusList.map((s, i) => (

          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >

            {/* SUBJECT */}
            <h2 className="text-lg font-semibold text-blue-600">
              📘 {s.subjectName}
            </h2>

            {/* TEACHER */}
            <p className="text-sm text-gray-600 mt-1">
              👨‍🏫 {s.teacherName || "Not Assigned"}
            </p>

            {/* DATE */}
            {s.examDate && (
              <p className="text-sm text-gray-600 mt-2">
                📅 {new Date(s.examDate).toLocaleDateString("en-IN")}
              </p>
            )}

            {/* TIME */}
            {s.startTime && (
              <p className="text-sm text-gray-600">
                ⏰ {s.startTime} - {s.endTime}
              </p>
            )}

            {/* SHIFT */}
            {s.shift && (
              <p className="text-xs font-semibold text-purple-600 mt-1">
                {s.shift}
              </p>
            )}

            {/* MODE */}
            {s.mode && (
              <p className="text-sm mt-2">
                📍 {s.mode === "OFFLINE"
                  ? `Room: ${s.roomNo || "-"}`
                  : "Online"}
              </p>
            )}

            {/* LINK */}
            {s.mode === "ONLINE" && (
              s.meetingLink ? (
                <a
                  href={s.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm underline"
                >
                  🔗 Join Meeting
                </a>
              ) : (
                <p className="text-gray-400 text-sm">
                  🔗 Link pending
                </p>
              )
            )}

            {/* STATUS */}
            <div className="mt-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${getColor(s.status)}`}
              >
                {s.status}
              </span>
            </div>

          </div>

        ))}

      </div>

      {/* EMPTY */}
      {!loading && statusList.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          No data found
        </div>
      )}

    </div>
  );
};

export default LiveResult;