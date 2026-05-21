import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Card,
  Typography,
  Spinner,
} from "@material-tailwind/react";

const SemesterTable = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [student, setStudent] =
    useState(null);

  const [classes, setClasses] =
    useState([]);

  const [subjectsMap, setSubjectsMap] =
    useState({});

  const [teachers, setTeachers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    loadData();

  }, []);

  // =====================================================
  // MAIN LOAD
  // =====================================================

  const loadData = async () => {

    try {

      setLoading(true);

      // =====================================================
      // STUDENT
      // =====================================================

      const studentId =
        localStorage.getItem("id");

      const studentRes =
        await axios.get(
          `http://localhost:8080/api/students/${studentId}`
        );

      const studentData =
        studentRes.data;

      setStudent(studentData);

      const schoolId =
        studentData.schoolId;

      // =====================================================
      // CLASSES
      // =====================================================

      const classRes =
        await axios.get(
          `http://localhost:8080/api/classes/by-school/${schoolId}`
        );

      const allClasses =
        classRes.data || [];

      setClasses(allClasses);

      // =====================================================
      // SUBJECTS
      // =====================================================

      const tempSubjects = {};

      for (const cls of allClasses) {

        const subRes =
          await axios.get(
            `http://localhost:8080/api/subjects/school/${schoolId}/class/${cls.id}`
          );

        tempSubjects[cls.id] =
          subRes.data || [];
      }

      setSubjectsMap(tempSubjects);

      // =====================================================
      // TEACHERS
      // =====================================================

      const teacherRes =
        await axios.get(
          `http://localhost:8080/api/professors/by-school/${schoolId}`
        );

      setTeachers(
        teacherRes.data || []
      );

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // FIND TEACHER
  // =====================================================

  const getTeacherName = (
    className,
    subjectName
  ) => {

    for (const teacher of teachers) {

      const assignments =
        teacher.assignments || [];

      const found =
        assignments.find(
          (a) =>

            a.className
              ?.trim()
              .toLowerCase() ===

            className
              ?.trim()
              .toLowerCase()

            &&

            a.subjectName
              ?.trim()
              .toLowerCase() ===

            subjectName
              ?.trim()
              .toLowerCase()
        );

      if (found) {

        return teacher.name;
      }
    }

    return "Pending Teacher";
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div className="flex h-screen items-center justify-center bg-[#f4f7ff]">

        <div className="text-center">

          <Spinner className="mx-auto h-14 w-14 text-indigo-600" />

          <Typography className="mt-5 text-lg font-semibold text-gray-700">

            Loading Academic Structure...

          </Typography>

        </div>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-[#f4f7ff] p-3 sm:p-6">

      {/* ================================================= */}
      {/* TOP HEADER */}
      {/* ================================================= */}

      <div className="mb-10 overflow-hidden rounded-[35px] sm:rounded-[40px] bg-gradient-to-r from-[#4338ca] via-[#4f46e5] to-[#312e81] shadow-2xl">

        <div className="relative p-5 sm:p-10">

          {/* BG CIRCLES */}

          <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-white/10"></div>

          <div className="absolute bottom-0 right-20 h-40 w-40 rounded-full bg-white/5"></div>

          {/* CONTENT */}

          <div
            className="
            relative z-10
            flex flex-col
            gap-8
            xl:flex-row
            xl:items-center
            xl:justify-between
          "
          >

            {/* LEFT */}

            <div>

              <Typography
                variant="h1"
                className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-black
                text-white
                leading-tight
              "
              >
                Semester Table
              </Typography>

              <Typography className="mt-4 text-base sm:text-lg text-indigo-100">

                Explore all classes, subjects and assigned teachers

              </Typography>

              {/* STATS */}

              <div className="mt-8 flex flex-wrap gap-4">

                {/* CLASSES */}

                <div
                  className="
                  rounded-3xl
                  border border-white/20
                  bg-white/10
                  px-5 py-4
                  sm:px-7 sm:py-5
                  backdrop-blur-xl
                  shadow-lg
                "
                >

                  <Typography className="text-sm text-indigo-100">
                    Total Classes
                  </Typography>

                  <Typography className="mt-2 text-3xl sm:text-4xl font-black text-white">

                    {classes.length}

                  </Typography>

                </div>

                {/* TEACHERS */}

                <div
                  className="
                  rounded-3xl
                  border border-white/20
                  bg-white/10
                  px-5 py-4
                  sm:px-7 sm:py-5
                  backdrop-blur-xl
                  shadow-lg
                "
                >

                  <Typography className="text-sm text-indigo-100">
                    Teachers
                  </Typography>

                  <Typography className="mt-2 text-3xl sm:text-4xl font-black text-white">

                    {teachers.length}

                  </Typography>

                </div>

              </div>

            </div>

            {/* PROFILE */}

            <div
              className="
              w-full
              xl:w-[380px]
              rounded-[35px]
              border border-white/20
              bg-white/10
              p-5 sm:p-7
              backdrop-blur-2xl
              shadow-2xl
            "
            >

              <div className="flex items-center gap-4 sm:gap-5">

                <img
                  src={
                    student?.profileImage
                      ? `http://localhost:8080/api/students/image/get/${student.id}`
                      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt="student"
                  className="
                  h-20 w-20
                  sm:h-24 sm:w-24
                  rounded-[24px]
                  border-4 border-white
                  object-cover
                  shadow-xl
                "
                />

                <div>

                  <Typography className="text-sm text-indigo-100">
                    Student
                  </Typography>

                  <Typography
                    variant="h5"
                    className="mt-1 font-black text-white"
                  >
                    {student?.studfirstName}{" "}
                    {student?.studlastName}
                  </Typography>

                  <Typography className="mt-2 text-sm sm:text-base font-medium text-indigo-100">

                    {student?.className}

                  </Typography>

                </div>

              </div>

              {/* DETAILS */}

              <div className="mt-7 grid grid-cols-2 gap-4">

                <div className="rounded-3xl bg-white/10 p-4 sm:p-5">

                  <Typography className="text-xs text-indigo-100">
                    Roll Number
                  </Typography>

                  <Typography className="mt-2 text-2xl sm:text-3xl font-black text-white">

                    {student?.studRollNo}

                  </Typography>

                </div>

                <div className="rounded-3xl bg-white/10 p-4 sm:p-5">

                  <Typography className="text-xs text-indigo-100">
                    School
                  </Typography>

                  <Typography className="mt-2 text-xs sm:text-sm font-bold text-white break-words">

                    {student?.schoolName}

                  </Typography>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* CLASS SECTION */}
      {/* ================================================= */}

      <div className="space-y-10">

        {classes.map((cls) => (

          <Card
            key={cls.id}
            className="
            overflow-hidden
            rounded-[28px]
            sm:rounded-[35px]
            border border-gray-100
            bg-white
            shadow-xl
          "
          >

            {/* HEADER */}

            <div
              className="
              bg-gradient-to-r
              from-[#eef2ff]
              to-[#f5f3ff]
              p-5 sm:p-8
              border-b
            "
            >

              <div className="flex flex-wrap items-center justify-between gap-6">

                {/* LEFT */}

                <div className="flex items-center gap-4 sm:gap-6">

                  <div
                    className="
                    flex
                    h-16 w-16
                    sm:h-24 sm:w-24
                    items-center justify-center
                    rounded-[22px]
                    sm:rounded-[30px]
                    bg-gradient-to-r
                    from-indigo-600
                    to-blue-600
                    text-2xl sm:text-4xl
                    font-black text-white
                    shadow-xl
                  "
                  >

                    {cls.className?.[0]}

                  </div>

                  <div>

                    <Typography
                      variant="h3"
                      className="font-black text-indigo-700 text-2xl sm:text-4xl"
                    >
                      {cls.className}
                    </Typography>

                    <Typography className="mt-2 text-sm sm:text-base text-gray-600">

                      Subjects & Assigned Teachers

                    </Typography>

                  </div>

                </div>

                {/* RIGHT */}

                <div className="rounded-3xl bg-white px-5 py-4 sm:px-7 sm:py-5 shadow-lg">

                  <Typography className="text-sm text-gray-500">
                    Total Subjects
                  </Typography>

                  <Typography className="mt-2 text-3xl sm:text-4xl font-black text-indigo-700">

                    {
                      subjectsMap[cls.id]
                        ?.length || 0
                    }

                  </Typography>

                </div>

              </div>

            </div>

            {/* SUBJECT GRID */}

            <div
              className="
              grid
              gap-5
              p-4 sm:p-8
              grid-cols-1
              md:grid-cols-2
              2xl:grid-cols-3
            "
            >

              {(subjectsMap[cls.id] || []).map(
                (subject) => {

                  const teacherName =
                    getTeacherName(
                      cls.className,
                      subject.subjectName
                    );

                  return (

                    <div
                      key={subject.id}
                      className="
                      group relative overflow-hidden
                      rounded-[28px]
                      border border-gray-100
                      bg-gradient-to-br
                      from-white
                      to-[#f8faff]
                      p-5 sm:p-7
                      shadow-lg
                      transition-all duration-300
                      hover:-translate-y-2
                      hover:shadow-2xl
                    "
                    >

                      {/* GLOW */}

                      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-100/40 blur-3xl"></div>

                      {/* TOP */}

                      <div className="relative z-10 flex items-start justify-between gap-4">

                        <div>

                          <Typography className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-500">

                            Subject

                          </Typography>

                          <Typography
                            variant="h5"
                            className="mt-3 font-black text-gray-800 break-words"
                          >

                            {subject.subjectName}

                          </Typography>

                        </div>

                        <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-2 text-xs sm:text-sm font-bold text-white shadow-md whitespace-nowrap">

                          Active

                        </div>

                      </div>

                      {/* TEACHER */}

                      <div className="relative z-10 mt-8 rounded-[24px] bg-[#f5f7ff] p-4 sm:p-5">

                        <div className="flex items-center gap-4 sm:gap-5">

                          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-[20px] bg-gradient-to-r from-indigo-600 to-blue-600 text-xl sm:text-2xl font-black text-white shadow-lg">

                            {teacherName?.[0]}

                          </div>

                          <div>

                            <Typography className="text-xs sm:text-sm font-semibold text-gray-500">

                              Assigned Teacher

                            </Typography>

                            <Typography className="mt-2 text-base sm:text-lg font-black text-gray-800 break-words">

                              {teacherName}

                            </Typography>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </Card>
        ))}

      </div>

    </div>
  );
};

export default SemesterTable;


































// import React from "react";
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   Typography,
//   Avatar,
//   Chip,
//   Tooltip,
//   Progress,
// } from "@material-tailwind/react";
// import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

// // Sample data for semesters
// const semesterData = [
//   {
//     semester: "Semester 1",
//     subjects: [
//       { code: "CS101", name: "Introduction to Programming", credits: 4, grade: "A", ct1: 18, ct2: 20, theory: 55 },
//       { code: "MA101", name: "Calculus", credits: 4, grade: "B+", ct1: 15, ct2: 17, theory: 45 },
//       { code: "PH101", name: "Physics", credits: 4, grade: "A-", ct1: 19, ct2: 18, theory: 50 },
//       { code: "CH101", name: "Chemistry", credits: 4, grade: "B", ct1: 14, ct2: 15, theory: 40 },
//       { code: "CS102", name: "Data Structures", credits: 4, grade: "A+", ct1: 20, ct2: 20, theory: 58 },
//       { code: "EN101", name: "English", credits: 4, grade: "A", ct1: 18, ct2: 20, theory: 55 },
//     ],
//     practicals: [
//       { name: "Physics Lab", grade: "A", written: 20, viva: 18 },
//       { name: "Chemistry Lab", grade: "B+", written: 18, viva: 16 },
//       { name: "CS Lab", grade: "A", written: 20, viva: 19 },
//     ],
//   },
//   {
//     semester: "Semester 2",
//     subjects: [
//       { code: "CS201", name: "Algorithms", credits: 4, grade: "A", ct1: 17, ct2: 18, theory: 50 },
//       { code: "MA201", name: "Linear Algebra", credits: 4, grade: "A-", ct1: 18, ct2: 19, theory: 52 },
//       { code: "PH201", name: "Electromagnetism", credits: 4, grade: "B+", ct1: 16, ct2: 17, theory: 47 },
//       { code: "CH201", name: "Organic Chemistry", credits: 4, grade: "B", ct1: 15, ct2: 14, theory: 42 },
//       { code: "CS202", name: "Operating Systems", credits: 4, grade: "A-", ct1: 18, ct2: 19, theory: 53 },
//       { code: "EN201", name: "Communication Skills", credits: 4, grade: "A", ct1: 19, ct2: 20, theory: 56 },
//     ],
//     practicals: [
//       { name: "Algorithms Lab", grade: "A", written: 20, viva: 18 },
//       { name: "OS Lab", grade: "A-", written: 18, viva: 17 },
//       { name: "Chemistry Lab", grade: "B", written: 16, viva: 15 },
//     ],
//   },
//   // Add more semester data as needed...
// ];

// export function SemesterTable() {
//   return (
//     <div className="mt-12 mb-8 flex flex-col gap-14">
//       {semesterData.map((semester, semKey) => (
//         <Card key={semKey}>
//           <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
//             <Typography variant="h6" color="white">
//               {semester.semester} - Subject Information
//             </Typography>
//           </CardHeader>
//           <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
//             <table className="w-full min-w-[640px] table-auto">
//               <thead>
//                 <tr>
//                   {["Code", "Name", "Credits", "CT-1", "CT-2", "Theory", "Total", "Grade"].map((el) => (
//                     <th
//                       key={el}
//                       className="border-b border-blue-gray-50 py-3 px-5 text-left"
//                     >
//                       <Typography
//                         variant="small"
//                         className="text-[11px] font-bold uppercase text-blue-gray-400"
//                       >
//                         {el}
//                       </Typography>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {semester.subjects.map((subject, key) => {
//                   const total = subject.ct1 + subject.ct2 + subject.theory;
//                   const className = `py-3 px-5 ${
//                     key === semester.subjects.length - 1
//                       ? ""
//                       : "border-b border-blue-gray-50"
//                   }`;

//                   return (
//                     <tr key={subject.code}>
//                       <td className={className}>
//                         <Typography
//                           variant="small"
//                           color="blue-gray"
//                           className="font-semibold"
//                         >
//                           {subject.code}
//                         </Typography>
//                       </td>
//                       <td className={className}>
//                         <Typography className="text-xs font-normal text-blue-gray-600">
//                           {subject.name}
//                         </Typography>
//                       </td>
//                       <td className={className}>
//                         <Typography className="text-xs font-semibold text-blue-gray-600">
//                           {subject.credits}
//                         </Typography>
//                       </td>
//                       <td className={className}>
//                         <Typography className="text-xs font-semibold text-blue-gray-600">
//                           {subject.ct1}
//                         </Typography>
//                       </td>
//                       <td className={className}>
//                         <Typography className="text-xs font-semibold text-blue-gray-600">
//                           {subject.ct2}
//                         </Typography>
//                       </td>
//                       <td className={className}>
//                         <Typography className="text-xs font-semibold text-blue-gray-600">
//                           {subject.theory}
//                         </Typography>
//                       </td>
//                       <td className={className}>
//                         <Typography className="text-xs font-semibold text-blue-gray-600">
//                           {total}
//                         </Typography>
//                       </td>
//                       <td className={className}>
//                         <Chip
//                           variant="gradient"
//                           color={total >= 90 ? "green" : total >= 75 ? "blue" : "red"}
//                           value={subject.grade}
//                           className="py-0.5 px-2 text-[11px] font-medium w-fit"
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </CardBody>

//           <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
//             <Typography variant="h6" color="white">
//               {semester.semester} - Practical Information
//             </Typography>
//           </CardHeader>
//           <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
//             <table className="w-full min-w-[640px] table-auto">
//               <thead>
//                 <tr>
//                   {["Name", "Written", "Viva", "Total", "Grade"].map((el) => (
//                     <th
//                       key={el}
//                       className="border-b border-blue-gray-50 py-3 px-5 text-left"
//                     >
//                       <Typography
//                         variant="small"
//                         className="text-[11px] font-bold uppercase text-blue-gray-400"
//                       >
//                         {el}
//                       </Typography>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {semester.practicals.map((practical, key) => {
//                   const total = practical.written + practical.viva;
//                   const className = `py-3 px-5 ${
//                     key === semester.practicals.length - 1
//                       ? ""
//                       : "border-b border-blue-gray-50"
//                   }`;

//                   return (
//                     <tr key={practical.name}>
//                       <td className={className}>
//                         <Typography
//                           variant="small"
//                           color="blue-gray"
//                           className="font-semibold"
//                         >
//                           {practical.name}
//                         </Typography>
//                       </td>
//                       <td className={className}>
//                         <Typography className="text-xs font-semibold text-blue-gray-600">
//                           {practical.written}
//                         </Typography>
//                       </td>
//                       <td className={className}>
//                         <Typography className="text-xs font-semibold text-blue-gray-600">
//                           {practical.viva}
//                         </Typography>
//                       </td>
//                       <td className={className}>
//                         <Typography className="text-xs font-semibold text-blue-gray-600">
//                           {total}
//                         </Typography>
//                       </td>
//                       <td className={className}>
//                         <Chip
//                           variant="gradient"
//                           color={total >= 35 ? "green" : total >= 25 ? "blue" : "red"}
//                           value={practical.grade}
//                           className="py-0.5 px-2 text-[11px] font-medium w-fit"
//                         />
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </CardBody>
//         </Card>
//       ))}
//     </div>
//   );
// }

// export default SemesterTable;