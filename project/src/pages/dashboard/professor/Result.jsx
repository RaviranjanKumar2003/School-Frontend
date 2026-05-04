import React, { useEffect, useState } from "react";
import axios from "axios";

const Result = () => {

  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);

  const [rechecks, setRechecks] = useState([]);

  const teacherData = JSON.parse(localStorage.getItem("professorData"));
  const teacherId = teacherData?.id;



  useEffect(() => {
  if (!teacherId) return;

  axios.get(`http://localhost:8080/api/recheck/teacher/${teacherId}`)
    .then(res => {
      console.log("RECHECK DATA:", res.data);
      setRechecks(res.data);
    })
    .catch(err => console.log(err));
  }, [teacherId]);

  // 🔥 LOAD CLASSES
  useEffect(() => {
    axios.get("http://localhost:8080/api/classes")
      .then(res => setClasses(res.data))
      .catch(() => alert("Error loading classes"));
  }, []);

  // 🔥 LOAD STUDENTS (ONLY PRESENT)
  const loadStudents = async () => {
    if (!classId) return alert("Select class");

    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/exam-schedule/result/${classId}/${teacherId}`
      );

      console.log("API DATA:", res.data);

      // 🔥 FILTER ONLY PRESENT
      const presentStudents = res.data.filter(
        s => s.examStatus === "PRESENT"
      );

      setStudents(presentStudents);

    } catch (err) {
      console.log(err);
      alert("No exam found or error");
    }

    setLoading(false);
  };

  // 🔥 HANDLE MARK INPUT
  const handleMarks = (id, value) => {
    setMarks(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // 🔥 SAVE RESULT
  const saveResult = async (student) => {
    try {
      await axios.post("http://localhost:8080/api/results", {
      studentId: student.studentId,
      subject: student.subjectName,
      marks: Number(marks[student.id] || 0),
      professorId: teacherId,
      examId: student.examScheduleId
      });

      alert("Result Saved ✅");

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || err.response?.data || "Error saving result");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-center mb-6">
        📝 Manage Results
      </h1>

      {/* CLASS SELECT */}
      <div className="flex flex-col md:flex-row gap-3 justify-center mb-6">

        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="p-3 rounded-lg border shadow focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Class</option>
          {classes.map(c => (
            <option key={c.id} value={c.id}>
              Class {c.className}
            </option>
          ))}
        </select>

        <button
          onClick={loadStudents}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          Load Students
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-gray-500">
          Loading...
        </div>
      )}

      {/* ================= RECHECK REQUESTS ================= */}

  {rechecks.length > 0 && (
  <>
    <h2 className="text-xl font-bold text-center mt-10 mb-4">
      🔁 Recheck Requests
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

      {rechecks.map(r => (

        <div
          key={r.id}
          className="bg-yellow-50 p-5 rounded-xl shadow-md border"
        >

          <h2 className="text-lg font-bold text-orange-600">
            👤 {r.studentName}
          </h2>

          <p className="text-sm mt-1">📘 Subject: {r.subjects?.[0]}</p>

          <p className="text-sm">🏫 Class: {r.classId}</p>

          <p className="text-sm">📝 Exam: {r.examType}</p>

          <p className="text-sm">
          📊 Old Marks: {r.oldMarks} / {r.totalMarks}
          </p>

          <p className="text-sm text-gray-600">
          💬 {r.reason}
          </p>
          <input
            type="number"
            placeholder="Enter new marks"
            value={marks[r.id] || ""}
            onChange={(e) =>
              setMarks(prev => ({
                ...prev,
                [r.id]: e.target.value
              }))
            }
            className="w-full mt-3 p-2 border rounded"
          />

          <div className="flex gap-2 mt-3">

            {/* ✅ UPDATE MARKS */}
            <button
              onClick={async () => {
                try {
                  await axios.put(
                    "http://localhost:8080/api/results/update-marks",
                    null,
                    {
                      params: {
                        studentId: r.studentId,
                        subject: r.subjects[0],
                        newMarks: marks[r.id],
                        requestId: r.id,
                        professorId: teacherId
                      }
                    }
                  );

                  alert("Marks Updated ✅");

                  // 🔥 remove from UI
                  setRechecks(prev => prev.filter(x => x.id !== r.id));

                } catch (err) {
                  alert("Error ❌");
                }
              }}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Update
            </button>

            {/* ❌ NO CHANGE */}
            <button
             onClick={async () => {

             const remark = prompt("Reason (why no change?)");

             if (!remark) return alert("Reason required");

             await axios.put(
             `http://localhost:8080/api/recheck/no-change/${r.id}`,
             null,
            {
            params: { remark }
           }
          );

          alert("No Change Saved ✅");

         setRechecks(prev => prev.filter(x => x.id !== r.id));

         }}
         className="bg-gray-400 text-white px-3 py-1 rounded">  No Change
        </button>
        </div>
        </div>
        ))}
        </div>
        </>
      )}

     {/* STUDENTS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {students.map(s => (

          <div
            key={s.id}
            className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition duration-300"
          >

            {/* STUDENT NAME */}
            <h2 className="text-lg font-bold text-blue-600 flex items-center gap-2">
              👤 {s.studentName}
            </h2>
            {/* SUBJECT */}
            <p className="text-sm text-gray-500 mt-1">
              📘 {s.subjectName}
            </p>
            {/* STATUS */}
            <p className="text-sm mt-1">
              Status:
              <span className="ml-2 text-green-600 font-semibold">
                {s.examStatus}
              </span>
            </p>
            {/* MARK INPUT */}
            <input
             type="number"
             placeholder={`Max ${s.totalMarks}`}
             value={marks[s.id] || ""}
             max={s.totalMarks}   // 🔥 LIMIT
             onChange={(e) => handleMarks(s.id, e.target.value)}
             className="w-full mt-3 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            {/* SAVE BUTTON */}
            <button
              onClick={() => saveResult(s)}
              className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition"
            >
              Save Result
            </button>
          </div>
        ))}
      </div>
      {/* EMPTY */}
      {!loading && students.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          No students found
        </div>
      )}
    </div>
  );
};

export default Result;