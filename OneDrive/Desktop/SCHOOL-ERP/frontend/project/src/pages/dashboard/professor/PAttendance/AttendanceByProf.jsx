// import { useState } from "react";
// import axios from "axios";
// const lecturers = [
//   "Dr. Roshan  Chandekar(Prof)",
//   "Prof. Sagar Tarekar",
//   "Prof. BalaKrishna Das",
//   "Prof. Shambhavi Holay",
//   "Prof. Nikita Khanzode",
//   "Prof. Triveni Rahangdale",
//   "Prof. Aniket Girde",
// ];
// const subjects = [
//   "Software Testing and Quality Assurance",
//   "Data Science",
//   "Deep Learning",
//   "Asp. Net Using C#",
//   "Cloud Computing",
//   "Business Analytics",
// ];

// const AttendanceByProf = () => {
//   const [selectedLecturer, setSelectedLecturer] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [dates, setDates] = useState([]);
//   const [error, setError] = useState(null);

//   const fetchAttendance = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.get(
//         "http://localhost:8080/api/attendance/lecturer/subject",
//         {
//           params: {
//             lecturer: selectedLecturer,
//             subject: selectedSubject,
//           },
//         }
//       );

//       // Transform the response data
//       const transformedData = transformData(response.data);
//       setAttendanceRecords(transformedData.records);
//       setDates(transformedData.dates);
//     } catch (err) {
//       setError("Error fetching attendance data");
//       console.error("Error fetching attendance data:", err);
//     }
//   };

//   // Function to transform the fetched data
//   const transformData = (data) => {
//     const dates = Object.keys(data); // Extract dates
//     const studentRecords = {};

//     dates.forEach((date) => {
//       data[date].forEach((record) => {
//         if (!studentRecords[record.studentName]) {
//           studentRecords[record.studentName] = { id: record.id };
//         }
//         studentRecords[record.studentName][date] = record.status;
//       });
//     });

//     const records = Object.entries(studentRecords).map(
//       ([studentName, record]) => ({
//         studentName,
//         ...record,
//       })
//     );

//     return { records, dates };
//   };

//   return (
//     <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
//       <h2 className="text-2xl font-bold mb-4 text-center">View Attendance</h2>
//       <form onSubmit={fetchAttendance} className="mb-6">
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//           <div>
//             <label className="block text-sm font-bold mb-2">Lecturer</label>
//             <select
//               value={selectedLecturer}
//               onChange={(e) => setSelectedLecturer(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               required
//             >
//               <option value="">Select Lecturer</option>
//               {lecturers.map((lecturer, index) => (
//                 <option key={index} value={lecturer}>
//                   {lecturer}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm font-bold mb-2">Subject</label>
//             <select
//               value={selectedSubject}
//               onChange={(e) => setSelectedSubject(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded"
//               required
//             >
//               <option value="">Select Subject</option>
//               {subjects.map((subject, index) => (
//                 <option key={index} value={subject}>
//                   {subject}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//         <button
//           type="submit"
//           className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Fetch Attendance
//         </button>
//       </form>
//       {error && <p className="text-red-500 text-center">{error}</p>}
//       {attendanceRecords.length > 0 && (
//         <div>
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead>
//               <tr>
//                 <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm font-bold text-gray-600">
//                   Sr. No
//                 </th>
//                 <th className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm font-bold text-gray-600">
//                   Student Name
//                 </th>
//                 {dates.map((date, index) => (
//                   <th
//                     key={index}
//                     className="px-6 py-3 border-b border-gray-200 bg-gray-100 text-left text-sm font-bold text-gray-600"
//                   >
//                     {new Date(date).toLocaleDateString("en-GB")}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {attendanceRecords.map((record, index) => (
//                 <tr key={index}>
//                   <td className="px-6 py-4 border-b border-gray-200">
//                     {index + 1}
//                   </td>
//                   <td className="px-6 py-4 border-b border-gray-200">
//                     {record.studentName}
//                   </td>
//                   {dates.map((date, idx) => (
//                     <td
//                       key={idx}
//                       className="px-6 py-4 border-b border-gray-200"
//                     >
//                       {record[date] || "-"}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AttendanceByProf;





// import { useState, useEffect } from "react";
// import axios from "axios";

// const AttendanceByProf = () => {

//   const [professor, setProfessor] = useState(null);

//   const [classes, setClasses] = useState([]);

//   const [selectedClass, setSelectedClass] = useState("");

//   const [students, setStudents] = useState([]);

