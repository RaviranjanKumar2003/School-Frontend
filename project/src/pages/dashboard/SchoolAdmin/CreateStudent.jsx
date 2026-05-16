// import { useState, useEffect } from "react";
// import axios from "axios";

// // ================= FIELD COMPONENT =================
// const Field = ({ label, children }) => (
//   <div className="flex flex-col gap-1">
//     <label className="text-sm font-semibold text-gray-600">
//       {label}
//     </label>

//     {children}
//   </div>
// );

// export default function CreateStudent() {

//   // ================= HOD DATA =================
//   const hodData = JSON.parse(
//     localStorage.getItem("hodData")
//   );

//   // ================= STATES =================
//   const [copiedField, setCopiedField] = useState("");

//   const [classes, setClasses] = useState([]);

//   const [autoRoll, setAutoRoll] = useState("");

//   const [loading, setLoading] = useState(false);

//   // ================= SUCCESS POPUP =================
//   const [showPopup, setShowPopup] = useState(false);

//   const [credentials, setCredentials] = useState({});

//   // ================= FORM =================
//   const [form, setForm] = useState({

//     schoolCode:
//       hodData?.school?.schoolCode || "",

//     studName: "",

//     studLastName: "",

//     studFatherName: "",

//     email: "",

//     studPhoneNumber: "",

//     classNumber: "",

//     studentDob: "",

//     studCategory: "",

//     studCaste: "",

//     studentAge: "",

//     image: null
//   });

//   // ================= FETCH CLASSES =================
//   useEffect(() => {

//     if (!hodData?.school?.id) return;

//     fetchClasses();

//   }, []);

//   // ================= FETCH CLASSES =================
//   const fetchClasses = async () => {

//     try {

//       const res = await axios.get(
//         `http://localhost:8080/api/classes/by-school/${hodData.school.id}`
//       );

//       setClasses(res.data || []);

//     } catch (err) {

//       console.log("Class Fetch Error:", err);

//     }
//   };

//   // ================= HANDLE CHANGE =================
//   const handleChange = (e) => {

//     const { name, value } = e.target;

//     let updated = {
//       ...form,
//       [name]: value
//     };

//     // ================= AUTO AGE =================
//     if (name === "studentDob") {

//       const today = new Date();

//       const dob = new Date(value);

//       let age =
//         today.getFullYear() - dob.getFullYear();

//       const month =
//         today.getMonth() - dob.getMonth();

//       if (
//         month < 0 ||
//         (
//           month === 0 &&
//           today.getDate() < dob.getDate()
//         )
//       ) {
//         age--;
//       }

//       updated.studentAge =
//         age >= 0 ? age : "";
//     }

//     setForm(updated);
//   };

//   // ================= CLASS CHANGE =================
//   const handleClassChange = (e) => {

//     setForm((prev) => ({
//       ...prev,
//       classNumber: e.target.value
//     }));
//   };

//   // ================= IMAGE =================
//   const handleImageChange = (e) => {

//     setForm((prev) => ({
//       ...prev,
//       image: e.target.files[0]
//     }));
//   };

//   // ================= COPY =================
//   const handleCopy = (text, field) => {

//     navigator.clipboard.writeText(text);

//     setCopiedField(field);

//     setTimeout(() => {

//       setCopiedField("");

//     }, 2000);
//   };

//   // ================= CREATE STUDENT =================
//   const createStudent = async (e) => {

//     e.preventDefault();

//     // ================= VALIDATION =================
//     if (
//       !form.studName ||
//       !form.email ||
//       !form.classNumber
//     ) {

//       alert(
//         "❌ Name, Email aur Class required hai"
//       );

//       return;
//     }

//     try {

//       setLoading(true);

//       // ================= PAYLOAD =================
//       const payload = {

//         schoolCode: form.schoolCode,

//         schoolId: hodData?.school?.id,

//         schoolName:
//           hodData?.school?.schoolName,

//         studName: form.studName,

//         studLastName: form.studLastName,

//         studFatherName: form.studFatherName,

//         email: form.email
//           .trim()
//           .toLowerCase(),

//         studPhoneNumber:
//           form.studPhoneNumber,

//         classNumber:
//           Number(form.classNumber),

//         studentDob:
//           form.studentDob,

//         studCategory:
//           form.studCategory,

