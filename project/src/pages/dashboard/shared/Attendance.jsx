// import { useState, useEffect } from "react";

// import TeacherAttendance from "@/pages/dashboard/hod/Attendance/TeacherAttendance";
// import StuAttendance from "@/pages/dashboard/hod/Attendance/StuAttendance";
// import PrincipalAttendance from "@/pages/dashboard/SchoolAdmin/PrincipalAttendance";
// import MyAttendance from "@/pages/dashboard/professor/MyAttendance";

// export default function HODAttendance() {

//   const [activeTab, setActiveTab] =
//     useState("");

//   const [role, setRole] =
//     useState("");

//   // =========================================================
//   // LOAD ROLE
//   // =========================================================

//   useEffect(() => {

//     const userRole =
//       localStorage
//         .getItem("userRole")
//         ?.toLowerCase();

//     setRole(userRole);

//     // =====================================================
//     // DEFAULT TAB
//     // =====================================================

//     // TEACHER / PROFESSOR
//     if (
//       userRole === "teacher" ||
//       userRole === "professor"
//     ) {

//       setActiveTab("student");
//     }

//     // STUDENT
//     else if (
//       userRole === "student"
//     ) {

//       setActiveTab("my");
//     }

//     // HOD
//     else if (
//       userRole === "hod"
//     ) {

//       setActiveTab("teacher");
//     }

//     // SCHOOL ADMIN
//     else if (
//       userRole === "schooladmin"
//     ) {

//       setActiveTab("teacher");
//     }

//   }, []);

//   // =========================================================
//   // ROLE CHECKS
//   // =========================================================

//   const isSchoolAdmin =
//     role === "schooladmin";

//   const isTeacher =
//     role === "teacher" ||
//     role === "professor";

//   const isStudent =
//     role === "student";

//   const isHod =
//     role === "hod";

//   // =========================================================
//   // WHO CAN SEE MY ATTENDANCE
//   // =========================================================

//   const canSeeMyAttendance =
//     isHod ||
//     isTeacher ||
//     isStudent;

//   // =========================================================
//   // UI
//   // =========================================================

//   return (

//     <div className="p-6">

//       {/* ================================================= */}
//       {/* TITLE */}
//       {/* ================================================= */}

//       <h2 className="text-2xl font-bold mb-6">

//         Attendance Management

//       </h2>

//       {/* ================================================= */}
//       {/* BUTTONS */}
//       {/* ================================================= */}

//       <div className="flex gap-4 flex-wrap">

//         {/* ================================================= */}
//         {/* HOD + SCHOOL ADMIN */}
//         {/* ================================================= */}

//         {(isHod || isSchoolAdmin) && (
//           <>

//             {/* TEACHER */}
//             <button
//               onClick={() =>
//                 setActiveTab("teacher")
//               }
//               className={`px-6 py-3 rounded font-semibold transition ${
//                 activeTab === "teacher"
//                   ? "bg-blue-600 text-white shadow-lg"
//                   : "bg-blue-100 text-blue-600 hover:bg-blue-200"
//               }`}
//             >

//               Teacher Attendance

//             </button>

//             {/* STUDENT */}
//             <button
//               onClick={() =>
//                 setActiveTab("student")
//               }
//               className={`px-6 py-3 rounded font-semibold transition ${
//                 activeTab === "student"
//                   ? "bg-green-600 text-white shadow-lg"
//                   : "bg-green-100 text-green-600 hover:bg-green-200"
//               }`}
//             >

//               Student Attendance

//             </button>

//           </>
//         )}

//         {/* ================================================= */}
//         {/* TEACHER / PROFESSOR */}
//         {/* ================================================= */}

//         {isTeacher && (
//           <>

//             {/* STUDENT */}
//             <button
//               onClick={() =>
//                 setActiveTab("student")
//               }
//               className={`px-6 py-3 rounded font-semibold transition ${
//                 activeTab === "student"
//                   ? "bg-green-600 text-white shadow-lg"
//                   : "bg-green-100 text-green-600 hover:bg-green-200"
//               }`}
//             >

