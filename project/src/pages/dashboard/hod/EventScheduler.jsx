
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EventScheduler() {

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: ""
  });

  const [events, setEvents] = useState([]);
  const [editId, setEditId] = useState(null);

/* 🔥 RESPONSES STATE */
  const [responses, setResponses] = useState({});

  const API = "http://localhost:8080/api/events";

/* 🔥 LOAD EVENTS */
  const loadEvents = async () => {
    const res = await axios.get(API);
    setEvents(res.data);
  };

/* 🔥 LOAD RESPONSES */
  const loadResponses = async () => {
    try {
      const res = await axios.get(`${API}/responses`);

      const grouped = {};
      res.data.forEach(r => {
        if (!grouped[r.eventId]) grouped[r.eventId] = [];
        grouped[r.eventId].push(r);
      });

      setResponses(grouped);

    } catch (err) {
      console.error("Error loading responses", err);
    }
  };

  useEffect(() => {
    loadEvents();
    loadResponses();
  }, []);

/* 🔥 CREATE / UPDATE */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(`${API}/${editId}`, form);
      alert("Updated ✅");
    } else {
      await axios.post(API, { ...form, createdBy: "ADMIN" });
      alert("Created (Private) 🔒");
    }

    setForm({ title: "", description: "", date: "" });
    setEditId(null);
    loadEvents();
  };

/* 🔥 DELETE */
  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    loadEvents();
  };

/* 🔥 EDIT */
  const handleEdit = (e) => {
    setForm({
      title: e.title,
      description: e.description,
      date: e.date
    });
    setEditId(e.id);
  };

/* 🔥 PUBLISH */
  const publishEvent = async (id, target) => {
    await axios.put(`${API}/publish/${id}?target=${target}`);
    alert("Published 🚀");
    loadEvents();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h2 className="text-3xl font-bold mb-6 text-blue-700">
        📅 Event Scheduler (Admin Panel)
      </h2>

      {/* ================= FORM ================= */}
      <div className="bg-white shadow-lg rounded-xl p-5 mb-6">
        <h3 className="text-lg font-semibold mb-3">
          {editId ? "Update Event ✏️" : "Create Event 🆕"}
        </h3>

        <form onSubmit={handleSubmit} className="grid gap-3">

          <input
            className="border p-2 rounded"
            placeholder="Event Title"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
          />

          <textarea
            className="border p-2 rounded"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
          />

          <input
            type="date"
            className="border p-2 rounded"
            value={form.date}
            onChange={(e) => setForm({...form, date: e.target.value})}
          />

          <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {editId ? "Update Event" : "Create Event"}
          </button>

        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white shadow-lg rounded-xl p-5">

        <h3 className="text-lg font-semibold mb-4">📌 All Events</h3>

        <table className="w-full border text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Target</th>
              <th className="p-2 border">Responses</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map(e => {

              const eventResponses = responses[e.id] || [];

              const yes = eventResponses.filter(r => r.status === "YES").length;
              const no = eventResponses.filter(r => r.status === "NO").length;
              const maybe = eventResponses.filter(r => r.status === "MAYBE").length;

              return (
                <tr key={e.id} className="text-center">

                  <td className="p-2 border">{e.title}</td>

                  <td className="p-2 border">{e.date}</td>

                  <td className="p-2 border">
                    {e.published ? (
                      <span className="text-green-600 font-semibold">Public</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Private</span>
                    )}
                  </td>

                  <td className="p-2 border">
                    {e.target || "-"}
                  </td>

                  {/* 🔥 RESPONSE + TEACHER LIST */}
                  <td className="p-2 border text-left">
                    <div className="text-xs space-y-1 max-h-32 overflow-y-auto">

                      {/* SUMMARY */}
                      <div className="mb-1 font-semibold">
                        <span className="text-green-600 mr-2">YES: {yes}</span>
                        <span className="text-red-500 mr-2">NO: {no}</span>
                        <span className="text-yellow-600">50%: {maybe}</span>
                      </div>

                      {/* TEACHER LIST */}
                      {eventResponses.length === 0 ? (
                        <p className="text-gray-400">No Responses</p>
                      ) : (
                        eventResponses.map((r, i) => (
                          <div
                            key={i}
                            className="flex justify-between border-b pb-1"
                          >
                            <span className="font-medium">
                              {r.teacherName || "Teacher"}
                            </span>

                            <span
                              className={
                                r.status === "YES"
                                  ? "text-green-600"
                                  : r.status === "NO"
                                  ? "text-red-500"
                                  : "text-yellow-600"
                              }
                            >
                              {r.status === "YES"
                                ? "✔"
                                : r.status === "NO"
                                ? "✖"
                                : "50%"}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-2 border space-x-1">

                    <button
                      onClick={() => handleEdit(e)}
                      className="bg-yellow-400 px-2 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(e.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>

                    {!e.published && (
                      <>
                        <button
                          onClick={() => publishEvent(e.id, "ALL")}
                          className="bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Everyone
                        </button>

                        <button
                          onClick={() => publishEvent(e.id, "TEACHERS")}
                          className="bg-purple-600 text-white px-2 py-1 rounded"
                        >
                          Teachers
                        </button>

                        <button
                          onClick={() => publishEvent(e.id, "STUDENTS")}
                          className="bg-blue-600 text-white px-2 py-1 rounded"
                        >
                          Students
                        </button>
                      </>
                    )}

                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

    </div>
  );
}