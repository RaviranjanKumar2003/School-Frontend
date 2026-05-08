// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Result = () => {

//   const [subjects, setSubjects] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [examType, setExamType] = useState("");

//   const [examTypes, setExamTypes] = useState([]);

//   const [showModal, setShowModal] = useState(false);
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [selectedExamId, setSelectedExamId] = useState("");
//   const [reason, setReason] = useState("");

//   const studentId = localStorage.getItem("id");

//   const student = JSON.parse(localStorage.getItem("student"));
//   const studentName = student
//   ? student.studName + " " + student.studLastName
//   : "";

//   useEffect(() => {
//   loadData();
//   }, [examType]); // 🔥 important


//   useEffect(() => {
//   axios.get("http://localhost:8080/api/exam-schedule/exam-types")
//     .then(res => setExamTypes(res.data))
//     .catch(err => console.log(err));
//   }, []);

//   const loadData = async () => {
//   if (!examType) {
//   setLoading(false);
//   return;
//  }

//   try {
//     const res1 = await axios.get(
//       `http://localhost:8080/api/results/student/${studentId}/${examType}`
//     );

//     const res2 = await axios.get(
//       `http://localhost:8080/api/recheck/student/${studentId}`
//     );

//     setSubjects(res1.data || []);
//     setRequests(res2.data || []);

//   } catch (err) {
//     if (err.response?.data === "RESULT_NOT_PUBLISHED") {
//       setError("NOT_PUBLISHED");
//     } else {
//       setError("ERROR");
//     }
//   } finally {
//     setLoading(false);
//   }
//   };

//   // 🔥 RECHECK STATUS
//   const getRecheckData = (subject, examId) => {
//   return requests.find(
//     r => r.subjects.includes(subject) && r.examId === examId
//   );
//  };

//   // 🎨 STATUS COLORS
//   const getColor = (status) => {
//     if (status === "PASS") return "bg-green-100 text-green-600";
//     if (status === "FAIL") return "bg-red-100 text-red-600";
//     if (status === "ABSENT") return "bg-gray-200 text-gray-600";
//     if (status === "PENDING") return "bg-yellow-100 text-yellow-700";
//     if (status === "APPROVED") return "bg-blue-100 text-blue-700";
//     if (status === "COMPLETED") return "bg-green-200 text-green-800";
//     if (status === "REJECTED") return "bg-red-200 text-red-800";
//     return "";
//   };

//   const openModal = (subject, examId) => {
//   setSelectedSubject(subject);
//   setSelectedExamId(examId);
//   setShowModal(true);
//   };

//   const submitRecheck = async () => {
//   try {

//     // 🔥 correct subject + exam का data निकाल
//     const selectedData = subjects.find(
//       s => s.subject === selectedSubject && s.examId === selectedExamId
//     );

//     await axios.post("http://localhost:8080/api/recheck/request", {
//       studentId,
//       studentName,
//       subjects: [selectedSubject],
//       examId: selectedExamId,
//       classId: selectedData?.classId,
//       professorId: selectedData?.teacherId,
//       reason
//     });

//     alert("Request Sent ✅");
//     setShowModal(false);
//     setReason("");
//     loadData();

//   } catch {
//     alert("Already requested ❌");
//   }
//   };

//   // 🔄 LOADING
//   if (loading) {
//     return <div className="text-center mt-20 text-gray-500">Loading...</div>;
//   }


//   // 📊 CALCULATION
//   let total = 0;
//   let max = 0;

//   subjects.forEach(s => {
//     total += s.marks || 0;
//     max += s.totalMarks || 0;
//   });

//   const percentage = max > 0 ? ((total * 100) / max).toFixed(1) : 0;

//   const resultStatus = subjects.some(
//     s => s.status === "FAIL" || s.status === "ABSENT"
//   ) ? "FAIL" : "PASS";

//   let grade = "D";
//   const p = Number(percentage);

//   if (p >= 90) grade = "A+";
//   else if (p >= 75) grade = "A";
//   else if (p >= 60) grade = "B";
//   else if (p >= 50) grade = "C";


//   subjects.sort((a, b) => b.examId - a.examId);

// const map = new Map();

// subjects.forEach(s => {
//   if (!map.has(s.subject)) {
//     map.set(s.subject, s);
//   }
// });

// const uniqueSubjects = Array.from(map.values());
//   return (
//     <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-center mb-8">
//         📊 Student Result
//       </h1>
//       <div className="mb-4 flex justify-center gap-2">
//   <div className="flex justify-center gap-3 mb-6">

