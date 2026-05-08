
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export function Home() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [pendingFees, setPendingFees] = useState(0);
  const [resultSummary, setResultSummary] = useState(null);
  const [notices, setNotices] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const navigate = useNavigate();



  const stats = [
    {
      title: "Attendance",
      value: `${attendancePercentage}%`,
      color: "from-blue-500 to-indigo-600",
      icon: "📘",
    },
    {
      title: "Upcoming Exams",
     value: examCount,
      color: "from-purple-500 to-pink-500",
      icon: "📝",
    },
    {
      title: "Pending Fees",
      value: `₹ ${pendingFees}`,
      color: "from-orange-400 to-red-500",
      icon: "💳",
      },
      {
      title: resultSummary?.examType || "Results",

      value: resultSummary
      ? `${resultSummary.obtained}/${resultSummary.total}`
      : "No Result",

      subtitle: resultSummary?.status || "",

      color:
      resultSummary?.status === "PASS"
      ? "from-green-400 to-emerald-600"
      : "from-red-400 to-pink-500",

      icon:
      resultSummary?.status === "PASS"
      ? "🏆"
      : "❌",
    },
  ];



  useEffect(() => {

   const id = localStorage.getItem("id");

   // ✅ Attendance API
   fetch(`http://localhost:8080/api/stu-attendance/student/${id}`)
    .then((res) => res.json())
    .then((data) => {

      setAttendance(data);

      // 🔥 Current Month Attendance
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const currentMonthData = data.filter((a) => {
        const d = new Date(a.date);

        return (
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );
      });

      const total = currentMonthData.length;

      const present = currentMonthData.filter(
        (a) => a.status === "P"
      ).length;

      const percentage =
        total > 0
          ? ((present / total) * 100).toFixed(1)
          : 0;

      setAttendancePercentage(percentage);

    })
    .catch((err) => console.log(err));



   // ✅ Exam API
   fetch(`http://localhost:8080/api/exam-schedule/student/${id}`)
   .then((res) => res.json())
   .then((data) => {

    // 🔥 only upcoming exams count
   const upcoming = data.filter(
   (e) =>
    e.status !== "CANCELLED" &&
    e.status !== "PRESENT" &&
    e.status !== "GIVEN"
   );

    setExamCount(upcoming.length);

   })
   .catch((err) => console.log(err));


   // ✅ Fee API
   fetch(`http://localhost:8080/api/fees/history/${id}`)
   .then((res) => res.json())
   .then((data) => {

    if (data.length > 0) {

      // latest fee
      const latestFee = data[data.length - 1];

      setPendingFees(latestFee.pendingAmount || 0);
    }
 
   })
   .catch((err) => console.log(err));


   // ✅ Latest Result Summary
   fetch(`http://localhost:8080/api/results/latest-summary/${id}`)
   .then((res) => res.json())
   .then((data) => {

    if (data.length > 0) {

      let obtained = 0;
      let total = 0;

      data.forEach((r) => {
        obtained += r.marks || 0;
        total += r.totalMarks || 0;
      });

      const failed = data.some(
        (r) =>
          r.status === "FAIL" ||
          r.status === "ABSENT"
      );

      setResultSummary({
        examType: data[0]?.examType,
        obtained,
        total,
        status: failed ? "FAIL" : "PASS",
      });
    }

   })
   .catch((err) => console.log(err));




   // ✅ TODAY NOTICES
   fetch(`http://localhost:8080/api/notifications/student/${id}`)
   .then((res) => res.json())
   .then((data) => {

    const today = new Date();

    const todayNotices = data.filter((n) => {

      const noticeDate = new Date(n.sentAt);

      return (
        noticeDate.getDate() === today.getDate() &&
        noticeDate.getMonth() === today.getMonth() &&
        noticeDate.getFullYear() === today.getFullYear()
      );
    });

    setNotices(todayNotices);

   })
   .catch((err) => console.log(err));



   // ✅ Student API
   fetch(`http://localhost:8080/api/students/by-id/${id}`)
   .then((res) => res.json())
   .then((data) => {

    console.log(data);

    setStudent(data);

    // ✅ ALL SUBJECTS OF CLASS
   fetch(`http://localhost:8080/api/subjects/class-name/${data.className}`)
   .then((res) => res.json())
   .then((subjectsData) => {

    // ✅ GET TEACHERS
    fetch(`http://localhost:8080/api/professors/class/${data.className}`)
      .then((res) => res.json())
      .then((teacherData) => {

        const subjectMap = {};

        // 🔥 FIRST ADD ALL SUBJECTS
        subjectsData.forEach((sub) => {

          subjectMap[sub.subjectName] = {
            subject: sub.subjectName,
            teachers: [],
          };

        });

        // 🔥 NOW ADD TEACHERS
        teacherData.forEach((teacher) => {

          if (teacher.assignments) {

            teacher.assignments.forEach((a) => {

              if (
                a.className?.trim().toLowerCase() ===
                data.className?.trim().toLowerCase()
              ) {

                if (!subjectMap[a.subjectName]) {

                  subjectMap[a.subjectName] = {
                    subject: a.subjectName,
                    teachers: [],
                  };

                }
                subjectMap[a.subjectName].teachers.push(
                  teacher.name
                );
              }
            });
          }
        });

        setClasses(Object.values(subjectMap));

      })
      .catch((err) => console.log(err));

   })
   .catch((err) => console.log(err));

   })
   .catch((err) => console.log(err));

  }, []);

  if (!student) {
  return (
    <div className="p-10 text-center text-xl font-bold">
      Loading...
    </div>
  );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">
      {/* HEADER */}
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-100">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-800">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Student Dashboard Overview
          </p>

          <div className="mt-4 flex gap-3 flex-wrap">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              Class : {student.className}
            </span>

            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              Roll No : {student.studRollNo}
            </span>
          </div>
        </div>

        {/* PROFILE */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-3xl shadow-lg w-full md:w-auto">
          <img
            src={
             student.imageUrl
             ? `http://localhost:8080/api/students/image/get/${student.id}`
             : "https://ui-avatars.com/api/?name=Student"
             }
             className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
         />

          <div>
            <h2 className="text-2xl font-bold">{student.studName} {student.studLastName}</h2>
            <p className="text-blue-100">{student.email}</p>
            <p className="text-blue-100 text-sm mt-1">
              Student • Active
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${item.color} rounded-3xl p-6 text-white shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-sm">
                  {item.title}
                </p>
                <h2 className="text-4xl font-bold mt-2">
                 {item.value}
                </h2>
                {
                  item.subtitle && (
                  <div
                  className={`mt-3 inline-block px-4 py-1 rounded-full text-sm font-bold ${
                  item.subtitle === "PASS"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                  }`}
                  >
                  {item.subtitle}
                </div>
                )
                }
              </div>
              <div className="text-5xl opacity-90">{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6 mt-8 items-stretch">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">
          {/* ATTENDANCE */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-slate-800">
                Attendance Overview
              </h2>

              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                Excellent
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
             <div
             style={{ width: `${attendancePercentage}%` }}
             className="bg-gradient-to-r from-green-400 to-emerald-600 h-5 rounded-full"
             ></div>
            </div>

            <p className="mt-4 text-gray-500 text-lg">
              Your attendance this month is <span className="font-bold text-green-600">{attendancePercentage}%</span>
            </p>
          </div>

          {/* TODAY CLASSES */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Teachers And Subjects ({classes.length})
              </h2>
             <button
             onClick={() => setShowAllClasses(!showAllClasses)}
             className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-all duration-300"
             >
             {showAllClasses ? "Hide" : "View All"}
             </button>
            </div>

            <div className="space-y-4">
              {(showAllClasses ? classes : classes.slice(0, 2)).map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl hover:scale-[1.02] transition-all duration-300"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">
                      {item.subject}
                    </h3>

                    <p className="text-gray-500 mt-1">
                      👨‍🏫 {
                   item.teachers.length > 0
                   ? item.teachers.join(", ")
                   : "Pending Teacher"
                   }
                    </p>
                  </div>

                  <div className="bg-white px-4 py-2 rounded-xl shadow text-blue-600 font-bold">
                   Subject
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6 flex flex-col h-full">
          {/* NOTICES */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-slate-800">
                Notices
              </h2>

              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                New
              </span>
            </div>

        <div className="space-y-4">

        {notices.length > 0 ? (
          notices.map((notice, index) => (
        <div
        key={index}
         className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 hover:shadow-md transition-all duration-300 cursor-pointer"
         >
         <p className="text-slate-700 font-medium">
          📢 {notice.title}
         </p>
         <p className="text-gray-500 text-sm mt-1">
           {notice.message}
         </p>
         </div>
        ))
        ) : (
          <div className="text-center text-gray-400 py-6">
          No notices for today
          </div>
          )}
          </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-5">
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <button
               onClick={() => navigate("/dashboard/student/exams")}
               className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow hover:scale-105 transition-all duration-300"
               > Exams
              </button>

              <button
               onClick={() => navigate("/dashboard/student/notifications")}
               className="bg-gradient-to-r from-green-400 to-emerald-600 text-white p-5 rounded-2xl shadow hover:scale-105 transition-all duration-300">Leave
              </button>

              <button
               onClick={() => navigate("/dashboard/student/student-fee")}
               className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-5 rounded-2xl shadow hover:scale-105 transition-all duration-300">Fees
              </button>

              <button
               onClick={() => navigate("/dashboard/student/result")}
               className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow hover:scale-105 transition-all duration-300">Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
