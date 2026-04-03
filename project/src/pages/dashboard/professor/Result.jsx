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

export default function Result() {
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [recheckList, setRecheckList] = useState([]);

  const teacherSubject = "Math"; // 🔥 later dynamic karenge

  // ✅ FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/students");
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ FETCH RECHECK REQUESTS (ADMIN APPROVED ONLY)
  const fetchRecheck = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/recheck/teacher"
      );
      setRecheckList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchRecheck();
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (id, value) => {
    setMarksData({
      ...marksData,
      [id]: value,
    });
  };

  // ✅ SAVE MARKS
  const saveMarks = async (student) => {
    try {
      await axios.post("http://localhost:8080/api/results", {
        studentId: student.id,
        studentName: student.name,
        subject: teacherSubject,
        marks: marksData[student.id],
        totalMarks: 100,
      });

      alert("Marks Saved ✅");
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ UPDATE RECHECK
  const updateRecheck = async (req) => {
    try {
      await axios.put(
        `http://localhost:8080/api/recheck/update/${req.id}`,
        {
          marks: marksData[req.studentId],
        }
      );

      alert("Recheck Updated ✅");
      fetchRecheck();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-8 px-4">

      {/* 🔥 MARKS UPLOAD */}
      <Card className="mb-6 border shadow-sm">
        <CardHeader className="p-6">
          <Typography variant="h6">
            Upload Marks ({teacherSubject})
          </Typography>
        </CardHeader>

        <CardBody className="overflow-x-auto">
          <table className="w-full min-w-[700px] table-auto">
            <thead>
              <tr>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Marks</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="p-3">{s.name}</td>

                  <td className="p-3">
                    <Input
                      type="number"
                      placeholder="Enter marks"
                      onChange={(e) =>
                        handleChange(s.id, e.target.value)
                      }
                    />
                  </td>

                  <td className="p-3">
                    <Button
                      color="green"
                      onClick={() => saveMarks(s)}
                    >
                      Save
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* 🔥 RECHECK SECTION */}
      <Card className="border shadow-sm">
        <CardHeader className="p-6">
          <Typography variant="h6">
            Recheck Requests (Approved by Admin)
          </Typography>
        </CardHeader>

        <CardBody className="overflow-x-auto">
          <table className="w-full min-w-[700px] table-auto">
            <thead>
              <tr>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">New Marks</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {recheckList.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-3">{r.studentName}</td>
                  <td className="p-3">{r.subject}</td>

                  <td className="p-3">
                    <Input
                      type="number"
                      placeholder="Rechecked marks"
                      onChange={(e) =>
                        handleChange(r.studentId, e.target.value)
                      }
                    />
                  </td>

                  <td className="p-3">
                    <Button
                      color="blue"
                      onClick={() => updateRecheck(r)}
                    >
                      Update
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

    </div>
  );
}