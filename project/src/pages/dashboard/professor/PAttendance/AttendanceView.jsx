
import React, { useEffect, useState } from "react";
import axios from "axios";

const AttendanceView = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/attendance/lecturer/subject?lecturer=test&subject=test")
      .then((response) => {
        const data = response.data;

        // Convert map to array
        const formatted = Object.keys(data).map((date) => ({
          date,
          records: data[date],
        }));

        setAttendanceData(formatted);
      })
      .catch((error) => {
        console.error("Error fetching attendance:", error);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Attendance Sheet</h2>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Student</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>

        <tbody>
          {attendanceData.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No Data
              </td>
            </tr>
          ) : (
            attendanceData.map((day, index) =>
              day.records.map((rec, i) => (
                <tr key={index + "-" + i}>
                  <td className="p-2 border">
                    {new Date(day.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    {rec.studentName}
                  </td>
                  <td
                    className={`p-2 border ${
                      rec.status === "PRESENT"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    {rec.status}
                  </td>
                </tr>
              ))
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceView;