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
// const students = [
//   "Aastha Parmeshwar Dhongade",
//   "Akshata Gautam Parghane",
//   "Anushka Gautam Fulkar",
//   "Anushka Rajesh Gudsundare",
//   "Apeksha Sunil Gadpayale",
//   "Apoorva Dinesh Moon",
//   "Ashwini Motiram Kawale",
//   "Diksha Siddharth Sontakke",
//   "Dipti Deepak Golait",
//   "Disha Deorao Raut",
//   "Divya Diwanji Madaye",
//   "Gayatri Anil Karadbhajane",
//   "Janvi Prakash Chincholkar",
//   "Kalyani Sureshrao Lonare",
//   "Komal Ravindra Gaikwad",
//   "Laxmi Mohan Badge",
//   "Likhita Dinesh Khonde",
//   "Neha Umesh Nagose",
//   "Nikita Maroti Chahande",
//   "Pallavi Rambhau Munghate",
//   "Prachi Ghanshyam Bharre",
//   "Priya Raju Koche",
//   "Puja Zanakalal Kodwate",
//   "Ragini Rajesh Waghmare",
//   "Rashmi Ramesh Fulzele",
//   "Ritika Nagaji Paikrao",
//   "Rutuja Krishnaji Nagpure",
//   "Sachi Ravindra Jiwane",
//   "Samiksha Sunil Fule",
//   "Sanskruti Ganesh Charde",
//   "Sejal Ashok Mohitkar",
//   "Shruti Ashish Amley",
//   "Shruti Satish Khobragade",
//   "Shubhangini Omprakash Bhoyar",
//   "Siya Satish Turkar",
//   "Srushti Pramod Dahekar",
//   "Tannu Chandrashekhar Kamble",
//   "Unnati Mahendra Shende",
//   "Yugeshwari Lomeshwar Isapure",
//   "Adarsh Baban Sathe",
//   "Akshay Kishor Khanke",
//   "Akshay Rameshrao Wawarkar",
//   "Alpesh Dhanraj Ande",
//   "Aman Baban Bagade",
//   "Amit Ganpat Konge",
//   "Aryan Shravanji Ganeshkar",
//   "Ashik Chotu Kewat",
//   "Ayush Mahendra Kopulwar",
//   "Ayush Sudhakar Bhakte",
//   "Chandan Vinod Jadhav",
//   "Chetan Ashok Modak",
//   "Chirag Ganesh Mohature",
//   "Dikshant Naresh Kamble",
//   "Divyanshu Anant Lamsoge",
//   "Gaurav Ramlal Nakhate",
//   "Gaurav Mangesh Umare",
//   "Harsh Manoj Nagdeve",
//   "Harshal Kolba Khapekar",
//   "Himanshu Prashant Meshram",
//   "Hitesh Govindrao Barde",
//   "Kaushik Kartik Dhongade",
//   "Kuldeep Suresh Thakre",
//   "Mohan Dattaji Masurkar",
//   "Piyush Ashok Ghugal",
//   "Piyush Kishor Gaidhane",
//   "Pranay Laxminarayan Mohankar",
//   "Pranay Narayan Bawane",
//   "Pratham Kamlesh Shambharkar",
//   "Pratham Vijay Mohile",
//   "Prathmesh Kishor Lokhande",
//   "Pratik Balu Gondkar",
//   "Pratik Gautam Dhakne",
//   "Pratik Ramkrushna Mendhe",
//   "Rehan Ali Rizwan Ali Nawab",
//   "Ritesh Praful Yesmbare",
//   "Rohit Khushal Raut",
//   "Rohit Raju Kosare",
//   "Sanath Chandrashekhar Bansod",
//   "Sarang Yuvraj Mate",
//   "Shubham Dudharam Tighare",
//   "Sourabh Rajendra Meshram",
//   "Sushant Shankar Khelkar",
//   "Tushar Shivkumar Zade",
//   "Vinay Rajaram Gawande",
//   "Vishal Rajesh Mohod",
//   "Vishwajeet Virendra Singh",
//   "Yash Ravindra Navnage",
//   "Yash Yadavrao Yawale",
// ];

