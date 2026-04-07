import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentEvents() {

  const [events, setEvents] = useState([]);

  // ✅ NEW API (FIXED)
  const API = "http://localhost:8080/api/events/student";

  const loadEvents = async () => {
    try {
      console.log("Calling API:", API);

      const res = await axios.get(API);

      console.log("Events:", res.data);

      setEvents(res.data);
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
    }
  };

  // ✅ FIXED (NO STUDENT ID NEEDED)
  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h2 className="text-3xl font-bold mb-6 text-blue-700">
        🎓 Student Events
      </h2>

      {events.length === 0 ? (
        <p className="text-gray-500">No events available</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">

          {events.map((e) => (
            <div
              key={e.id}
              className="bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition"
            >

              <h3 className="text-xl font-semibold text-gray-800">
                {e.title}
              </h3>

              <p className="text-gray-600 mt-2">
                {e.description}
              </p>

              <p className="mt-3 text-sm text-gray-500">
                📅 {e.date}
              </p>

              <div className="mt-3 flex justify-between items-center">

                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                  {e.target}
                </span>

                <span className="text-xs text-blue-500">
                  New
                </span>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}