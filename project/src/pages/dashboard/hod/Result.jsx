import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
} from "@material-tailwind/react";
import axios from "axios";

export default function AdminPanel() {

  const [tab, setTab] = useState("RESULT");

  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState([]);

  const [classes, setClasses] = useState([]);
  const [examTypes, setExamTypes] = useState([]);

  const [classId, setClassId] = useState("");
  const [examType, setExamType] = useState("");

  const [search, setSearch] = useState("");

  // 🔥 LOAD INIT
  useEffect(() => {
    axios.get("http://localhost:8080/api/classes")
      .then(res => setClasses(res.data));

    axios.get("http://localhost:8080/api/exam-schedule/exam-types")
      .then(res => setExamTypes(res.data));

    loadRecheck();
  }, []);

  // 🔥 LOAD RESULTS
  useEffect(() => {
    if (classId && examType) {
      axios.get(`http://localhost:8080/api/results/class/${classId}/${examType}`)
        .then(res => setResults(res.data))
        .catch(() => setResults([]));
    }
  }, [classId, examType]);

  // 🔥 LOAD RECHECK
  const loadRecheck = () => {
    axios.get("http://localhost:8080/api/recheck/admin")
      .then(res => setRequests(res.data));
  };


  const getClassName = (id) => {
  const cls = classes.find(c => c.id === id);
  return cls ? cls.className : id;
  };


  // 🔥 APPROVE / REJECT
  const approve = async (id) => {
    await axios.put(`http://localhost:8080/api/recheck/approve/${id}`);
    alert("Approved ✅");
    loadRecheck();
  };

  const reject = async (id) => {
    await axios.put(`http://localhost:8080/api/recheck/reject/${id}`);
    alert("Rejected ❌");
    loadRecheck();
  };

  // 🔥 GROUP RESULT
  const grouped = results.reduce((acc, r) => {
    if (!acc[r.studentId]) {
      acc[r.studentId] = {
        name: r.studentName || `Student ${r.studentId}`,
        subjects: [],
      };
    }
    acc[r.studentId].subjects.push(r);
    return acc;
  }, {});

  const filteredStudents = Object.values(grouped).filter((s) =>
    (s.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* 🔥 HEADER */}
      <Typography variant="h4" className="mb-6 text-center">
        Admin Dashboard
      </Typography>

      {/* 🔥 TAB BUTTONS */}
      <div className="flex justify-center gap-4 mb-6">
        <Button
          color={tab === "RESULT" ? "blue" : "gray"}
          onClick={() => setTab("RESULT")}
        >
          Results
        </Button>

        <Button
          color={tab === "RECHECK" ? "purple" : "gray"}
          onClick={() => setTab("RECHECK")}
        >
          Recheck Requests
        </Button>
      </div>

      {/* ================= RESULT ================= */}
      {tab === "RESULT" && (
        <>
          <Card className="mb-6">
            <CardBody className="flex gap-4 flex-wrap">

              {/* CLASS */}
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Select Class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    Class {c.className}
                  </option>
                ))}
              </select>

              {/* EXAM TYPE */}
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Select Exam</option>
                {examTypes.map((e, i) => (
                  <option key={i} value={e}>
                    {e}
                  </option>
                ))}
              </select>

              {/* SEARCH */}
              <Input
                label="Search Student"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </CardBody>
          </Card>

          {/* RESULT LIST */}
          {filteredStudents.map((student, index) => {

            const total = student.subjects.reduce((s, x) => s + x.marks, 0);
            const max = student.subjects.reduce((s, x) => s + x.totalMarks, 0);
            const per = max > 0 ? ((total / max) * 100).toFixed(1) : 0;

            return (
              <Card key={index} className="mb-4">
                <CardHeader className="p-4 flex justify-between bg-gray-100">
                  <Typography>{student.name}</Typography>
                  <Typography className="text-green-600 font-bold">
                    {per}%
                  </Typography>
                </CardHeader>

                <CardBody>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {student.subjects.map((s, i) => (
                        <tr key={i}>
                          <td>{s.subject}</td>
                          <td>{s.marks}</td>
                          <td>{s.totalMarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="text-right mt-3 font-bold">
                    Total: {total} / {max}
                  </div>

                </CardBody>
              </Card>
            );
          })}
        </>
      )}

      {/* ================= RECHECK ================= */}
      {tab === "RECHECK" && (
        <div className="grid md:grid-cols-4 gap-4">

          {requests.map((r) => (
  <Card key={r.id} className="p-5 shadow-md border bg-orange-50 rounded-2xl hover:bg-orange-100 hover:scale-105 hover:shadow-xl transition-all duration-300">

    {/* HEADER */}
    <Typography variant="h6" className="mb-2">
      👨‍🎓 {r.studentName || "Unknown Student"}
    </Typography>

    {/* DETAILS */}
    <div className="text-sm space-y-1">

      <p>📝 Class: {getClassName(r.classId)}</p>
      <p>📊 Old Marks: {r.oldMarks} / {r.totalMarks}</p>
      <p>📝 Exam: {r.examType}</p>

      <p>📘 Subject: {r.subjects?.[0]}</p>

      <p>📝 Reason: {r.reason}</p>
    </div>

    {/* STATUS */}
    <p className="mt-3 font-bold text-blue-600">
      {r.status}
    </p>

    {/* BUTTONS */}
    {r.status === "PENDING" && (
      <div className="flex gap-3 mt-4">
        <Button color="green" onClick={() => approve(r.id)}>
          Approve
        </Button>

        <Button color="red" onClick={() => reject(r.id)}>
          Reject
        </Button>
      </div>
    )}

  </Card>
  ))}

  </div>
  )}
  </div>
  );
}