//         studCaste:
//           form.studCaste,

//         studentAge:
//           Number(form.studentAge) || 0
//       };

//       // ================= FORMDATA =================

// const formData = new FormData();

// formData.append(
//   "student",
//   new Blob(
//     [JSON.stringify(payload)],
//     {
//       type: "application/json",
//     }
//   )
// );

// // ================= IMAGE =================
// if (form.image) {

//   formData.append(
//     "image",
//     form.image
//   );
// }

//       // ================= CREATE API =================
//       const res = await axios.post(
//   "http://localhost:8080/api/students/add-student",
//   formData,
//   {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   }
// );

//       const data = res.data;

//       // ================= POPUP DATA =================
//       setCredentials({

//         username: data.username,

//         password: data.password,

//         studentId: data.studentId,

//         rollNo: data.studRollNo
//       });

//       setShowPopup(true);

//       // ================= RESET =================
//       setForm({

//         schoolCode:
//           hodData?.school?.schoolCode || "",

//         studName: "",

//         studLastName: "",

//         studFatherName: "",

//         email: "",

//         studPhoneNumber: "",

//         classNumber: "",

//         studentDob: "",

//         studCategory: "",

//         studCaste: "",

//         studentAge: "",

//         image: null
//       });

//       setAutoRoll("");

//     } catch (err) {

//       console.log("Create Student Error:", err);

//       // ================= ERROR MESSAGE =================
//       if (
//         err?.response?.data?.message
//       ) {

//         alert(
//           "❌ " + err.response.data.message
//         );

//       } else {

//         alert(
//           "❌ Student create nahi hua"
//         );
//       }

//     } finally {

//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">

//       {/* ================= TITLE ================= */}
//       <h2 className="text-2xl font-bold mb-6 text-blue-600">
//         👨‍🎓 Create Student
//       </h2>

//       {/* ================= FORM ================= */}
//       <form
//         onSubmit={createStudent}
//         className="bg-white p-6 rounded-xl shadow grid grid-cols-1 md:grid-cols-2 gap-4"
//       >

//         {/* SCHOOL CODE */}
//         <Field label="🏫 School Code">

//           <input
//             name="schoolCode"
//             value={form.schoolCode}
//             readOnly
//             className="
//               border
//               p-2
//               rounded
//               bg-gray-100
//               cursor-not-allowed
//             "
//           />

//         </Field>

//         {/* FIRST NAME */}
//         <Field label="👤 First Name">

//           <input
//             name="studName"
//             value={form.studName}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />

//         </Field>

//         {/* LAST NAME */}
//         <Field label="👤 Last Name">

//           <input
//             name="studLastName"
//             value={form.studLastName}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />

//         </Field>

//         {/* FATHER NAME */}
//         <Field label="👨 Father Name">

//           <input
//             name="studFatherName"
//             value={form.studFatherName}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />

//         </Field>

//         {/* EMAIL */}
//         <Field label="📧 Email">

//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />

//         </Field>

//         {/* PHONE */}
//         <Field label="📱 Phone Number">

//           <input
//             name="studPhoneNumber"
//             value={form.studPhoneNumber}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />

//         </Field>

//         {/* CLASS */}
//         <Field label="🏫 Class">

//           <select
//             value={form.classNumber}
//             onChange={handleClassChange}
//             className="border p-2 rounded"
//           >

//             <option value="">
//               Select Class
//             </option>

//             {classes.map((c) => (

//               <option
//                 key={c.id}
//                 value={c.id}
//               >
//                 {c.className}
//               </option>

//             ))}

//           </select>

//         </Field>

//         {/* ROLL */}
//         <Field label="🎯 Roll No">

//           <input
//             value={
//               autoRoll || "Auto Generated"
//             }
//             readOnly
//             className="
//               border
//               p-2
//               rounded
//               bg-gray-100
//             "
//           />

//         </Field>

//         {/* DOB */}
//         <Field label="📅 DOB">

//           <input
//             type="date"
//             name="studentDob"
//             value={form.studentDob}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />

//         </Field>

//         {/* AGE */}
//         <Field label="🎂 Age">

//           <input
//             value={form.studentAge}
//             readOnly
//             className="
//               border
//               p-2
//               rounded
//               bg-gray-100
//             "
//           />

//         </Field>

//         {/* CATEGORY */}
//         <Field label="🏷 Category">

//           <input
//             name="studCategory"
//             value={form.studCategory}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />

//         </Field>

//         {/* CASTE */}
//         <Field label="🧾 Caste">

//           <input
//             name="studCaste"
//             value={form.studCaste}
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />

//         </Field>

//         {/* IMAGE */}
//         <Field label="🖼 Image">

//           <input
//             type="file"
//             onChange={handleImageChange}
//           />

//         </Field>

//         {/* BUTTON */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="
//             bg-green-600
//             text-white
//             py-3
//             rounded-lg
//             md:col-span-2
//           "
//         >
//           {
//             loading
//               ? "Creating..."
//               : "🚀 Create Student"
//           }
//         </button>

//       </form>

//       {/* ================= SUCCESS POPUP ================= */}
//       {showPopup && (

//         <div className="
//           fixed
//           inset-0
//           z-50
//           flex
//           items-center
//           justify-center
//           bg-black/60
//           backdrop-blur-sm
//           p-4
//         ">

//           <div className="
//             relative
//             w-full
//             max-w-md
//             bg-white
//             rounded-3xl
//             shadow-2xl
//             overflow-hidden
//             animate-[popup_0.3s_ease]
//           ">

//             {/* HEADER */}
//             <div className="
//               bg-gradient-to-r
//               from-green-600
//               via-emerald-600
//               to-teal-600
//               p-6
//               text-center
//               text-white
//             ">

//               <span className="text-4xl">
//                 🎓
//               </span>

//               <h2 className="
//                 text-2xl
//                 font-bold
//                 mt-2
//               ">
//                 Student Created Successfully
//               </h2>

//               <p className="
//                 text-sm
//                 text-green-100
//                 mt-1
//               ">
//                 All details generated
//               </p>

//             </div>

//             {/* BODY */}
//             <div className="p-6 space-y-3">

//               {/* STUDENT ID */}
//               <div className="
//                 bg-gray-50
//                 p-3
//                 rounded-xl
//               ">

//                 <p className="
//                   text-xs
//                   text-gray-500
//                 ">
//                   Student ID
//                 </p>

//                 <p className="font-bold">
//                   {credentials.studentId}
//                 </p>

//               </div>

//               {/* ROLL */}
//               <div className="
//                 bg-gray-50
//                 p-3
//                 rounded-xl
//               ">

//                 <p className="
//                   text-xs
//                   text-gray-500
//                 ">
//                   Roll No
//                 </p>

//                 <p className="font-bold">
//                   {credentials.rollNo}
//                 </p>

//               </div>

//               {/* USERNAME */}
//               <div className="
//                 bg-green-50
//                 p-3
//                 rounded-xl
//               ">

//                 <p className="
//                   text-xs
//                   font-bold
//                   text-green-600
//                 ">
//                   Username
//                 </p>

//                 <div className="
//                   flex
//                   justify-between
//                   items-center
//                 ">

//                   <span>
//                     {credentials.username}
//                   </span>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       handleCopy(
//                         credentials.username,
//                         "username"
//                       )
//                     }
//                     className="
//                       text-xs
//                       bg-green-600
//                       text-white
//                       px-2
//                       py-1
//                       rounded
//                     "
//                   >
//                     {
//                       copiedField === "username"
//                         ? "Copied!"
//                         : "Copy"
//                     }
//                   </button>

//                 </div>

//               </div>

//               {/* PASSWORD */}
//               <div className="
//                 bg-blue-50
//                 p-3
//                 rounded-xl
//               ">

//                 <p className="
//                   text-xs
//                   font-bold
//                   text-blue-600
//                 ">
//                   Password
//                 </p>

//                 <div className="
//                   flex
//                   justify-between
//                   items-center
//                 ">

//                   <span>
//                     {credentials.password}
//                   </span>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       handleCopy(
//                         credentials.password,
//                         "password"
//                       )
//                     }
//                     className="
//                       text-xs
//                       bg-blue-600
//                       text-white
//                       px-2
//                       py-1
//                       rounded
//                     "
//                   >
//                     {
//                       copiedField === "password"
//                         ? "Copied!"
//                         : "Copy"
//                     }
//                   </button>

//                 </div>

//               </div>

