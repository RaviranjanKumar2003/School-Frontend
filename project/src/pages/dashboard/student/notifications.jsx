import React, { useEffect, useState } from "react";
import axios from "axios";

const badgeStyles = {
  ADMIN: "bg-red-50 text-red-700 border border-red-100",
  TEACHER: "bg-blue-50 text-blue-700 border border-blue-100",
  REQUEST: "bg-green-50 text-green-700 border border-green-100"
};

const lineStyles = {
  ADMIN: "from-red-500 to-red-400",
  TEACHER: "from-blue-500 to-indigo-500",
  REQUEST: "from-green-500 to-emerald-400"
};

function Notices() {
  const [notices, setNotices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeType, setActiveType] = useState("ALL");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveData, setLeaveData] = useState({
  reason: "",
  fromDate: "",
  toDate: "",
  sendTo: "HOD"
  });
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchNotices();
    fetchLeaves();
  }, []);


 const fetchNotices = async () => {
  try {
    const studentId = localStorage.getItem("id");

    if (!studentId) {
      console.log("❌ ID missing");
      return;
    }
   
    const res = await axios.get(
      `http://localhost:8080/api/notifications/student/${studentId}`
    );
    if (res.data && res.data.length > 0) {
      setNotices(res.data);
      console.log(res.data);
      setFiltered(res.data);
    } else {
      console.log("❌ No data from backend");
    }

  } catch (err) {
    console.error("Error:", err);
  } finally {
    setLoading(false);
  }
  };

 const archiveNotice = async (id) => {
  try {
    const notice = notices.find((n) => n.id === id);

    // 🔥 agar unread hai to pehle read karo
    if (notice && !notice.readStatus) {
      await axios.put(
        `http://localhost:8080/api/notifications/read/${id}`
      );
    }

    // 🔥 phir archive
    await axios.put(
      `http://localhost:8080/api/notifications/archive/${id}`
    );

    // 🔥 UI update
    setNotices((prev) => prev.filter((n) => n.id !== id));
    setFiltered((prev) => prev.filter((n) => n.id !== id));

  } catch (err) {
    console.error(err);
  }
};

  const fetchLeaves = async () => {
    try {
      const studentId = localStorage.getItem("id");

      const res = await axios.get(
        `http://localhost:8080/api/leave/my?studentId=${studentId}`
      );

      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 UPDATED FILTER
  const handleFilter = (type) => {
    setActiveType(type);

    if (type === "ALL") {
      setFiltered(notices);
    } else if (type === "REQUEST") {
      setFiltered([]); // hide notices
    } else {
     setFiltered(notices.filter((n) => n.sender === type));
    }
  };

  const handleLeaveChange = (e) => {
  const { name, value } = e.target;

  setLeaveData(prev => ({
    ...prev,
    [name]: value
  }));
  };

  const submitLeave = async () => {
    try {
      const studentId = localStorage.getItem("id");

      await axios.post(
  `http://localhost:8080/api/leave?studentId=${studentId}`,
  leaveData
  );

      alert("Leave Applied ✅");
      setShowLeaveModal(false);

     setLeaveData({
  reason: "",
  fromDate: "",
  toDate: "",
  sendTo: "HOD"   // 🔥 IMPORTANT
  });
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert("Error ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-6 mt-16">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Notices</h1>
            <p className="text-slate-500">Home / Notices</p>
          </div>

          <button
            onClick={() => setShowLeaveModal(true)}
            className="px-6 py-3 bg-black/50 text-white rounded-xl shadow-lg hover:bg-red-600 hover:shadow-xl hover:scale-105 transition duration-300">
            + Apply Leave
          </button>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["ALL", "HOD", "TEACHER", "REQUEST"].map((type) => (
            <button
              key={type}
              onClick={() => handleFilter(type)}
              className={`px-4 py-2 rounded-full transition ${
                activeType === type
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white border hover:bg-blue-50 hover:shadow"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* 🔥 NOTICE CARDS */}
        {activeType !== "REQUEST" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow border 
                hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
              >
                <p className="text-sm text-gray-400">
                  {new Date(item.sentAt).toLocaleDateString()}
                </p>

                <h3 className="text-xl font-semibold mt-2 hover:text-blue-600 transition">
                  {item.title}
                </h3>

                <p className="text-gray-600 mt-2 line-clamp-3">
                  {item.message}
                </p>

                <button
                  onClick={() => setSelectedNotice(item)}
                  className="mt-4 text-blue-600 font-medium hover:underline"
                >
                  Read More →
                </button>
                <button
                 onClick={(e) => {
                 e.stopPropagation();
                 archiveNotice(item.id);
                 }}
                 className="mt-10 mr-10 ml-10 mb-10 text-1xl text-gray-500 rounded-full hover:text-red-500"
                 >
                 Move to Archive
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 🔥 LEAVES ONLY ON REQUEST */}
        {activeType === "REQUEST" && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">
              My Leave Requests
            </h2>

            {leaves.length === 0 && (
              <p className="text-gray-400">No leaves applied</p>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaves.map((l) => (
                <div
                  key={l.id}
                  className="bg-white p-5 rounded-2xl shadow border 
                  hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >
                  <p className="text-sm text-gray-400">
                    {l.fromDate} → {l.toDate}
                  </p>

                  <h3 className="font-semibold text-lg mt-2">
                    {l.reason}
                  </h3>

                  <span
                    className={`inline-block mt-4 px-3 py-1 rounded-full text-sm font-medium ${
                      l.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : l.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTICE MODAL */}
        {selectedNotice && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl max-w-xl w-full">
              <h2 className="text-2xl font-bold mb-4">
                {selectedNotice.title}
              </h2>

              <p>{selectedNotice.message}</p>

              <button
                onClick={() => setSelectedNotice(null)}
                className="mt-4 text-red-500"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* LEAVE MODAL */}
       {showLeaveModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">

    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-slate-800">
          Apply Leave 
        </h2>

        <button
          onClick={() => setShowLeaveModal(false)}
          className="text-gray-400 hover:text-red-500 text-lg"
        >
          ✕
        </button>
      </div>

      {/* Form */}
      <div className="space-y-4">

        {/* Dropdown */}
        <div>
          <label className="text-sm text-gray-500 mb-1 block">
            Send To
          </label>
          <select
            name="sendTo"
            value={leaveData.sendTo}
            onChange={handleLeaveChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="HOD">HOD</option>
            <option value="TEACHER">Teacher</option>
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="text-sm text-gray-500 mb-1 block">
            Reason
          </label>
          <input
            name="reason"
            placeholder="Enter reason..."
            value={leaveData.reason}
            onChange={handleLeaveChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              From
            </label>
            <input
              type="date"
              name="fromDate"
              value={leaveData.fromDate}
              onChange={handleLeaveChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              To
            </label>
            <input
              type="date"
              name="toDate"
              value={leaveData.toDate}
              onChange={handleLeaveChange}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={submitLeave}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Submit
          </button>

          <button
            onClick={() => setShowLeaveModal(false)}
            className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
 )}
</div>
</div>
);
}

export default Notices;