//   const [attendanceMap, setAttendanceMap] = useState({});

//   const [time, setTime] = useState("");

//   const [attendanceDate, setAttendanceDate] = useState("");

//   // =========================================
//   // LOAD INITIAL DATA
//   // =========================================
//   useEffect(() => {

//     const now = new Date();

//     setAttendanceDate(now.toISOString().split("T")[0]);

//     setTime(now.toTimeString().slice(0, 5));

//     // PROFESSOR
//     axios.get("http://localhost:8080/api/auth/me")
//       .then(res => {
//         setProfessor(res.data);
//       })
//       .catch(err => {
//         console.error("Professor API Error:", err);
//       });

//     // CLASSES
//     axios.get("http://localhost:8080/api/classes")
//       .then(res => {

//         console.log("CLASSES API RESPONSE => ", res.data);

//         if (Array.isArray(res.data)) {
//           setClasses(res.data);
//         } else {
//           setClasses([]);
//         }

//       })
//       .catch(err => {
//         console.error("Classes API Error:", err);
//         setClasses([]);
//       });

//   }, []);

//   // =========================================
//   // LOAD STUDENTS
//   // =========================================
//   useEffect(() => {

//     if (selectedClass) {

//       axios
//         .get(`http://localhost:8080/api/students/attendance/${selectedClass}`)
//         .then(res => {

//           console.log("STUDENTS => ", res.data);

//           setStudents(res.data);

//           const map = {};

//           res.data.forEach(student => {
//             map[student.id] = "PRESENT";
//           });

//           setAttendanceMap(map);

//         })
//         .catch(err => {
//           console.error("Students API Error:", err);
//         });

//     }

//   }, [selectedClass]);

//   // =========================================
//   // PREFILL EXISTING ATTENDANCE
//   // =========================================
//   useEffect(() => {

//     if (selectedClass && attendanceDate) {

//       axios
//         .get(
//           `http://localhost:8080/api/attendance/class/${selectedClass}/date/${attendanceDate}`
//         )
//         .then(res => {

//           console.log("EXISTING ATTENDANCE => ", res.data);

//           if (res.data?.students) {

//             const existingMap = {};

//             res.data.students.forEach(student => {
//               existingMap[student.studentId] = student.status;
//             });

//             setAttendanceMap(prev => ({
//               ...prev,
//               ...existingMap
//             }));

//           }

//         })
//         .catch(err => {
//           console.error("Prefill Error:", err);
//         });

//     }

//   }, [selectedClass, attendanceDate]);

//   // =========================================
//   // HANDLE STATUS CHANGE
//   // =========================================
//   const handleChange = (id, value) => {

//     setAttendanceMap(prev => ({
//       ...prev,
//       [id]: value
//     }));

//   };

//   // =========================================
//   // MARK ALL
//   // =========================================
//   const markAll = (status) => {

//     const updated = {};

//     students.forEach(student => {
//       updated[student.id] = status;
//     });

//     setAttendanceMap(updated);

//   };

//   // =========================================
//   // COUNTS
//   // =========================================
//   const presentCount = Object.values(attendanceMap)
//     .filter(v => v === "PRESENT").length;

//   const absentCount = Object.values(attendanceMap)
//     .filter(v => v === "ABSENT").length;

//   // =========================================
//   // SUBMIT
//   // =========================================
//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     if (!selectedClass) {
//       alert("Please select class");
//       return;
//     }

//     const studentsList = students.map(student => ({
//       studentId: student.id,
//       status: attendanceMap[student.id] || "ABSENT"
//     }));

//     const data = {
//       lecturer: professor?.name || "Unknown",
//       subject: "GENERAL",
//       classNumber: parseInt(selectedClass),
//       date: attendanceDate,
//       time: time + ":00",
//       students: studentsList
//     };

//     console.log("SUBMIT DATA => ", data);

//     try {

//       await axios.post(
//         "http://localhost:8080/api/attendance/save",
//         data
//       );

//       alert("✅ Attendance Saved Successfully");

//     } catch (err) {

//       console.error("SAVE ERROR => ", err);

//       if (err.response?.data?.message) {
//         alert(err.response.data.message);
//       } else {
//         alert("❌ Failed To Save Attendance");
//       }

//     }

//   };

//   return (

//     <div className="max-w-7xl mx-auto p-6">

//       <div className="bg-white shadow-2xl rounded-3xl p-6">

//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">
//               Class Attendance
//             </h1>

//             <p className="text-gray-500 mt-1">
//               Manage student attendance easily
//             </p>
//           </div>

