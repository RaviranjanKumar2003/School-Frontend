import { useState, useEffect } from "react";
import axios from "axios";

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

    // DOB → AUTO AGE
    if (name === "studentDob") {

      const today = new Date();
      const dob = new Date(value);

      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      setForm({
        ...form,
        studentDob: value,
        studentAge: age >= 0 ? age : ""
      });

    } else {
      setForm({
        ...form,
        [name]: value
      });
    }
  };

  // ================= CLASS SELECT FIX (🔥 IMPORTANT) =================
  const handleClassChange = async (e) => {

    const value = e.target.value;

    if (!value) {
      setForm({ ...form, classNumber: "" });
      setAutoRoll("");
      return;
    }

    // "Class 5" → 5
    const number = parseInt(value.replace("Class ", ""));

    setForm({
      ...form,
      classNumber: number
    });

    // AUTO ROLL FETCH
    try {
      const res = await axios.get(
        `http://localhost:8080/api/students/next-roll/${number}`
      );
      setAutoRoll(res.data);
    } catch {
      setAutoRoll("Auto");
    }
  };

  // ================= IMAGE =================
  const handleImageChange = (e) => {
    setForm({
      ...form,
      image: e.target.files[0]
    });
  };

  // ================= CREATE =================
  const createStudent = async (e) => {
    e.preventDefault();

    // 🔥 STRONG VALIDATION
    if (!form.studName || !form.email || !form.classNumber) {
      alert("❌ Name, Email aur Class required hai");
      return;
    }

    if (form.classNumber <= 0) {
      alert("❌ Invalid class");
      return;
    }

    const formData = new FormData();

    formData.append("schoolCode", form.schoolCode || "SCH");
    formData.append("studName", form.studName);
    formData.append("studLastName", form.studLastName);
    formData.append("studFatherName", form.studFatherName);
    formData.append("email", form.email.trim().toLowerCase());
    formData.append("studPhoneNumber", form.studPhoneNumber);
    formData.append("classNumber", parseInt(form.classNumber));
    formData.append("studentDob", form.studentDob || "");
    formData.append("studCategory", form.studCategory || "");
    formData.append("studCaste", form.studCaste || "");
    formData.append("studentAge", form.studentAge || 0);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      for (let pair of formData.entries()) {
          console.log(pair[0]+ ': ' + pair[1]);
       }

      const res = await axios.post(
        "http://localhost:8080/api/students/add-student",
        formData
      );

      const data = res.data;

      alert(
        `✅ Student Created Successfully

Reg No: ${data.studentId}
Roll No: ${data.studRollNo}
Username: ${data.username}
Password: ${data.password}`
      );

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

      console.error(err);

      if (err.response) {
  alert("❌ " + (err.response.data || "Server error"));
} else {
  alert("❌ Server error");
}
    }
  };

  return (

    <div className="p-4 md:p-6">

      <h2 className="text-xl md:text-2xl font-bold mb-4">
        Create Student
      </h2>

      {/* ✅ MOBILE RESPONSIVE GRID */}
      <form onSubmit={createStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input name="schoolCode" placeholder="School Code" className="border p-2" onChange={handleChange} />
        <input name="studName" placeholder="First Name" className="border p-2" onChange={handleChange} />
        <input name="studLastName" placeholder="Last Name" className="border p-2" onChange={handleChange} />
        <input name="studFatherName" placeholder="Father Name" className="border p-2" onChange={handleChange} />
        <input name="email" placeholder="Email" className="border p-2" onChange={handleChange} />
        <input name="studPhoneNumber" placeholder="Phone Number" className="border p-2" onChange={handleChange} />

        {/* ✅ CLASS DROPDOWN FIXED */}
        <select
          className="border p-2"
          value={form.classNumber ? `Class ${form.classNumber}` : ""}
          onChange={handleClassChange}
        >
          <option value="">Select Class</option>

          {classes.map((c) => (
            <option key={c.id} value={c.className}>
              {c.className}
            </option>
          ))}
        </select>

        {/* AUTO ROLL */}
        <input
          value={autoRoll || "Auto"}
          className="border p-2 bg-gray-100"
          readOnly
        />

        <input type="date" name="studentDob" className="border p-2" onChange={handleChange} />
        <input value={form.studentAge} className="border p-2 bg-gray-100" readOnly />

        <input name="studCategory" placeholder="Category" className="border p-2" onChange={handleChange} />
        <input name="studCaste" placeholder="Caste" className="border p-2" onChange={handleChange} />

        <input type="file" className="border p-2 md:col-span-2" onChange={handleImageChange} />

        <button className="bg-green-600 text-white py-2 rounded md:col-span-2">
          Create Student
        </button>

      </form>

    </div>
  );
}