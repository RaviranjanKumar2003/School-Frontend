import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  EnvelopeIcon,
  PencilIcon,
  ClipboardDocumentCheckIcon ,
  CalendarDaysIcon ,

} from "@heroicons/react/24/solid";
import { lazy, Suspense } from "react";

/* ================= SUPER ADMIN ================= */

const SuperAdminHome = lazy(() =>
  import("@/pages/dashboard/superadmin/Home")
);

const SchoolManagement = lazy(() =>
  import("@/pages/dashboard/superadmin/Schools")
);

const SchoolAdminPage = lazy(() =>
  import("@/pages/dashboard/superadmin/SchoolAdmins")
);


/* ================= SCHOOL ADMIN ================= */

const SchoolAdminHome = lazy(() =>
  import("@/pages/dashboard/schooladmin/Home")
);

const SchoolAdminInfo = lazy(() =>
  import("@/pages/dashboard/schooladmin/Information")
);

const AdminCreatClassSubject = lazy(() =>
  import("@/pages/dashboard/schooladmin/CreatClassAndSubject")
);

const SchoolTeachers = lazy(() =>
  import("@/pages/dashboard/schooladmin/Teachers")
);

const SchoolStudents = lazy(() =>
  import("@/pages/dashboard/schooladmin/Students")
);

const HODs = lazy(() =>
  import("@/pages/dashboard/schooladmin/HODs")
);


/* ================= HOD ================= */

const HODHome = lazy(() => import("@/pages/dashboard/hod/Home"));
const HODProfile = lazy(() => import("@/pages/dashboard/hod/Profile"));
const LiveResult = lazy(() => import("@/pages/dashboard/hod/LiveResult"));
const Email = lazy(() =>
   import("@/components/email/MailSender")
);

const HODSemesterTable = lazy(() =>
  import("@/pages/dashboard/hod/SemesterTable")
);

const HODNotifications = lazy(() =>
  import("@/pages/dashboard/hod/Notifications")
);

const HODResult = lazy(() =>
  import("@/pages/dashboard/hod/Result")
);

const StudentExam = lazy(() =>
  import("@/pages/dashboard/hod/StudentExam")
);

const EventScheduler = lazy(() =>
  import("@/pages/dashboard/hod/EventScheduler")
);

const CreateTeacher = lazy(() =>
  import("@/pages/dashboard/SchoolAdmin/CreateTeacher")
);
const CreateStudent = lazy(() =>
  import("@/pages/dashboard/SchoolAdmin/CreateStudent")
);

const ArchivedStudents = lazy(() =>
  import("@/pages/dashboard/hod/ArchivedStudents")
);
const StudentFees = lazy(() =>
  import("@/pages/dashboard/hod/StudentFees")
);
// const HODAttendance = lazy(() =>
//   import("@/pages/dashboard/hod/Attendance")
// );

/* ================= PROFESSOR ================= */

const ProfessorHome = lazy(() => import("@/pages/dashboard/professor/Home"));
const ExamNotice = lazy(() => import("@/pages/dashboard/professor/ExamNotice"));
const StudentExams = lazy(() => import("@/pages/dashboard/professor/StudentExams"));
const ExamAttendance = lazy(() => import("@/pages/dashboard/professor/ExamAttendance"));
const ProfessorProfile = lazy(() =>
  import("@/pages/dashboard/professor/Profile")
);
const ProfessorNotifications = lazy(() =>
  import("@/pages/dashboard/professor/Notifications")
);

// ✅ FIXED HERE ONLY
const AttendancePage = lazy(() =>
  import("@/pages/dashboard/professor/PAttendance/AttendanceFlow")
);

const ProfessorResult = lazy(() =>
  import("@/pages/dashboard/professor/Result")
);

const ProfessorEvents = lazy(() =>
  import("@/pages/dashboard/professor/ProfessorEvents")
);

/* ================= STUDENT ================= */

const StudentHome = lazy(() => import("@/pages/dashboard/student/Home"));
const StudentProfile = lazy(() => import("@/pages/dashboard/student/Profile"));
const Exams = lazy(() => import("@/pages/dashboard/student/Exams"));
const LiveClass = lazy(() =>
  import("@/pages/dashboard/student/LiveClass")
);

const StudentNotifications = lazy(() =>
  import("@/pages/dashboard/student/Notifications")
);
const StudentSemesterTable = lazy(() =>
  import("@/pages/dashboard/student/SemesterTable")
);

const StudentResult = lazy(() =>
  import("@/pages/dashboard/student/Result")
);

const ArchivedNotifications = lazy(() =>
  import("@/pages/dashboard/student/ArchivedNotifications")
);

const StudentEvents = lazy(() =>
  import("@/pages/dashboard/student/StudentEvents")
);

/* ================= AUTH ================= */

const HODSignIn = lazy(() => import("@/pages/auth/hod/HODSignIn"));
const HODSignUp = lazy(() => import("@/pages/auth/hod/HODSignUp"));

const ProfessorSignIn = lazy(() =>
  import("@/pages/auth/professor/ProfessorSignIn")
);
const ProfessorSignUp = lazy(() =>
  import("@/pages/auth/professor/ProfessorSignUp")
);

const StudentSignIn = lazy(() => import("@/pages/auth/student/StudentSignIn"));
const StudentSignUp = lazy(() => import("@/pages/auth/student/StudentSignUp"));

//============================================================================
/* ================= SUPER ADMIN AUTH ================= */

const SuperAdminSignIn = lazy(() =>
  import("@/pages/auth/superadmin/SuperAdminSignIn")
);


/* ================= SCHOOL ADMIN AUTH ================= */

const SchoolAdminSignIn = lazy(() =>
  import("@/pages/auth/schooladmin/SchoolAdminSignIn")
);

const SchoolAdminSignUp = lazy(() =>
  import("@/pages/auth/schooladmin/SchoolAdminSignUp")
);

const ForgotPasswordFlow = lazy(() =>
  import("./pages/forgotPassword/ForgotPasswordFlow")
);

const icon = {
  className: "w-5 h-5 text-inherit",
};

//========================================================== COMMEN IMPORT

const Teachers = lazy(() =>
  import("@/pages/dashboard/shared/Teachers")
);

const Students = lazy(() =>
  import("@/pages/dashboard/shared/Students")
);

const Attendance = lazy(() =>
  import("@/pages/dashboard/shared/Attendance")
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="relative">
      <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
      <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
    </div>
  </div>
);

export const routes = [

//============================================================== PRINCIPLE/HOD DASHBOADR
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "HOD dashboard",
        path: "/hod/home",
        element: <Suspense fallback={<LoadingSpinner />}><HODHome /></Suspense>,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "HOD Information",
        path: "/hod/information",
        element: <Suspense fallback={<LoadingSpinner />}><HODProfile /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Our Classes",
        path: "/hod/semesters",
        element: <Suspense fallback={<LoadingSpinner />}><HODSemesterTable /></Suspense>,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "HOD notifications",
        path: "/hod/notifications",
        element: <Suspense fallback={<LoadingSpinner />}><HODNotifications /></Suspense>,
      },
      {
        icon: <EnvelopeIcon {...icon} />,
        name: "HOD E-Mail",
        path: "/hod/email",
        element: <Suspense fallback={<LoadingSpinner />}><Email /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Student Results",
        path: "/hod/result",
        element: <Suspense fallback={<LoadingSpinner />}><HODResult /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Live Results",
        path: "/hod/liveresult",
        element: <Suspense fallback={<LoadingSpinner />}><LiveResult /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Student Exams",
        path: "/hod/student-exam",
        element: <Suspense fallback={<LoadingSpinner />}><StudentExam /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Event Scheduler",
        path: "/hod/events",
        element: <Suspense fallback={<LoadingSpinner />}><EventScheduler /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Teachers List",
        path: "/hod/teachers",
        element: <Suspense fallback={<LoadingSpinner />}><Teachers /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Students List",
        path: "/hod/students",
        element: <Suspense fallback={<LoadingSpinner />}><Students /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Archived Students",
        path: "/hod/archived-students",
        element: <Suspense fallback={<LoadingSpinner />}><ArchivedStudents /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Students Fees",
        path: "/hod/fees",
        element: <Suspense fallback={<LoadingSpinner />}><StudentFees /></Suspense>,
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Attendance",
        path: "/hod/attendance",
        element: <Suspense fallback={<LoadingSpinner />}><Attendance /></Suspense>,
      }
    ],
  },