//           <div className="mt-4 md:mt-0 bg-gray-100 px-5 py-3 rounded-2xl">
//             <h3 className="font-bold text-lg text-gray-700">
//               {professor?.name || "Loading..."}
//             </h3>

//             <p className="text-sm text-gray-500">
//               Professor Dashboard
//             </p>
//           </div>

//         </div>

//         <form onSubmit={handleSubmit}>

//           {/* FILTER SECTION */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

//             {/* CLASS */}
//             <select
//               value={selectedClass}
//               onChange={(e) => {

//                 setSelectedClass(e.target.value);

//                 setStudents([]);

//               }}
//               className="border rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >

//               <option value="">
//                 Select Class
//               </option>

//               {Array.isArray(classes) &&
//                 classes.length > 0 &&
//                 classes.map((c, index) => {

//                   console.log("CLASS => ", c);

//                   return (
//                     <option
//                       key={c.id || index}
//                       value={c.classNumber || c.id}
//                     >
//                       {c.className || c.name || `Class ${index + 1}`}
//                     </option>
//                   );

//                 })}

//             </select>

//             {/* DATE */}
//             <input
//               type="date"
//               value={attendanceDate}
//               onChange={(e) => setAttendanceDate(e.target.value)}
//               className="border rounded-2xl p-3"
//               required
//             />

//             {/* TIME */}
//             <input
//               type="time"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//               className="border rounded-2xl p-3"
//               required
//             />

//             {/* SAVE */}
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-semibold rounded-2xl"
//             >
//               Save Attendance
//             </button>

//           </div>

//           {/* STATS */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

//             {/* PRESENT */}
//             <div className="bg-green-100 p-5 rounded-2xl shadow-sm">

//               <h2 className="text-3xl font-bold text-green-700">
//                 {presentCount}
//               </h2>

//               <p className="text-green-600 mt-1">
//                 Present
//               </p>

//             </div>

//             {/* ABSENT */}
//             <div className="bg-red-100 p-5 rounded-2xl shadow-sm">

//               <h2 className="text-3xl font-bold text-red-700">
//                 {absentCount}
//               </h2>

//               <p className="text-red-600 mt-1">
//                 Absent
//               </p>

//             </div>

//             {/* TOTAL */}
//             <div className="bg-blue-100 p-5 rounded-2xl shadow-sm">

//               <h2 className="text-3xl font-bold text-blue-700">
//                 {students.length}
//               </h2>

//               <p className="text-blue-600 mt-1">
//                 Total Students
//               </p>

//             </div>

//             {/* MARK ALL */}
//             <div className="flex gap-2">

//               <button
//                 type="button"
//                 onClick={() => markAll("PRESENT")}
//                 className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold"
//               >
//                 Mark All P
//               </button>

//               <button
//                 type="button"
//                 onClick={() => markAll("ABSENT")}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold"
//               >
//                 Mark All A
//               </button>

//             </div>

//           </div>

//           {/* TABLE */}
//           <div className="border rounded-3xl overflow-hidden shadow-sm">

//             <div className="max-h-[550px] overflow-y-auto">

//               <table className="w-full">

//                 {/* TABLE HEADER */}
//                 <thead className="bg-gray-100 sticky top-0 z-10">

//                   <tr>

//                     <th className="text-left p-4 font-bold text-gray-700">
//                       #
//                     </th>

//                     <th className="text-left p-4 font-bold text-gray-700">
//                       Student Name
//                     </th>

//                     <th className="text-center p-4 font-bold text-gray-700">
//                       Attendance Status
//                     </th>

//                   </tr>

//                 </thead>

//                 {/* TABLE BODY */}
//                 <tbody>

//                   {students.length === 0 ? (

//                     <tr>

//                       <td
//                         colSpan="3"
//                         className="text-center p-10 text-gray-400 text-lg"
//                       >
//                         Select class to load students
//                       </td>

//                     </tr>

//                   ) : (

//                     students.map((student, index) => (

//                       <tr
//                         key={student.id}
//                         className="border-t hover:bg-gray-50 transition-all"
//                       >

//                         {/* ROLL */}
//                         <td className="p-4 font-semibold">
//                           {index + 1}
//                         </td>

//                         {/* NAME */}
//                         <td className="p-4">
//                           {student.studName || student.name}
//                         </td>

//                         {/* BUTTONS */}
//                         <td className="p-4">

//                           <div className="flex justify-center gap-3">

