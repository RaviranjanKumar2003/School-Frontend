import { useState, useEffect } from "react";
import axios from "axios";

// ✅ FIX: Field component OUTSIDE
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-600">
      {label}
    </label>
    {children}
  </div>
);

export default function CreateStudent() {

  const [classes, setClasses] = useState([]);
  const [autoRoll, setAutoRoll] = useState("");

  const [form, setForm] = useState({
    schoolCode: "",
    studName: "",
    studLastName: "",
    studFatherName: "",
    email: "",
    studPhoneNumber: "",
    classNumber: "",
    className: "",
    studentDob: "",
    studCategory: "",
    studCaste: "",
    studentAge: "",
    image: null
  });

  // ================= FETCH CLASSES =================
  useEffect(() => {
    axios.get("http://localhost:8080/api/classes")
      .then(res => setClasses(res.data))
      .catch(err => console.log(err));
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = { ...form, [name]: value };

    // DOB → AGE
    if (name === "studentDob") {
      const today = new Date();
      const dob = new Date(value);

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      updated.studentAge = age >= 0 ? age : "";
    }

    setForm(updated);
  };

  // ================= CLASS CHANGE =================
  const handleClassChange = (e) => {
    setForm(prev => ({
      ...prev,
      classNumber: e.target.value
    }));
  };

  // ================= IMAGE =================
  const handleImageChange = (e) => {
    setForm(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  // ================= CREATE =================
  const createStudent = async (e) => {
    e.preventDefault();

    if (!form.studName || !form.email || !form.classNumber) {
      alert("❌ Name, Email aur Class required hai");
      return;
    }

    const formData = new FormData();

    formData.append("schoolCode", form.schoolCode || "SCH");
    formData.append("studName", form.studName);
    formData.append("studLastName", form.studLastName);
    formData.append("studFatherName", form.studFatherName);
    formData.append("email", form.email.trim().toLowerCase());
    formData.append("studPhoneNumber", form.studPhoneNumber);
    formData.append("classNumber", Number(form.classNumber));
    formData.append("studentDob", form.studentDob || "");
    formData.append("studCategory", form.studCategory || "");
    formData.append("studCaste", form.studCaste || "");
    formData.append("studentAge", form.studentAge || 0);

    if (form.image) formData.append("image", form.image);

    try {
      const res = await axios.post(
        "http://localhost:8080/api/students/add-student",
        formData
      );

      const data = res.data;

      alert(`✅ Student Created Successfully

Reg No: ${data.studentId}
Roll No: ${data.studRollNo}
Username: ${data.username}
Password: ${data.password}`);

      // RESET
      setForm({
        schoolCode: "",
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
      console.log(err);
      alert("❌ Server error");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        👨‍🎓 Create Student
      </h2>

      <form onSubmit={createStudent} className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4">

        <Field label="🏫 School Code">
          <input
            name="schoolCode"
            value={form.schoolCode}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </Field>

        <Field label="👤 First Name">
          <input
            name="studName"
            value={form.studName}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </Field>

        <Field label="👤 Last Name">
          <input
            name="studLastName"
            value={form.studLastName}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </Field>

        <Field label="👨 Father Name">
          <input
            name="studFatherName"
            value={form.studFatherName}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </Field>

        <Field label="📧 Email">
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </Field>

        <Field label="📱 Phone Number">
          <input
            name="studPhoneNumber"
            value={form.studPhoneNumber}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </Field>

        <Field label="🏫 Class">
          <select
            value={form.classNumber}
            onChange={handleClassChange}
            className="border p-2 rounded"
          >
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {c.className}
              </option>
            ))}
          </select>
        </Field>

        <Field label="🎯 Roll No">
          <input
            value={autoRoll || "Auto Generated"}
            readOnly
            className="border p-2 rounded bg-gray-100"
          />
        </Field>

        <Field label="📅 DOB">
          <input
            type="date"
            name="studentDob"
            value={form.studentDob}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </Field>

        <Field label="🎂 Age">
          <input
            value={form.studentAge}
            readOnly
            className="border p-2 rounded bg-gray-100"
          />
        </Field>

        <Field label="🏷 Category">
          <input
            name="studCategory"
            value={form.studCategory}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </Field>

        <Field label="🧾 Caste">
          <input
            name="studCaste"
            value={form.studCaste}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </Field>

        <Field label="🖼 Image">
          <input type="file" onChange={handleImageChange} />
        </Field>

        <button className="bg-green-600 text-white py-3 rounded-lg md:col-span-2">
          🚀 Create Student
        </button>

      </form>
    </div>
  );
}