// const AttendanceForm = () => {
//   const [lecturer, setLecturer] = useState("");
//   const [subject, setSubject] = useState("");
//   const [time, setTime] = useState(""); // Initialize as empty
//   const [attendanceDate, setAttendanceDate] = useState("");
//   const [attendanceList, setAttendanceList] = useState(
//     students.map((student) => ({
//       studentName: student,
//       status: false,
//     }))
//   );

//   const handleLecturerChange = (e) => setLecturer(e.target.value);
//   const handleSubjectChange = (e) => setSubject(e.target.value);
//   const handleTimeChange = (e) => setTime(e.target.value); // Update time state
//   const handleDateChange = (e) => setAttendanceDate(e.target.value);

//   const handleAttendanceChange = (index) => {
//     const updatedAttendanceList = [...attendanceList];
//     updatedAttendanceList[index].status = !updatedAttendanceList[index].status;
//     setAttendanceList(updatedAttendanceList);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formattedTime = time + ":00"; // Format time to HH:mm:ss

//     const attendanceData = {
//       lecturer,
//       subject,
//       time: formattedTime,
//       attendanceDate,
//       attendanceList: attendanceList.map((student) => ({
//         studentName: student.studentName,
//         status: student.status ? "P" : "A",
//       })),
//     };

//     try {
//       const response = await axios.post(
//         "http://localhost:8080/api/attendance/save",
//         attendanceData
//       );
//       console.log("Attendance submitted successfully:", response.data);
//       alert("successful submission");

//       setLecturer("");
//       setSubject("");
//       setTime("");
//       setAttendanceDate("");
//       setAttendanceList(
//         students.map((student) => ({
//           studentName: student,
//           status: false,
//         }))
//       );
//     } catch (error) {
//       console.error("Error submitting attendance:", error);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
//       <h2 className="text-2xl font-bold mb-4 text-center">Attendance Form</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
//         {/* Form Inputs */}
//         <div className="flex-1 space-y-3 space-x-2  ">
//           {/* Lecturer Dropdown */}
//           <div>
//             <label className="block font-medium mb-2">Lecturer:</label>
//             <select
//               value={lecturer}
//               onChange={handleLecturerChange}
//               className="w-full border border-gray-300 rounded-md p-2"
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

//           {/* Subject Dropdown */}
//           <div>
//             <label className="block font-medium mb-2">Subject:</label>
//             <select
//               value={subject}
//               onChange={handleSubjectChange}
//               className="w-full border border-gray-300 rounded-md p-2"
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

//           {/* Time Input */}
//           <div>
//             <label className="block font-medium mb-2">Time:</label>
//             <input
//               type="time"
//               value={time}
//               onChange={handleTimeChange}
//               className="w-full border border-gray-300 rounded-md p-2"
//               required
//             />
//           </div>

//           {/* Date Picker */}
//           <div>
//             <label className="block font-medium mb-2">Attendance Date:</label>
//             <input
//               type="date"
//               value={attendanceDate}
//               onChange={handleDateChange}
//               className="w-full border border-gray-300 rounded-md p-2"
//               required
//             />
//           </div>
//         </div>

//         {/* Student List */}
//         <div className="flex-1 overflow-auto h-80 bg-gray-50 p-4 rounded-md border border-gray-300">
//           <label className="block font-medium mb-2">Students:</label>
//           <div className="space-y-2">
//             {attendanceList.map((student, index) => (
//               <div key={index} className="flex items-center">
//                 <input
//                   type="checkbox"
//                   checked={student.status}
//                   onChange={() => handleAttendanceChange(index)}
//                   className="mr-4 h-4 w-4"
//                 />
//                 <span className="text-lg">{student.studentName}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           className="w-20 h-10 bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 mt-4 lg:mt-0"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AttendanceForm;



