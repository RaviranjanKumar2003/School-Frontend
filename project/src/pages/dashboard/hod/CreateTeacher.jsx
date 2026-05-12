import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function CreateTeacher() {

  const fileRef = useRef(null);

  // ================= HOD DATA =================
  const storedHod = JSON.parse(localStorage.getItem("hodData"));
  const schoolCodeFromHod = storedHod?.school?.schoolCode || "";
  const schoolIdFromHod = storedHod?.school?.id || null;

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
  const [selectedData, setSelectedData] = useState({});

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  // ================= AUTO FILL =================
  useEffect(() => {
    if (schoolCodeFromHod) {
      setForm(prev => ({
        ...prev,
        schoolCode: schoolCodeFromHod
      }));
    }
  }, [schoolCodeFromHod]);

  // ================= LOAD CLASSES =================
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

  // ================= CLASS TOGGLE =================
  const toggleClass = (className) => {
    setSelectedData(prev => {
      if (prev[className]) {
        const updated = { ...prev };
        delete updated[className];
        return updated;
      }
      return { ...prev, [className]: [] };
    });
  };

  // ================= SUBJECT TOGGLE =================
  const toggleSubject = (className, subject) => {
    setSelectedData(prev => {
      const subjects = prev[className] || [];

      if (subjects.includes(subject)) {
        return {
          ...prev,
          [className]: subjects.filter(s => s !== subject)
        };
      } else {
        return {
          ...prev,
          [className]: [...subjects, subject]
        };
      }
    });
  };

  // ================= CREATE =================
  const createTeacher = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {

      let finalAssignments = [];

      Object.entries(selectedData).forEach(([className, subjects]) => {

        if (!subjects || subjects.length === 0) return;

        const classObj = classes.find(c => c.className === className);
        if (!classObj) return;

        subjects.forEach(subject => {
          finalAssignments.push({
            classId: classObj.id,
            className,
            subjectName: subject
          });
        });

      });

      const hodId = localStorage.getItem("hodId");

      if (!hodId || !schoolIdFromHod) {
        setErrorMessage("HOD / School not found. Please login again.");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      formData.append("name", form.name || "");
      formData.append("email", form.email || "");
      formData.append("phone", form.phone || "");
      formData.append("designation", form.designation || "");
      formData.append("qualification", form.qualification || "");
      formData.append("experience", form.experience || "");
      formData.append("joiningDate", form.joiningDate || "");

      // 🔥 IMPORTANT FIX
      formData.append("schoolId", schoolIdFromHod);
      formData.append("schoolCode", schoolCodeFromHod);
      formData.append("hodId", hodId);

      formData.append("assignments", JSON.stringify(finalAssignments || []));

      if (image) formData.append("image", image);

      const res = await axios.post(
        "http://localhost:8080/api/professors",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setCredentials(res.data);
      setShowPopup(true);

      // RESET
      setForm({
        schoolCode: schoolCodeFromHod,
        name: "",
        email: "",
        phone: "",
        designation: "",
        qualification: "",
        experience: "",
        joiningDate: ""
      });

      setSelectedData({});
      setImage(null);
      setPreview(null);

      if (fileRef.current) fileRef.current.value = "";

    } catch (err) {
      console.log(err);
      setErrorMessage(
        err?.response?.data?.message || "Teacher creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">

      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        Create Teacher 👨‍🏫
      </h2>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
          {errorMessage}
        </div>
      )}

      <form onSubmit={createTeacher} className="bg-white p-5 rounded-xl shadow space-y-4">

        {/* BASIC DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {Object.keys(form).map(key => (
            <div key={key} className="flex flex-col">

              <label className="text-sm text-gray-600 mb-1">{key}</label>

              <input
                name={key}
                type={key === "joiningDate" ? "date" : "text"}
                value={form[key]}
                onChange={handleChange}
                className="border p-2 rounded"
                required
                readOnly={key === "schoolCode"}
              />

            </div>
          ))}

        </div>

        {/* CLASS + SUBJECT */}
        <div>
          <h3 className="font-semibold mb-2">Assign Classes & Subjects</h3>

          {classes.map(cls => (
            <div key={cls.id} className="border rounded p-3 mb-2">

              <label className="flex gap-2 font-semibold">
                <input
                  type="checkbox"
                  checked={!!selectedData[cls.className]}
                  onChange={() => toggleClass(cls.className)}
                />
                {cls.className}
              </label>

              {selectedData[cls.className] && (
                <div className="flex flex-wrap gap-2 mt-2">

                  {cls.subjects.map(sub => (
                    <label key={sub.id} className="flex gap-1 bg-gray-100 px-2 py-1 rounded">

                      <input
                        type="checkbox"
                        checked={selectedData[cls.className]?.includes(sub.subjectName)}
                        onChange={() =>
                          toggleSubject(cls.className, sub.subjectName)
                        }
                      />

                      {sub.subjectName}

                    </label>
                  ))}

                </div>
              )}

            </div>
          ))}
        </div>

        {/* IMAGE */}
        <input type="file" ref={fileRef} onChange={handleImage} />

        {preview && (
          <img src={preview} className="w-24 h-24 rounded-full object-cover" />
        )}

        <button
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded w-full"
        >
          {loading ? "Creating..." : "Create Teacher"}
        </button>

      </form>

      {/* ================= POPUP (UNCHANGED UI) ================= */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-[popup_0.3s_ease]">

            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-center text-white">

              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                <span className="text-4xl">🎉</span>
              </div>

              <h2 className="text-2xl font-extrabold">
                Teacher Created Successfully
              </h2>

              <p className="text-blue-100 mt-2 text-sm">
                Login credentials generated successfully
              </p>

            </div>

            <div className="p-6">

              <div className="bg-blue-50 p-4 rounded-xl mb-4">
                <p className="text-xs text-blue-500 font-bold">Username</p>
                <p className="font-bold">{credentials.username}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-xs text-purple-500 font-bold">Password</p>
                <p className="font-bold">{credentials.password}</p>
              </div>

              <button
                onClick={() => setShowPopup(false)}
                className="mt-6 w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
              >
                Continue
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}