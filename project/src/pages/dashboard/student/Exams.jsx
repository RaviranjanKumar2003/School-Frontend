import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const Exams = () => {

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("id");

  useEffect(() => {
    if (studentId) {
      axios
        .get(`http://localhost:8080/api/exam-schedule/student/${studentId}`)
        .then((res) => setExams(res.data))
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  }, [studentId]);

  if (loading) {
    return <div className="p-6 text-center">Loading Exams...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">

      <h1 className="text-3xl font-bold text-center mb-8">
        📘 My Exams
      </h1>

      {exams.length === 0 ? (
        <div className="text-center text-gray-500">
          ❌ No Exams Found
        </div>
      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {exams.map((e) => (

            <Card
              key={e.id}
              className={`transition duration-300 shadow-lg ${
                e.status === "CANCELLED"
                  ? "bg-red-50 opacity-60"
                  : "bg-white hover:scale-105 hover:shadow-2xl cursor-pointer"
              }`}
            >
              <CardBody>

                {/* MESSAGE */}
                <p className="text-sm font-semibold mb-2 text-black">
                  📝 {e.message}
                </p>

                {/* TEACHER */}
                <Typography variant="h6" color="blue">
                  👨‍🏫 {e.teacherName}
                </Typography>

                {/* SUBJECT */}
                <Typography variant="h6" color="blue">
                  📚 {e.subjectName}
                </Typography>

                {/* MARKS */}
                <Typography className="text-green-600 font-semibold mt-1">
                  Total Marks: {e.totalMarks}
                </Typography>

                {/* DATE */}
                <Typography className="mt-2 text-gray-700">
                  📅 {new Date(e.examDate).toLocaleDateString("en-GB")}
                </Typography>

                {/* TIME */}
                {e.status !== "CANCELLED" && (
                  <Typography className="text-gray-700">
                    ⏰ {e.startTime} - {e.endTime}
                  </Typography>
                )}

                {/* SHIFT */}
                <Typography className="text-sm font-semibold text-purple-600">
                  {e.shift?.toUpperCase() === "MORNING"
                    ? "🌅 Morning"
                    : e.shift?.toUpperCase() === "AFTERNOON"
                    ? "🌇 Afternoon"
                    : ""}
                </Typography>

                {/* MODE */}
                {e.status !== "CANCELLED" && (
                  <Typography className="mt-2">
                    📍 {e.mode === "OFFLINE"
                      ? `Room: ${e.roomNo}`
                      : "Online"}
                  </Typography>
                )}

                {/* LINK */}
                {e.mode === "ONLINE" && e.status !== "CANCELLED" && (
                  e.meetingLink ? (
                    <a
                      href={e.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm mt-1 block underline"
                    >
                      🔗 Join Meeting
                    </a>
                  ) : (
                    <p className="text-gray-400 text-sm mt-1">
                      🔗 Link will be shared soon
                    </p>
                  )
                )}

                {/* STATUS */}
                <div className="mt-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      e.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : e.status === "GIVEN"
                        ? "bg-green-100 text-green-700"
                        : e.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {e.status}
                  </span>
                </div>

                {/* CANCELLED MESSAGE */}
                {e.status === "CANCELLED" && (
                  <div className="mt-2 text-red-500 text-sm font-semibold">
                    ❌ Exam Cancelled
                    {e.cancelReason && (
                      <div className="text-xs text-gray-500">
                        Reason: {e.cancelReason}
                      </div>
                    )}
                  </div>
                )}

              </CardBody>
            </Card>

          ))}

        </div>
      )}
    </div>
  );
};

export default Exams;