// after update


import { useState, useEffect } from "react";
import axios from "axios";

const lecturers = [
  "Dr. Roshan  Chandekar(Prof)",
  "Prof. Sagar Tarekar",
  "Prof. BalaKrishna Das",
  "Prof. Shambhavi Holay",
  "Prof. Nikita Khanzode",
  "Prof. Triveni Rahangdale",
  "Prof. Aniket Girde",
];

const subjects = [
  "Software Testing and Quality Assurance",
  "Data Science",
  "Deep Learning",
  "Asp. Net Using C#",
  "Cloud Computing",
  "Business Analytics",
];

const AttendanceForm = () => {
  const [lecturer, setLecturer] = useState("");
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [year, setYear] = useState("");

  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});

  // ===============================
  // ✅ FETCH STUDENTS BY CLASS
  // ===============================
  const fetchStudents = async (selectedYear) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/attendance/students/${selectedYear}`
      );

      setStudents(res.data);

      // initialize attendance map
      const initialMap = {};
      res.data.forEach((s) => {
        initialMap[s.id] = false;
      });

      setAttendanceMap(initialMap);

    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    if (year) {
      fetchStudents(year);
    }
  }, [year]);

  // ===============================
  // ✅ HANDLE CHECKBOX
  // ===============================
  const handleAttendanceChange = (id) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ===============================
  // ✅ SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedTime = time + ":00";

    // convert to backend format
    const studentsData = {};
    Object.keys(attendanceMap).forEach((id) => {
      studentsData[id] = attendanceMap[id] ? "PRESENT" : "ABSENT";
    });

    const data = {
      professor: lecturer,
      subject,
      year: parseInt(year),
      time: formattedTime,
      attendanceDate,
      students: studentsData,
    };

    try {
      const res = await axios.post(
        "http://localhost:8080/api/attendance/save",
        data
      );

      alert("Attendance Submitted ✅");

      // reset
      setLecturer("");
      setSubject("");
      setTime("");
      setAttendanceDate("");
      setYear("");
      setStudents([]);
      setAttendanceMap({});

    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Attendance Form</h2>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">

        {/* LEFT SIDE */}
        <div className="flex-1 space-y-3">

          {/* CLASS SELECT */}
          <div>
            <label className="block font-medium mb-2">Class (Year):</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border p-2"
              required
            >
              <option value="">Select Class</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {/* LECTURER */}
          <div>
            <label className="block font-medium mb-2">Lecturer:</label>
            <select
              value={lecturer}
              onChange={(e) => setLecturer(e.target.value)}
              className="w-full border p-2"
              required
            >
              <option value="">Select Lecturer</option>
              {lecturers.map((l, i) => (
                <option key={i}>{l}</option>
              ))}
            </select>
          </div>

          {/* SUBJECT */}
          <div>
            <label className="block font-medium mb-2">Subject:</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border p-2"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((s, i) => (
                <option key={i}>{s}</option>
              ))}
            </select>
          </div>

          {/* TIME */}
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border p-2"
            required
          />

          {/* DATE */}
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="w-full border p-2"
            required
          />
        </div>

        {/* RIGHT SIDE (STUDENTS AUTO LOAD) */}
        <div className="flex-1 overflow-auto h-80 bg-gray-50 p-4 border">

          <h3 className="font-bold mb-2">Students:</h3>

          {students.length === 0 ? (
            <p>Select class to load students</p>
          ) : (
            students.map((s) => (
              <div key={s.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={attendanceMap[s.id] || false}
                  onChange={() => handleAttendanceChange(s.id)}
                  className="mr-3"
                />
                <span>{s.studName}</span>
              </div>
            ))
          )}

        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-24 h-10 bg-blue-500 text-white rounded mt-4"
        >
          Submit
        </button>

      </form>
    </div>
  );
};

export default AttendanceForm;