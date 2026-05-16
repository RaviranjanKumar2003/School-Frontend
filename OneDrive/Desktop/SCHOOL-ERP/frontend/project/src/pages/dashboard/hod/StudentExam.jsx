import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentExam = () => {

  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [examType, setExamType] = useState("");
  const [message, setMessage] = useState("");

  const [notices, setNotices] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]); // 🔥 IMPORTANT

  const [examTypes, setExamTypes] = useState([]);

  useEffect(() => {
  axios.get("http://localhost:8080/api/exam-schedule/exam-types")
    .then(res => setExamTypes(res.data));
  }, []);

  // 🔥 LOAD DATA
  useEffect(() => {
    loadClasses();
    loadNotices();
  }, []);

  const loadClasses = async () => {
    const res = await axios.get("http://localhost:8080/api/classes");
    setClasses(res.data);
  };

  const loadNotices = async () => {
    const res = await axios.get("http://localhost:8080/api/exam-notice/all");
    setNotices(res.data);
  };

  // 🔁 RESET FORM
  const resetForm = () => {
    setShowForm(false);
    setIsUpdate(false);
    setClassId("");
    setExamType("");
    setMessage("");
    setSelectedIds([]);
  };

  // ✅ CREATE
  const createExam = async () => {
    if (!classId || !message || !examType) {
    alert("Fill all fields");
    return;
  }

    await axios.post("http://localhost:8080/api/exam-notice/create", {
      classId,
      examType,
      message
    });

    alert("✅ Exam Created");
    resetForm();
    loadNotices();
  };

  // ✅ UPDATE (ONLY SELECTED IDS)
  const updateExam = async () => {
    if (!message || selectedIds.length === 0) {
      alert("Something missing");
      return;
    }

    await axios.put("http://localhost:8080/api/exam-notice/update", {
      ids: selectedIds,
      message
    });

    alert("✅ Updated Successfully");
    resetForm();
    loadNotices();
  };

  // ✅ DELETE
  const deleteFullExam = async (ids) => {
    if (!window.confirm("Delete this exam?")) return;

    for (let id of ids) {
      await axios.delete(`http://localhost:8080/api/exam-notice/${id}`);
    }

    loadNotices();
  };

  // 🔥 GROUP DATA
  const grouped = {};

  notices.forEach((n) => {
  const key = `${n.className}_${n.examType}`;

  if (!grouped[key]) {
    grouped[key] = {
      classId: n.classId,
      className: n.className, // ✅ FIX
      examType: n.examType,
      message: n.message,
      subjects: [],
      ids: []
    };
  }

  grouped[key].subjects.push(n.subjectName);
  grouped[key].ids.push(n.id);
  });

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📘 Exams</h1>

        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setIsUpdate(false);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Create Exam
          </button>
        )}
      </div>

      {/* FORM */}
      {showForm ? (

        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">

          <h2 className="text-lg font-bold mb-4 text-center">
            {isUpdate ? "Update Exam" : "Create Exam"}
          </h2>

          {/* CLASS */}
          {!isUpdate && (
            <select
              className="w-full p-2 border rounded mb-3"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.className}
                </option>
              ))}
            </select>
          )}

          {/* TYPE */}
          {!isUpdate && (
           <select
           className="w-full p-2 border rounded mb-3"
           value={examType}
           onChange={(e) => setExamType(e.target.value)}
          >
         <option value="">Select Exam Type</option>

        {examTypes.map(type => (
        <option key={type} value={type}>
       {type.replace("_", " ")}
      </option>
      ))}
    </select>
          )}

          {/* MESSAGE */}
          <textarea
            placeholder="Enter exam instructions..."
            className="w-full p-2 border rounded mb-3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="flex gap-2">

            <button
              onClick={isUpdate ? updateExam : createExam}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              {isUpdate ? "Update" : "Create"}
            </button>

            <button
              onClick={resetForm}
              className="flex-1 bg-gray-400 text-white py-2 rounded"
            >
              Cancel
            </button>

          </div>

        </div>

      ) : (

        /* CARDS */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {Object.values(grouped).map((g, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >

              <h2 className="text-lg font-bold text-blue-600">
                Class {g.className} - {g.examType}
              </h2>

              <p className="text-sm text-gray-600 mt-2">
                {g.message}
              </p>

              <ul className="mt-2 text-sm text-gray-700">
                {g.subjects.map((s, index) => (
                  <li key={index}>• {s}</li>
                ))}
              </ul>

              <div className="flex justify-between mt-4">

                <button
                  onClick={() => {
                    setShowForm(true);
                    setIsUpdate(true);
                    setMessage(g.message);
                    setSelectedIds(g.ids); // 🔥 IMPORTANT
                  }}
                  className="text-blue-500 text-sm"
                >
                  Update
                </button>

                <button
                  onClick={() => deleteFullExam(g.ids)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

      )}

    </div>
  );
};

export default StudentExam;