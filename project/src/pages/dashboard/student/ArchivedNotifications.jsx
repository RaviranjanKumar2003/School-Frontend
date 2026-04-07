import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ArchivedNotifications() {
  const [data, setData] = useState([]);
  const studentId = localStorage.getItem("id");

  useEffect(() => {
    fetchArchived();
  }, []);

  const fetchArchived = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/notifications/archived/${studentId}`
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/notifications/delete/${id}`
      );
      setData((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(
        `http://localhost:8080/api/notifications/unarchive/${id}`
      );
      setData((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 mt-16">

      {/* 🔥 HEADER */}
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        📁 Archived Notifications
      </h2>

      {data.length === 0 && (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-lg">📭 No archived notifications</p>
        </div>
      )}

      {/* 🔥 CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {data.map((n) => (
          <div
            key={n.id}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100 hover:-translate-y-1"
          >

            {/* DATE */}
            <p className="text-xs text-gray-400">
              {new Date(n.sentAt).toLocaleDateString()}
            </p>

            {/* TITLE */}
            <h3 className="text-lg font-semibold mt-2 text-gray-800">
              {n.title}
            </h3>

            {/* MESSAGE */}
            <p className="text-gray-600 mt-2 text-sm line-clamp-3">
              {n.message}
            </p>

            {/* ACTIONS */}
            <div className="flex justify-between mt-5">

              {/* Restore Button */}
              <button
                onClick={() => handleRestore(n.id)}
                className="px-3 py-1.5 text-sm font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
              >
                ♻️ Restore
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(n.id)}
                className="px-3 py-1.5 text-sm font-medium bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >
                🗑 Delete
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}