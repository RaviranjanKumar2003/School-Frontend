import React, { useEffect, useState } from "react";

export default function ArchivedNotifications() {
  const [data, setData] = useState([]);

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    fetch(`http://localhost:8080/api/notifications/archived/${studentId}`)
      .then(res => res.json())
      .then(setData);
  }, []);

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/notifications/delete/${id}`, {
      method: "DELETE",
    });
    window.location.reload();
  };

  return (
    <div className="p-5">
      <h2 className="text-xl mb-4">Archived Notifications</h2>

      {data.map((n) => (
        <div key={n.id} className="bg-gray-200 p-3 mb-2 rounded">
          <h4>{n.title}</h4>
          <p>{n.message}</p>

          <button
            onClick={() => handleDelete(n.id)}
            className="bg-red-600 text-white px-2 py-1 mt-2 rounded"
          >
            Delete Permanently
          </button>
        </div>
      ))}
    </div>
  );
}