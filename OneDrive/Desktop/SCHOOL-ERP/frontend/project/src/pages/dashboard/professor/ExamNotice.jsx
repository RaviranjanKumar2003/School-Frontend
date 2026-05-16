import React, { useEffect, useState } from "react";
import axios from "axios";

const ExamNotice = () => {

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIX: सही teacher data लो
  const teacherData = JSON.parse(localStorage.getItem("professorData"));
  const teacherId = teacherData?.id;

  useEffect(() => {
    if (teacherId) {
      loadNotices();
    }
  }, [teacherId]);

  const loadNotices = async () => {
    try {
      console.log("🔥 Teacher ID:", teacherId);

      const res = await axios.get(
        `http://localhost:8080/api/exam-notice/teacher/${teacherId}`
      );

      console.log("🔥 Notices:", res.data);

      setNotices(res.data);

    } catch (err) {
      console.log("❌ ERROR:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LOADING
  if (loading) {
    return <div className="p-6 text-center">Loading Notices...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">

      <h1 className="text-3xl font-bold text-center mb-6">
        📢 Exam Notices
      </h1>

      {notices.length === 0 ? (
        <div className="text-center text-gray-500">
          ❌ No Notices Found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {notices.map((n) => (

            <div
              key={n.id}
              className="bg-white p-5 rounded-xl shadow-lg hover:scale-105 transition"
            >

              <h2 className="text-lg font-bold text-blue-600">
              Sub:-  {n.subjectName}
              </h2>

              <p className="text-sm text-gray-600 mt-2">
              Message:-  {n.message}
              </p>

              <div className="mt-3 text-sm text-gray-500">
                <p>📚 Class: {n.className}</p>
                <p>📅 {new Date(n.createdAt).toLocaleString()}</p>
              </div>

              <span className={`mt-3 inline-block px-3 py-1 text-xs rounded-full ${
                n.examType === "FINAL"
                  ? "bg-green-100 text-green-700"
                  : "bg-purple-100 text-purple-700"
              }`}>
                {n.examType}
              </span>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default ExamNotice;