//================================================================= PROFESSOR DASHBOARD 
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Professor dashboard",
        path: "/professor/home",
        element: <Suspense fallback={<LoadingSpinner />}><ProfessorHome /></Suspense>,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Professor Information",
        path: "/professor/information",
        element: <Suspense fallback={<LoadingSpinner />}><ProfessorProfile /></Suspense>,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Professor notifications",
        path: "/professor/notifications",
        element: <Suspense fallback={<LoadingSpinner />}><ProfessorNotifications /></Suspense>,
      },
      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Attendance",
        path: "/professor/attendance",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Attendance />
          </Suspense>
        ),
      },
      {
        icon: <PencilIcon {...icon} />,
        name: "Student Exams",
        path: "/professor/student-exams",
        element: <Suspense fallback={<LoadingSpinner />}><StudentExams /></Suspense>,
      },
      {
        icon: <PencilIcon {...icon} />,
        name: "Exam Attendance",
        path: "/professor/exam-attendance",
        element: <Suspense fallback={<LoadingSpinner />}><ExamAttendance /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Manage Results",
        path: "/professor/result",
        element: <Suspense fallback={<LoadingSpinner />}><ProfessorResult /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Exam Notice",
        path: "/professor/examNotice",
        element: <Suspense fallback={<LoadingSpinner />}><ExamNotice /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Events",
        path: "/professor/events",
        element: <Suspense fallback={<LoadingSpinner />}><ProfessorEvents /></Suspense>,
      },
    ],
  },

  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Student dashboard",
        path: "/student/home",
        element: <Suspense fallback={<LoadingSpinner />}><StudentHome /></Suspense>,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Student Information",
        path: "/student/information",
        element: <Suspense fallback={<LoadingSpinner />}><StudentProfile /></Suspense>,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Student notifications",
        path: "/student/notifications",
        element: <Suspense fallback={<LoadingSpinner />}><StudentNotifications /></Suspense>,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Exams",
        path: "/student/exams",
        element: <Suspense fallback={<LoadingSpinner />}><Exams /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Results",
        path: "/student/result",
        element: <Suspense fallback={<LoadingSpinner />}><StudentResult /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Archived Notifications",
        path: "/student/archived-notifications",
        element: <Suspense fallback={<LoadingSpinner />}><ArchivedNotifications /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Student Semester Table",
        path: "/student/semestertable",
        element: <Suspense fallback={<LoadingSpinner />}><StudentSemesterTable /></Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Events",
        path: "/student/events",
        element: <Suspense fallback={<LoadingSpinner />}><StudentEvents /></Suspense>,
      },
    ],
  },

  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Student sign-in",
        path: "student/sign-in",
        element: <Suspense fallback={<LoadingSpinner />}><StudentSignIn /></Suspense>,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Student sign-up",
        path: "student/sign-up",
        element: <Suspense fallback={<LoadingSpinner />}><StudentSignUp /></Suspense>,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "forgot password",
        path: "/forgot-password",
        element: <Suspense fallback={<LoadingSpinner />}><ForgotPasswordFlow /></Suspense>,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Professor sign-in",
        path: "professor/sign-in",
        element: <Suspense fallback={<LoadingSpinner />}><ProfessorSignIn /></Suspense>,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Professor sign-up",
        path: "professor/sign-up",
        element: <Suspense fallback={<LoadingSpinner />}><ProfessorSignUp /></Suspense>,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "HOD sign-in",
        path: "hod/sign-in",
        element: <Suspense fallback={<LoadingSpinner />}><HODSignIn /></Suspense>,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "HOD sign-up",
        path: "hod/sign-up",
        element: <Suspense fallback={<LoadingSpinner />}><HODSignUp /></Suspense>,
      },

      {
        icon: <ServerStackIcon {...icon} />,
        name: "Super Admin sign-in",
        path: "superadmin/sign-in",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SuperAdminSignIn />
          </Suspense>
        ),
      },

      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Super Admin sign-up",
        path: "superadmin/sign-up",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
          </Suspense>
        ),
      },

      {
        icon: <ServerStackIcon {...icon} />,
        name: "School Admin sign-in",
        path: "schooladmin/sign-in",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SchoolAdminSignIn />
          </Suspense>
        ),
       },

       {
        icon: <RectangleStackIcon {...icon} />,
        name: "School Admin sign-up",
        path: "schooladmin/sign-up",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
           <SchoolAdminSignUp />
          </Suspense>
        ),
      },
    ],
  },