//   {examTypes.map((type) => (
//   <button
//     key={type}
//     onClick={() => setExamType(type)}
//     className={`px-5 py-2 rounded-full font-semibold
//       ${
//         examType === type
//           ? "bg-blue-600 text-white"
//           : "bg-white border text-gray-600"
//       }`}
//   >
//     {type.replace("_", " ")}
//   </button>
// ))}

// </div>

// </div>

//   {!examType && (
//   <div className="flex justify-center items-center mt-10">
    
//     <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-xl shadow-md text-center max-w-md w-full">
      
//       <div className="text-3xl mb-2">⚠️</div>
      
//       <p className="text-lg font-semibold">
//         Select Exam Type First
//       </p>

//       <p className="text-sm mt-1 text-yellow-700">
//         Please choose an exam type to view your results
//       </p>

//     </div>

//   </div>
// )}

//       {/* TABLE */}
//       <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">

//         <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">

//   {error === "NOT_PUBLISHED" ? (
//     <div className="text-center py-10 text-blue-500 font-semibold">
//       ⏳ Result not published for {examType}
//     </div>
//   ) : subjects.length === 0 ? (
//     <div className="text-center py-10 text-red-500 font-semibold">
//       ❌ No result found for {examType}
//     </div>
//   ) : (

//     <table className="w-full text-sm min-w-[600px]">
//       {/* tera existing table code */}
//     </table>
//   )}
//  </div>

//         <table className="w-full text-sm min-w-[600px]">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-3 text-left">Subject</th>
//               <th className="p-3 text-left">Marks</th>
//               <th className="p-3 text-left">per(%)</th>
//               <th className="p-3 text-left">Grade</th>
//               <th className="p-3 text-left">Status</th>
//               <th className="p-3 text-left">Recheck</th>
//             </tr>
//           </thead>

//           <tbody>
//             {uniqueSubjects.map((s, i) => {

//              const recheck = getRecheckData(s.subject, s.examId);

//               return (
//                 <tr key={i} className="border-b hover:bg-gray-50">

//                   <td className="p-3 font-medium">{s.subject}</td>

//                   <td className="p-3">
//                    {s.status === "ABSENT"
//                      ? `0/${s.totalMarks} (ABSENT)`
//                       : `${s.marks}/${s.totalMarks}`}
//                   </td>

//                   <td className="p-3">
//                     {((s.marks * 100) / s.totalMarks).toFixed(1)}%
//                   </td>

//                   <td className="p-3 text-purple-600 font-semibold">
//                     {s.grade}
//                   </td>

//                   <td className="p-3">
//                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${getColor(s.status)}`}>
//                       {s.status}
//                     </span>
//                   </td>

//                   <td className="p-3">

//                     {s.status === "ABSENT" ? (
//                      <span className="text-gray-400 text-xs">
//                      Not Allowed
//                      </span>
//                     ) : recheck ? (

//                     <div className="flex flex-col gap-1">

//                    {/* STATUS */}
//                    <span className={`px-2 py-1 rounded-full text-xs w-10 font-bold ${getColor(recheck.status)}`}>
//                    {recheck.status}
//                    </span>

//                    {/* 🔥 REASON */}
//                     {recheck.teacherRemark && (
//                    <span className="text-2xl text-gray-500 w-0 italic">
//                    💬 {recheck.teacherRemark}
//                     </span>
//                     )}

//                      </div>

//                     ) : (
//                       <button
//                        onClick={() => openModal(s.subject, s.examId)}
//                         className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs"
//                       >
//                         Recheck
//                       </button>
//                     )}

//                   </td>

//                 </tr>
//               );
//             })}
//           </tbody>

//         </table>
//       </div>

//       {/* SUMMARY */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

//         <div className="bg-white p-4 rounded-xl shadow text-center">
//           <p className="text-gray-400 text-sm">Total</p>
//           <p className="text-xl font-semibold">{total} / {max}</p>
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow text-center">
//           <p className="text-gray-400 text-sm">Percentage</p>
//           <p className="text-xl font-semibold text-blue-600">{percentage}%</p>
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow text-center">
//           <p className="text-gray-400 text-sm">Grade</p>
//           <p className="text-xl font-semibold text-purple-600">{grade}</p>
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow text-center">
//           <p className="text-gray-400 text-sm">Result</p>
//           <p className={`text-xl font-semibold ${
//             resultStatus === "PASS" ? "text-green-600" : "text-red-600"
//           }`}>
//             {resultStatus}
//           </p>
//         </div>

