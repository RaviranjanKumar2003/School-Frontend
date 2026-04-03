import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Input,
} from "@material-tailwind/react";

import axios from "axios";

export default function Result() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");

  // ✅ FETCH ALL RESULTS
  const fetchResults = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/results");
      setResults(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // ✅ GROUP BY STUDENT
  const grouped = results.reduce((acc, r) => {
    if (!acc[r.studentId]) {
      acc[r.studentId] = {
        name: r.studentName,
        subjects: [],
      };
    }
    acc[r.studentId].subjects.push(r);
    return acc;
  }, {});

  // ✅ FILTER
  const filteredStudents = Object.values(grouped).filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mt-8 px-4">

      {/* 🔥 HEADER */}
      <Card className="mb-6 border shadow-sm">
        <CardHeader className="p-6">
          <Typography variant="h5">All Students Result</Typography>
        </CardHeader>

        <CardBody>
          <Input
            label="Search Student"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardBody>
      </Card>

      {/* 🔥 RESULT LIST */}
      {filteredStudents.map((student, index) => {

        const totalMarks = student.subjects.reduce(
          (sum, s) => sum + s.marks,
          0
        );

        const totalMax = student.subjects.reduce(
          (sum, s) => sum + s.totalMarks,
          0
        );

        const percentage =
          totalMax > 0
            ? ((totalMarks / totalMax) * 100).toFixed(2)
            : 0;

        return (
          <Card key={index} className="mb-6 border shadow-sm">

            <CardHeader className="p-4 bg-gray-100 flex justify-between">
              <Typography>{student.name}</Typography>
              <Typography className="font-bold text-green-600">
                {percentage}%
              </Typography>
            </CardHeader>

            <CardBody className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="p-3 text-left">Subject</th>
                    <th className="p-3 text-left">Marks</th>
                    <th className="p-3 text-left">Total</th>
                    <th className="p-3 text-left">%</th>
                  </tr>
                </thead>

                <tbody>
                  {student.subjects.map((sub, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-3">{sub.subject}</td>
                      <td className="p-3">{sub.marks}</td>
                      <td className="p-3">{sub.totalMarks}</td>
                      <td className="p-3">
                        {((sub.marks / sub.totalMarks) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 🔥 TOTAL */}
              <div className="mt-4 text-right font-bold">
                Total: {totalMarks} / {totalMax}
              </div>

            </CardBody>
          </Card>
        );
      })}

    </div>
  );
}