//               {/* CLOSE */}
//               <button
//                 onClick={() =>
//                   setShowPopup(false)
//                 }
//                 className="
//                   w-full
//                   bg-green-600
//                   text-white
//                   py-2
//                   rounded-xl
//                   mt-2
//                 "
//               >
//                 Continue
//               </button>

//             </div>

//           </div>

//           <style>{`
//             @keyframes popup {

//               from {
//                 opacity: 0;
//                 transform: scale(0.8);
//               }

//               to {
//                 opacity: 1;
//                 transform: scale(1);
//               }
//             }
//           `}</style>

//         </div>
//       )}

//     </div>
//   );
// }




import { useState, useEffect } from "react";
import axios from "axios";


// ================= STATES & CITIES =================

const indiaData = {

  Bihar: [
    "Patna",
    "Gaya",
    "Bhagalpur",
    "Muzaffarpur",
    "Darbhanga",
    "Purnia",
    "Begusarai",
    "Ara",
    "Katihar",
    "Munger"
  ],

  UttarPradesh: [
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi",
    "Prayagraj",
    "Noida",
    "Ghaziabad",
    "Meerut",
    "Aligarh",
    "Bareilly"
  ],

  Delhi: [
    "New Delhi",
    "North Delhi",
    "South Delhi",
    "Dwarka",
    "Rohini",
    "Saket"
  ],

  Maharashtra: [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Nashik",
    "Aurangabad",
    "Thane"
  ],

  Rajasthan: [
    "Jaipur",
    "Jodhpur",
    "Udaipur",
    "Ajmer",
    "Kota",
    "Bikaner"
  ],

  Gujarat: [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar"
  ],

  MadhyaPradesh: [
    "Bhopal",
    "Indore",
    "Jabalpur",
    "Gwalior",
    "Ujjain"
  ],

  Punjab: [
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "Mohali"
  ],

  Haryana: [
    "Gurgaon",
    "Faridabad",
    "Panipat",
    "Karnal",
    "Hisar"
  ],

  WestBengal: [
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Siliguri",
    "Asansol"
  ],

  Jharkhand: [
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro"
  ],

  Chhattisgarh: [
    "Raipur",
    "Bilaspur",
    "Durg",
    "Korba"
  ],

  Odisha: [
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Puri"
  ],

  TamilNadu: [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Salem",
    "Tiruppur"
  ],

  Karnataka: [
    "Bengaluru",
    "Mysore",
    "Mangalore",
    "Hubli"
  ],

  Kerala: [
    "Kochi",
    "Thiruvananthapuram",
    "Kozhikode",
    "Thrissur"
  ],

  Telangana: [
    "Hyderabad",
    "Warangal",
    "Karimnagar"
  ],

  AndhraPradesh: [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore"
  ]
};


// ================= FIELD COMPONENT =================

