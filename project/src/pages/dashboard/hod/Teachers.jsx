import { useEffect, useState } from "react";
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
    const fetchTeachers = async () => {
        const res = await axios.get(BASE_URL);
        setTeachers(res.data);
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // ================= DELETE =================
    const deleteTeacher = async (id) => {
        if (!window.confirm("Delete teacher?")) return;

        await axios.delete(`${BASE_URL}/delete/${id}`);
        fetchTeachers();
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
            department: teacher.departmentName || "",
            subject: teacher.subject || "",
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

            formData.append("name", editingTeacher.name);
            formData.append("email", editingTeacher.email);
            formData.append("phone", editingTeacher.phone);
            formData.append("department", editingTeacher.department);
            formData.append("subject", editingTeacher.subject);
            formData.append("designation", editingTeacher.designation);
            formData.append("qualification", editingTeacher.qualification);
            formData.append("experience", editingTeacher.experience);
            formData.append("joiningDate", editingTeacher.joiningDate);

            if (image) {
                formData.append("image", image);
            }

            await axios.put(
                `${BASE_URL}/update/${editingTeacher.id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            alert("✅ Teacher updated successfully");

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
        <div className="p-6">

            <h2 className="text-2xl font-bold mb-4">
                Teachers ({teachers.length})
            </h2>

            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search teacher..."
                className="border p-2 mb-4 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* ================= PROFILE ================= */}
            {selectedTeacher && (
                <div className="bg-white p-6 rounded shadow mb-4">

                    <div className="flex gap-6">

                        <img
                            src={`${BASE_URL}/image/get/${selectedTeacher.id}`}
                            className="w-32 h-32 rounded-full object-cover border"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <p><b>Name:</b> {selectedTeacher.name}</p>
                            <p><b>Email:</b> {selectedTeacher.email}</p>
                            <p><b>Phone:</b> {selectedTeacher.phone}</p>
                            <p><b>Department:</b> {selectedTeacher.departmentName}</p>
                            <p><b>Subject:</b> {selectedTeacher.subject}</p>
                            <p><b>Designation:</b> {selectedTeacher.designation}</p>
                            <p><b>Qualification:</b> {selectedTeacher.qualification}</p>
                            <p><b>Experience:</b> {selectedTeacher.experience}</p>
                            <p><b>Joining Date:</b> {selectedTeacher.joiningDate}</p>
                        </div>
                    </div>

                    <div className="mt-4 space-x-2">
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
                    className="bg-white p-6 rounded shadow mb-4 grid grid-cols-2 gap-4"
                >

                    <input name="name" value={editingTeacher.name} onChange={handleChange} className="border p-2" placeholder="Name" />
                    <input name="email" value={editingTeacher.email} onChange={handleChange} className="border p-2" placeholder="Email" />
                    <input name="phone" value={editingTeacher.phone} onChange={handleChange} className="border p-2" placeholder="Phone" />
                    <input name="department" value={editingTeacher.department} onChange={handleChange} className="border p-2" placeholder="Department" />
                    <input name="subject" value={editingTeacher.subject} onChange={handleChange} className="border p-2" placeholder="Subject" />
                    <input name="designation" value={editingTeacher.designation} onChange={handleChange} className="border p-2" placeholder="Designation" />
                    <input name="qualification" value={editingTeacher.qualification} onChange={handleChange} className="border p-2" placeholder="Qualification" />
                    <input name="experience" value={editingTeacher.experience} onChange={handleChange} className="border p-2" placeholder="Experience" />
                    <input type="date" name="joiningDate" value={editingTeacher.joiningDate} onChange={handleChange} className="border p-2" />

                    {/* IMAGE */}
                    <input type="file" onChange={handleImageChange} className="col-span-2" />

                    {preview ? (
                        <img src={preview} className="w-24 h-24 rounded-full" />
                    ) : (
                        <img
                            src={`${BASE_URL}/image/get/${editingTeacher.id}`}
                            className="w-24 h-24 rounded-full"
                        />
                    )}

                    <button className="bg-blue-600 text-white py-2 col-span-2 rounded">
                        Update Teacher
                    </button>

                </form>
            )}

            {/* ================= TABLE ================= */}
            <table className="w-full border text-center">
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
                        <tr key={t.id}>
                            <td>{i + 1}</td>

                            <td>
                                <img
                                    src={`${BASE_URL}/image/get/${t.id}`}
                                    className="w-10 h-10 rounded-full mx-auto object-cover"
                                />
                            </td>

                            <td>{t.name}</td>
                            <td>{t.email}</td>

                            <td className="space-x-2">
                                <button
                                    onClick={() => handleProfile(t)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                >
                                    Profile
                                </button>

                                <button
                                    onClick={() => handleEdit(t)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteTeacher(t.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
}