//                             {/* PRESENT */}
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleChange(student.id, "PRESENT")
//                               }
//                               className={`px-5 py-2 rounded-2xl font-semibold transition-all duration-300
//                                ${attendanceMap[student.id] === "PRESENT"
//                                   ? "bg-green-600 text-white shadow-lg scale-105"
//                                   : "bg-gray-200 hover:bg-green-100"
//                                 }`}
//                             >
//                               Present
//                             </button>

//                             {/* ABSENT */}
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleChange(student.id, "ABSENT")
//                               }
//                               className={`px-5 py-2 rounded-2xl font-semibold transition-all duration-300
//                                ${attendanceMap[student.id] === "ABSENT"
//                                   ? "bg-red-600 text-white shadow-lg scale-105"
//                                   : "bg-gray-200 hover:bg-red-100"
//                                 }`}
//                             >
//                               Absent
//                             </button>

//                           </div>

//                         </td>

//                       </tr>

//                     ))

//                   )}

//                 </tbody>

//               </table>

//             </div>

//           </div>

//         </form>

//       </div>

//     </div>

//   );

// };

// export default AttendanceByProf;





//testing for attendance by prof




// import { useState, useEffect } from "react";
// import axios from "axios";

// const AttendanceByProf = () => {

//   const [professor, setProfessor] = useState(null);

//   const [classes, setClasses] = useState([]);

//   const [selectedClass, setSelectedClass] = useState("");

//   const [students, setStudents] = useState([]);

//   const [attendanceMap, setAttendanceMap] = useState({});

//   const [time, setTime] = useState("");

//   const [attendanceDate, setAttendanceDate] = useState("");

//   // =========================================
//   // LOAD INITIAL DATA
//   // =========================================
//   useEffect(() => {

//     const now = new Date();

//     setAttendanceDate(now.toISOString().split("T")[0]);

//     setTime(now.toTimeString().slice(0, 5));

//     // =========================================
//     // PROFESSOR
//     // =========================================
//     axios.get("http://localhost:8080/api/auth/me")

//       .then(res => {

//         setProfessor(res.data);

//       })

//       .catch(err => {

//         console.error("Professor API Error:", err);

//       });

//     // =========================================
//     // CLASSES
//     // =========================================
//     axios.get("http://localhost:8080/api/classes")

//       .then(res => {

//         console.log("CLASSES API RESPONSE => ", res.data);

//         if (Array.isArray(res.data)) {

//           setClasses(res.data);

//         } else {

//           setClasses([]);

//         }

//       })

//       .catch(err => {

//         console.error("Classes API Error:", err);

//         setClasses([]);

//       });

//   }, []);

//   // =========================================
//   // LOAD STUDENTS
//   // =========================================
//   useEffect(() => {

//     if (selectedClass) {

//       axios
//         .get(`http://localhost:8080/api/students/attendance/${selectedClass}`)

//         .then(res => {

//           console.log("STUDENTS => ", res.data);

//           setStudents(res.data);

//           const map = {};

//           res.data.forEach(student => {

//             map[student.id] = "PRESENT";

//           });

//           setAttendanceMap(map);

//         })

//         .catch(err => {

//           console.error("Students API Error:", err);

//         });

//     }

//   }, [selectedClass]);

//   // =========================================
//   // PREFILL EXISTING ATTENDANCE
//   // =========================================
//   useEffect(() => {

//     if (selectedClass && attendanceDate) {

//       axios
//         .get(
//           `http://localhost:8080/api/stu-attendance/class/${selectedClass}/date/${attendanceDate}`
//         )

//         .then(res => {

//           console.log("EXISTING ATTENDANCE => ", res.data);

//           if (Array.isArray(res.data) && res.data.length > 0) {

//             const existingMap = {};

//             res.data.forEach(record => {

//               existingMap[record.studentId] = record.status;

//             });

//             setAttendanceMap(prev => ({
//               ...prev,
//               ...existingMap
//             }));

//           }

//         })

//         .catch(err => {

//           console.error("Prefill Error:", err);

//         });

//     }

//   }, [selectedClass, attendanceDate]);

//   // =========================================
//   // HANDLE STATUS CHANGE
//   // =========================================
//   const handleChange = (id, value) => {

//     setAttendanceMap(prev => ({
//       ...prev,
//       [id]: value
//     }));

//   };

//   // =========================================
//   // MARK ALL
//   // =========================================
//   const markAll = (status) => {

//     const updated = {};

//     students.forEach(student => {

//       updated[student.id] = status;

//     });

//     setAttendanceMap(updated);

//   };

