import { useState, useRef } from "react";
import axios from "axios";

export default function CreateTeacher() {

    const fileRef = useRef(null);

    const [form, setForm] = useState({
        schoolCode: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        subject: "",
        designation: "",
        qualification: "",
        experience: "",
        joiningDate: ""
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [showPopup, setShowPopup] = useState(false);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // ================= HANDLE INPUT =================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ================= HANDLE IMAGE =================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);

        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    // ================= CREATE TEACHER =================
    const createTeacher = async (e) => {

        e.preventDefault();
        setLoading(true);

        try {

            const formData = new FormData();

            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });

            if (image) {
                formData.append("image", image);
            }

            const res = await axios.post(
                "http://localhost:8080/api/professors/createTeacher",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setCredentials({
                username: res.data.username,
                password: res.data.password
            });

            setShowPopup(true);
            setErrorMessage("");

            // RESET FORM
            setForm({
                schoolCode: "",
                name: "",
                email: "",
                phone: "",
                department: "",
                subject: "",
                designation: "",
                qualification: "",
                experience: "",
                joiningDate: ""
            });

            setImage(null);
            setPreview(null);

            if (fileRef.current) {
                fileRef.current.value = "";
            }

        } catch (err) {
            console.log(err);
            setErrorMessage("❌ Teacher creation failed. Check backend or API.");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="p-4 md:p-6">

            <h2 className="text-2xl font-bold mb-6 text-blue-600">
                Create Teacher 👨‍🏫
            </h2>

            {errorMessage && (
                <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
                    {errorMessage}
                </div>
            )}

            <form
                onSubmit={createTeacher}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl shadow"
            >

                {Object.keys(form).map((key) => (
                    <input
                        key={key}
                        name={key}
                        type={key === "joiningDate" ? "date" : "text"}
                        placeholder={key}
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={form[key]}
                        onChange={handleChange}
                        required
                    />
                ))}

                {/* IMAGE INPUT */}
                <div className="md:col-span-2">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileRef}
                        className="border p-2 rounded w-full"
                        onChange={handleImageChange}
                    />
                </div>

                {/* IMAGE PREVIEW */}
                {preview && (
                    <div className="md:col-span-2 flex justify-center">
                        <img
                            src={preview}
                            alt="preview"
                            className="w-32 h-32 object-cover rounded-full border shadow"
                        />
                    </div>
                )}

                {/* BUTTON */}
                <button
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded md:col-span-2 transition"
                >
                    {loading ? "Creating..." : "Create Teacher"}
                </button>

            </form>

            {/* SUCCESS POPUP */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">

                    <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96 animate-scaleIn">

                        <h3 className="text-xl font-bold text-green-600 mb-4 text-center">
                            🎉 Teacher Created Successfully
                        </h3>

                        <div className="bg-gray-100 p-4 rounded mb-4 text-sm">

                            <p><strong>User ID :</strong> {credentials.username}</p>
                            <p><strong>Password :</strong> {credentials.password}</p>

                        </div>

                        <button
                            onClick={() => setShowPopup(false)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
                        >
                            OK
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}