//               Student Attendance

//             </button>

//           </>
//         )}

//         {/* ================================================= */}
//         {/* MY ATTENDANCE */}
//         {/* ================================================= */}

//         {canSeeMyAttendance && (

//           <button
//             onClick={() =>
//               setActiveTab("my")
//             }
//             className={`px-6 py-3 rounded font-semibold transition ${
//               activeTab === "my"
//                 ? "bg-indigo-600 text-white shadow-lg"
//                 : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
//             }`}
//           >

//             My Attendance

//           </button>

//         )}

//         {/* ================================================= */}
//         {/* PRINCIPAL */}
//         {/* ================================================= */}

//         {isSchoolAdmin && (

//           <button
//             onClick={() =>
//               setActiveTab("principal")
//             }
//             className={`px-6 py-3 rounded font-semibold transition ${
//               activeTab === "principal"
//                 ? "bg-purple-600 text-white shadow-lg"
//                 : "bg-purple-100 text-purple-600 hover:bg-purple-200"
//             }`}
//           >

//             Principal Attendance

//           </button>

//         )}

//       </div>

//       {/* ================================================= */}
//       {/* CONTENT */}
//       {/* ================================================= */}

//       <div className="mt-6">

//         {/* ================================================= */}
//         {/* TEACHER ATTENDANCE */}
//         {/* ================================================= */}

//         {(isHod || isSchoolAdmin) &&
//           activeTab === "teacher" && (
//             <TeacherAttendance />
//         )}

//         {/* ================================================= */}
//         {/* STUDENT ATTENDANCE */}
//         {/* ================================================= */}

//         {(
//           isHod ||
//           isSchoolAdmin ||
//           isTeacher
//         ) &&
//           activeTab === "student" && (
//             <StuAttendance />
//         )}

//         {/* ================================================= */}
//         {/* PRINCIPAL */}
//         {/* ================================================= */}

//         {isSchoolAdmin &&
//           activeTab === "principal" && (
//             <PrincipalAttendance />
//         )}

//         {/* ================================================= */}
//         {/* MY ATTENDANCE */}
//         {/* ================================================= */}

//         {canSeeMyAttendance &&
//           activeTab === "my" && (
//             <MyAttendance />
//         )}

//       </div>

//     </div>
//   );
// }



import { useState, useEffect } from "react";

import TeacherAttendance from "@/pages/dashboard/hod/Attendance/TeacherAttendance";
import StuAttendance from "@/pages/dashboard/hod/Attendance/StuAttendance";
import PrincipalAttendance from "@/pages/dashboard/SchoolAdmin/PrincipalAttendance";
import MyAttendance from "@/pages/dashboard/professor/MyAttendance";