//   // =========================================
//   // COUNTS
//   // =========================================
//   const presentCount = Object.values(attendanceMap)
//     .filter(v => v === "PRESENT").length;

//   const absentCount = Object.values(attendanceMap)
//     .filter(v => v === "ABSENT").length;

//   // =========================================
//   // SUBMIT ATTENDANCE
//   // =========================================
//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     if (!selectedClass) {

//       alert("Please select class");

//       return;

//     }

//     const studentsList = students.map(student => ({

//       studentId: student.id,

//       status: attendanceMap[student.id] || "ABSENT"

//     }));

//     // =========================================
//     // PAYLOAD
//     // =========================================
//     const payload = {

//       className: selectedClass,

//       attendanceDate: attendanceDate,

//       students: studentsList

//     };

//     console.log("FINAL PAYLOAD => ", payload);

//     try {

//       const response = await axios.post(

//         "http://localhost:8080/api/stu-attendance/save",

//         payload

//       );

//       console.log("SAVE RESPONSE => ", response.data);

//       alert(
//         response.data?.message ||
//         "✅ Attendance Saved Successfully"
//       );

//     } catch (err) {

//       console.error("SAVE ERROR => ", err);

//       if (err.response?.data?.message) {

//         alert(err.response.data.message);

//       } else if (typeof err.response?.data === "string") {

//         alert(err.response.data);

//       } else {

//         alert("❌ Failed To Save Attendance");

//       }

//     }

//   };

//   return (

//     <div className="max-w-7xl mx-auto p-6">

//       <div className="bg-white shadow-2xl rounded-3xl p-6">

//         {/* HEADER */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

//           <div>

//             <h1 className="text-3xl font-bold text-gray-800">
//               Class Attendance
//             </h1>

//             <p className="text-gray-500 mt-1">
//               Manage student attendance easily
//             </p>

//           </div>

//           <div className="mt-4 md:mt-0 bg-gray-100 px-5 py-3 rounded-2xl">

//             <h3 className="font-bold text-lg text-gray-700">

//               {professor?.name || "Loading..."}

//             </h3>

//             <p className="text-sm text-gray-500">

//               Professor Dashboard

//             </p>

//           </div>

//         </div>

//         <form onSubmit={handleSubmit}>

//           {/* FILTER SECTION */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

//             {/* CLASS */}
//             <select
//               value={selectedClass}
//               onChange={(e) => {

//                 setSelectedClass(e.target.value);

//                 setStudents([]);

//               }}
//               className="border rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >

//               <option value="">
//                 Select Class
//               </option>

//               {Array.isArray(classes) &&
//                 classes.length > 0 &&
//                 classes.map((c, index) => (

//                   <option
//                     key={c.id || index}
//                     value={c.classNumber || c.id}
//                   >

//                     {c.className || c.name || `Class ${index + 1}`}

//                   </option>

//                 ))}

//             </select>

//             {/* DATE */}
//             <input
//               type="date"
//               value={attendanceDate}
//               onChange={(e) => setAttendanceDate(e.target.value)}
//               className="border rounded-2xl p-3"
//               required
//             />

//             {/* TIME */}
//             <input
//               type="time"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//               className="border rounded-2xl p-3"
//               required
//             />

//             {/* SAVE */}
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-semibold rounded-2xl"
//             >

//               Save Attendance

//             </button>

//           </div>

//           {/* STATS */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

//             {/* PRESENT */}
//             <div className="bg-green-100 p-5 rounded-2xl shadow-sm">

//               <h2 className="text-3xl font-bold text-green-700">
//                 {presentCount}
//               </h2>

//               <p className="text-green-600 mt-1">
//                 Present
//               </p>

//             </div>

//             {/* ABSENT */}
//             <div className="bg-red-100 p-5 rounded-2xl shadow-sm">

//               <h2 className="text-3xl font-bold text-red-700">
//                 {absentCount}
//               </h2>

//               <p className="text-red-600 mt-1">
//                 Absent
//               </p>

//             </div>

//             {/* TOTAL */}
//             <div className="bg-blue-100 p-5 rounded-2xl shadow-sm">

//               <h2 className="text-3xl font-bold text-blue-700">
//                 {students.length}
//               </h2>

//               <p className="text-blue-600 mt-1">
//                 Total Students
//               </p>

//             </div>

//             {/* MARK ALL */}
//             <div className="flex gap-2">

//               <button
//                 type="button"
//                 onClick={() => markAll("PRESENT")}
//                 className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold"
//               >

//                 Mark All P

