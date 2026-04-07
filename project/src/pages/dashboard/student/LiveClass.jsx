import React from "react";

const classes = [
  {
    id: 1,
    subject: "Mathematics",
    teacher: "Prof. Sharma",
    time: "10:00 AM - 11:00 AM",
    status: "LIVE",
    link: "https://meet.google.com/abc-xyz",
  },
  {
    id: 2,
    subject: "Computer Science",
    teacher: "Prof. Verma",
    time: "12:00 PM - 1:00 PM",
    status: "UPCOMING",
    link: "https://meet.google.com/def-xyz",
  },
  {
    id: 3,
    subject: "English",
    teacher: "Prof. Singh",
    time: "2:00 PM - 3:00 PM",
    status: "ENDED",
    link: "",
  },
];

const LiveClass = () => {
  return (
    <div className="p-6 min-h-screen bg-gray-100">

      {/* 🔥 HEADER */}
      <h1 className="text-2xl font-bold mb-6">🎥 Live Classes</h1>

      {/* 🔥 CLASS LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >

            {/* SUBJECT */}
            <h2 className="text-lg font-semibold">{cls.subject}</h2>

            {/* TEACHER */}
            <p className="text-gray-500 text-sm mt-1">
              👨‍🏫 {cls.teacher}
            </p>

            {/* TIME */}
            <p className="text-gray-400 text-sm mt-1">
              🕒 {cls.time}
            </p>

            {/* STATUS */}
            <div className="mt-3">
              {cls.status === "LIVE" && (
                <span className="text-green-600 font-semibold text-sm">
                  🔴 Live Now
                </span>
              )}
              {cls.status === "UPCOMING" && (
                <span className="text-yellow-500 font-semibold text-sm">
                  ⏳ Upcoming
                </span>
              )}
              {cls.status === "ENDED" && (
                <span className="text-gray-400 font-semibold text-sm">
                  ❌ Ended
                </span>
              )}
            </div>

            {/* BUTTON */}
            <div className="mt-4">
              {cls.status === "LIVE" ? (
                <a
                  href={cls.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                >
                  Join Now
                </a>
              ) : cls.status === "UPCOMING" ? (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg cursor-not-allowed"
                >
                  Not Started
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg cursor-not-allowed"
                >
                  Class Ended
                </button>
              )}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default LiveClass;