//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

//           <div className="bg-white p-6 rounded-xl w-full max-w-md">

//             <h2 className="text-lg font-bold mb-3">
//               Recheck Request
//             </h2>

//             <p className="mb-2">
//               Subject: <b>{selectedSubject}</b>
//             </p>

//             <textarea
//               className="w-full border p-2 rounded mb-4"
//               placeholder="Enter reason..."
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//             />

//             <div className="flex justify-end gap-2">

//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 rounded"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={submitRecheck}
//                 className="px-4 py-2 bg-blue-600 text-white rounded"
//               >
//                 Submit
//               </button>

//             </div>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// };

// export default Result;





















































import React, { useEffect, useState } from "react";
import axios from "axios";

const Result = () => {

  const [subjects, setSubjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [examType, setExamType] = useState("");

  const [examTypes, setExamTypes] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [reason, setReason] = useState("");

  // ✅ ADD (reason popup)
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedRemark, setSelectedRemark] = useState("");

  const studentId = localStorage.getItem("id");

  const student = JSON.parse(localStorage.getItem("student"));
  const studentName = student
  ? student.studName + " " + student.studLastName
  : "";

  useEffect(() => {
    loadData();
  }, [examType]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/exam-schedule/exam-types")
      .then(res => setExamTypes(res.data))
      .catch(err => console.log(err));
  }, []);

  const loadData = async () => {
    if (!examType) {
      setLoading(false);
      return;
    }

    try {
      const res1 = await axios.get(
        `http://localhost:8080/api/results/student/${studentId}/${examType}`
      );

      const res2 = await axios.get(
        `http://localhost:8080/api/recheck/student/${studentId}`
      );

      setSubjects(res1.data || []);
      setRequests(res2.data || []);

    } catch (err) {
      if (err.response?.data === "RESULT_NOT_PUBLISHED") {
        setError("NOT_PUBLISHED");
      } else {
        setError("ERROR");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRecheckData = (subject, examId) => {
    return requests.find(
      r => r.subjects.includes(subject) && r.examId === examId
    );
  };

  const getColor = (status) => {
    if (status === "PASS") return "bg-green-100 text-green-600";
    if (status === "FAIL") return "bg-red-100 text-red-600";
    if (status === "ABSENT") return "bg-gray-200 text-gray-600";
    if (status === "PENDING") return "bg-yellow-100 text-yellow-700";
    if (status === "APPROVED") return "bg-blue-100 text-blue-700";
    if (status === "COMPLETED") return "bg-green-200 text-green-800";
    if (status === "REJECTED") return "bg-red-200 text-red-800";
    return "";
  };

  const openModal = (subject, examId) => {
    setSelectedSubject(subject);
    setSelectedExamId(examId);
    setShowModal(true);
  };

  // ✅ ADD
  const openReasonModal = (remark) => {
    setSelectedRemark(remark);
    setShowReasonModal(true);
  };

  const submitRecheck = async () => {
    try {

      const selectedData = subjects.find(
        s => s.subject === selectedSubject && s.examId === selectedExamId
      );

      await axios.post("http://localhost:8080/api/recheck/request", {
        studentId,
        studentName,
        subjects: [selectedSubject],
        examId: selectedExamId,
        classId: selectedData?.classId,
        professorId: selectedData?.teacherId,
        reason
      });

      alert("Request Sent ✅");
      setShowModal(false);
      setReason("");
      loadData();

    } catch {
      alert("Already requested ❌");
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-500">Loading...</div>;
  }

  let total = 0;
  let max = 0;

  subjects.forEach(s => {
    total += s.marks || 0;
    max += s.totalMarks || 0;
  });

  const percentage = max > 0 ? ((total * 100) / max).toFixed(1) : 0;

  const resultStatus = subjects.some(
    s => s.status === "FAIL" || s.status === "ABSENT"
  ) ? "FAIL" : "PASS";

  let grade = "D";
  const p = Number(percentage);

  if (p >= 90) grade = "A+";
  else if (p >= 75) grade = "A";
  else if (p >= 60) grade = "B";
  else if (p >= 50) grade = "C";

  subjects.sort((a, b) => b.examId - a.examId);

  const map = new Map();
  subjects.forEach(s => {
    if (!map.has(s.subject)) {
      map.set(s.subject, s);
    }
  });

  const uniqueSubjects = Array.from(map.values());

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">

      <h1 className="text-xl md:text-3xl font-bold text-center mb-6 md:mb-8">
        📊 Student Result
      </h1>

      <div className="mb-4 flex justify-center gap-2 flex-wrap">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">

          {examTypes.map((type) => (
            <button
              key={type}
              onClick={() => setExamType(type)}
              className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-sm md:text-base font-semibold
                ${
                  examType === type
                    ? "bg-blue-600 text-white"
                    : "bg-white border text-gray-600"
                }`}
            >
              {type.replace("_", " ")}
            </button>
          ))}

        </div>
      </div>

      {!examType && (
        <div className="flex justify-center items-center mt-10">
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-xl shadow-md text-center max-w-md w-full">
            <div className="text-3xl mb-2">⚠️</div>
            <p className="text-lg font-semibold">
              Select Exam Type First
            </p>
            <p className="text-sm mt-1 text-yellow-700">
              Please choose an exam type to view your results
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 overflow-x-auto">

        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 overflow-x-auto">

          {error === "NOT_PUBLISHED" ? (
            <div className="text-center py-10 text-blue-500 font-semibold">
              ⏳ Result not published for {examType}
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-10 text-red-500 font-semibold">
              ❌ No result found for {examType}
            </div>
          ) : (
            <table className="w-full text-xs md:text-sm min-w-[600px]"></table>
          )}
        </div>

        <table className="w-full text-xs md:text-sm min-w-[600px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 md:p-3 text-left">Subject</th>
              <th className="p-2 md:p-3 text-left">Marks</th>
              <th className="p-2 md:p-3 text-left">per(%)</th>
              <th className="p-2 md:p-3 text-left">Grade</th>
              <th className="p-2 md:p-3 text-left">Status</th>
              <th className="p-2 md:p-3 text-left">Recheck</th>
            </tr>
          </thead>

          <tbody>
            {uniqueSubjects.map((s, i) => {

              const recheck = getRecheckData(s.subject, s.examId);

              return (
                <tr key={i} className="border-b hover:bg-gray-50">

                  <td className="p-2 md:p-3 font-medium">{s.subject}</td>

                  <td className="p-2 md:p-3">
                    {s.status === "ABSENT"
                      ? `0/${s.totalMarks} (ABSENT)`
                      : `${s.marks}/${s.totalMarks}`}
                  </td>

                  <td className="p-2 md:p-3">
                    {((s.marks * 100) / s.totalMarks).toFixed(1)}%
                  </td>

                  <td className="p-2 md:p-3 text-purple-600 font-semibold">
                    {s.grade}
                  </td>

                  <td className="p-2 md:p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getColor(s.status)}`}>
                      {s.status}
                    </span>
                  </td>

                  <td className="p-2 md:p-3">

                    {s.status === "ABSENT" ? (
                      <span className="text-gray-400 text-xs">
                        Not Allowed
                      </span>
                    ) : recheck ? (

                      <div className="flex flex-col gap-1">

                        <span className={`px-2 py-1 rounded-full text-xs w-fit font-bold ${getColor(recheck.status)}`}>
                          {recheck.status}
                        </span>

                        {recheck.teacherRemark && (
                          <button
                            onClick={() => openReasonModal(recheck.teacherRemark)}
                            className="text-blue-500 text-xs underline text-left"
                          >
                            View Reason
                          </button>
                        )}

                      </div>

                    ) : (
                      <button
                        onClick={() => openModal(s.subject, s.examId)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs"
                      >
                        Recheck
                      </button>
                    )}

                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-400 text-sm">Total</p>
          <p className="text-xl font-semibold">{total} / {max}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-400 text-sm">Percentage</p>
          <p className="text-xl font-semibold text-blue-600">{percentage}%</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-400 text-sm">Grade</p>
          <p className="text-xl font-semibold text-purple-600">{grade}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-400 text-sm">Result</p>
          <p className={`text-xl font-semibold ${
            resultStatus === "PASS" ? "text-green-600" : "text-red-600"
          }`}>
            {resultStatus}
          </p>
        </div>

      </div>

      {/* EXISTING MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-lg font-bold mb-3">Recheck Request</h2>
            <p className="mb-2">Subject: <b>{selectedSubject}</b></p>
            <textarea
              className="w-full border p-2 rounded mb-4"
              placeholder="Enter reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={submitRecheck} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ NEW REASON MODAL */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm text-center">
            <h2 className="text-lg font-bold mb-3">Reason</h2>
            <p className="text-gray-600 italic">💬 {selectedRemark}</p>
            <button
              onClick={() => setShowReasonModal(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
export default Result;