const Field = ({
  label,
  children,
  required = false
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700">
      {label}
      {required && (
        <span className="text-red-500 ml-1">*</span>
      )}
    </label>

    {children}
  </div>
);


// ================= SECTION TITLE =================

const SectionTitle = ({ title }) => (
  <div className="mb-5 border-b pb-3">
    <h2 className="text-xl font-bold text-blue-700">
      {title}
    </h2>
  </div>
);


// ================= MAIN COMPONENT =================

export default function CreateStudent() {

  const adminData =
JSON.parse(localStorage.getItem("schoolAdminData")) || {};

const schoolId = Number(
  adminData?.schoolId ||
  adminData?.school?.id ||
  0
);

console.log("FULL ADMIN DATA :", adminData);  

  const [classes, setClasses] = useState([]);

  const [sections, setSections] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const [credentials, setCredentials] = useState({});

  // ================= FORM =================

  const [form, setForm] = useState({

    // ================= LOGIN =================
    schoolCode:
  adminData?.schoolCode || "",

    email: "",
    username: "Auto Generated",
    password: "Auto Generated",

    // ================= ACADEMIC =================
    classId: "",
    section: "",
    studRollNo: "Auto Generated",
    admissionDate: "",

    // ================= PERSONAL =================
    studfirstName: "",
    studlastName: "",
    studFatherName: "",
    motherName: "",

    gender: "",
    studentDob: "",

    bloodGroup: "",
    religion: "",
    nationality: "Indian",

    studCategory: "",
    studCaste: "",

    aadhaarNumber: "",

    // ================= CONTACT =================
    studPhoneNumber: "",
    fatherPhone: "",
    fatherEmail: "",
    motherPhone: "",

    // ================= ADDRESS =================
    address: "",
    city: "",
    state: "",
    pincode: "",

    // ================= EXTRA =================
    previousSchool: "",
    monthlyFee: "",

    discountedStudent: false,

    // ================= TRANSPORT =================
    transportRequired: false,
    pickupPoint: "",
    assignedBusRoute: "",

    // ================= SYSTEM =================
    createParentAccount: false,

    image: null
  });

  // ================= FETCH CLASSES =================  alert("Student Created Successfully");

  useEffect(() => {

  const schoolId =adminData?.schoolId || adminData?.school?.id;

  console.log("SCHOOL ID :", schoolId);

  if (!schoolId) {
    console.log("School ID not found");
    return;
  }

  axios
    .get(
      `http://localhost:8080/api/classes/by-school/${schoolId}`
    )

    .then((res) => {

      console.log("CLASSES API :", res.data);

      setClasses(res.data || []);

    })

    .catch((err) => {

      console.log("CLASS FETCH ERROR :", err);

    });

}, []);



// ================= HANDLE CLASS CHANGE =================

const handleClassChange = async (e) => {

  const classId = e.target.value;

  setForm((prev) => ({
    ...prev,
    classId,
    section: ""
  }));

  if (!classId) {

    setSections([]);

    return;
  }

  try {

    const res = await axios.get(
      `http://localhost:8080/api/sections/${adminData?.schoolId}/${classId}`
    );

    console.log("SECTIONS :", res.data);

    setSections(res.data || []);

  } catch (err) {

    console.log("SECTION FETCH ERROR :", err);

    setSections([]);
  }
};

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value
    }));
  };

  // ================= HANDLE IMAGE =================

  const handleImage = (e) => {

    setForm({
      ...form,
      image: e.target.files[0]
    });
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const payload = {

  ...form,

  schoolId: schoolId,

  classId: form.classId
    ? Number(form.classId)
    : 0,

  monthlyFee: form.monthlyFee
    ? Number(form.monthlyFee)
    : 0,

  studRollNo: form.studRollNo
    ? Number(form.studRollNo)
    : 0,

  admissionDate:
    form.admissionDate || "",

  studentDob:
    form.studentDob || "",

  aadhaarNumber:
    form.aadhaarNumber || "",

  discountedStudent:
    form.discountedStudent === true ||
    form.discountedStudent === "true",

  transportRequired:
    form.transportRequired === true ||
    form.transportRequired === "true",

  createParentAccount:
    form.createParentAccount === true ||
    form.createParentAccount === "true",

  pickupPoint:
    form.transportRequired === true ||
    form.transportRequired === "true"
      ? form.pickupPoint
      : "",

  assignedBusRoute:
    form.transportRequired === true ||
    form.transportRequired === "true"
      ? form.assignedBusRoute
      : "",

};

      const formData =
        new FormData();

      formData.append(
        "student",

        new Blob(
          [JSON.stringify(payload)],
          {
            type: "application/json"
          }
        )
      );

      if (form.image) {

        formData.append(
          "image",
          form.image
        );
      }

      console.log("FINAL PAYLOAD :", payload);

      const res = await axios.post(

        "http://localhost:8080/api/students/add-student",

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      setCredentials({

  studentId:
    res.data.studentId ||

    "",

  username:
    res.data.generatedUsername ||
    res.data.username ||

    "",

  password:
    res.data.generatedPassword ||
    res.data.password ||

    "",

  studRollNo:
    res.data.studRollNo ||

    ""
});

setForm((prev) => ({

  ...prev,

  studentId:
    res.data.studentId || "",

  username:
    res.data.generatedUsername ||
    res.data.username ||
    "",

  password:
    res.data.generatedPassword ||
    "",

  studRollNo:
    res.data.studRollNo || ""

}));

setShowPopup(true);

alert("Student Created Successfully");

    } catch (err) {

      console.log("FULL ERROR :", err);

console.log("ERROR RESPONSE :", err.response);

console.log("ERROR DATA :", err.response?.data);

console.log("ERROR MESSAGE :", err.response?.data?.message);

      alert(
        err?.response?.data?.message ||
        "Error while creating student"
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= UI =================

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="bg-gradient-to-r from-blue-700 to-cyan-600 rounded-2xl p-6 shadow-lg mb-6 text-white">

          <h1 className="text-3xl font-bold">
            Student Admission Form
          </h1>

          <p className="mt-2 text-blue-100">
            Fill complete student details carefully
          </p>

        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ================= LOGIN INFO ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <SectionTitle title="Login Information" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

              <Field label="School Code">

                <input
                  value={form.schoolCode}
                  readOnly
                  className="border rounded-xl p-3 bg-gray-100"
                />

              </Field>

              <Field label="Email" required>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              

<Field label="Username">

  <input
    value={form.username}
    readOnly
    className="border rounded-xl p-3 bg-gray-100 text-gray-600"
  />

</Field>

<Field label="Password">

  <input
    value={form.password}
    readOnly
    className="border rounded-xl p-3 bg-gray-100 text-gray-600"
  />

</Field>

            </div>

          </div>

          {/* ================= ACADEMIC INFO ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <SectionTitle title="Academic Information" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

              <Field label="Class" required>

  <select
  name="classId"
  value={form.classId}
  onChange={handleClassChange}
  className="border rounded-xl p-3 w-full"
>

    <option value="">
      Select Class
    </option>

    {
      Array.isArray(classes) &&
      classes.map((cls) => (

        <option
          key={cls.id}
          value={cls.id}
        >
          {cls.className}
        </option>

      ))
    }

  </select>

</Field>

              <Field label="Section">

  <select
    name="section"
    value={form.section}
    onChange={handleChange}
    className="border rounded-xl p-3"
  >

    <option value="">
      Select Section
    </option>

    {
      sections.map((sec) => (

        <option
          key={sec.id}
          value={sec.sectionName}
        >
          {sec.sectionName}
        </option>

      ))
    }

  </select>

</Field>

              <Field label="Roll No">

  <input
    value={form.studRollNo}
    readOnly
    className="border rounded-xl p-3 bg-gray-100 text-gray-600"
  />

</Field>

              <Field label="Admission Date">

                <input
                  type="date"
                  name="admissionDate"
                  value={form.admissionDate}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

            </div>

          </div>

          {/* ================= PERSONAL INFO ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <SectionTitle title="Personal Information" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">

              <Field label="First Name" required>

                <input
                  name="studfirstName"
                  value={form.studfirstName}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Last Name">

                <input
                  name="studlastName"
                  value={form.studlastName}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Father Name">

                <input
                  name="studFatherName"
                  value={form.studFatherName}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Mother Name">

                <input
                  name="motherName"
                  value={form.motherName}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Gender">

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                >

                  <option value="">
                    Select
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </Field>

              <Field label="Date Of Birth">

                <input
                  type="date"
                  name="studentDob"
                  value={form.studentDob}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Blood Group">

                <input
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Religion">

                <input
                  name="religion"
                  value={form.religion}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Nationality">

                <input
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Category">

                <input
                  name="studCategory"
                  value={form.studCategory}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Caste">

                <input
                  name="studCaste"
                  value={form.studCaste}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Aadhaar Number">

                <input
                  name="aadhaarNumber"
                  value={form.aadhaarNumber}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

            </div>

          </div>

          {/* ================= CONTACT INFO ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <SectionTitle title="Contact Information" />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              <Field label="Student Phone">

                <input
                  name="studPhoneNumber"
                  value={form.studPhoneNumber}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Father Phone">

                <input
                  name="fatherPhone"
                  value={form.fatherPhone}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Father Email">

                <input
                  name="fatherEmail"
                  value={form.fatherEmail}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Mother Phone">

                <input
                  name="motherPhone"
                  value={form.motherPhone}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

            </div>

          </div>

          {/* ================= ADDRESS ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <SectionTitle title="Address Information" />

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">

              <Field label="Address">

                <textarea
                  rows="4"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <div className="grid gap-5">

                <Field label="State">

  <select
    name="state"
    value={form.state}
    onChange={(e) => {

      setForm({
        ...form,
        state: e.target.value,
        city: ""
      });

    }}
    className="border rounded-xl p-3"
  >

    <option value="">
      Select State
    </option>

    {
      Object.keys(indiaData).map((state) => (

        <option
          key={state}
          value={state}
        >
          {state}
        </option>

      ))
    }

  </select>

</Field>


<Field label="City">

  <select
    name="city"
    value={form.city}
    onChange={handleChange}
    className="border rounded-xl p-3"
  >

    <option value="">
      Select City
    </option>

    {
      form.state &&
      indiaData[form.state]?.map((city) => (

        <option
          key={city}
          value={city}
        >
          {city}
        </option>

      ))
    }

  </select>

</Field>

                <Field label="Pincode">

                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    className="border rounded-xl p-3"
                  />

                </Field>

              </div>

            </div>

          </div>

          {/* ================= EXTRA INFO ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <SectionTitle title="Extra Information" />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              <Field label="Previous School">

                <input
                  name="previousSchool"
                  value={form.previousSchool}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Monthly Fee">

                <input
                  type="number"
                  name="monthlyFee"
                  value={form.monthlyFee}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                />

              </Field>

              <Field label="Discounted Student">

                <select
                  name="discountedStudent"
                  value={form.discountedStudent}
                  onChange={handleChange}
                  className="border rounded-xl p-3"
                >

                  <option value={false}>
                    No
                  </option>

                  <option value={true}>
                    Yes
                  </option>

                </select>

              </Field>

            </div>

          </div>

          {/* ================= TRANSPORT ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <SectionTitle title="Transport Information" />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

              <Field label="Transport Required">

  <select
    name="transportRequired"
    value={form.transportRequired}
    onChange={(e) => {

      const value =
        e.target.value === "true";

      setForm((prev) => ({

        ...prev,

        transportRequired: value,

        // AUTO CLEAR
        pickupPoint:
          value
            ? prev.pickupPoint
            : "",

        assignedBusRoute:
          value
            ? prev.assignedBusRoute
            : ""
      }));

    }}
    className="border rounded-xl p-3"
  >

    <option value={false}>
      No
    </option>

    <option value={true}>
      Yes
    </option>

  </select>

</Field>

<Field label="Pickup Point">

  <input
    name="pickupPoint"
    value={form.pickupPoint}
    onChange={handleChange}

    disabled={!form.transportRequired}

    className={`border rounded-xl p-3 ${
      !form.transportRequired
        ? "bg-gray-100 cursor-not-allowed"
        : ""
    }`}
  />

</Field>

<Field label="Bus Route">

  <input
    name="assignedBusRoute"
    value={form.assignedBusRoute}
    onChange={handleChange}

    disabled={!form.transportRequired}

    className={`border rounded-xl p-3 ${
      !form.transportRequired
        ? "bg-gray-100 cursor-not-allowed"
        : ""
    }`}
  />

</Field>

            </div>

          </div>

          {/* ================= IMAGE ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <SectionTitle title="Student Photo" />

            <Field label="Upload Image">

              <input
                type="file"
                onChange={handleImage}
                className="border rounded-xl p-3"
              />

            </Field>

          </div>

          {/* ================= PARENT ACCOUNT ================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-3">

            <input
              type="checkbox"
              name="createParentAccount"
              checked={form.createParentAccount}
              onChange={handleChange}
              className="w-5 h-5"
            />

            <label className="font-semibold text-gray-700">
              Create Parent Account
            </label>

          </div>

          {/* ================= BUTTON ================= */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-700 to-cyan-600 hover:opacity-90 text-white py-4 rounded-2xl text-lg font-bold shadow-lg"
          >

            {
              loading
                ? "Creating Student..."
                : "Create Student"
            }

          </button>

        </form>

      </div>

      {/* ================= SUCCESS POPUP ================= */}

      {
        showPopup && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-2xl">

              <h2 className="text-2xl font-bold text-green-600 mb-4">
                Student Created Successfully
              </h2>

              <div className="space-y-3 text-gray-700">

  <p>
    <strong>Student ID:</strong>
    {" "}
    {credentials.studentId}
  </p>

  <p>
    <strong>Username:</strong>
    {" "}
    {credentials.username}
  </p>

  <p>
    <strong>Password:</strong>
    {" "}
    {credentials.password}
  </p>

  <p>
    <strong>Roll No:</strong>
    {" "}
    {credentials.studRollNo}
  </p>

</div>

              <button
                onClick={() => setShowPopup(false)}
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl"
              >
                Close
              </button>

            </div>

          </div>
        )
      }

    </div>
  );
}