//               </button>

//               <button
//                 type="button"
//                 onClick={() => markAll("ABSENT")}
//                 className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold"
//               >

//                 Mark All A

//               </button>

//             </div>

//           </div>

//           {/* TABLE */}
//           <div className="border rounded-3xl overflow-hidden shadow-sm">

//             <div className="max-h-[550px] overflow-y-auto">

//               <table className="w-full">

//                 {/* TABLE HEADER */}
//                 <thead className="bg-gray-100 sticky top-0 z-10">

//                   <tr>

//                     <th className="text-left p-4 font-bold text-gray-700">
//                       #
//                     </th>

//                     <th className="text-left p-4 font-bold text-gray-700">
//                       Student Name
//                     </th>

//                     <th className="text-center p-4 font-bold text-gray-700">
//                       Attendance Status
//                     </th>

//                   </tr>

//                 </thead>

//                 {/* TABLE BODY */}
//                 <tbody>

//                   {students.length === 0 ? (

//                     <tr>

//                       <td
//                         colSpan="3"
//                         className="text-center p-10 text-gray-400 text-lg"
//                       >

//                         Select class to load students

//                       </td>

//                     </tr>

//                   ) : (

//                     students.map((student, index) => (

//                       <tr
//                         key={student.id}
//                         className="border-t hover:bg-gray-50 transition-all"
//                       >

//                         {/* SERIAL */}
//                         <td className="p-4 font-semibold">
//                           {index + 1}
//                         </td>

//                         {/* NAME */}
//                         <td className="p-4">
//                           {student.studName || student.name}
//                         </td>

//                         {/* STATUS */}
//                         <td className="p-4">

//                           <div className="flex justify-center gap-3">

//                             {/* PRESENT */}
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleChange(student.id, "PRESENT")
//                               }
//                               className={`px-5 py-2 rounded-2xl font-semibold transition-all duration-300
//                               ${
//                                 attendanceMap[student.id] === "PRESENT"
//                                   ? "bg-green-600 text-white shadow-lg scale-105"
//                                   : "bg-gray-200 hover:bg-green-100"
//                               }`}
//                             >

//                               Present

//                             </button>

//                             {/* ABSENT */}
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 handleChange(student.id, "ABSENT")
//                               }
//                               className={`px-5 py-2 rounded-2xl font-semibold transition-all duration-300
//                               ${
//                                 attendanceMap[student.id] === "ABSENT"
//                                   ? "bg-red-600 text-white shadow-lg scale-105"
//                                   : "bg-gray-200 hover:bg-red-100"
//                               }`}
//                             >

//                               Absent

//                             </button>

//                           </div>

//                         </td>

//                       </tr>

//                     ))

//                   )}

//                 </tbody>

//               </table>

//             </div>

//           </div>

//         </form>

//       </div>

//     </div>

//   );

// };

// export default AttendanceByProf;









// =========================================

import { useState, useEffect } from "react";
import axios from "axios";

