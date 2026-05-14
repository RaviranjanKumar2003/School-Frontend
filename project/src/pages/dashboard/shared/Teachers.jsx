import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BASE_URL = "http://localhost:8080/api/professors";

export default function Teachers() {

    const [schoolClasses, setSchoolClasses] = useState([]);

    const [updateAssignments, setUpdateAssignments] = useState(true);

    const [userData, setUserData] = useState(null);

    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState("");

    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [editingTeacher, setEditingTeacher] = useState(null);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const teachersPerPage = 5;

    const [showIDCard, setShowIDCard] = useState(false);
    const [cardTeacher, setCardTeacher] = useState(null);

    const cardRef = useRef();



    const fetchSchoolClasses = async () => {
    try {
        const res = await axios.get(
            `http://localhost:8080/api/classes?schoolId=${userData.schoolId}`
        );

        setSchoolClasses(res.data);

    } catch (err) {
        console.log(err);
    }
};


useEffect(() => {
    if (updateAssignments) {
        fetchSchoolClasses();
    }
}, [updateAssignments]);

const isChecked = (classId, subjectName) => {  // cls
  
    return editingTeacher?.assignments?.some((a) =>

        String(a.classId) === String(classId) &&

        String(a.subjectName).trim().toLowerCase() ===
        String(subjectName).trim().toLowerCase()
    );
};
 // ================================================ FETCH Teachers ===================================
    const fetchTeachers = useCallback(async () => {
    try {

        const role = localStorage.getItem("userRole")?.toLowerCase();

        if (!userData?.id || !userData?.schoolId) {
            console.log("❌ Missing userData:", userData);
            return;
        }

        let res;

        if (role === "hod") {

            const schoolId = userData.schoolId;
            const hodId = userData.id;

            if (!schoolId || !hodId) {
                console.log("❌ Invalid IDs:", { schoolId, hodId });
                return;
            }

            res = await axios.get(
                `${BASE_URL}/by-hod/${schoolId}/${hodId}`
            );
        }

        else if (role === "schooladmin") {
            res = await axios.get(
                `${BASE_URL}/by-school/${userData.schoolId}`
            );
        }

        else {
            res = await axios.get(BASE_URL);
        }

        setTeachers(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
        console.log("Fetch error:", err);
        setTeachers([]);
    }
}, [userData]);

   useEffect(() => {
    if (userData) {
        fetchTeachers();
    }
}, [userData, fetchTeachers]);

    // ================= DELETE =================
    const deleteTeacher = async (id) => {

        if (!window.confirm("Delete this teacher?")) return;

        try {

            await axios.delete(`${BASE_URL}/${id}`);

            fetchTeachers();

        } catch (err) {

            console.log(err);

            alert("Delete failed");
        }
    };

    // ================= PROFILE =================
    const handleProfile = (teacher) => {

        setSelectedTeacher(teacher);

        setEditingTeacher(null);
    };

    // ================= EDIT =================
    const handleEdit = (teacher) => {

        setEditingTeacher({
            id: teacher.id,
            schoolCode: teacher.schoolCode || "",
            name: teacher.name || "",
            email: teacher.email || "",
            phone: teacher.phone || "",
            hodId: teacher.hodId || "",
            designation: teacher.designation || "",
            qualification: teacher.qualification || "",
            experience: teacher.experience || "",
            joiningDate: teacher.joiningDate || "",
            assignments: teacher.assignments || []
        });

        setSelectedTeacher(null);

        setImage(null);

        setPreview(null);
    };

    const handleChange = (e) => {

        setEditingTeacher({
            ...editingTeacher,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        setImage(file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };


    // ======================================== USEEFFECT 
       useEffect(() => {

    const role = localStorage.getItem("userRole")?.toLowerCase();

    if (role === "hod") {

        const hodData = JSON.parse(localStorage.getItem("hodData"));

        console.log("🔥 HOD DATA:", hodData);

        setUserData({
            id: hodData?.id,
            schoolId: hodData?.school?.id,
            schoolName: hodData?.school?.schoolName
        });
    }

    else if (role === "schooladmin") {

        const schoolAdminData = JSON.parse(
            localStorage.getItem("schoolAdminData")
        );

        console.log("🔥 SCHOOL ADMIN DATA:", schoolAdminData);

        setUserData({
            id: schoolAdminData?.id,
            schoolId: schoolAdminData?.schoolId,
            schoolName: schoolAdminData?.schoolName
        });
    }

    else if (role === "professor") {

        const professorData = JSON.parse(
            localStorage.getItem("professorData")
        );

        setUserData(professorData);
    }

    else if (role === "student") {

        const studentData = JSON.parse(
            localStorage.getItem("studentData")
        );

        setUserData(studentData);
    }

}, []);

    // ================= UPDATE =================
    const updateTeacher = async (e) => {
    e.preventDefault();

    try {
        if (!editingTeacher?.id) {
            alert("Teacher ID missing");
            return;
        }

        if (!userData?.schoolId) {
            alert("School ID missing");
            return;
        }

        const formData = new FormData();

        // ================= BASIC FIELDS =================
        formData.append("name", editingTeacher?.name || "");
        formData.append("email", editingTeacher?.email || "");
        formData.append("phone", editingTeacher?.phone || "");
        formData.append("designation", editingTeacher?.designation || "");
        formData.append("qualification", editingTeacher?.qualification || "");
        formData.append("experience", editingTeacher?.experience || "");
        formData.append("joiningDate", editingTeacher?.joiningDate || "");

        // ================= IDs =================
        formData.append("schoolId", userData?.schoolId);

        const hodIdFinal = editingTeacher?.hodId || userData?.id;

        if (!hodIdFinal) {
            alert("HOD ID missing");
            return;
        }

        formData.append("hodId", hodIdFinal);

        // ================= ⭐ NEW FLAG (IMPORTANT) =================
        const updateAssignments = editingTeacher?.updateAssignments ?? true;

        formData.append("updateAssignments", updateAssignments);

        // ================= ASSIGNMENTS =================
        const assignments =
    Array.isArray(editingTeacher?.assignments)
        ? editingTeacher.assignments
        : [];

// ✅ CLEAN PAYLOAD
const cleanedAssignments = assignments.map(a => ({
    classId: a.classId,
    className: a.className,
    subjectName: a.subjectName
}));

formData.append(
    "assignments",
    JSON.stringify(cleanedAssignments)
);

        // ================= IMAGE =================
        if (image instanceof File) {
            formData.append("image", image);
        }

        // ================= DEBUG =================
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        // ================= API CALL =================
        const res = await axios.put(
            `${BASE_URL}/${editingTeacher.id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        alert("✅ Updated Successfully");

        setEditingTeacher(null);
        setImage(null);
        setPreview(null);

        fetchTeachers();

    } catch (err) {
        console.log("UPDATE ERROR:", err?.response?.data || err);
        alert("❌ Update failed (check console)");
    }
};

    // ================= SEARCH =================
    const safeTeachers = Array.isArray(teachers) ? teachers : [];

const filteredTeachers = safeTeachers.filter((t) =>
    t?.name?.toLowerCase().includes(search.toLowerCase()) ||
    t?.email?.toLowerCase().includes(search.toLowerCase())
);

    // ================= PAGINATION =================
    const indexOfLastTeacher = currentPage * teachersPerPage;

    const indexOfFirstTeacher =
        indexOfLastTeacher - teachersPerPage;

    const currentTeachers = filteredTeachers.slice(
        indexOfFirstTeacher,
        indexOfLastTeacher
    );

    const totalPages = Math.ceil(
        filteredTeachers.length / teachersPerPage
    );

    // ================= OPEN ID CARD =================
    const openIDCard = (teacher) => {

        setCardTeacher(teacher);

        setShowIDCard(true);
    };

    // ================= DOWNLOAD ID CARD =================
    const downloadIDCard = async () => {

        const canvas = await html2canvas(cardRef.current, {
            useCORS: true,
            scale: 3
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("landscape", "mm", [86, 54]);

        pdf.addImage(imgData, "PNG", 0, 0, 86, 54);

        pdf.save(`${cardTeacher.name}_Teacher_ID_Card.pdf`);
    };

    // ================= ASSIGNMENT RENDER =================
    const renderAssignments = (assignments) => {

        if (!assignments || assignments.length === 0) {
            return <p>No Assignments</p>;
        }

        const grouped = assignments.reduce((acc, item) => {

            const className =
                item.className ||
                item.classNumber ||
                "N/A";

            const subjectName =
                item.subjectName ||
                item.subject ||
                "N/A";

            if (!acc[className]) {
                acc[className] = [];
            }

            if (!acc[className].includes(subjectName)) {
                acc[className].push(subjectName);
            }

            return acc;

        }, {});

        return Object.entries(grouped).map(
            ([className, subjects], index) => (

                <p key={index}>
                    <span className="font-bold">
                        {className}
                    </span>
                    {" - "}
                    {subjects.join(", ")}
                </p>
            )
        );
    };

    return (

        <div className="p-4 md:p-6 bg-gray-100 min-h-screen">

            {/* ================= HEADER ================= */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Teachers ({teachers.length})
                </h2>

                <input
                    type="text"
                    placeholder="Search teacher..."
                    className="border p-3 w-full md:w-80 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />

            </div>

            {/* ================= PROFILE ================= */}
            {selectedTeacher && (

                <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">

                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Teacher Profile
                    </h2>

                    <div className="flex flex-col md:flex-row gap-6 items-center">

                        <img
                            src={`${BASE_URL}/image/get/${selectedTeacher.id}`}
                            className="w-36 h-36 rounded-full border-4 border-blue-600 shadow-lg object-cover"
                            crossOrigin="anonymous"
                            onError={(e) => {
                                e.target.src =
                                    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                            }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-sm md:text-base">

                            <p>
                                <b>Name :</b> {selectedTeacher.name}
                            </p>

                            <p>
                                <b>Email :</b> {selectedTeacher.email}
                            </p>

                            <p>
                                <b>Phone :</b> {selectedTeacher.phone}
                            </p>

                            <p>
                                <b>Designation :</b>{" "}
                                {selectedTeacher.designation}
                            </p>

                            <p>
                                <b>Qualification :</b>{" "}
                                {selectedTeacher?.qualification || "N/A"}
                            </p>

                            <p>
                                <b>Experience :</b>{" "}
                                {selectedTeacher?.experience || "N/A"}
                            </p>

                            <p>
                                <b>Joining :</b>{" "}
                                {selectedTeacher.joiningDate}
                            </p>

                            {/* SUBJECTS & CLASSES */}
                            <div className="pb-4 text-xs">

                                <h3 className="font-bold text-sm mb-2 border-b border-gray-300">
                                    Assigned Classes & Subjects
                                </h3>

                                <div className="space-y-1">
                                    {renderAssignments(
                                        selectedTeacher.assignments
                                    )}
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">

                        <button
                            onClick={() => handleEdit(selectedTeacher)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-xl"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => openIDCard(selectedTeacher)}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl"
                        >
                            View ID Card
                        </button>

                        <button
                            onClick={() => setSelectedTeacher(null)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-xl"
                        >
                            Close
                        </button>

                    </div>

                </div>
            )}

            {/* ================= EDIT FORM ================= */}
            {editingTeacher && (
                

    <form
        onSubmit={updateTeacher}
        className="bg-white rounded-3xl shadow-xl p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
    >

        <h2 className="col-span-full text-2xl font-bold text-gray-700">
            Edit Teacher
        </h2>

        {/* ================= IMAGE PREVIEW ================= */}
        <div className="md:col-span-2 flex justify-center">

            <img
                src={
                    preview
                        ? preview
                        : `${BASE_URL}/image/get/${editingTeacher.id}`
                }
                className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                    e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                }}
            />

        </div>
        <input
            type="file"
            onChange={handleImageChange}
            className="md:col-span-2"
        />

        {/* ================= BASIC FIELDS ================= */}
        <input
            name="name"
            value={editingTeacher.name || ""}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            placeholder="Teacher Name"
        />

        <input
            name="email"
            value={editingTeacher.email || ""}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            placeholder="Email"
        />

        <input
            name="phone"
            value={editingTeacher.phone || ""}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            placeholder="Phone"
        />

        <input
            name="designation"
            value={editingTeacher.designation || ""}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            placeholder="Designation"
        />

        <input
            name="qualification"
            value={editingTeacher.qualification || ""}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            placeholder="Qualification"
        />

        <input
            name="experience"
            value={editingTeacher.experience || ""}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            placeholder="Experience"
        />

        <input
            type="date"
            name="joiningDate"
            value={editingTeacher.joiningDate || ""}
            onChange={handleChange}
            className="border p-3 rounded-xl"
        />

        {/* ================= IMAGE ================= */}
        

        {/* ================= ⭐ TOGGLE SWITCH ================= */}
<div className="md:col-span-2 flex items-center justify-between bg-gray-100 p-4 rounded-xl">

    <span className="font-medium text-gray-700">
        Update Assignments
    </span>

    <button
        type="button"
        onClick={() => setUpdateAssignments(!updateAssignments)}
        className={`px-4 py-2 rounded-full font-semibold transition ${
            updateAssignments
                ? "bg-green-600 text-white"
                : "bg-red-500 text-white"
        }`}
    >
        {updateAssignments ? "ON" : "OFF"}
    </button>

</div>

{/* ================= ASSIGNMENTS SHOW  subjectId ================= */}
{updateAssignments && (
    <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border">

        <h3 className="font-bold mb-3 text-gray-700">
            Manage Class & Subject Assignments
        </h3>

        {schoolClasses.map((cls) => (

            <div key={cls.id} className="mb-5 border p-3 rounded-xl bg-white">

                {/* CLASS NAME */}
                <div className="flex items-center gap-2 mb-2">

    {/* CLASS CHECKBOX */}
    <input
        type="checkbox"
        checked={editingTeacher?.assignments?.some(
    (a) => String(a.classId) === String(cls.id)
)}
        onChange={(e) => {

            let updated = [...(editingTeacher?.assignments || [])];

            if (e.target.checked) {

                // ➕ ADD ALL SUBJECTS OF CLASS
                cls.subjects.forEach((sub) => {

                    const exists = updated.some(
                        (a) =>
                            String(a.classId) === String(cls.id)
                    );

                    if (!exists) {
                        updated.push({
                            classId: cls.id,
                            className: cls.className,
                            subjectName: sub.subjectName
                        });
                    }
                });

            } else {

                // ❌ REMOVE ALL SUBJECTS OF CLASS
                updated = updated.filter(
                    (a) => String(a.classId) !== String(cls.id)
                );
            }

            setEditingTeacher({
                ...editingTeacher,
                assignments: updated
            });
        }}
    />

    {/* CLASS NAME */}
    <h4 className="font-bold text-blue-700">
        {cls.className}
    </h4>

</div>

                {/* SUBJECTS */}
                <div className="flex flex-wrap gap-2">

                    {cls.subjects.map((sub) => (

                        <label
                            key={sub.id}
                            className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${
                                isChecked(cls.id, sub.subjectName)
                                    ? "bg-green-100 border-green-500"
                                    : "bg-gray-100"
                            }`}
                        >

                            <input
                                type="checkbox"
                                checked={isChecked(cls.id, sub.subjectName)}
                                onChange={(e) => {

                                    let updated = [...(editingTeacher.assignments || [])];

                                    if (e.target.checked) {
                                        // ➕ ADD
                                        updated.push({
                                            classId: cls.id,
                                            className: cls.className,
                                            subjectName: sub.subjectName
                                        });
                                    } else {
                                        // ❌ REMOVE
                                        updated = updated.filter(
    (a) =>
        !(
            String(a.classId) === String(cls.id) &&
            String(a.subjectName).trim().toLowerCase() ===
            String(sub.subjectName).trim().toLowerCase()
        )
);
                                    }

                                    setEditingTeacher({
                                        ...editingTeacher,
                                        assignments: updated
                                    });
                                }}
                            />

                            {sub.subjectName}

                        </label>

                    ))}

                </div>

            </div>

        ))}

    </div>
)}

        {/* ================= SUBMIT ================= */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl md:col-span-2">
            Update Teacher
        </button>

    </form>
)}

            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto bg-white rounded-3xl shadow-xl">

                <table className="min-w-full text-sm md:text-base">

                    <thead>

                        <tr className="bg-blue-700 text-white">

                            <th className="p-4">#</th>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Designation</th>
                            <th className="p-4">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {currentTeachers.map((t, i) => (

                            <tr
                                key={t.id}
                                className="text-center border-b hover:bg-gray-50"
                            >

                                <td className="p-4">
                                    {indexOfFirstTeacher + i + 1}
                                </td>

                                <td className="p-4">

    <img
        src={
            t?.id
                ? `${BASE_URL}/image/get/${t.id}`
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        }
        className="sm:w-14 sm:h-14 rounded-full object-cover mx-auto border-2 border-blue-500"
        crossOrigin="anonymous"
        onError={(e) => {
            e.target.src =
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        }}
    />

</td>

                                <td className="p-4 font-semibold">
                                    {t.name}
                                </td>

                                <td className="p-4">
                                    {t.email}
                                </td>

                                <td className="p-4 text-blue-700 font-medium">
                                    {t.designation}
                                </td>

                                <td className="p-4 flex flex-wrap justify-center gap-2">

                                    <button
                                        onClick={() => handleProfile(t)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                                    >
                                        Profile
                                    </button>

                                    <button
                                        onClick={() => handleEdit(t)}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteTeacher(t.id)}
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
            <div className="flex justify-center flex-wrap gap-3 mt-6">

                {Array.from(
                    { length: totalPages },
                    (_, i) => (

                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`px-4 py-2 rounded-xl border font-semibold transition ${
                                currentPage === i + 1
                                    ? "bg-blue-600 text-white"
                                    : "bg-white hover:bg-gray-100"
                            }`}
                        >
                            {i + 1}
                        </button>

                    )
                )}

            </div>

            {/* ================= ID CARD ================= */}
            {showIDCard && cardTeacher && (

                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-3xl p-6 shadow-2xl">

                        <div
                            ref={cardRef}
                            className="w-[350px] min-h-[230px] rounded-3xl overflow-hidden relative shadow-2xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-700 text-white"
                        >

                            <div className="text-center py-3 border-b border-white/30">

                                <h1 className="text-2xl font-bold tracking-wide">
                                   {userData?.schoolName || "Your SCHOOL"}
                                </h1>

                                <p className="text-xs tracking-[4px]">
                                    TEACHER IDENTITY CARD
                                </p>

                            </div>

                            <div className="flex p-4 gap-4">

                                <img
                                    src={`${BASE_URL}/image/get/${cardTeacher.id}`}
                                    className="w-24 h-24 rounded-2xl border-4 border-white object-cover bg-white"
                                    crossOrigin="anonymous"
                                    onError={(e) => {
                                        e.target.src =
                                            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                                    }}
                                />

                                <div className="space-y-1 text-xs">

                                    <p>
                                        <span className="font-bold">
                                            Name :
                                        </span>{" "}
                                        {cardTeacher.name}
                                    </p>

                                    <p>
                                        <span className="font-bold">
                                            Designation :
                                        </span>{" "}
                                        {cardTeacher.designation}
                                    </p>

                                    <p>
                                        <span className="font-bold">
                                            Phone :
                                        </span>{" "}
                                        {cardTeacher.phone}
                                    </p>

                                    <p>
                                        <span className="font-bold">
                                            Joining :
                                        </span>{" "}
                                        {cardTeacher.joiningDate}
                                    </p>

                                </div>

                            </div>

                            <div className="px-4 pb-4 text-xs">

                                <h3 className="font-bold text-sm mb-2 border-b border-white/30 pb-1">
                                    Assigned Classes & Subjects
                                </h3>

                                <div className="space-y-1">
                                    {renderAssignments(
                                        cardTeacher.assignments
                                    )}
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full bg-black/20 text-center py-2 text-xs tracking-widest">
                                www.tgpcetschool.com
                            </div>
                        </div>
                        <div className="flex justify-center gap-4 mt-5">
                            <button
                                onClick={downloadIDCard}
                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl"
                            >
                                Download PDF
                            </button>
                            <button
                                onClick={() => setShowIDCard(false)}
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