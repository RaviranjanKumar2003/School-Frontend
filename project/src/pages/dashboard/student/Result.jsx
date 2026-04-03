import React, { useEffect, useState } from "react";
import { Typography, Card, Button } from "@material-tailwind/react";

export default function Result() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("studentId");

  // ✅ FETCH RESULT
  const fetchResults = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/results/student/${studentId}`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // ✅ RECHECK REQUEST
  const requestRecheck = async (subject) => {
    try {
      await fetch("http://localhost:8080/api/recheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          subject,
        }),
      });

      alert(`Recheck requested for ${subject} ✅`);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ CALCULATE TOTAL
  const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
  const totalMax = results.reduce((sum, r) => sum + r.totalMarks, 0);
  const percentage =
    totalMax > 0 ? ((totalMarks / totalMax) * 100).toFixed(2) : 0;

  if (loading) {
    return (
      <Typography className="text-center mt-10">
        Loading Result...
      </Typography>
    );
  }

  return (
    <div className="mt-8 px-4">

      {/* 🔥 TOP SUMMARY */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">

        <Card className="p-4 border">
          <Typography>Total Marks</Typography>
          <Typography className="font-bold">{totalMarks}</Typography>
        </Card>

        <Card className="p-4 border">
          <Typography>Percentage</Typography>
          <Typography className="font-bold text-green-600">
            {percentage}%
          </Typography>
        </Card>

        <Card className="p-4 border">
          <Typography>Total Subjects</Typography>
          <Typography className="font-bold">
            {results.length}
          </Typography>
        </Card>

      </div>

      {/* 🔥 RESULT TABLE */}
      <Card className="p-4 border">
        <Typography className="mb-4 font-bold text-lg">
          Subject-wise Result
        </Typography>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Subject</th>
                <th className="p-3 text-left">Marks</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">%</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {results.map((r, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{r.subject}</td>
                  <td className="p-3">{r.marks}</td>
                  <td className="p-3">{r.totalMarks}</td>
                  <td className="p-3">
                    {((r.marks / r.totalMarks) * 100).toFixed(2)}%
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      color="red"
                      onClick={() => requestRecheck(r.subject)}
                    >
                      Recheck
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </Card>

    </div>
  );
}