export default function HODAttendance() {

  // =========================================================
  // STATES
  // =========================================================

  const [activeTab, setActiveTab] =
    useState("");

  const [role, setRole] =
    useState("");

  // =========================================================
  // LOAD ROLE
  // =========================================================

  useEffect(() => {

    const userRole =
      localStorage
        .getItem("userRole")
        ?.trim()
        ?.toLowerCase();

    console.log(
      "USER ROLE =",
      userRole
    );

    setRole(userRole);

    // =====================================================
    // DEFAULT TAB
    // =====================================================

    // TEACHER / PROFESSOR
    if (
      userRole === "teacher" ||
      userRole === "professor"
    ) {

      setActiveTab("student");
    }

    // STUDENT
    else if (
      userRole === "student"
    ) {

      setActiveTab("my");
    }

    // HOD
    else if (
      userRole === "hod"
    ) {

      setActiveTab("teacher");
    }

    // SCHOOL ADMIN
    else if (
      userRole === "schooladmin" ||
      userRole === "school_admin"
    ) {

      setActiveTab("teacher");
    }

  }, []);

  // =========================================================
  // ROLE CHECKS
  // =========================================================

  const isSchoolAdmin =
    role === "schooladmin" ||
    role === "school_admin";

  const isTeacher =
    role === "teacher" ||
    role === "professor";

  const isStudent =
    role === "student";

  const isHod =
    role === "hod";

  // =========================================================
  // WHO CAN SEE MY ATTENDANCE
  // =========================================================

  const canSeeMyAttendance =
    isHod ||
    isTeacher ||
    isStudent;

  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="p-6">

      {/* ================================================= */}
      {/* TITLE */}
      {/* ================================================= */}

      <div className="mb-6">

        <h2 className="text-3xl font-bold text-gray-800">

          Attendance Management

        </h2>

        <p className="text-sm text-gray-500 mt-1">

          Manage teacher, student and personal attendance

        </p>

      </div>

      {/* ================================================= */}
      {/* DEBUG */}
      {/* ================================================= */}

      <div className="mb-4 text-sm text-gray-500">

        Current Role :
        {" "}
        <span className="font-bold text-blue-600">
          {role || "NO ROLE"}
        </span>

      </div>

      {/* ================================================= */}
      {/* BUTTONS */}
      {/* ================================================= */}

      <div className="flex gap-4 flex-wrap">

        {/* ================================================= */}
        {/* HOD + SCHOOL ADMIN */}
        {/* ================================================= */}

        {(isHod || isSchoolAdmin) && (
          <>

            {/* TEACHER */}
            <button
              onClick={() =>
                setActiveTab("teacher")
              }
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "teacher"
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >

              Teacher Attendance

            </button>

            {/* STUDENT */}
            <button
              onClick={() =>
                setActiveTab("student")
              }
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "student"
                  ? "bg-green-600 text-white shadow-lg scale-105"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >

              Student Attendance

            </button>

          </>
        )}

        {/* ================================================= */}
        {/* TEACHER / PROFESSOR */}
        {/* ================================================= */}

        {isTeacher && (
          <>

            {/* STUDENT */}
            <button
              onClick={() =>
                setActiveTab("student")
              }
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "student"
                  ? "bg-green-600 text-white shadow-lg scale-105"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >

              Student Attendance

            </button>

          </>
        )}

        {/* ================================================= */}
        {/* MY ATTENDANCE */}
        {/* ================================================= */}

        {canSeeMyAttendance && (

          <button
            onClick={() =>
              setActiveTab("my")
            }
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "my"
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
          >

            My Attendance

          </button>

        )}

        {/* ================================================= */}
        {/* PRINCIPAL */}
        {/* ================================================= */}

        {isSchoolAdmin && (

          <button
            onClick={() =>
              setActiveTab("principal")
            }
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "principal"
                ? "bg-purple-600 text-white shadow-lg scale-105"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200"
            }`}
          >

            Principal Attendance

          </button>

        )}

      </div>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="mt-8">

        {/* ================================================= */}
        {/* TEACHER ATTENDANCE */}
        {/* ================================================= */}

        {(isHod || isSchoolAdmin) &&
          activeTab === "teacher" && (
            <TeacherAttendance />
        )}

        {/* ================================================= */}
        {/* STUDENT ATTENDANCE */}
        {/* ================================================= */}

        {(
          isHod ||
          isSchoolAdmin ||
          isTeacher
        ) &&
          activeTab === "student" && (
            <StuAttendance />
        )}

        {/* ================================================= */}
        {/* PRINCIPAL */}
        {/* ================================================= */}

        {isSchoolAdmin &&
          activeTab === "principal" && (
            <PrincipalAttendance />
        )}

        {/* ================================================= */}
        {/* MY ATTENDANCE */}
        {/* ================================================= */}

        {canSeeMyAttendance &&
          activeTab === "my" && (
            <MyAttendance />
        )}

      </div>

    </div>
  );
}