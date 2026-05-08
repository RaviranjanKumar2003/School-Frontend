import { useEffect, useRef, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Students() {

    const [userData, setUserData] = useState(null);

    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [editingStudent, setEditingStudent] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // ================= ID CARD =================
    const [showIDCard, setShowIDCard] = useState(false);
    const [cardStudent, setCardStudent] = useState(null);

    const cardRef = useRef();

    const studentsPerPage = 5;

    // ================= FETCH =================
    const fetchStudents = async () => {

        try {

            const res = await axios.get(
                "http://localhost:8080/api/students"
            );

            const fixedData = res.data.map((s) => ({
                ...s,
                classNumber: Number(s.classNumber || 0),
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

        await axios.delete(
            `http://localhost:8080/api/students/${id}`
        );

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
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e) => {

        setEditingStudent({
            ...editingStudent,
            image: e.target.files[0],
        });
    };


    // ============================================= Use Effect 
       
       useEffect(() => {

    const role =
        localStorage.getItem("userRole");

    // ================= HOD =================
    if (role?.toLowerCase() === "hod") {

        const hodData =
            JSON.parse(localStorage.getItem("hodData"));

        setUserData(hodData);
    }

    // ================= PROFESSOR =================
    else if (
        role?.toLowerCase() === "professor"
    ) {

        const professorData =
            JSON.parse(
                localStorage.getItem("professorData")
            );

        setUserData(professorData);
    }

    // ================= STUDENT =================
    else if (
        role?.toLowerCase() === "student"
    ) {

        const studentData =
            JSON.parse(
                localStorage.getItem("studentData")
            );

        setUserData(studentData);
    }

}, []);

    // ================= UPDATE =================
    const updateStudent = async (e) => {

        e.preventDefault();

        try {

            const formData = new FormData();

            formData.append(
                "studName",
                editingStudent.studName || ""
            );

            formData.append(
                "email",
                editingStudent.email || ""
            );

            formData.append(
                "phone",
                editingStudent.studPhoneNumber || ""
            );

            formData.append(
                "classNumber",
                Number(editingStudent.classNumber || 0)
            );

            formData.append(
                "rollNo",
                Number(editingStudent.studRollNo || 0)
            );

            if (editingStudent.image instanceof File) {

                formData.append(
                    "image",
                    editingStudent.image
                );
            }

            await axios.put(
                `http://localhost:8080/api/students/update/${editingStudent.id}`,
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
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
    const filteredStudents = students.filter(
        (s) =>
            s.studName
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||

            s.email
                ?.toLowerCase()
                .includes(search.toLowerCase())
    );

    // ================= PAGINATION =================
    const indexOfLast =
        currentPage * studentsPerPage;

    const indexOfFirst =
        indexOfLast - studentsPerPage;

    const currentStudents =
        filteredStudents.slice(
            indexOfFirst,
            indexOfLast
        );

    const totalPages = Math.ceil(
        filteredStudents.length /
        studentsPerPage
    );

    // ================= OPEN ID CARD =================
    const openIDCard = (student) => {

        setCardStudent(student);

        setShowIDCard(true);
    };

    // ================= DOWNLOAD ID CARD =================
    const downloadIDCard = async () => {

        try {

            const canvas = await html2canvas(
                cardRef.current,
                {
                    useCORS: true,
                    allowTaint: true,
                    scale: 3,
                    backgroundColor: null,
                }
            );

            const imgData =
                canvas.toDataURL("image/png");

            const pdf = new jsPDF(
                "landscape",
                "mm",
                [86, 54]
            );

            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                86,
                54
            );

            pdf.save(
                `${cardStudent.studName, cardStudent.studLastName}_ID_Card.pdf`
            );

        } catch (error) {

            console.log(error);

            alert("Failed to download ID Card");
        }
    };

    return (

        <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Students ({students.length})
                </h2>

                <input
                    type="text"
                    placeholder="Search student..."
                    className="border p-3 w-full md:w-80 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />

            </div>

            {/* PROFILE */}
            {selectedStudent && (

                <div className="mb-6 bg-white rounded-3xl shadow-xl p-6">

                    <h2 className="text-2xl font-bold mb-5 text-gray-800">
                        Student Profile
                    </h2>

                    <div className="flex flex-col md:flex-row gap-8 items-center">

                        <img
                            crossOrigin="anonymous"
                            src={
                                selectedStudent.imageUrl
                                    ? `http://localhost:8080/api/students/image/get/${selectedStudent.id}`
                                    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            }
                            className="w-40 h-40 rounded-full border-4 border-blue-600 shadow-lg object-cover"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base w-full">

                            <p>
                                <b>Name :</b>{" "}
                                {selectedStudent.studName} {selectedStudent.studLastName}
                            </p>

                            <p>
                                <b>Roll :</b>{" "}
                                {selectedStudent.studRollNo}
                            </p>

                            <p>
                                <b>Email :</b>{" "}
                                {selectedStudent.email}
                            </p>

                            <p>
                                <b>Phone :</b>{" "}
                                {selectedStudent.studPhoneNumber}
                            </p>

                            <p>
                                <b>Class :</b>{" "}
                                {selectedStudent.className}
                            </p>

                            <p>
                                <b>Student ID :</b>{" "}
                                {selectedStudent.studentId}
                            </p>

                        </div>

                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">

                        <button
                            onClick={() =>
                                handleEdit(selectedStudent)
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() =>
                                openIDCard(selectedStudent)
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl"
                        >
                            View ID Card
                        </button>

                        <button
                            onClick={() =>
                                setSelectedStudent(null)
                            }
                            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl"
                        >
                            Close
                        </button>

                    </div>

                </div>
            )}

            {/* EDIT */}
            {editingStudent && (

                <form
                    onSubmit={updateStudent}
                    className="mb-6 bg-white p-6 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-4"
                >

                    <h3 className="col-span-full text-2xl font-bold text-gray-700">
                        Edit Student
                    </h3>

                    <input
                        name="studName"
                        value={editingStudent.studName}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Name"
                    />

                    <input
                        name="email"
                        value={editingStudent.email}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Email"
                    />

                    <input
                        name="studPhoneNumber"
                        value={editingStudent.studPhoneNumber}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Phone"
                    />

                    <input
                        name="studRollNo"
                        value={editingStudent.studRollNo}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Roll"
                    />

                    <input
                        name="classNumber"
                        value={editingStudent.classNumber}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Class"
                    />

                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="col-span-full"
                    />

                    <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl col-span-full">
                        Update Student
                    </button>

                </form>
            )}

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded-3xl shadow-xl">

                <table className="min-w-full text-sm md:text-base">

                    <thead>

                        <tr className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white">

                            <th className="p-4">#</th>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Roll</th>
                            <th className="p-4">Class</th>
                            <th className="p-4">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {currentStudents.map((s, index) => (

                            <tr
                                key={s.id}
                                className="text-center border-b hover:bg-blue-50 transition"
                            >

                                <td className="p-3">
                                    {indexOfFirst + index + 1}
                                </td>

                                <td className="p-3">

                                    <img
                                        crossOrigin="anonymous"
                                        src={
                                            s.imageUrl
                                                ? `http://localhost:8080/api/students/image/get/${s.id}`
                                                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                        }
                                        className="w-14 h-14 rounded-full mx-auto border-2 border-blue-400 object-cover"
                                    />

                                </td>

                                <td className="p-3 font-semibold">
                                   {s.studName} {s.studLastName}
                                </td>

                                <td className="p-3">
                                    {s.email}
                                </td>

                                <td className="p-3">
                                    {s.studPhoneNumber}
                                </td>

                                <td className="p-3">
                                    {s.studRollNo}
                                </td>

                                <td className="p-3 text-blue-700 font-bold">
                                    {s.className}
                                </td>

                                <td className="p-3 flex flex-wrap justify-center gap-2">

                                    <button
                                        onClick={() =>
                                            handleProfile(s)
                                        }
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                                    >
                                        Profile
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleEdit(s)
                                        }
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteStudent(s.id)
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* PAGINATION */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">

                {Array.from(
                    { length: totalPages },
                    (_, i) => (

                        <button
                            key={i}
                            onClick={() =>
                                setCurrentPage(i + 1)
                            }
                            className={`px-4 py-2 rounded-xl border font-semibold ${
                                currentPage === i + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-white"
                            }`}
                        >
                            {i + 1}
                        </button>

                    )
                )}

            </div>

            {/* ================= ID CARD MODAL ================= */}
            {showIDCard && cardStudent && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-3xl p-6 shadow-2xl">

                        {/* CARD */}
                        <div
                            ref={cardRef}
                            className="w-[340px] h-[210px] rounded-3xl overflow-hidden relative shadow-2xl"
                            style={{
                                background:
                                    "linear-gradient(135deg, #1e3a8a, #312e81, #7c3aed)",
                            }}
                        >

                            {/* CIRCLE DESIGN */}
                            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>

                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full"></div>

                            {/* HEADER */}
                            <div className="text-center pt-4 text-white">

                                <h1 className="text-2xl font-bold tracking-wide">
                                   {userData?.schoolName || "TGP CET SCHOOL"}
                                </h1>

                                <p className="text-[10px] tracking-[3px]">
                                    STUDENT IDENTITY CARD
                                </p>

                            </div>

                            {/* BODY */}
                            <div className="flex items-center gap-4 px-5 mt-4">

                                {/* IMAGE */}
                                <img
                                    crossOrigin="anonymous"
                                    src={
                                        cardStudent.imageUrl
                                            ? `http://localhost:8080/api/students/image/get/${cardStudent.id}`
                                            : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                    }
                                    className="w-24 h-24 rounded-2xl border-4 border-white object-cover shadow-lg"
                                />

                                {/* DETAILS */}
                                <div className="text-white text-sm leading-6">

                                    <p>
                                        <span className="font-bold">
                                            Name :
                                        </span>{" "}
                                        {cardStudent.studName} {cardStudent.studLastName}
                                    </p>

                                    <p>
                                        <span className="font-bold">
                                            Roll :
                                        </span>{" "}
                                        {cardStudent.studRollNo}
                                    </p>

                                    <p>
                                        <span className="font-bold">
                                            Class :
                                        </span>{" "}
                                        {cardStudent.className}
                                    </p>

                                    <p>
                                        <span className="font-bold">
                                            ID :
                                        </span>{" "}
                                        {cardStudent.studentId}
                                    </p>

                                </div>

                            </div>

                            {/* FOOTER */}
                            <div className="absolute bottom-0 left-0 w-full bg-black/20 py-2 text-center text-white text-[11px] tracking-wide">
                                www.tgpcetschool.com
                            </div>

                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-center gap-4 mt-6">

                            <button
                                onClick={downloadIDCard}
                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl"
                            >
                                Download PDF
                            </button>

                            <button
                                onClick={() =>
                                    setShowIDCard(false)
                                }
                                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}