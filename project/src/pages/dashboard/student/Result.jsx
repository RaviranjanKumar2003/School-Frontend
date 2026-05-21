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

//   // ✅ ADD (reason popup)
//   const [showReasonModal, setShowReasonModal] = useState(false);
//   const [selectedRemark, setSelectedRemark] = useState("");

//   const studentId = localStorage.getItem("id");

//   const student = JSON.parse(localStorage.getItem("student"));
//   const studentName = student
//   ? student.studName + " " + student.studLastName
//   : "";

//   useEffect(() => {
//     loadData();
//   }, [examType]);

//   useEffect(() => {
//     axios.get("http://localhost:8080/api/exam-schedule/exam-types")
//       .then(res => setExamTypes(res.data))
//       .catch(err => console.log(err));
//   }, []);

//   const loadData = async () => {
//     if (!examType) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const res1 = await axios.get(
//         `http://localhost:8080/api/results/student/${studentId}/${examType}`
//       );

//       const res2 = await axios.get(
//         `http://localhost:8080/api/recheck/student/${studentId}`
//       );

//       setSubjects(res1.data || []);
//       setRequests(res2.data || []);

//     } catch (err) {
//       if (err.response?.data === "RESULT_NOT_PUBLISHED") {
//         setError("NOT_PUBLISHED");
//       } else {
//         setError("ERROR");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getRecheckData = (subject, examId) => {
//     return requests.find(
//       r => r.subjects.includes(subject) && r.examId === examId
//     );
//   };

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
//     setSelectedSubject(subject);
//     setSelectedExamId(examId);
//     setShowModal(true);
//   };

//   // ✅ ADD
//   const openReasonModal = (remark) => {
//     setSelectedRemark(remark);
//     setShowReasonModal(true);
//   };

//   const submitRecheck = async () => {
//     try {

//       const selectedData = subjects.find(
//         s => s.subject === selectedSubject && s.examId === selectedExamId
//       );

//       await axios.post("http://localhost:8080/api/recheck/request", {
//         studentId,
//         studentName,
//         subjects: [selectedSubject],
//         examId: selectedExamId,
//         classId: selectedData?.classId,
//         professorId: selectedData?.teacherId,
//         reason
//       });

//       alert("Request Sent ✅");
//       setShowModal(false);
//       setReason("");
//       loadData();

//     } catch {
//       alert("Already requested ❌");
//     }
//   };

//   if (loading) {
//     return <div className="text-center mt-20 text-gray-500">Loading...</div>;
//   }

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

//   const map = new Map();
//   subjects.forEach(s => {
//     if (!map.has(s.subject)) {
//       map.set(s.subject, s);
//     }
//   });

//   const uniqueSubjects = Array.from(map.values());

//   return (
//     <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">

//       <h1 className="text-xl md:text-3xl font-bold text-center mb-6 md:mb-8">
//         📊 Student Result
//       </h1>

//       <div className="mb-4 flex justify-center gap-2 flex-wrap">
//         <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">

//           {examTypes.map((type) => (
//             <button
//               key={type}
//               onClick={() => setExamType(type)}
//               className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full text-sm md:text-base font-semibold
//                 ${
//                   examType === type
//                     ? "bg-blue-600 text-white"
//                     : "bg-white border text-gray-600"
//                 }`}
//             >
//               {type.replace("_", " ")}
//             </button>
//           ))}

//         </div>
//       </div>

//       {!examType && (
//         <div className="flex justify-center items-center mt-10">
//           <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-xl shadow-md text-center max-w-md w-full">
//             <div className="text-3xl mb-2">⚠️</div>
//             <p className="text-lg font-semibold">
//               Select Exam Type First
//             </p>
//             <p className="text-sm mt-1 text-yellow-700">
//               Please choose an exam type to view your results
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 overflow-x-auto">

//         <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 overflow-x-auto">

//           {error === "NOT_PUBLISHED" ? (
//             <div className="text-center py-10 text-blue-500 font-semibold">
//               ⏳ Result not published for {examType}
//             </div>
//           ) : subjects.length === 0 ? (
//             <div className="text-center py-10 text-red-500 font-semibold">
//               ❌ No result found for {examType}
//             </div>
//           ) : (
//             <table className="w-full text-xs md:text-sm min-w-[600px]"></table>
//           )}
//         </div>

