import { useState, useEffect, useRef } from "react";
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
  const [selectedData, setSelectedData] = useState({});

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

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

    try {

      let finalAssignments = [];

      Object.entries(selectedData).forEach(([className, subjects]) => {

  if (!subjects || subjects.length === 0) return;

  // 🔥 FIND CLASS OBJECT
  const classObj = classes.find(c => c.className === className);

  if (!classObj) {
    console.error("❌ Class not found:", className);
    return;
  }

  subjects.forEach(subject => {
    finalAssignments.push({
      classId: classObj.id,       // ✅ MOST IMPORTANT
      className: className,
      subjectName: subject
    });
  });

});

      console.log("FINAL ASSIGNMENTS => ", finalAssignments);

      const hodId = localStorage.getItem("hodId"); // 🔥 IMPORTANT FIX

      const formData = new FormData();

      Object.keys(form).forEach(k => formData.append(k, form[k]));

      formData.append("assignments", JSON.stringify(finalAssignments));

      // 🔥 ADD HOD ID
      formData.append("hodId", hodId);

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
        schoolCode: "",
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
      setErrorMessage("Teacher creation failed");
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

      <form
        onSubmit={createTeacher}
        className="bg-white p-5 rounded-xl shadow space-y-4"
      >

        {/* BASIC DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.keys(form).map(key => (
            <div key={key} className="flex flex-col">

              <label className="text-sm text-gray-600 mb-1">
                {key === "joiningDate" ? "Joining Date" : key}
              </label>

              <input
                name={key}
                type={key === "joiningDate" ? "date" : "text"}
                value={form[key]}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              />

            </div>
          ))}
        </div>

        {/* CLASS + SUBJECT */}
        <div>
          <h3 className="font-semibold mb-2">Assign Classes & Subjects</h3>

          <div className="space-y-3">

            {classes.map(cls => (
              <div key={cls.id} className="border rounded p-3">

                <label className="flex items-center gap-2 font-semibold">
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
                      <label
                        key={sub.id}
                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                      >
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
        </div>

        {/* IMAGE */}
        <input type="file" ref={fileRef} onChange={handleImage} />

        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        )}

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded w-full"
        >
          {loading ? "Creating..." : "Create Teacher"}
        </button>

      </form>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-5 rounded text-center">

            <h3 className="text-green-600 font-bold mb-2">
              Success 🎉
            </h3>

            <p>User: {credentials.username}</p>
            <p>Pass: {credentials.password}</p>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
            >
              OK
            </button>

          </div>

        </div>
      )}

    </div>
  );
}