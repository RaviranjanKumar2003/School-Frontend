import { useEffect, useState } from "react";
import axios from "axios";

export default function Toppers() {
  const [toppers, setToppers] = useState([]);

  const fetchToppers = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/students");

      // 🔥 SORT BY MARKS (HIGH → LOW)
      const sorted = res.data
        .filter(s => s.marks !== undefined) // marks hona chahiye
        .sort((a, b) => b.marks - a.marks);

      setToppers(sorted);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchToppers();
  }, []);

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">
        🎓 Toppers of the Year
      </h2>

      <table className="w-full border text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Rank</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Roll</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Marks</th>
          </tr>
        </thead>

        <tbody>
          {toppers.map((s, index) => (
            <tr key={s.id} className="hover:bg-gray-100">
              <td className="border p-2 font-bold">
                {index + 1}
              </td>
              <td className="border p-2">{s.studName}</td>
              <td className="border p-2">{s.studRollNo}</td>
              <td className="border p-2">{s.major}</td>
              <td className="border p-2 text-green-600 font-bold">
                {s.marks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}