//         <table className="w-full text-xs md:text-sm min-w-[600px]">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 md:p-3 text-left">Subject</th>
//               <th className="p-2 md:p-3 text-left">Marks</th>
//               <th className="p-2 md:p-3 text-left">per(%)</th>
//               <th className="p-2 md:p-3 text-left">Grade</th>
//               <th className="p-2 md:p-3 text-left">Status</th>
//               <th className="p-2 md:p-3 text-left">Recheck</th>
//             </tr>
//           </thead>

//           <tbody>
//             {uniqueSubjects.map((s, i) => {

//               const recheck = getRecheckData(s.subject, s.examId);

//               return (
//                 <tr key={i} className="border-b hover:bg-gray-50">

//                   <td className="p-2 md:p-3 font-medium">{s.subject}</td>

//                   <td className="p-2 md:p-3">
//                     {s.status === "ABSENT"
//                       ? `0/${s.totalMarks} (ABSENT)`
//                       : `${s.marks}/${s.totalMarks}`}
//                   </td>

//                   <td className="p-2 md:p-3">
//                     {((s.marks * 100) / s.totalMarks).toFixed(1)}%
//                   </td>

//                   <td className="p-2 md:p-3 text-purple-600 font-semibold">
//                     {s.grade}
//                   </td>

//                   <td className="p-2 md:p-3">
//                     <span className={`px-2 py-1 rounded-full text-xs font-bold ${getColor(s.status)}`}>
//                       {s.status}
//                     </span>
//                   </td>

//                   <td className="p-2 md:p-3">

//                     {s.status === "ABSENT" ? (
//                       <span className="text-gray-400 text-xs">
//                         Not Allowed
//                       </span>
//                     ) : recheck ? (

//                       <div className="flex flex-col gap-1">

//                         <span className={`px-2 py-1 rounded-full text-xs w-fit font-bold ${getColor(recheck.status)}`}>
//                           {recheck.status}
//                         </span>

//                         {recheck.teacherRemark && (
//                           <button
//                             onClick={() => openReasonModal(recheck.teacherRemark)}
//                             className="text-blue-500 text-xs underline text-left"
//                           >
//                             View Reason
//                           </button>
//                         )}

//                       </div>

//                     ) : (
//                       <button
//                         onClick={() => openModal(s.subject, s.examId)}
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

//       {/* EXISTING MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-xl w-full max-w-md">
//             <h2 className="text-lg font-bold mb-3">Recheck Request</h2>
//             <p className="mb-2">Subject: <b>{selectedSubject}</b></p>
//             <textarea
//               className="w-full border p-2 rounded mb-4"
//               placeholder="Enter reason..."
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//             />
//             <div className="flex justify-end gap-2">
//               <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
//               <button onClick={submitRecheck} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ✅ NEW REASON MODAL */}
//       {showReasonModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4">
//           <div className="bg-white p-6 rounded-xl w-full max-w-sm text-center">
//             <h2 className="text-lg font-bold mb-3">Reason</h2>
//             <p className="text-gray-600 italic">💬 {selectedRemark}</p>
//             <button
//               onClick={() => setShowReasonModal(false)}
//               className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };
// export default Result;

