const AttendanceByProf = () => {

  // =========================================
  // STATES
  // =========================================
  const [professor, setProfessor] = useState(null);

  const [classes, setClasses] = useState([]);

  // CLASS ID STORE HOGA
  const [selectedClass, setSelectedClass] = useState("");

  const [students, setStudents] = useState([]);

  const [attendanceMap, setAttendanceMap] = useState({});

  const [time, setTime] = useState("");

  const [attendanceDate, setAttendanceDate] = useState("");

  // =========================================
  // FIND SELECTED CLASS OBJECT
  // =========================================
  const selectedClassObj = classes.find(
    (c) => String(c.id) === String(selectedClass)
  );

  // =========================================
  // INITIAL LOAD
  // =========================================
  useEffect(() => {

    const now = new Date();

    setAttendanceDate(
      now.toISOString().split("T")[0]
    );

    setTime(
      now.toTimeString().slice(0, 5)
    );

    // =========================================
    // LOAD PROFESSOR FROM LOCAL STORAGE
    // =========================================
    const storedProfessor =
      localStorage.getItem("professorData");

    if (storedProfessor) {

      const parsedProfessor =
        JSON.parse(storedProfessor);

      // console.log(
      //   "PROFESSOR FROM STORAGE => ",
      //   parsedProfessor
      // );

      setProfessor(parsedProfessor);

    } else {

      console.log(
        "NO PROFESSOR FOUND IN STORAGE"
      );

    }

    // =========================================
    // LOAD CLASSES
    // =========================================
    axios
      .get("http://localhost:8080/api/classes")

      .then((res) => {

        // console.log(
        //   "CLASSES => ",
        //   res.data
        // );

        if (Array.isArray(res.data)) {

          setClasses(res.data);

        } else {

          setClasses([]);

        }

      })

      .catch((err) => {

        console.error(
          "Classes API Error:",
          err
        );

        setClasses([]);

      });

  }, []);

  // =========================================
  // LOAD STUDENTS
  // =========================================
  useEffect(() => {

    if (selectedClass) {

      console.log(
        "FETCHING STUDENTS FOR CLASS ID => ",
        selectedClass
      );

      axios

        .get(
          `http://localhost:8080/api/students/attendance/${selectedClass}`
        )

        .then((res) => {

          console.log(
            "STUDENTS => ",
            res.data
          );

          if (Array.isArray(res.data)) {

            setStudents(res.data);

            const map = {};

            res.data.forEach((student) => {

              map[student.id] =
                "PRESENT";

            });

            setAttendanceMap(map);

          } else {

            setStudents([]);

          }

        })

        .catch((err) => {

          console.error(
            "Students API Error:",
            err
          );

          setStudents([]);

        });

    }

  }, [selectedClass]);

  // =========================================
  // PREFILL ATTENDANCE
  // =========================================
  useEffect(() => {

    if (
      selectedClassObj?.className &&
      attendanceDate
    ) {

      axios

        .get(
          `http://localhost:8080/api/stu-attendance/class/${selectedClassObj.className}/date/${attendanceDate}`
        )

        .then((res) => {

          console.log(
            "PREFILL => ",
            res.data
          );

          if (Array.isArray(res.data)) {

            const existingMap = {};

            res.data.forEach((record) => {

              existingMap[
                record.studentId
              ] = record.status;

            });

            setAttendanceMap((prev) => ({
              ...prev,
              ...existingMap,
            }));

          }

        })

        .catch((err) => {

          console.error(
            "Prefill Error:",
            err
          );

        });

    }

  }, [selectedClassObj, attendanceDate]);

  // =========================================
  // CHANGE STATUS
  // =========================================
  const handleChange = (id, value) => {

    setAttendanceMap((prev) => ({

      ...prev,

      [id]: value,

    }));

  };

  // =========================================
  // MARK ALL
  // =========================================
  const markAll = (status) => {

    const updated = {};

    students.forEach((student) => {

      updated[student.id] =
        status;

    });

    setAttendanceMap(updated);

  };

  // =========================================
  // COUNTS
  // =========================================
  const presentCount =
    Object.values(attendanceMap)
      .filter(
        (v) => v === "PRESENT"
      ).length;

  const absentCount =
    Object.values(attendanceMap)
      .filter(
        (v) => v === "ABSENT"
      ).length;

  // =========================================
  // SAVE ATTENDANCE
  // =========================================
  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!selectedClass) {

      alert("Please select class");

      return;

    }

    // =========================================
    // DEBUG PROFESSOR
    // =========================================
    console.log(
      "PROFESSOR FULL DATA => ",
      professor
    );

    console.log(
      "PROFESSOR NAME => ",
      professor?.name
    );

    const studentsList =
      students.map((student) => ({

        studentId: student.id,

        status:
          attendanceMap[
            student.id
          ] || "ABSENT",

      }));

    // =========================================
    // FINAL PAYLOAD
    // =========================================
    const payload = {

      // BACKEND KO CLASS NAME JAYEGA
      className:
        selectedClassObj?.className || "",

      attendanceDate:
        attendanceDate,

      attendanceTime:
        time,

      // =========================================
      // FINAL PROFESSOR FIX
      // =========================================
      professorName:
        String(

          professor?.name ||

          professor?.username ||

          "Unknown Professor"

        ).trim(),

      subjectName:
        "GENERAL",

      students:
        studentsList,

    };

    console.log(
      "FINAL PAYLOAD => ",
      payload
    );

    try {

      const response =
        await axios.post(

          "http://localhost:8080/api/stu-attendance/save",

          payload

        );

      console.log(
        "SAVE RESPONSE => ",
        response.data
      );

      alert(

        response.data?.message ||

        "✅ Attendance Saved Successfully"

      );

    } catch (err) {

      console.error(
        "SAVE ERROR => ",
        err
      );

      if (
        err.response?.data?.message
      ) {

        alert(
          err.response.data.message
        );

      } else if (

        typeof err.response?.data
        === "string"

      ) {

        alert(
          err.response.data
        );

      } else {

        alert(
          "❌ Failed To Save Attendance"
        );

      }

    }

  };

  return (

    <div className="max-w-7xl mx-auto p-6">

      <div className="bg-white shadow-2xl rounded-3xl p-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Class Attendance
            </h1>

            <p className="text-gray-500 mt-1">
              Manage student attendance easily
            </p>

          </div>

          <div className="mt-4 md:mt-0 bg-gray-100 px-5 py-3 rounded-2xl">

            <h3 className="font-bold text-lg text-gray-700">

              {professor?.name ||

                professor?.username ||

                "Loading..."}

            </h3>

            <p className="text-sm text-gray-500">

              Professor Dashboard

            </p>

          </div>

        </div>

        <form onSubmit={handleSubmit}>

          {/* FILTERS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

            {/* CLASS */}
            <select
              value={selectedClass}
              onChange={(e) => {

                setSelectedClass(
                  e.target.value
                );

                setStudents([]);

              }}
              className="border rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >

              <option value="">
                Select Class
              </option>

              {classes.map((c, index) => (

                <option
                  key={c.id || index}
                  value={c.id}
                >

                  {c.className ||

                    c.name ||

                    `Class ${index + 1}`}

                </option>

              ))}

            </select>

            {/* DATE */}
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) =>
                setAttendanceDate(
                  e.target.value
                )
              }
              className="border rounded-2xl p-3"
              required
            />

            {/* TIME */}
            <input
              type="time"
              value={time}
              onChange={(e) =>
                setTime(
                  e.target.value
                )
              }
              className="border rounded-2xl p-3"
              required
            />

            {/* SAVE */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white font-semibold rounded-2xl"
            >

              Save Attendance

            </button>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

            <div className="bg-green-100 p-5 rounded-2xl shadow-sm">

              <h2 className="text-3xl font-bold text-green-700">

                {presentCount}

              </h2>

              <p className="text-green-600 mt-1">
                Present
              </p>

            </div>

            <div className="bg-red-100 p-5 rounded-2xl shadow-sm">

              <h2 className="text-3xl font-bold text-red-700">

                {absentCount}

              </h2>

              <p className="text-red-600 mt-1">
                Absent
              </p>

            </div>

            <div className="bg-blue-100 p-5 rounded-2xl shadow-sm">

              <h2 className="text-3xl font-bold text-blue-700">

                {students.length}

              </h2>

              <p className="text-blue-600 mt-1">
                Total Students
              </p>

            </div>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() =>
                  markAll("PRESENT")
                }
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold"
              >

                Mark All P

              </button>

              <button
                type="button"
                onClick={() =>
                  markAll("ABSENT")
                }
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-semibold"
              >

                Mark All A

              </button>

            </div>

          </div>

          {/* TABLE */}
          <div className="border rounded-3xl overflow-hidden shadow-sm">

            <div className="max-h-[550px] overflow-y-auto">

              <table className="w-full">

                <thead className="bg-gray-100 sticky top-0 z-10">

                  <tr>

                    <th className="text-left p-4">
                      #
                    </th>

                    <th className="text-left p-4">
                      Student Name
                    </th>

                    <th className="text-center p-4">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {students.length === 0 ? (

                    <tr>

                      <td
                        colSpan="3"
                        className="text-center p-10 text-gray-400"
                      >

                        Select class to load students

                      </td>

                    </tr>

                  ) : (

                    students.map((student, index) => (

                      <tr
                        key={student.id}
                        className="border-t hover:bg-gray-50"
                      >

                        <td className="p-4 font-semibold">

                          {index + 1}

                        </td>

                        <td className="p-4">

                          {student.studName ||
                            student.name}

                        </td>

                        <td className="p-4">

                          <div className="flex justify-center gap-3">

                            <button
                              type="button"
                              onClick={() =>
                                handleChange(
                                  student.id,
                                  "PRESENT"
                                )
                              }
                              className={`px-5 py-2 rounded-2xl font-semibold transition-all
                              ${
                                attendanceMap[
                                  student.id
                                ] === "PRESENT"
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-200"
                              }`}
                            >

                              Present

                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleChange(
                                  student.id,
                                  "ABSENT"
                                )
                              }
                              className={`px-5 py-2 rounded-2xl font-semibold transition-all
                              ${
                                attendanceMap[
                                  student.id
                                ] === "ABSENT"
                                  ? "bg-red-600 text-white"
                                  : "bg-gray-200"
                              }`}
                            >

                              Absent

                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </form>

      </div>

    </div>

  );

};

export default AttendanceByProf;