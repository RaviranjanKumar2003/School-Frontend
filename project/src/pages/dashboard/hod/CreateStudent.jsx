import { useState, useEffect } from "react";
import axios from "axios";

// ================= FIELD COMPONENT =================
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-600">
      {label}
    </label>

    {children}
  </div>
);

export default function CreateStudent() {

  // ================= HOD DATA =================
  const hodData = JSON.parse(
    localStorage.getItem("hodData")
  );

  // ================= STATES =================
  const [copiedField, setCopiedField] = useState("");

  const [classes, setClasses] = useState([]);

  const [autoRoll, setAutoRoll] = useState("");

  const [loading, setLoading] = useState(false);

  // ================= SUCCESS POPUP =================
  const [showPopup, setShowPopup] = useState(false);

  const [credentials, setCredentials] = useState({});

  // ================= FORM =================
  const [form, setForm] = useState({

    schoolCode:
      hodData?.school?.schoolCode || "",

    studName: "",

    studLastName: "",

    studFatherName: "",

    email: "",

    studPhoneNumber: "",

    classNumber: "",

    studentDob: "",

    studCategory: "",

    studCaste: "",

    studentAge: "",

    image: null
  });

  // ================= FETCH CLASSES =================
  useEffect(() => {

    if (!hodData?.school?.id) return;

    fetchClasses();

  }, []);

  // ================= FETCH CLASSES =================
  const fetchClasses = async () => {

    try {

      const res = await axios.get(
        `http://localhost:8080/api/classes/by-school/${hodData.school.id}`
      );

      setClasses(res.data || []);

    } catch (err) {

      console.log("Class Fetch Error:", err);

    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {

    const { name, value } = e.target;

    let updated = {
      ...form,
      [name]: value
    };

    // ================= AUTO AGE =================
    if (name === "studentDob") {

      const today = new Date();

      const dob = new Date(value);

      let age =
        today.getFullYear() - dob.getFullYear();

      const month =
        today.getMonth() - dob.getMonth();

      if (
        month < 0 ||
        (
          month === 0 &&
          today.getDate() < dob.getDate()
        )
      ) {
        age--;
      }

      updated.studentAge =
        age >= 0 ? age : "";
    }

    setForm(updated);
  };

  // ================= CLASS CHANGE =================
  const handleClassChange = (e) => {

    setForm((prev) => ({
      ...prev,
      classNumber: e.target.value
    }));
  };

  // ================= IMAGE =================
  const handleImageChange = (e) => {

    setForm((prev) => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  // ================= COPY =================
  const handleCopy = (text, field) => {

    navigator.clipboard.writeText(text);

    setCopiedField(field);

    setTimeout(() => {

      setCopiedField("");

    }, 2000);
  };

  // ================= CREATE STUDENT =================
  const createStudent = async (e) => {

    e.preventDefault();

    // ================= VALIDATION =================
    if (
      !form.studName ||
      !form.email ||
      !form.classNumber
    ) {

      alert(
        "❌ Name, Email aur Class required hai"
      );

      return;
    }

    try {

      setLoading(true);

      // ================= PAYLOAD =================
      const payload = {

        schoolCode: form.schoolCode,

        schoolId: hodData?.school?.id,

        schoolName:
          hodData?.school?.schoolName,

        studName: form.studName,

        studLastName: form.studLastName,

        studFatherName: form.studFatherName,

        email: form.email
          .trim()
          .toLowerCase(),

        studPhoneNumber:
          form.studPhoneNumber,

        classNumber:
          Number(form.classNumber),

        studentDob:
          form.studentDob,

        studCategory:
          form.studCategory,

        studCaste:
          form.studCaste,

        studentAge:
          Number(form.studentAge) || 0
      };

      // ================= FORMDATA =================

const formData = new FormData();

formData.append(
  "student",
  new Blob(
    [JSON.stringify(payload)],
    {
      type: "application/json",
    }
  )
);

// ================= IMAGE =================
if (form.image) {

  formData.append(
    "image",
    form.image
  );
}

      // ================= CREATE API =================
      const res = await axios.post(
  "http://localhost:8080/api/students/add-student",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

      const data = res.data;

      // ================= POPUP DATA =================
      setCredentials({

        username: data.username,

        password: data.password,

        studentId: data.studentId,

        rollNo: data.studRollNo
      });

      setShowPopup(true);

      // ================= RESET =================
      setForm({

        schoolCode:
          hodData?.school?.schoolCode || "",

        studName: "",

        studLastName: "",

        studFatherName: "",

        email: "",

        studPhoneNumber: "",

        classNumber: "",

        studentDob: "",

        studCategory: "",

        studCaste: "",

        studentAge: "",

        image: null
      });

      setAutoRoll("");

    } catch (err) {

      console.log("Create Student Error:", err);

      // ================= ERROR MESSAGE =================
      if (
        err?.response?.data?.message
      ) {

        alert(
          "❌ " + err.response.data.message
        );

      } else {

        alert(
          "❌ Student create nahi hua"
        );
      }

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* ================= TITLE ================= */}
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        👨‍🎓 Create Student
      </h2>

      {/* ================= FORM ================= */}
      <form
        onSubmit={createStudent}
        className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4"
      >

        {/* SCHOOL CODE */}
        <Field label="🏫 School Code">

          <input
            name="schoolCode"
            value={form.schoolCode}
            readOnly
            className="
              border
              p-2
              rounded
              bg-gray-100
              cursor-not-allowed
            "
          />

        </Field>

        {/* FIRST NAME */}
        <Field label="👤 First Name">

          <input
            name="studName"
            value={form.studName}
            onChange={handleChange}
            className="border p-2 rounded"
          />

        </Field>

        {/* LAST NAME */}
        <Field label="👤 Last Name">

          <input
            name="studLastName"
            value={form.studLastName}
            onChange={handleChange}
            className="border p-2 rounded"
          />

        </Field>

        {/* FATHER NAME */}
        <Field label="👨 Father Name">

          <input
            name="studFatherName"
            value={form.studFatherName}
            onChange={handleChange}
            className="border p-2 rounded"
          />

        </Field>

        {/* EMAIL */}
        <Field label="📧 Email">

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />

        </Field>

        {/* PHONE */}
        <Field label="📱 Phone Number">

          <input
            name="studPhoneNumber"
            value={form.studPhoneNumber}
            onChange={handleChange}
            className="border p-2 rounded"
          />

        </Field>

        {/* CLASS */}
        <Field label="🏫 Class">

          <select
            value={form.classNumber}
            onChange={handleClassChange}
            className="border p-2 rounded"
          >

            <option value="">
              Select Class
            </option>

            {classes.map((c) => (

              <option
                key={c.id}
                value={c.id}
              >
                {c.className}
              </option>

            ))}

          </select>

        </Field>

        {/* ROLL */}
        <Field label="🎯 Roll No">

          <input
            value={
              autoRoll || "Auto Generated"
            }
            readOnly
            className="
              border
              p-2
              rounded
              bg-gray-100
            "
          />

        </Field>

        {/* DOB */}
        <Field label="📅 DOB">

          <input
            type="date"
            name="studentDob"
            value={form.studentDob}
            onChange={handleChange}
            className="border p-2 rounded"
          />

        </Field>

        {/* AGE */}
        <Field label="🎂 Age">

          <input
            value={form.studentAge}
            readOnly
            className="
              border
              p-2
              rounded
              bg-gray-100
            "
          />

        </Field>

        {/* CATEGORY */}
        <Field label="🏷 Category">

          <input
            name="studCategory"
            value={form.studCategory}
            onChange={handleChange}
            className="border p-2 rounded"
          />

        </Field>

        {/* CASTE */}
        <Field label="🧾 Caste">

          <input
            name="studCaste"
            value={form.studCaste}
            onChange={handleChange}
            className="border p-2 rounded"
          />

        </Field>

        {/* IMAGE */}
        <Field label="🖼 Image">

          <input
            type="file"
            onChange={handleImageChange}
          />

        </Field>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="
            bg-green-600
            text-white
            py-3
            rounded-lg
            md:col-span-2
          "
        >
          {
            loading
              ? "Creating..."
              : "🚀 Create Student"
          }
        </button>

      </form>

      {/* ================= SUCCESS POPUP ================= */}
      {showPopup && (

        <div className="
          fixed
          inset-0
          z-50
          flex
          items-center
          justify-center
          bg-black/60
          backdrop-blur-sm
          p-4
        ">

          <div className="
            relative
            w-full
            max-w-md
            bg-white
            rounded-3xl
            shadow-2xl
            overflow-hidden
            animate-[popup_0.3s_ease]
          ">

            {/* HEADER */}
            <div className="
              bg-gradient-to-r
              from-green-600
              via-emerald-600
              to-teal-600
              p-6
              text-center
              text-white
            ">

              <span className="text-4xl">
                🎓
              </span>

              <h2 className="
                text-2xl
                font-bold
                mt-2
              ">
                Student Created Successfully
              </h2>

              <p className="
                text-sm
                text-green-100
                mt-1
              ">
                All details generated
              </p>

            </div>

            {/* BODY */}
            <div className="p-6 space-y-3">

              {/* STUDENT ID */}
              <div className="
                bg-gray-50
                p-3
                rounded-xl
              ">

                <p className="
                  text-xs
                  text-gray-500
                ">
                  Student ID
                </p>

                <p className="font-bold">
                  {credentials.studentId}
                </p>

              </div>

              {/* ROLL */}
              <div className="
                bg-gray-50
                p-3
                rounded-xl
              ">

                <p className="
                  text-xs
                  text-gray-500
                ">
                  Roll No
                </p>

                <p className="font-bold">
                  {credentials.rollNo}
                </p>

              </div>

              {/* USERNAME */}
              <div className="
                bg-green-50
                p-3
                rounded-xl
              ">

                <p className="
                  text-xs
                  font-bold
                  text-green-600
                ">
                  Username
                </p>

                <div className="
                  flex
                  justify-between
                  items-center
                ">

                  <span>
                    {credentials.username}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        credentials.username,
                        "username"
                      )
                    }
                    className="
                      text-xs
                      bg-green-600
                      text-white
                      px-2
                      py-1
                      rounded
                    "
                  >
                    {
                      copiedField === "username"
                        ? "Copied!"
                        : "Copy"
                    }
                  </button>

                </div>

              </div>

              {/* PASSWORD */}
              <div className="
                bg-blue-50
                p-3
                rounded-xl
              ">

                <p className="
                  text-xs
                  font-bold
                  text-blue-600
                ">
                  Password
                </p>

                <div className="
                  flex
                  justify-between
                  items-center
                ">

                  <span>
                    {credentials.password}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        credentials.password,
                        "password"
                      )
                    }
                    className="
                      text-xs
                      bg-blue-600
                      text-white
                      px-2
                      py-1
                      rounded
                    "
                  >
                    {
                      copiedField === "password"
                        ? "Copied!"
                        : "Copy"
                    }
                  </button>

                </div>

              </div>

              {/* CLOSE */}
              <button
                onClick={() =>
                  setShowPopup(false)
                }
                className="
                  w-full
                  bg-green-600
                  text-white
                  py-2
                  rounded-xl
                  mt-2
                "
              >
                Continue
              </button>

            </div>

          </div>

          <style>{`
            @keyframes popup {

              from {
                opacity: 0;
                transform: scale(0.8);
              }

              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>

        </div>
      )}

    </div>
  );
}