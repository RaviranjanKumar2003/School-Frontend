import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function CreateTeacher() {

    const fileRef = useRef(null);

    const [form, setForm] = useState({
        schoolCode: "",
        name: "",
        email: "",
        phone: "",
        designation: "",
        qualification: "",
        experience: "",
        joiningDate: ""
    });

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [assignments, setAssignments] = useState([]);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8080/api/classes")
            .then(res => setClasses(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const toggleSubject = (subject) => {
        if (selectedSubjects.includes(subject)) {
            setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
        } else {
            setSelectedSubjects([...selectedSubjects, subject]);
        }
    };

    const addAssignment = () => {

        if (!selectedClass || selectedSubjects.length === 0) return;

        const exists = assignments.find(a => a.className === selectedClass);

        if (exists) {
            setAssignments(assignments.map(a =>
                a.className === selectedClass
                    ? { ...a, subjects: [...new Set([...a.subjects, ...selectedSubjects])] }
                    : a
            ));
        } else {
            setAssignments([
                ...assignments,
                { className: selectedClass, subjects: selectedSubjects }
            ]);
        }

        setSelectedClass("");
        setSelectedSubjects([]);
    };

    const createTeacher = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {

            let finalAssignments = [];

            assignments.forEach(a => {
                a.subjects.forEach(sub => {
                    finalAssignments.push({
                        className: a.className,
                        subjectName: sub
                    });
                });
            });

            const formData = new FormData();

            Object.keys(form).forEach(k => formData.append(k, form[k]));
            formData.append("assignments", JSON.stringify(finalAssignments));

            if (image) formData.append("image", image);

            const res = await axios.post(
                "http://localhost:8080/api/professors",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setCredentials(res.data);
            setShowPopup(true);

            setForm({
                schoolCode: "",
                name: "",
                email: "",
                phone: "",
                designation: "",
                qualification: "",
                experience: "",
                joiningDate: ""
            });

            setAssignments([]);
            setImage(null);
            setPreview(null);

            if (fileRef.current) fileRef.current.value = "";

        } catch (err) {
            setErrorMessage("Teacher creation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-3 sm:p-5 md:p-8 bg-gray-50 min-h-screen">

            {/* HEADER */}
            <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4">
                Create Teacher 👨‍🏫
            </h2>

            {errorMessage && (
                <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
                    {errorMessage}
                </div>
            )}

            {/* FORM CARD */}
            <form
                onSubmit={createTeacher}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md space-y-4"
            >

                {/* INPUT GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {Object.keys(form).map(key => (
                        <input
                            key={key}
                            name={key}
                            type={key === "joiningDate" ? "date" : "text"}
                            value={form[key]}
                            onChange={handleChange}
                            placeholder={key}
                            className="border p-2 rounded w-full text-sm sm:text-base"
                            required
                        />
                    ))}

                </div>

                {/* CLASS SELECT */}
                <div>
                    <label className="font-semibold text-sm sm:text-base">
                        Select Class
                    </label>

                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="border p-2 w-full rounded mt-1"
                    >
                        <option value="">-- Select Class --</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.className}>
                                {c.className}
                            </option>
                        ))}
                    </select>
                </div>

                {/* SUBJECTS */}
                {selectedClass && (
                    <div className="border rounded p-3 bg-gray-50">

                        <h4 className="font-semibold text-sm mb-2">
                            Subjects of {selectedClass}
                        </h4>

                        <div className="flex flex-wrap gap-2">

                            {classes
                                .find(c => c.className === selectedClass)
                                ?.subjects.map(sub => (
                                    <label
                                        key={sub.id}
                                        className="flex items-center gap-1 bg-white px-2 py-1 rounded border text-sm"
                                    >
                                        <input
                                            type="checkbox"
                                            onChange={() => toggleSubject(sub.subjectName)}
                                        />
                                        {sub.subjectName}
                                    </label>
                                ))}

                        </div>

                        <button
                            type="button"
                            onClick={addAssignment}
                            className="mt-3 bg-green-600 text-white px-3 py-1 rounded text-sm w-full sm:w-auto"
                        >
                            + Add Assignment
                        </button>

                    </div>
                )}

                {/* ASSIGNMENT PREVIEW */}
                <div>
                    <h4 className="font-semibold text-sm mb-2">Assigned Classes</h4>

                    <div className="space-y-2">

                        {assignments.map((a, i) => (
                            <div
                                key={i}
                                className="bg-blue-50 border p-2 rounded text-sm"
                            >
                                <b>{a.className}</b> → {a.subjects.join(", ")}
                            </div>
                        ))}

                    </div>
                </div>

                {/* IMAGE */}
                <div>
                    <input
                        type="file"
                        ref={fileRef}
                        onChange={handleImage}
                        className="w-full text-sm"
                    />
                </div>

                {preview && (
                    <div className="flex justify-center">
                        <img
                            src={preview}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border"
                        />
                    </div>
                )}

                {/* SUBMIT */}
                <button
                    disabled={loading}
                    className="bg-blue-600 text-white py-2 rounded w-full text-sm sm:text-base"
                >
                    {loading ? "Creating..." : "Create Teacher"}
                </button>

            </form>

            {/* POPUP */}
            {showPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">

                    <div className="bg-white p-5 rounded-lg w-full max-w-sm text-center">

                        <h3 className="text-green-600 font-bold mb-2">
                            Success 🎉
                        </h3>

                        <p className="text-sm">User: {credentials.username}</p>
                        <p className="text-sm">Pass: {credentials.password}</p>

                        <button
                            onClick={() => setShowPopup(false)}
                            className="mt-4 bg-green-600 text-white w-full py-2 rounded"
                        >
                            OK
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}