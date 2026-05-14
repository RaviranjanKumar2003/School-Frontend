import { useEffect, useRef, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import JsBarcode from "jsbarcode";

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

    const barcodeRef = useRef();

    const studentsPerPage = 5;

    // ================= IMAGE URL =================
    const getStudentImage = (student) => {

    if (student?.id) {

        return `http://localhost:8080/api/students/image/get/${student.id}?t=${new Date().getTime()}`;
    }

    return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
   };

    // ================= FETCH STUDENTS =================
    const fetchStudents = async () => {

        try {

            const role =
                localStorage.getItem("userRole");

            let schoolId = null;

            // ================= HOD =================
            if (
                role?.toLowerCase() === "hod"
            ) {

                const hodData = JSON.parse(
                    localStorage.getItem("hodData")
                );

                schoolId =
                    hodData?.school?.id;
            }

            // ================= PROFESSOR =================
            else if (
                role?.toLowerCase() === "professor"
            ) {

                const professorData = JSON.parse(
                    localStorage.getItem("professorData")
                );

                schoolId =
                    professorData?.school?.id;
            }

            // ================= SCHOOL ADMIN =================
            else if (
                role?.toLowerCase() === "schooladmin"
            ) {

                const schoolData = JSON.parse(
                    localStorage.getItem("schoolAdminData")
                );

                schoolId =
                    schoolData?.schoolId;
            }

            const res = await axios.get(
                `http://localhost:8080/api/students/school/${schoolId}`
            );

            console.log(
                "STUDENT API RESPONSE :",
                res.data
            );

            setStudents(res.data || []);

        } catch (err) {

            console.log(
                "FETCH STUDENT ERROR :",
                err
            );
        }
    };

    useEffect(() => {

        fetchStudents();

    }, []);

    // ================= USER DATA =================
    useEffect(() => {

        const role =
            localStorage.getItem("userRole");

        if (
            role?.toLowerCase() === "hod"
        ) {

            const hodData = JSON.parse(
                localStorage.getItem("hodData")
            );

            setUserData(hodData);
        }

        else if (
            role?.toLowerCase() === "professor"
        ) {

            const professorData = JSON.parse(
                localStorage.getItem(
                    "professorData"
                )
            );

            setUserData(professorData);
        }

        else if (
            role?.toLowerCase() === "student"
        ) {

            const studentData = JSON.parse(
                localStorage.getItem(
                    "studentData"
                )
            );

            setUserData(studentData);
        }

        else if (
            role?.toLowerCase() ===
            "schooladmin"
        ) {

            const schoolAdminData =
                JSON.parse(
                    localStorage.getItem(
                        "schoolAdminData"
                    )
                );

            setUserData(
                schoolAdminData
            );
        }

    }, []);

    // ================= BARCODE =================
    useEffect(() => {

        if (
            showIDCard &&
            cardStudent &&
            barcodeRef.current
        ) {

            JsBarcode(
                barcodeRef.current,
                cardStudent.studentId || "000000",
                {
                    format: "CODE128",
                    lineColor: "#000",
                    width: 2,
                    height: 40,
                    displayValue: false,
                    margin: 0,
                }
            );
        }

    }, [showIDCard, cardStudent]);

    // ================= DELETE =================
    const deleteStudent = async (id) => {

        if (
            !window.confirm(
                "Delete this student?"
            )
        ) return;

        try {

            await axios.delete(
                `http://localhost:8080/api/students/${id}`
            );

            alert(
                "✅ Student Deleted Successfully"
            );

            fetchStudents();

        } catch (err) {

            console.log(err);

            alert("❌ Delete Failed");
        }
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

    // ================= CHANGE =================
    const handleChange = (e) => {

        setEditingStudent({
            ...editingStudent,
            [e.target.name]: e.target.value,
        });
    };

    // ================= IMAGE =================
    const handleImageChange = (e) => {

        setEditingStudent({
            ...editingStudent,
            image: e.target.files[0],
        });
    };

    // ================= UPDATE =================
const updateStudent = async (e) => {

    e.preventDefault();

    try {

        const formData = new FormData();

        // ================= STUDENT JSON =================
        const studentData = {

            studfirstName:
                editingStudent?.studfirstName || "",

            studlastName:
                editingStudent?.studlastName || "",

            studFatherName:
                editingStudent?.studFatherName || "",

            motherName:
                editingStudent?.motherName || "",

            email:
                editingStudent?.email || "",

            studPhoneNumber:
                editingStudent?.studPhoneNumber || "",

            gender:
                editingStudent?.gender || "",

            studentDob:
                editingStudent?.studentDob || "",

            bloodGroup:
                editingStudent?.bloodGroup || "",

            religion:
                editingStudent?.religion || "",

            studCategory:
                editingStudent?.studCategory || "",

            studCaste:
                editingStudent?.studCaste || "",

            className:
                editingStudent?.className || "",

            section:
                editingStudent?.section || "",

            studRollNo:
                editingStudent?.studRollNo || "",

            admissionDate:
                editingStudent?.admissionDate || "",

            address:
                editingStudent?.address || "",

            city:
                editingStudent?.city || "",

            state:
                editingStudent?.state || "",

            pincode:
                editingStudent?.pincode || "",

            nationality:
                editingStudent?.nationality || "",

            aadhaarNumber:
                editingStudent?.aadhaarNumber || "",

            fatherPhone:
                editingStudent?.fatherPhone || "",

            motherPhone:
                editingStudent?.motherPhone || "",

            status:
                editingStudent?.status || "ACTIVE",
        };

        // ================= IMPORTANT =================
        formData.append(
            "student",
            new Blob(
                [JSON.stringify(studentData)],
                {
                    type: "application/json",
                }
            )
        );

        // ================= IMAGE =================
        if (
            editingStudent?.image instanceof File
        ) {

            formData.append(
                "image",
                editingStudent.image
            );
        }

        // ================= API =================
        const response = await axios.put(

            `http://localhost:8080/api/students/update/${editingStudent.id}`,

            formData,

            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

        console.log(
            "UPDATE RESPONSE :",
            response.data
        );

        alert(
            "✅ Student Updated Successfully"
        );

        setEditingStudent(null);

        fetchStudents();

    } catch (err) {

        console.error(
            "UPDATE ERROR :",
            err.response?.data || err
        );

        alert(
            err.response?.data ||
            "❌ Update failed"
        );
    }
};

    // ================= SEARCH =================
    const filteredStudents =
        students.filter((s) => {

            const fullName =
                `${s.studfirstName || ""} ${s.studlastName || ""}`
                    .toLowerCase();

            return (

                fullName.includes(
                    search.toLowerCase()
                ) ||

                s.email
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||

                s.studentId
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||

                String(
                    s.studRollNo || ""
                ).includes(search)
            );
        });

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

            const canvas =
                await html2canvas(
                    cardRef.current,
                    {
                        useCORS: true,
                        allowTaint: true,
                        scale: 3,
                        backgroundColor: null,
                    }
                );

            const imgData =
                canvas.toDataURL(
                    "image/png"
                );

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
                `${cardStudent.studfirstName}_${cardStudent.studentId}.pdf`
            );

        } catch (error) {

            console.log(error);

            alert(
                "Failed to download ID Card"
            );
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

            {/* ================= PROFILE ================= */}
            {selectedStudent && (

                <div className="mb-6 bg-white rounded-3xl shadow-xl p-6">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-3xl font-bold text-gray-800">
                            Student Full Profile
                        </h2>

                        <button
                            onClick={() =>
                                openIDCard(selectedStudent)
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
                        >
                            View ID Card
                        </button>

                    </div>

                    <div className="flex flex-col lg:flex-row gap-10">

                        {/* IMAGE */}
                        <div className="flex flex-col items-center">

                            <img
                                src={getStudentImage(selectedStudent)}
                                alt="student"
                                onError={(e) => {
                                    e.target.src =
                                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                                }}
                                className="w-52 h-52 rounded-3xl object-cover border-4 border-blue-600 shadow-xl"
                            />

                            <div className="mt-4 text-center">

                                <h3 className="text-2xl font-bold text-gray-800">
                                    {selectedStudent.studfirstName} {selectedStudent.studlastName}
                                </h3>

                                <p className="text-blue-700 font-semibold">
                                    {selectedStudent.studentId}
                                </p>

                            </div>

                        </div>

                        {/* DETAILS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>First Name :</b> {selectedStudent.studfirstName}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Last Name :</b> {selectedStudent.studlastName}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Father Name :</b> {selectedStudent.studFatherName}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Mother Name :</b> {selectedStudent.motherName}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Email :</b> {selectedStudent.email}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Phone :</b> {selectedStudent.studPhoneNumber}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Gender :</b> {selectedStudent.gender}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>DOB :</b> {selectedStudent.studentDob}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Blood Group :</b> {selectedStudent.bloodGroup}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Religion :</b> {selectedStudent.religion}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Category :</b> {selectedStudent.studCategory}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Caste :</b> {selectedStudent.studCaste}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Class :</b> {selectedStudent.className}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Section :</b> {selectedStudent.section}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Roll No :</b> {selectedStudent.studRollNo}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p><b>Admission Date :</b> {selectedStudent.admissionDate}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl md:col-span-2">
                                <p><b>Address :</b> {selectedStudent.address}</p>
                            </div>

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
                                setSelectedStudent(null)
                            }
                            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl"
                        >
                            Close
                        </button>

                    </div>

                </div>
            )}

            {/* ================= EDIT FORM ================= */}
            {editingStudent && (

                <form
                    onSubmit={updateStudent}
                    className="mb-6 bg-white p-6 rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-2 gap-4"
                >

                    <h3 className="col-span-full text-2xl font-bold text-gray-700">
                        Edit Student
                    </h3>

                    <input
                        name="studfirstName"
                        value={editingStudent.studfirstName || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="First Name"
                    />

                    <input
                        name="studlastName"
                        value={editingStudent.studlastName || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Last Name"
                    />

                    <input
                        name="studFatherName"
                        value={editingStudent.studFatherName || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Father Name"
                    />

                    <input
                        name="motherName"
                        value={editingStudent.motherName || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Mother Name"
                    />

                    <input
                        name="email"
                        value={editingStudent.email || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Email"
                    />

                    <input
                        name="studPhoneNumber"
                        value={editingStudent.studPhoneNumber || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Phone"
                    />

                    <input
                        name="address"
                        value={editingStudent.address || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Address"
                    />

                    <input
                        name="city"
                        value={editingStudent.city || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="City"
                    />

                    <input
                        name="state"
                        value={editingStudent.state || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="State"
                    />

                    <input
                        name="pincode"
                        value={editingStudent.pincode || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Pincode"
                    />

                    <input
                        name="studRollNo"
                        value={editingStudent.studRollNo || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Roll No"
                    />

                    <input
                        name="className"
                        value={editingStudent.className || ""}
                        onChange={handleChange}
                        className="border p-3 rounded-xl"
                        placeholder="Class"
                    />

                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="col-span-full border p-3 rounded-xl"
                    />

                    <div className="col-span-full flex gap-4">

                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl">
                            Update Student
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setEditingStudent(null)
                            }
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl"
                        >
                            Cancel
                        </button>

                    </div>

                </form>
            )}

            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto bg-white rounded-3xl shadow-xl">

                <table className="min-w-full text-sm md:text-base">

                    <thead>

                        <tr className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white">

                            <th className="p-4">#</th>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Student ID</th>
                            <th className="p-4">Class</th>
                            <th className="p-4">Phone</th>
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
                                        src={getStudentImage(s)}
                                        alt="student"
                                        onError={(e) => {
                                            e.target.src =
                                                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                                        }}
                                        className="w-14 h-14 rounded-full mx-auto border-2 border-blue-400 object-cover"
                                    />

                                </td>

                                <td className="p-3 font-semibold">
                                    {s.studfirstName} {s.studlastName}
                                </td>

                                <td className="p-3 text-blue-700 font-bold">
                                    {s.studentId}
                                </td>

                                <td className="p-3">
                                    {s.className}
                                </td>

                                <td className="p-3">
                                    {s.studPhoneNumber}
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

            {/* ================= PAGINATION ================= */}
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

            {/* ================= ID CARD ================= */}
            {showIDCard && cardStudent && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-3xl p-6 shadow-2xl">

                        <div
                            ref={cardRef}
                            className="w-[340px] rounded-3xl overflow-hidden relative shadow-2xl text-white"
                            style={{
                                background:
                                    "linear-gradient(135deg,#1e3a8a,#312e81,#7c3aed)",
                            }}
                        >

                            {/* TOP */}
                            <div className="p-4 text-center">

                                <h1 className="text-xl font-bold">
                                    {userData?.schoolName || "TGP CET SCHOOL"}
                                </h1>

                                <p className="text-[11px] tracking-[3px]">
                                    STUDENT ID CARD
                                </p>

                            </div>

                            {/* BODY */}
                            <div className="px-4 flex gap-4 items-center">

                                <img
                                    src={getStudentImage(cardStudent)}
                                    alt="student"
                                    onError={(e) => {
                                        e.target.src =
                                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                                    }}
                                    className="w-24 h-24 rounded-2xl border-4 border-white object-cover"
                                />

                                <div className="text-sm leading-6">

                                    <p>
                                        <b>Name :</b>{" "}
                                        {cardStudent.studfirstName} {cardStudent.studlastName}
                                    </p>

                                    <p>
                                        <b>ID :</b>{" "}
                                        {cardStudent.studentId}
                                    </p>

                                    <p>
                                        <b>Class :</b>{" "}
                                        {cardStudent.className}
                                    </p>

                                    <p>
                                        <b>Roll :</b>{" "}
                                        {cardStudent.studRollNo}
                                    </p>

                                </div>

                            </div>

                            {/* BARCODE */}
                            <div className="bg-white mt-4 py-3 flex justify-center">

                                <svg ref={barcodeRef}></svg>

                            </div>

                            {/* FOOTER */}
                            <div className="bg-black/30 text-center py-2 text-xs">
                                Valid School Identity Card
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