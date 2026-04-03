import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfessorEvents = () => {
  const [events, setEvents] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  const teacherId = localStorage.getItem("userId"); // adjust if needed

  // 🔥 GET EVENTS
  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 🔥 STATUS UPDATE
  const updateStatus = async (eventId, status) => {
    try {
      await axios.post("/api/events/respond", {
        eventId,
        teacherId,
        status,
      });

      setStatusMap((prev) => ({
        ...prev,
        [eventId]: status,
      }));
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">📅 Teacher Events</h2>

      {events.length === 0 ? (
        <p>No Events Available</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-2xl shadow-lg p-5 bg-white"
            >
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>

              <p className="mt-2 text-sm text-gray-500">
                📍 {event.location}
              </p>
              <p className="text-sm text-gray-500">
                🗓 {event.date}
              </p>

              {/* STATUS BUTTONS */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => updateStatus(event.id, "YES")}
                  className={`px-4 py-2 rounded-lg text-white ${
                    statusMap[event.id] === "YES"
                      ? "bg-green-700"
                      : "bg-green-500"
                  }`}
                >
                  ✅ Yes
                </button>

                <button
                  onClick={() => updateStatus(event.id, "NO")}
                  className={`px-4 py-2 rounded-lg text-white ${
                    statusMap[event.id] === "NO"
                      ? "bg-red-700"
                      : "bg-red-500"
                  }`}
                >
                  ❌ No
                </button>

                <button
                  onClick={() => updateStatus(event.id, "MAYBE")}
                  className={`px-4 py-2 rounded-lg text-white ${
                    statusMap[event.id] === "MAYBE"
                      ? "bg-yellow-600"
                      : "bg-yellow-400"
                  }`}
                >
                  🤔 50%
                </button>
              </div>

              {/* CURRENT STATUS */}
              <div className="mt-3">
                <span className="text-sm font-medium">
                  Your Status:{" "}
                  <span className="text-blue-600">
                    {statusMap[event.id] || "Not Responded"}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessorEvents;