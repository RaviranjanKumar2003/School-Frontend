import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const API = "http://localhost:8080/api/live-class";

function LiveClassInStudent() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const studentId = localStorage.getItem("id");
  const classId = localStorage.getItem("classId");

  const [joinedClassId, setJoinedClassId] = useState(
    localStorage.getItem("joinedLiveClassId")
  );

  const [selectedClass, setSelectedClass] = useState(null);

  const fetchedOnce = useRef(false);
  const intervalRef = useRef(null);

  // ================= FETCH =================
  useEffect(() => {
    if (!classId) return;

    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    fetchClasses();

    intervalRef.current = setInterval(() => {
      fetchClasses();
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [classId]);

  const fetchClasses = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/class/${classId}`);

      const data = Array.isArray(res.data) ? res.data : [];

      setClasses(data);
      console.log("STUDENT LIVE CLASS DATA =>", data);

    } catch (err) {
      console.log("FETCH ERROR:", err?.response?.data || err.message);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // ================= JOIN =================
  const joinClass = async (liveClassId, meetingLink, status) => {
    try {
      if (status === "ENDED") return;

      await axios.put(
        `${API}/join/${liveClassId}/${studentId}`
      );

      setJoinedClassId(liveClassId);
      localStorage.setItem("joinedLiveClassId", liveClassId);

      if (meetingLink) {
        window.open(meetingLink, "_blank");
      }

      fetchClasses();

    } catch (err) {
      console.log("JOIN ERROR:", err?.response?.data || err.message);
    }
  };

  // ================= LEAVE =================
  const leaveClass = async (liveClassId) => {
    try {
      await axios.put(
        `${API}/leave/${liveClassId}/${studentId}`
      );

      setJoinedClassId(null);
      localStorage.removeItem("joinedLiveClassId");

      fetchClasses();

    } catch (err) {
      console.log("LEAVE ERROR:", err?.response?.data || err.message);
    }
  };

  const badgeColor = (status) => {
    switch (status) {
      case "LIVE":
        return "bg-green-100 text-green-700";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-700";
      case "ENDED":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-3xl mb-6">
        <h1 className="text-3xl font-bold">My Live Classes</h1>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : classes.length === 0 ? (
        <div className="text-center text-gray-500">
          No Live Classes Found
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-2xl shadow p-5">

              {/* TOP */}
              <div className="flex justify-between">
                <h3 className="font-bold">{cls.topic}</h3>

                <span className={`px-3 py-1 text-xs rounded-full ${badgeColor(cls.status)}`}>
                  {cls.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-1">
                {cls.className}
              </p>

              <p className="text-sm text-gray-500">
  👨‍🏫 {cls.professor?.name || "Unknown Teacher"} Sir
</p>

              {/* INFO */}
              <div className="mt-3 space-y-2 text-sm text-gray-600">

                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="h-4 w-4" />
                  {cls.scheduledDate}
                </div>

                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  {cls.scheduledTime}
                </div>

                <div className="space-y-2">

  <div className="flex items-center gap-2 font-bold text-blue-600">
    <UserGroupIcon className="h-4 w-4" />
    Total Joined: {cls.totalParticipants ?? 0}
  </div>

  {cls.status === "LIVE" && (
    <div className="flex items-center gap-2 font-bold text-green-600">
      <UserGroupIcon className="h-4 w-4" />
      Currently Online: {cls.currentParticipants ?? 0}
    </div>
  )}

</div>

              </div>

              {/* ACTIONS */}
              <div className="grid grid-cols-2 gap-2 mt-4">

                <button
                  onClick={() => setSelectedClass(cls)}
                  className="border py-2 rounded-xl flex items-center justify-center gap-2"
                >
                  <EyeIcon className="h-4 w-4" />
                  View
                </button>

                {/* 🔥 FIX: END BLOCK */}
                {cls.status === "ENDED" ? (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-600 py-2 rounded-xl cursor-not-allowed"
                  >
                    Ended
                  </button>
                ) : joinedClassId == cls.id ? (
                  <button
                    onClick={() => leaveClass(cls.id)}
                    className="bg-red-600 text-white py-2 rounded-xl"
                  >
                    Leave
                  </button>
                ) : (
                  <button
                    onClick={() => joinClass(cls.id, cls.meetingLink, cls.status)}
                    className="bg-green-600 text-white py-2 rounded-xl"
                  >
                    Join
                  </button>
                )}

              </div>
            </div>
          ))}

        </div>
      )}

      {/* MODAL */}
      {selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 relative">

            <button
              onClick={() => setSelectedClass(null)}
              className="absolute top-4 right-4"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold">
              {selectedClass.topic}
            </h2>

            <p className="text-gray-500">
              {selectedClass.className}
            </p>
            <p className="text-sm text-gray-500 mt-1">
  👨‍🏫 {selectedClass.professor?.name || "Unknown Teacher"} Sir
</p>
            <div className="mt-4 space-y-2">

              <p>📅 {selectedClass.scheduledDate}</p>
              <p>⏰ {selectedClass.scheduledTime}</p>

              <p className="font-bold text-blue-600">
  👥 Total Joined: {selectedClass.totalParticipants ?? 0}
</p>

{selectedClass.status === "LIVE" && (
  <p className="font-bold text-green-600">
    🟢 Currently Online: {selectedClass.currentParticipants ?? 0}
  </p>
)}

              <p>Status: {selectedClass.status}</p>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default LiveClassInStudent;