//=================================================== SUPER ADMIN DASHBOAR
  {
  layout: "dashboard",
  pages: [
    {
      icon: <HomeIcon {...icon} />,
      name: "Super Admin Dashboard",
      path: "/superadmin/home",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <SuperAdminHome />
        </Suspense>
      ),
    },
    {
      icon: <TableCellsIcon {...icon} />,
      name: "Manage Schools",
      path: "/superadmin/schools",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <SchoolManagement />
        </Suspense>
      ),
    },
    {
      icon: <UserCircleIcon {...icon} />,
      name: "School Admins",
      path: "/superadmin/admins",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <SchoolAdminPage />
        </Suspense>
      ),
    },
  ],
},

//============================================= SCHOOL ADMIN DASHBOAR

{
  layout: "dashboard",
  pages: [

    {
      icon: <HomeIcon {...icon} />,
      name: "Admin Dashboard",
      path: "/schooladmin/home",
      element: 
      <Suspense fallback={<LoadingSpinner />}>
        <SchoolAdminHome />
      </Suspense>,
    },
    {
      icon: <UserCircleIcon {...icon} />,
      name: "Admin Information",
      path: "/schooladmin/information",
      element: 
      <Suspense fallback={<LoadingSpinner />}>
        <SchoolAdminInfo />
      </Suspense>,
    },
    {
      icon: <TableCellsIcon {...icon} />,
      name: "Our Classes",
      path: "/schooladmin/CreatClassAndSubject",
      element: 
      <Suspense fallback={<LoadingSpinner />}>
        <AdminCreatClassSubject />
      </Suspense>,
    },
    {
      icon: <UserCircleIcon {...icon} />,
      name: "Our Principle",
      path: "/schooladmin/hods",
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <HODs />
        </Suspense>
      ),
    },
    {
        icon: <PencilIcon {...icon} />,
        name: "Create Teacher",
        path: "/schooladmin/create-teacher",
        element:
        <Suspense fallback={<LoadingSpinner />}>
          <CreateTeacher />
        </Suspense>,
      },
      {
        icon: <PencilIcon {...icon} />,
        name: "Create Student",
        path: "/schooladmin/create-student",
        element: 
        <Suspense fallback={<LoadingSpinner />}>
          <CreateStudent />
        </Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Teachers List",
        path: "/schooladmin/teachers",
        element: 
        <Suspense fallback={<LoadingSpinner />}>
          <Teachers />
        </Suspense>,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Students List",
        path: "/schooladmin/students",
        element: 
        <Suspense fallback={<LoadingSpinner />}>
          <Students />
        </Suspense>,
      },

      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Attendance",
        path: "/schooladmin/attendance",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Attendance />
          </Suspense>
        ),
      },

    
  
  ],
},



];

export default routes;