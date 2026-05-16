import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function CreateTeacher() {

  const fileRef = useRef(null);

  // ================= SCHOOL ADMIN DATA =================
  const adminData =
    JSON.parse(
      localStorage.getItem("schoolAdminData")
    ) || {};

  // ================= SCHOOL DATA =================
  const schoolCode =
    adminData?.school?.schoolCode ||
    adminData?.schoolCode ||
    "";

  const schoolId =
    adminData?.school?.id ||
    adminData?.schoolId ||
    null;

  // 🔥 SCHOOL ADMIN ID
  const schoolAdminId =
    adminData?.id ||
    adminData?.schoolAdminId ||
    null;

  // ================= FORM =================
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

  // ================= STATES =================
  const [classes, setClasses] = useState([]);
  const [selectedData, setSelectedData] = useState({});

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] =
    useState(false);

  const [credentials, setCredentials] =
    useState({
      username: "",
      password: ""
    });

  const [errorMessage, setErrorMessage] =
    useState("");

  // ================= AUTO FILL SCHOOL CODE =================
  useEffect(() => {

    if (schoolCode) {

      setForm((prev) => ({
        ...prev,
        schoolCode: schoolCode
      }));

    }

  }, [schoolCode]);

  // ================= LOAD CLASSES =================
  useEffect(() => {

    if (!schoolId) return;

    axios
      .get(
        `http://localhost:8080/api/classes/by-school/${schoolId}`
      )

      .then((res) => {

        console.log("CLASSES :", res.data);

        setClasses(res.data || []);

      })

      .catch((err) => {

        console.log(
          "CLASS FETCH ERROR :",
          err
        );

      });

  }, [schoolId]);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // ================= HANDLE IMAGE =================
  const handleImage = (e) => {

    const file = e.target.files[0];

    setImage(file);

    if (file) {

      setPreview(
        URL.createObjectURL(file)
      );

    }

  };

  // ================= CLASS TOGGLE =================
  const toggleClass = (className) => {

    setSelectedData((prev) => {

      if (prev[className]) {

        const updated = { ...prev };

        delete updated[className];

        return updated;

      }

      return {
        ...prev,
        [className]: []
      };

    });

  };

  // ================= SUBJECT TOGGLE =================
  const toggleSubject = (
    className,
    subject
  ) => {

    setSelectedData((prev) => {

      const subjects =
        prev[className] || [];

      if (subjects.includes(subject)) {

        return {
          ...prev,

          [className]:
            subjects.filter(
              (s) => s !== subject
            )
        };

      }

      return {
        ...prev,

        [className]: [
          ...subjects,
          subject
        ]
      };

    });

  };

  // ================= CREATE TEACHER =================
  const createTeacher = async (e) => {

    e.preventDefault();

    setLoading(true);

    setErrorMessage("");

    try {

      // ================= ASSIGNMENTS =================
      let finalAssignments = [];

      Object.entries(selectedData).forEach(

        ([className, subjects]) => {

          if (
            !subjects ||
            subjects.length === 0
          ) return;

          const classObj =
            classes.find(
              (c) =>
                c.className === className
            );

          if (!classObj) return;

          subjects.forEach((subject) => {

            finalAssignments.push({
              classId: classObj.id,
              className: className,
              subjectName: subject
            });

          });

        }
      );

      console.log(
        "FINAL ASSIGNMENTS :",
        finalAssignments
      );

      // ================= VALIDATION =================
      if (!schoolId) {

        setErrorMessage(
          "School not found. Please login again."
        );

        setLoading(false);

        return;

      }

      // ================= FORM DATA =================
      const formData = new FormData();

      formData.append(
        "name",
        form.name || ""
      );

      formData.append(
        "email",
        form.email || ""
      );

      formData.append(
        "phone",
        form.phone || ""
      );

      formData.append(
        "designation",
        form.designation || ""
      );

      formData.append(
        "qualification",
        form.qualification || ""
      );

      formData.append(
        "experience",
        form.experience || ""
      );

      formData.append(
        "joiningDate",
        form.joiningDate || ""
      );

      // ================= IMPORTANT =================
      formData.append(
        "schoolId",
        schoolId
      );

      // 🔥 NOW USING SCHOOL ADMIN ID
      formData.append(
        "schoolAdminId",
        schoolAdminId
      );

      formData.append(
        "assignments",
        JSON.stringify(
          finalAssignments || []
        )
      );

      // ================= IMAGE =================
      if (image) {

        formData.append(
          "image",
          image
        );

      }

      // ================= DEBUG =================
      for (let pair of formData.entries()) {

        console.log(
          pair[0],
          pair[1]
        );

      }

      // ================= API =================
      const res = await axios.post(

        "http://localhost:8080/api/professors",

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      console.log(
        "SUCCESS RESPONSE :",
        res.data
      );

      // ================= SUCCESS =================
      setCredentials({
        username:
          res.data?.username || "",

        password:
          res.data?.password || ""
      });

      setShowPopup(true);

      // ================= RESET =================
      setForm({
        schoolCode: schoolCode,

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

      if (fileRef.current) {

        fileRef.current.value = "";

      }

    } catch (err) {

      console.log(
        "CREATE TEACHER ERROR :",
        err
      );

      console.log(
        "ERROR RESPONSE :",
        err?.response?.data
      );

      setErrorMessage(

        err?.response?.data?.message ||

        err?.response?.data ||

        "Teacher creation failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen">

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-blue-600 mb-4">

        Create Teacher 👨‍🏫

      </h2>

      {/* ERROR */}
      {errorMessage && (

        <div className="bg-red-100 text-red-700 p-2 rounded mb-3">

          {errorMessage}

        </div>

      )}

      {/* FORM */}
      <form
        onSubmit={createTeacher}
        className="bg-white p-5 rounded-xl shadow space-y-4"
      >

        {/* BASIC DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {Object.keys(form).map((key) => (

            <div
              key={key}
              className="flex flex-col"
            >

              <label className="text-sm text-gray-600 mb-1 capitalize">

                {key}

              </label>

              <input
                name={key}

                type={
                  key === "joiningDate"
                    ? "date"
                    : "text"
                }

                value={form[key]}

                onChange={handleChange}

                className="border p-2 rounded"

                required

                readOnly={
                  key === "schoolCode"
                }
              />

            </div>

          ))}

        </div>

        {/* CLASS + SUBJECT */}
        <div>

          <h3 className="font-semibold mb-2">

            Assign Classes & Subjects

          </h3>

          {classes.map((cls) => (

            <div
              key={cls.id}
              className="border rounded p-3 mb-2"
            >

              {/* CLASS */}
              <label className="flex gap-2 font-semibold">

                <input
                  type="checkbox"

                  checked={
                    !!selectedData[
                      cls.className
                    ]
                  }

                  onChange={() =>
                    toggleClass(
                      cls.className
                    )
                  }
                />

                {cls.className}

              </label>

              {/* SUBJECTS */}
              {selectedData[
                cls.className
              ] && (

                <div className="flex flex-wrap gap-2 mt-2">

                  {cls.subjects?.map(
                    (sub) => (

                      <label
                        key={sub.id}
                        className="flex gap-1 bg-gray-100 px-2 py-1 rounded"
                      >

                        <input
                          type="checkbox"

                          checked={
                            selectedData[
                              cls.className
                            ]?.includes(
                              sub.subjectName
                            )
                          }

                          onChange={() =>
                            toggleSubject(
                              cls.className,
                              sub.subjectName
                            )
                          }
                        />

                        {sub.subjectName}

                      </label>

                    )
                  )}

                </div>

              )}

            </div>

          ))}

        </div>

        {/* IMAGE */}
        <input
          type="file"
          ref={fileRef}
          onChange={handleImage}
        />

        {/* PREVIEW */}
        {preview && (

          <img
            src={preview}
            alt="preview"
            className="w-24 h-24 rounded-full object-cover"
          />

        )}

        {/* BUTTON */}
        <button
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded w-full"
        >

          {
            loading
              ? "Creating..."
              : "Create Teacher"
          }

        </button>

      </form>

      {/* ================= SUCCESS POPUP ================= */}
      {showPopup && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-center text-white">

              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">

                <span className="text-4xl">
                  🎉
                </span>

              </div>

              <h2 className="text-2xl font-extrabold">

                Teacher Created Successfully

              </h2>

              <p className="text-blue-100 mt-2 text-sm">

                Login credentials generated successfully

              </p>

            </div>

            {/* BODY */}
            <div className="p-6">

              <div className="bg-blue-50 p-4 rounded-xl mb-4">

                <p className="text-xs text-blue-500 font-bold">

                  Username

                </p>

                <p className="font-bold">

                  {credentials.username}

                </p>

              </div>

              <div className="bg-purple-50 p-4 rounded-xl">

                <p className="text-xs text-purple-500 font-bold">

                  Password

                </p>

                <p className="font-bold">

                  {credentials.password}

                </p>

              </div>

              <button
                onClick={() =>
                  setShowPopup(false)
                }

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