import { useEffect, useState } from "react";
import axios from "axios";

export default function ArchivedStudents() {

    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 5;

    const [loading, setLoading] = useState(false); // ✅ NEW


    // ✅ FETCH DELETED STUDENTS (MORE SAFE)
    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/api/students/deleted");

            console.log("Deleted Students:", res.data);

            if (Array.isArray(res.data)) {
                setStudents(res.data);
            } else {
                setStudents([]);
            }

        } catch (err) {
            console.log("Fetch Error:", err);
            setStudents([]); // ✅ avoid crash
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);


    // ✅ RESTORE STUDENT
    const restoreStudent = async (id) => {

        if (!window.confirm("Restore this student?")) return;

        try {

            await axios.put(`http://localhost:8080/api/students/restore/${id}`);

            alert("Student Restored Successfully");

            setStudents(prev => prev.filter(s => s.id !== id));

        } catch (err) {
            console.log("Restore Error:", err);
        }
    };


    // ❌ PERMANENT DELETE
    const deletePermanently = async (id) => {

        if (!window.confirm("Permanently delete this student?")) return;

        try {

            await axios.delete(`http://localhost:8080/api/students/permanent/${id}`);

            alert("Student Permanently Deleted");

            setStudents(prev => prev.filter(s => s.id !== id));

        } catch (err) {
            console.log("Delete Error:", err);
        }
    };


    // 🔍 SEARCH
    const filteredStudents = students.filter((s) =>
        s.studName?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    );


    // 📄 PAGINATION
    const indexOfLast = currentPage * studentsPerPage;
    const indexOfFirst = indexOfLast - studentsPerPage;

    const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);


    return (

        <div className="p-6">

            <h2 className="text-2xl font-bold mb-4">
                Archived Students ({students.length})
            </h2>


            {/* ✅ LOADING */}
            {loading && (
                <p className="text-blue-500 mb-4">Loading...</p>
            )}


            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search archived student..."
                className="border p-2 mb-4 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />


            {/* TABLE */}
            <div className="overflow-x-auto">

                <table className="w-full border">

                    <thead>
                        <tr className="bg-gray-200 text-center">
                            <th className="border p-2">#</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Phone</th>
                            <th className="border p-2">Roll</th>
                            <th className="border p-2">Department</th>
                            <th className="border p-2">Class</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {currentStudents.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center p-4">
                                    No Archived Students Found
                                </td>
                            </tr>
                        ) : (

                            currentStudents.map((s, index) => (

                                <tr key={s.id} className="text-center hover:bg-gray-100">

                                    <td className="border p-2">
                                        {indexOfFirst + index + 1}
                                    </td>

                                    <td className="border p-2">{s.studName}</td>
                                    <td className="border p-2">{s.email}</td>
                                    <td className="border p-2">{s.studPhoneNumber}</td>
                                    <td className="border p-2">{s.studRollNo}</td>
                                    <td className="border p-2">{s.major}</td>

                                    {/* ✅ CLASS SAFE FIX */}
                                    <td className="border p-2">
                                        {s.classNumber || "N/A"}
                                    </td>

                                    <td className="border p-2 space-x-2">

                                        <button
                                            onClick={() => restoreStudent(s.id)}
                                            className="bg-green-600 text-white px-2 py-1 rounded"
                                        >
                                            Restore
                                        </button>

                                        <button
                                            onClick={() => deletePermanently(s.id)}
                                            className="bg-red-600 text-white px-2 py-1 rounded"
                                        >
                                            Delete Permanently
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>


            {/* PAGINATION */}
            <div className="mt-4 flex gap-2">

                {Array.from({ length: totalPages }, (_, i) => (

                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`border px-3 py-1 ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""}`}
                    >
                        {i + 1}
                    </button>

                ))}

            </div>

        </div>
    );
}