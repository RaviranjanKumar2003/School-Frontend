import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/professors";

export default function Teachers() {

    const [teachers, setTeachers] = useState([]);
    const [search, setSearch] = useState("");

    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [editingTeacher, setEditingTeacher] = useState(null);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    // ================= FETCH =================
    const fetchTeachers = useCallback(async () => {
        try {
            const res = await axios.get(BASE_URL);
            setTeachers(res.data);
        } catch (err) {
            console.log("Fetch error:", err);
        }
    }, []);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

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
            name: teacher.name || "",
            email: teacher.email || "",
            phone: teacher.phone || "",
            designation: teacher.designation || "",
            qualification: teacher.qualification || "",
            experience: teacher.experience || "",
            joiningDate: teacher.joiningDate || ""
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

    // ================= UPDATE =================
    const updateTeacher = async (e) => {
    e.preventDefault();

    try {
        const formData = new FormData();

        // ✅ REQUIRED FIELDS (VERY IMPORTANT)
        formData.append("schoolCode", editingTeacher.schoolCode || "SCHOOL-1");

        formData.append("name", editingTeacher.name);
        formData.append("email", editingTeacher.email);
        formData.append("phone", editingTeacher.phone);
        formData.append("designation", editingTeacher.designation);
        formData.append("qualification", editingTeacher.qualification);
        formData.append("experience", editingTeacher.experience);
        formData.append("joiningDate", editingTeacher.joiningDate);

        // ✅ IMPORTANT FIX FOR 400 ERROR
        formData.append(
            "assignments",
            JSON.stringify(editingTeacher.assignments || [])
        );

        // image optional
        if (image) {
            formData.append("image", image);
        }

        await axios.put(`${BASE_URL}/${editingTeacher.id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        alert("✅ Updated Successfully");

        setEditingTeacher(null);
        setImage(null);
        setPreview(null);

        fetchTeachers();

    } catch (err) {
        console.log(err);
        alert("❌ Update failed");
    }
};

    // ================= SEARCH =================
    const filteredTeachers = teachers.filter(
        (t) =>
            t.name?.toLowerCase().includes(search.toLowerCase()) ||
            t.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-3 md:p-6">

            {/* HEADER */}
            <h2 className="text-xl md:text-2xl font-bold mb-3">
                Teachers ({teachers.length})
            </h2>

            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search teacher..."
                className="border p-2 mb-4 w-full md:w-80 rounded"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* ================= PROFILE CARD ================= */}
            {selectedTeacher && (
                <div className="bg-white p-4 rounded shadow mb-4">

                    <div className="flex flex-col md:flex-row gap-4">

                        <img
                            src={`${BASE_URL}/image/get/${selectedTeacher.id}`}
                            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border mx-auto md:mx-0"
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150";
                            }}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm md:text-base">
                            <p><b>Name:</b> {selectedTeacher.name}</p>
                            <p><b>Email:</b> {selectedTeacher.email}</p>
                            <p><b>Phone:</b> {selectedTeacher.phone}</p>
                            <p><b>Designation:</b> {selectedTeacher.designation}</p>
                            <p><b>Qualification:</b> {selectedTeacher.qualification}</p>
                            <p><b>Experience:</b> {selectedTeacher.experience}</p>
                            <p><b>Joining:</b> {selectedTeacher.joiningDate}</p>
                        </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={() => handleEdit(selectedTeacher)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => setSelectedTeacher(null)}
                            className="bg-gray-500 text-white px-3 py-1 rounded"
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
                    className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-2 gap-3"
                >

                    {Object.keys(editingTeacher).map((key) => (
                        key !== "id" && (
                            <input
                                key={key}
                                name={key}
                                value={editingTeacher[key]}
                                onChange={handleChange}
                                className="border p-2 rounded"
                                placeholder={key}
                            />
                        )
                    ))}

                    <input type="file" onChange={handleImageChange} className="md:col-span-2" />

                    <div className="md:col-span-2 flex justify-center">
                        <img
                            src={
                                preview
                                    ? preview
                                    : `${BASE_URL}/image/get/${editingTeacher.id}`
                            }
                            className="w-24 h-24 rounded-full border"
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150";
                            }}
                        />
                    </div>

                    <button className="bg-blue-600 text-white py-2 rounded md:col-span-2">
                        Update Teacher
                    </button>

                </form>
            )}

            {/* ================= TABLE ================= */}
            <div className="overflow-x-auto">

                <table className="w-full border text-center text-sm md:text-base">

                    <thead>
                        <tr className="bg-gray-200">
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTeachers.map((t, i) => (
                            <tr key={t.id} className="border">

                                <td>{i + 1}</td>

                                {/* IMAGE FIXED */}
                                <td>
                                    <img
                                        src={`${BASE_URL}/image/get/${t.id}`}
                                        className="w-10 h-10 rounded-full mx-auto object-cover"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/100";
                                        }}
                                    />
                                </td>

                                <td>{t.name}</td>
                                <td>{t.email}</td>

                                <td className="space-x-1 md:space-x-2">

                                    <button
                                        onClick={() => handleProfile(t)}
                                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs md:text-sm"
                                    >
                                        Profile
                                    </button>

                                    <button
                                        onClick={() => handleEdit(t)}
                                        className="bg-yellow-500 text-white px-2 py-1 rounded text-xs md:text-sm"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteTeacher(t.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded text-xs md:text-sm"
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

        </div>
    );
}