import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import axios from "axios";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Result = () => {

  const [student, setStudent] =
    useState(null);

  const [subjects, setSubjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [examType, setExamType] =
    useState("");

  const [examTypes, setExamTypes] =
    useState([]);

    // ================= RECHECK =================

  const [requests, setRequests] =
  useState([]);

  const [showModal, setShowModal] =
  useState(false);

  const [selectedSubject, setSelectedSubject] =
  useState("");

  const [selectedExamId, setSelectedExamId] =
  useState("");

  const [reason, setReason] =
  useState("");

  const [showReasonModal, setShowReasonModal] =
  useState(false);

  const [selectedRemark, setSelectedRemark] =
  useState("");

  const marksheetRef =
    useRef();

  const studentId =
    localStorage.getItem("id");

  // ================= LOAD STUDENT =================

  useEffect(() => {

    fetch(
      `http://localhost:8080/api/students/${studentId}`
    )
      .then((res) => res.json())
      .then((data) => {

        console.log(data);

        setStudent(data);

      })
      .catch((err) =>
        console.log(err)
      );

  }, []);

  // ================= LOAD EXAM TYPES =================

  useEffect(() => {

    axios
      .get(
        "http://localhost:8080/api/exam-schedule/exam-types"
      )
      .then((res) => {

        setExamTypes(
          res.data
        );

      })
      .catch((err) =>
        console.log(err)
      );

  }, []);

  // ================= LOAD RESULTS =================

  useEffect(() => {

    if (!examType) {

      setLoading(false);

      return;
    }

    loadResults();

  }, [examType]);

 const loadResults =
  async () => {

    try {

      setLoading(true);

      // RESULT
      const res =
        await axios.get(
          `http://localhost:8080/api/results/student/${studentId}/${examType}`
        );

      setSubjects(
        res.data || []
      );

      // RECHECK HISTORY
      const reqRes =
        await axios.get(
          `http://localhost:8080/api/recheck/student/${studentId}`
        );

      setRequests(
        reqRes.data || []
      );

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  };





  // ================= RECHECK HELPERS =================

  const getRecheckData = (
  subject,
  examId
  ) => {

  return requests.find(
    r =>
      r.subjects?.includes(subject)
      &&
      Number(r.examId) === Number(examId)
  );
 };

 const getColor = (
  status
 ) => {

  if (status === "PASS")
    return "bg-green-100 text-green-700";

  if (status === "FAIL")
    return "bg-red-100 text-red-700";

  if (status === "PENDING")
    return "bg-yellow-100 text-yellow-700";

  if (status === "APPROVED")
    return "bg-blue-100 text-blue-700";

  if (status === "COMPLETED")
    return "bg-green-200 text-green-800";

  if (status === "REJECTED")
    return "bg-red-200 text-red-800";

  return "";
 };

 const openModal = (
  subject,
  examId
 ) => {

  setSelectedSubject(subject);

  setSelectedExamId(examId);

  setShowModal(true);
 };

 const openReasonModal = (
  remark
 ) => {

  setSelectedRemark(remark);

  setShowReasonModal(true);
 };

 const submitRecheck =
  async () => {

    if (!reason.trim()) {

      alert(
        "Please enter reason"
      );

      return;
    }

    try {

      const selectedData =
        subjects.find(
          s =>
            s.subject === selectedSubject
            &&
            s.examId === selectedExamId
        );

      await axios.post(
        "http://localhost:8080/api/recheck/request",
        {
          studentId,

          subjects: [
            selectedSubject
          ],

          examId:
            selectedExamId,

          classId:
            selectedData?.classId,

          professorId:
            selectedData?.teacherId,

          reason
        }
      );

      alert(
        "Request Sent ✅"
      );

      setShowModal(false);

      setReason("");

      loadResults();

    } catch {

      alert(
        "Already requested ❌"
      );
    }
  };


  // ================= TOTAL =================

  let total = 0;
  let max = 0;

  subjects.forEach((s) => {

    total +=
      s.marks || 0;

    max +=
      s.totalMarks || 0;

  });

  const percentage =
    max > 0
      ? (
          (total * 100) /
          max
        ).toFixed(1)
      : 0;

  const resultStatus =
    subjects.some(
      (s) =>
        s.status ===
          "FAIL" ||
        s.status ===
          "ABSENT"
    )
      ? "FAIL"
      : "PASS";

  let grade = "D";

  const p =
    Number(percentage);

  if (p >= 90)
    grade = "A+";

  else if (p >= 75)
    grade = "A";

  else if (p >= 60)
    grade = "B";

  else if (p >= 50)
    grade = "C";

  // ================= PDF DOWNLOAD =================

  const downloadPDF =
    async () => {

      const input =
        marksheetRef.current;

      input.style.display =
        "block";

      const canvas =
        await html2canvas(
          input,
          {
            scale: 2,
          }
        );

      const imgData =
        canvas.toDataURL(
          "image/png"
        );

      const pdf =
        new jsPDF(
          "p",
          "mm",
          "a4"
        );

      const pdfWidth =
        pdf.internal.pageSize.getWidth();

      const imgProps =
        pdf.getImageProperties(
          imgData
        );

      const pdfHeight =
        (imgProps.height *
          pdfWidth) /
        imgProps.width;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight
      );

      pdf.save(
        `${student?.studentId}-${examType}-Marksheet.pdf`
      );

      input.style.display =
        "none";
    };

  // ================= LOADING =================

  if (
    !student ||
    loading
  ) {

    return (
      <div className="text-center mt-20 text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 md:p-8">

      {/* HEADER */}

      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">

        <div className="flex flex-col md:flex-row justify-between items-center gap-5">

          <div>

            <h1 className="text-4xl font-bold text-blue-700">
              Results
            </h1>

            <p className="text-gray-500 mt-2">
              Academic Report Card
            </p>

          </div>

          <button
            onClick={
              downloadPDF
            }
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg font-semibold"
          >
            ⬇ Download Marksheet
          </button>

        </div>

      </div>

      
      {/* EXAM TYPES */}

      <div className="flex flex-wrap gap-4 mt-8">

        {examTypes.map(
          (type) => (

            <button
              key={type}
              onClick={() =>
                setExamType(
                  type
                )
              }
              className={`px-6 py-3 rounded-full font-bold shadow transition-all duration-300 ${
                examType ===
                type
                  ? "bg-blue-600 text-white scale-105"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
            >
              {type}
            </button>
          )
        )}

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-3xl shadow-xl p-6 mt-8 overflow-x-auto">

        {!examType ? (

          <div className="text-center py-10 text-xl font-semibold text-yellow-600">
            Select Exam Type
          </div>

        ) : subjects.length ===
          0 ? (

          <div className="text-center py-10 text-xl font-semibold text-red-500">
            No Result Found
          </div>

        ) : (

          <table className="w-full">

            <thead>

              <tr className="bg-blue-600 text-white">

                <th className="p-4">
                  Subject
                </th>

                <th className="p-4">
                  Marks
                </th>

                <th className="p-4">
                  Percentage
                </th>

                <th className="p-4">
                  Grade
                </th>

                <th className="p-4">
                  Status
                </th>
                <th className="p-4">
                 Recheck
                </th>

              </tr>

            </thead>

            <tbody>

              {subjects.map(
               (s, i) => {

                const recheck =
                getRecheckData(
                s.subject,
                s.examId
                );

               return (

                  <tr
                    key={i}
                    className="text-center border-b hover:bg-gray-50"
                  >

                    <td className="p-4 font-semibold">
                      {
                        s.subject
                      }
                    </td>

                    <td className="p-4">
                      {s.marks}/
                      {
                        s.totalMarks
                      }
                    </td>

                    <td className="p-4">
                      {(
                        (s.marks *
                          100) /
                        s.totalMarks
                      ).toFixed(1)}
                      %
                    </td>

                    <td className="p-4 text-purple-600 font-bold">
                      {s.grade}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-4 py-1 rounded-full text-sm font-bold ${
                          s.status ===
                          "PASS"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {s.status}
                      </span>

                    </td>

                    <td className="p-4">

                    {s.status === "ABSENT" ? (

                    <span className="text-gray-400 text-xs">
                     Not Allowed
                    </span>

                   ) : recheck ? (

                  <div className="flex flex-col gap-1 items-center">

                   <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getColor(recheck.status)}`}
                    >
                   {recheck.status}
                   </span>

                    {recheck.teacherRemark && (
                    <button
                    onClick={() =>
                    openReasonModal(
                    recheck.teacherRemark
                    )
                    }
                   className="text-blue-500 underline text-xs">
                    View Reason
                   </button>

                    )}

                   </div>

                   ) : (

                   <button
                   onClick={() =>
                   openModal(
                   s.subject,
                   s.examId
                   )
                   }
                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full text-xs"
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
        )}
      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-8">

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

          <p className="text-gray-500">
            Total Marks
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {total}/{max}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

          <p className="text-gray-500">
            Percentage
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {percentage}%
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

          <p className="text-gray-500">
            Grade
          </p>

          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {grade}
          </h2>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">

          <p className="text-gray-500">
            Final Result
          </p>

          <h2
            className={`text-3xl font-bold mt-2 ${
              resultStatus ===
              "PASS"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {
              resultStatus
            }
          </h2>
        </div>
      </div>

      {/* ================= PDF TEMPLATE ================= */}
      <div
        ref={marksheetRef}
        style={{
          display: "none",
          background: "white",
          width: "800px",
          padding: "40px",
          fontFamily: "Arial",
          color: "#111",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            textAlign:
              "center",
            borderBottom:
              "3px solid #2563eb",
            paddingBottom:
              "20px",
            marginBottom:
              "30px",
          }}
        >

          <img
            src="/logo.png"
            alt="school"
            style={{
              width: "90px",
              height: "90px",
              objectFit:
                "contain",
              margin:
                "0 auto",
            }}
          />

          <h1
            style={{
              color:
                "#2563eb",
              fontSize:
                "38px",
              fontWeight:
                "bold",
              marginTop:
                "10px",
            }}
          >
            {
              student?.schoolName
            }
          </h1>

          <p
            style={{
              color: "#666",
              fontSize:
                "18px",
              marginTop:
                "5px",
            }}
          >
            Academic Report Card
          </p>

        </div>

        {/* INFO */}

        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom:
              "30px",
          }}
        >

          <div
            style={{
              lineHeight:
                "2",
              fontSize:
                "16px",
            }}
          >

            <p>
              <b>
                Student Name :
              </b>{" "}
              {
                student?.studfirstName
              }{" "}
              {
                student?.studlastName
              }
            </p>

            <p>
              <b>
                Student ID :
              </b>{" "}
              {
                student?.studentId
              }
            </p>

            <p>
              <b>
                Class :
              </b>{" "}
              {
                student?.className
              }
            </p>

            <p>
              <b>
                Roll No :
              </b>{" "}
              {
                student?.studRollNo
              }
            </p>

            <p>
              <b>
                Father Name :
              </b>{" "}
              {
                student?.studFatherName
              }
            </p>

            <p>
              <b>
                Exam Type :
              </b>{" "}
              {examType}
            </p>

          </div>

          <div>

            <img
              src={`http://localhost:8080/api/students/image/get/${student?.id}`}
              alt="student"
              style={{
                width:
                  "120px",
                height:
                  "120px",
                borderRadius:
                  "10px",
                objectFit:
                  "cover",
                border:
                  "4px solid #2563eb",
              }}
            />

          </div>

        </div>

        {/* TABLE */}

        <table
          style={{
            width: "100%",
            borderCollapse:
              "collapse",
            marginTop:
              "20px",
          }}
        >

          <thead>

            <tr
              style={{
                background:
                  "#2563eb",
                color:
                  "white",
              }}
            >

              <th
                style={{
                  border:
                    "1px solid #ccc",
                  padding:
                    "12px",
                }}
              >
                Subject
              </th>

              <th
                style={{
                  border:
                    "1px solid #ccc",
                  padding:
                    "12px",
                }}
              >
                Marks
              </th>

              <th
                style={{
                  border:
                    "1px solid #ccc",
                  padding:
                    "12px",
                }}
              >
                Percentage
              </th>

              <th
                style={{
                  border:
                    "1px solid #ccc",
                  padding:
                    "12px",
                }}
              >
                Grade
              </th>

              <th
                style={{
                  border:
                    "1px solid #ccc",
                  padding:
                    "12px",
                }}
              >
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {subjects.map(
              (s, i) => (

                <tr key={i}>

                  <td
                    style={{
                      border:
                        "1px solid #ccc",
                      padding:
                        "12px",
                    }}
                  >
                    {
                      s.subject
                    }
                  </td>

                  <td
                    style={{
                      border:
                        "1px solid #ccc",
                      padding:
                        "12px",
                    }}
                  >
                    {s.marks}/
                    {
                      s.totalMarks
                    }
                  </td>

                  <td
                    style={{
                      border:
                        "1px solid #ccc",
                      padding:
                        "12px",
                    }}
                  >
                    {(
                      (s.marks *
                        100) /
                      s.totalMarks
                    ).toFixed(
                      1
                    )}
                    %
                  </td>

                  <td
                    style={{
                      border:
                        "1px solid #ccc",
                      padding:
                        "12px",
                      color:
                        "#9333ea",
                      fontWeight:
                        "bold",
                    }}
                  >
                    {
                      s.grade
                    }
                  </td>

                  <td
                    style={{
                      border:
                        "1px solid #ccc",
                      padding:
                        "12px",
                      color:
                        s.status ===
                        "PASS"
                          ? "green"
                          : "red",
                      fontWeight:
                        "bold",
                    }}
                  >
                    {
                      s.status
                    }
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

        {/* SUMMARY */}

        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            marginTop:
              "40px",
            gap: "20px",
          }}
        >

          <div
            style={{
              flex: 1,
              border:
                "1px solid #ccc",
              padding:
                "20px",
              borderRadius:
                "10px",
              textAlign:
                "center",
            }}
          >

            <p>
              Total Marks
            </p>

            <h2>
              {total} / {max}
            </h2>

          </div>

          <div
            style={{
              flex: 1,
              border:
                "1px solid #ccc",
              padding:
                "20px",
              borderRadius:
                "10px",
              textAlign:
                "center",
            }}
          >

            <p>
              Percentage
            </p>

            <h2
              style={{
                color:
                  "#2563eb",
              }}
            >
              {percentage}%
            </h2>

          </div>

          <div
            style={{
              flex: 1,
              border:
                "1px solid #ccc",
              padding:
                "20px",
              borderRadius:
                "10px",
              textAlign:
                "center",
            }}
          >

            <p>
              Grade
            </p>

            <h2
              style={{
                color:
                  "#9333ea",
              }}
            >
              {grade}
            </h2>

          </div>

          <div
            style={{
              flex: 1,
              border:
                "1px solid #ccc",
              padding:
                "20px",
              borderRadius:
                "10px",
              textAlign:
                "center",
            }}
          >

            <p>
              Final Result
            </p>

            <h2
              style={{
                color:
                  resultStatus ===
                  "PASS"
                    ? "green"
                    : "red",
              }}
            >
              {
                resultStatus
              }
            </h2>

          </div>

        </div>

        {/* FOOTER */}

        <div
          style={{
            marginTop:
              "80px",
            display:
              "flex",
            justifyContent:
              "space-between",
            textAlign:
              "center",
          }}
        >

          <div>

            <div
              style={{
                borderTop:
                  "1px solid #000",
                width:
                  "180px",
                marginBottom:
                  "10px",
              }}
            ></div>

            <p>
              Class Teacher
            </p>

          </div>

          <div>

            <div
              style={{
                borderTop:
                  "1px solid #000",
                width:
                  "180px",
                marginBottom:
                  "10px",
              }}
            ></div>

            <p>
              Principal Signature
            </p>

          </div>

        </div>

      </div>

      {/* RECHECK MODAL */}

{showModal && (

  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

    <div className="bg-white p-6 rounded-xl w-full max-w-md">

      <h2 className="text-xl font-bold mb-3">
        Recheck Request
      </h2>

      <p className="mb-3">
        Subject:
        <b> {selectedSubject}</b>
      </p>

      <textarea
        className="w-full border p-3 rounded mb-4"
        placeholder="Enter reason..."
        value={reason}
        onChange={(e) =>
          setReason(e.target.value)
        }
      />

      <div className="flex justify-end gap-2">

        <button
          onClick={() =>
            setShowModal(false)
          }
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>

        <button
          onClick={submitRecheck}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>

      </div>

    </div>

  </div>

)}

{/* REASON MODAL */}

{showReasonModal && (

  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">

    <div className="bg-white p-6 rounded-xl w-full max-w-sm text-center">

      <h2 className="text-lg font-bold mb-3">
        Teacher Remark
      </h2>

      <p className="text-gray-700 italic">
        💬 {selectedRemark}
      </p>

      <button
        onClick={() =>
          setShowReasonModal(false)
        }
        className="mt-5 px-4 py-2 bg-blue-600 text-white rounded"
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