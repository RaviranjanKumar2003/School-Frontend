import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

export default function Students() {

    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 5;

    const [editingStudent, setEditingStudent] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // ================= FETCH =================
    const fetchStudents = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/students");

            const fixedData = res.data.map(s => ({
                ...s,
                classNumber: Number(s.classNumber || 0)
            }));

            setStudents(fixedData);

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // ================= DELETE =================
    const deleteStudent = async (id) => {
        if (!window.confirm("Delete this student?")) return;

        await axios.delete(`http://localhost:8080/api/students/${id}`);
        fetchStudents();
    };

    // ================= PROFILE =================
    const handleProfile = (student) => {
        setSelectedStudent(student);
        setEditingStudent(null);
    };

    // ================= EDIT =================
    const handleEdit = (student) => {
        setEditingStudent(student);
        setSelectedStudent(null);
    };

    const handleChange = (e) => {
        setEditingStudent({
            ...editingStudent,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        setEditingStudent({
            ...editingStudent,
            image: e.target.files[0]
        });
    };

    // ================= UPDATE =================
    const updateStudent = async (e) => {
        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append("studName", editingStudent.studName || "");
            formData.append("email", editingStudent.email || "");
            formData.append("phone", editingStudent.studPhoneNumber || "");
            formData.append("classNumber", Number(editingStudent.classNumber || 0));
            formData.append("rollNo", Number(editingStudent.studRollNo || 0));

            if (editingStudent.image instanceof File) {
                formData.append("image", editingStudent.image);
            }

            await axios.put(
                `http://localhost:8080/api/students/update/${editingStudent.id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert("✅ Student Updated Successfully");

            setEditingStudent(null);
            fetchStudents();

        } catch (err) {
            console.error(err);
            alert("❌ Update failed");
        }
    };

    // ================= SEARCH =================
    const filteredStudents = students.filter((s) =>
        s.studName?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    );

    // ================= PAGINATION =================
    const indexOfLast = currentPage * studentsPerPage;
    const indexOfFirst = indexOfLast - studentsPerPage;

    const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    // ================= ID CARD =================
    const downloadIDCard = (student) => {

        const doc = new jsPDF("landscape", "mm", [85, 54]);

        doc.setFontSize(16);
        doc.text("TGP CET School", 25, 10);

        doc.setFontSize(10);
        doc.text("Student Identity Card", 27, 16);

        doc.text(`Name : ${student.studName}`, 10, 25);
        doc.text(`Roll : ${student.studRollNo}`, 10, 32);
        doc.text(`Class : ${student.classNumber}`, 10, 39);

        doc.save(`${student.studName}_IDCard.pdf`);
    };

    return (

        <div className="p-4 md:p-6">

            <h2 className="text-xl md:text-2xl font-bold mb-4">
                Students ({students.length})
            </h2>

            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search student..."
                className="border p-2 mb-4 w-full md:w-64 rounded"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* PROFILE */}
            {selectedStudent && (
                <div className="mb-6 p-4 md:p-6 border rounded shadow bg-white">

                    <h2 className="text-xl md:text-2xl font-bold mb-4">
                        Student Profile
                    </h2>

                    <div className="flex flex-col md:flex-row gap-6 items-center">

                        <img
                            src={
                                selectedStudent.imageUrl
                                    ? `http://localhost:8080/api/students/image/get/${selectedStudent.id}`
                                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            }
                            className="w-28 h-28 md:w-32 md:h-32 rounded-full border"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm md:text-base">
                            <p><b>Name :</b> {selectedStudent.studName}</p>
                            <p><b>Roll :</b> {selectedStudent.studRollNo}</p>
                            <p><b>Email :</b> {selectedStudent.email}</p>
                            <p><b>Phone :</b> {selectedStudent.studPhoneNumber}</p>
                            <p><b>Class :</b> {selectedStudent.classNumber}</p>
                        </div>

                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">

                        <button onClick={() => handleEdit(selectedStudent)} className="bg-yellow-500 text-white px-3 py-2 rounded">
                            Edit
                        </button>

                        <button onClick={() => downloadIDCard(selectedStudent)} className="bg-green-600 text-white px-3 py-2 rounded">
                            ID Card
                        </button>

                        <button onClick={() => setSelectedStudent(null)} className="bg-gray-500 text-white px-3 py-2 rounded">
                            Close
                        </button>

                    </div>

                </div>
            )}

            {/* EDIT */}
            {editingStudent && (
                <form onSubmit={updateStudent} className="mb-6 p-4 border grid grid-cols-1 md:grid-cols-2 gap-4">

                    <h3 className="col-span-full text-lg font-bold">
                        Edit Student
                    </h3>

                    <input name="studName" value={editingStudent.studName} onChange={handleChange} className="border p-2 rounded" placeholder="Name" />
                    <input name="email" value={editingStudent.email} onChange={handleChange} className="border p-2 rounded" placeholder="Email" />
                    <input name="studPhoneNumber" value={editingStudent.studPhoneNumber} onChange={handleChange} className="border p-2 rounded" placeholder="Phone" />
                    <input name="studRollNo" value={editingStudent.studRollNo} onChange={handleChange} className="border p-2 rounded" placeholder="Roll" />
                    <input name="classNumber" value={editingStudent.classNumber} onChange={handleChange} className="border p-2 rounded" placeholder="Class" />

                    <input type="file" onChange={handleImageChange} className="col-span-full" />

                    <button className="bg-green-600 text-white p-2 rounded col-span-full">
                        Update Student
                    </button>

                </form>
            )}

            {/* TABLE */}
            <div className="overflow-x-auto">

                <table className="min-w-full border text-sm md:text-base">

                    <thead>
                        <tr className="bg-gray-200 text-center">
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Roll</th>
                            <th>Class</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentStudents.map((s, index) => (
                            <tr key={s.id} className="text-center hover:bg-gray-100">

                                <td>{indexOfFirst + index + 1}</td>

                                <td>
                                    <img
                                        src={
                                            s.imageUrl
                                                ? `http://localhost:8080/api/students/image/get/${s.id}`
                                                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                        }
                                        className="w-10 h-10 md:w-12 md:h-12 rounded-full mx-auto"
                                    />
                                </td>

                                <td>{s.studName}</td>
                                <td className="truncate max-w-[120px]">{s.email}</td>
                                <td>{s.studPhoneNumber}</td>
                                <td>{s.studRollNo}</td>
                                <td>{s.classNumber}</td>

                                <td className="flex flex-wrap justify-center gap-1 p-2">
                                    <button onClick={() => handleProfile(s)} className="bg-blue-500 text-white px-2 py-1 rounded text-xs md:text-sm">Profile</button>
                                    <button onClick={() => handleEdit(s)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs md:text-sm">Edit</button>
                                    <button onClick={() => deleteStudent(s.id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs md:text-sm">Delete</button>
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>

            {/* PAGINATION */}
            <div className="mt-4 flex flex-wrap gap-2">

                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`border px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""}`}
                    >
                        {i + 1}
                    </button>
                ))}

            </div>

        </div>
    );
}