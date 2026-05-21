import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  EnvelopeIcon,
  PencilIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  BellIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon ,
  PresentationChartBarIcon ,
  PhoneIcon,
} from "@heroicons/react/24/solid";

import { lazy, Suspense } from "react";

/* =========================================================
   COMMON LOADER
========================================================= */

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="relative">
      <div className="h-20 w-20 rounded-full border-[6px] border-gray-200"></div>

      <div className="absolute top-0 left-0 h-20 w-20 rounded-full border-[6px] border-blue-600 border-t-transparent animate-spin"></div>
    </div>
  </div>
);

const Load = (Component) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

const icon = {
  className: "w-5 h-5 text-inherit",
};

/* =========================================================
   PUBLIC PUBLISH COMMEN INQUIRY PAGE
========================================================= */

import PublicSchoolPage from
  "@/pages/public/PublicSchoolPage";




/* =========================================================
   RECEPTIONIST
========================================================= */

const ReceptionistHome = lazy(() =>
  import("@/pages/dashboard/receptionist/Home")
);

const ReceptionistInfo = lazy(() =>
  import("@/pages/dashboard/receptionist/Information")
);

const AddInquiry = lazy(() =>
  import("@/pages/dashboard/receptionist/AddInquiry")
);

const InquiryList = lazy(() =>
  import("@/pages/dashboard/receptionist/InquiryList")
);

const InquiryDetails = lazy(() =>
  import("@/pages/dashboard/receptionist/InquiryDetails")
);

const CallLogs = lazy(() =>
  import("@/pages/dashboard/receptionist/CallLogs")
);

const FollowUps = lazy(() =>
  import("@/pages/dashboard/receptionist/FollowUps")
);

/* =========================================================
   SUPER ADMIN
========================================================= */

const SuperAdminHome = lazy(() =>
  import("@/pages/dashboard/superadmin/Home")
);

const SchoolManagement = lazy(() =>
  import("@/pages/dashboard/superadmin/Schools")
);

const SchoolAdminPage = lazy(() =>
  import("@/pages/dashboard/superadmin/SchoolAdmins")
);

/* =========================================================
   SCHOOL ADMIN
========================================================= */

const SchoolAdminHome = lazy(() =>
  import("@/pages/dashboard/schooladmin/Home")
);

const SchoolAdminInfo = lazy(() =>
  import("@/pages/dashboard/schooladmin/Information")
);

const AdminCreatClassSubject = lazy(() =>
  import("@/pages/dashboard/schooladmin/CreatClassAndSubject")
);

const HODs = lazy(() =>
  import("@/pages/dashboard/schooladmin/HODs")
);

const ArchivedStudents = lazy(() =>
  import("@/pages/dashboard/schooladmin/ArchivedStudents")
);

const Receptionists = lazy(() =>
  import("@/pages/dashboard/schooladmin/Receptionists")
);

const CreateTeacher = lazy(() =>
  import("@/pages/dashboard/SchoolAdmin/CreateTeacher")
);

const CreateStudent = lazy(() =>
  import("@/pages/dashboard/SchoolAdmin/CreateStudent")
);

const StudentPromotion = lazy(() =>
  import("@/pages/dashboard/SchoolAdmin/StudentPromotion")
);
/* =========================================================
   HOD
========================================================= */

const HODHome = lazy(() =>
  import("@/pages/dashboard/hod/Home")
);

const HODProfile = lazy(() =>
  import("@/pages/dashboard/hod/Profile")
);

const LiveResult = lazy(() =>
  import("@/pages/dashboard/hod/LiveResult")
);

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

const StudentFees = lazy(() =>
  import("@/pages/dashboard/hod/StudentFees")
);

/* =========================================================
   PROFESSOR
========================================================= */

const ProfessorHome = lazy(() =>
  import("@/pages/dashboard/professor/Home")
);

const ExamNotice = lazy(() =>
  import("@/pages/dashboard/professor/ExamNotice")
);

const StudentExams = lazy(() =>
  import("@/pages/dashboard/professor/StudentExams")
);

const ExamAttendance = lazy(() =>
  import("@/pages/dashboard/professor/ExamAttendance")
);

const ProfessorProfile = lazy(() =>
  import("@/pages/dashboard/professor/Profile")
);

const ProfessorNotifications = lazy(() =>
  import("@/pages/dashboard/professor/Notifications")
);

const AttendancePage = lazy(() =>
  import("@/pages/dashboard/professor/PAttendance/AttendanceFlow")
);

const ProfessorResult = lazy(() =>
  import("@/pages/dashboard/professor/Result")
);

const ProfessorEvents = lazy(() =>
  import("@/pages/dashboard/professor/ProfessorEvents")
);

/* =========================================================
   STUDENT
========================================================= */

const StudentHome = lazy(() =>
  import("@/pages/dashboard/student/Home")
);

const StudentProfile = lazy(() =>
  import("@/pages/dashboard/student/Profile")
);

const Exams = lazy(() =>
  import("@/pages/dashboard/student/Exams")
);

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

/* =========================================================
   AUTH
========================================================= */



const HODSignIn = lazy(() =>
  import("@/pages/auth/hod/HODSignIn")
);

const HODSignUp = lazy(() =>
  import("@/pages/auth/hod/HODSignUp")
);

const ProfessorSignIn = lazy(() =>
  import("@/pages/auth/professor/ProfessorSignIn")
);

const ProfessorSignUp = lazy(() =>
  import("@/pages/auth/professor/ProfessorSignUp")
);

const StudentSignIn = lazy(() =>
  import("@/pages/auth/student/StudentSignIn")
);

const StudentSignUp = lazy(() =>
  import("@/pages/auth/student/StudentSignUp")
);

const SuperAdminSignIn = lazy(() =>
  import("@/pages/auth/superadmin/SuperAdminSignIn")
);

const ReceptionistSignIn = lazy(() =>
  import("@/pages/auth/receptionist/ReceptionistSignIn")
);

const SchoolAdminSignIn = lazy(() =>
  import("@/pages/auth/schooladmin/SchoolAdminSignIn")
);

const SchoolAdminSignUp = lazy(() =>
  import("@/pages/auth/schooladmin/SchoolAdminSignUp")
);

const ForgotPasswordFlow = lazy(() =>
  import("./pages/forgotPassword/ForgotPasswordFlow")
);

/* =========================================================
   SHARED
========================================================= */

const Teachers = lazy(() =>
  import("@/pages/dashboard/shared/Teachers")
);

const Students = lazy(() =>
  import("@/pages/dashboard/shared/Students")
);

const Attendance = lazy(() =>
  import("@/pages/dashboard/shared/Attendance")
);

/* =========================================================
   ROUTES
========================================================= */

export const routes = [



  /* =====================================================
   PUBLIC SCHOOL PAGE
===================================================== */

{
  layout: "public",
  pages: [
    {
      icon: <HomeIcon {...icon} />,
      name: "Public School Page",
      path: "/school/:slug",
      element: <PublicSchoolPage />,
    },
  ],
},


  /* =====================================================
     HOD DASHBOARD
  ===================================================== */

  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "HOD Dashboard",
        path: "/hod/home",
        element: Load(HODHome),
      },

      {
        icon: <UserCircleIcon {...icon} />,
        name: "HOD Information",
        path: "/hod/information",
        element: Load(HODProfile),
      },

      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Our Classes",
        path: "/hod/semesters",
        element: Load(HODSemesterTable),
      },

      {
        icon: <BellIcon {...icon} />,
        name: "Notifications",
        path: "/hod/notifications",
        element: Load(HODNotifications),
      },

      {
        icon: <EnvelopeIcon {...icon} />,
        name: "E-Mail",
        path: "/hod/email",
        element: Load(Email),
      },

      {
        icon: <ChartBarIcon {...icon} />,
        name: "Student Results",
        path: "/hod/result",
        element: Load(HODResult),
      },

      {
        icon: <ClipboardDocumentCheckIcon {...icon} />,
        name: "Live Results",
        path: "/hod/liveresult",
        element: Load(LiveResult),
      },

      {
        icon: <PencilIcon {...icon} />,
        name: "Student Exams",
        path: "/hod/student-exam",
        element: Load(StudentExam),
      },

      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Event Scheduler",
        path: "/hod/events",
        element: Load(EventScheduler),
      },

      {
        icon: <UserGroupIcon {...icon} />,
        name: "Teachers List",
        path: "/hod/teachers",
        element: Load(Teachers),
      },

      {
        icon: <UserGroupIcon {...icon} />,
        name: "Students List",
        path: "/hod/students",
        element: Load(Students),
      },

      {
        icon: <TableCellsIcon {...icon} />,
        name: "Students Fees",
        path: "/hod/fees",
        element: Load(StudentFees),
      },

      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Attendance",
        path: "/hod/attendance",
        element: Load(Attendance),
      },
    ],
  },

  /* =====================================================
     PROFESSOR DASHBOARD
  ===================================================== */

  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Professor Dashboard",
        path: "/professor/home",
        element: Load(ProfessorHome),
      },

      {
        icon: <UserCircleIcon {...icon} />,
        name: "Professor Information",
        path: "/professor/information",
        element: Load(ProfessorProfile),
      },

      {
        icon: <BellIcon {...icon} />,
        name: "Notifications",
        path: "/professor/notifications",
        element: Load(ProfessorNotifications),
      },

      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Attendance",
        path: "/professor/attendance",
        element: Load(AttendancePage),
      },

      {
        icon: <PencilIcon {...icon} />,
        name: "Student Exams",
        path: "/professor/student-exams",
        element: Load(StudentExams),
      },

      {
        icon: <ClipboardDocumentCheckIcon {...icon} />,
        name: "Exam Attendance",
        path: "/professor/exam-attendance",
        element: Load(ExamAttendance),
      },

      {
        icon: <ChartBarIcon {...icon} />,
        name: "Manage Results",
        path: "/professor/result",
        element: Load(ProfessorResult),
      },

      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Exam Notice",
        path: "/professor/examNotice",
        element: Load(ExamNotice),
      },

      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Events",
        path: "/professor/events",
        element: Load(ProfessorEvents),
      },
    ],
  },

  /* =====================================================
     STUDENT DASHBOARD
  ===================================================== */

  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Student Dashboard",
        path: "/student/home",
        element: Load(StudentHome),
      },

      {
        icon: <UserCircleIcon {...icon} />,
        name: "Student Information",
        path: "/student/information",
        element: Load(StudentProfile),
      },

      {
        icon: <BellIcon {...icon} />,
        name: "Notifications",
        path: "/student/notifications",
        element: Load(StudentNotifications),
      },

      {
        icon: <ClipboardDocumentCheckIcon {...icon} />,
        name: "Exams",
        path: "/student/exams",
        element: Load(Exams),
      },

      {
        icon: <ChartBarIcon {...icon} />,
        name: "Results",
        path: "/student/result",
        element: Load(StudentResult),
      },

      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Archived Notifications",
        path: "/student/archived-notifications",
        element: Load(ArchivedNotifications),
      },

      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Semester Table",
        path: "/student/semestertable",
        element: Load(StudentSemesterTable),
      },

      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Events",
        path: "/student/events",
        element: Load(StudentEvents),
      },

      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Attendance",
        path: "/student/attendance",
        element: Load(Attendance),
      },
    ],
  },

  /* =====================================================
     AUTH ROUTES
  ===================================================== */

  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Student sign-in",
        path: "student/sign-in",
        element: Load(StudentSignIn),
      },

      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Student sign-up",
        path: "student/sign-up",
        element: Load(StudentSignUp),
      },

      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Forgot Password",
        path: "/forgot-password",
        element: Load(ForgotPasswordFlow),
      },

      {
        icon: <ServerStackIcon {...icon} />,
        name: "Professor sign-in",
        path: "professor/sign-in",
        element: Load(ProfessorSignIn),
      },

      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Professor sign-up",
        path: "professor/sign-up",
        element: Load(ProfessorSignUp),
      },

      {
        icon: <ServerStackIcon {...icon} />,
        name: "HOD sign-in",
        path: "hod/sign-in",
        element: Load(HODSignIn),
      },

      {
        icon: <RectangleStackIcon {...icon} />,
        name: "HOD sign-up",
        path: "hod/sign-up",
        element: Load(HODSignUp),
      },

      {
        icon: <ServerStackIcon {...icon} />,
        name: "Super Admin sign-in",
        path: "superadmin/sign-in",
        element: Load(SuperAdminSignIn),
      },

      {
        icon: <ServerStackIcon {...icon} />,
        name: "Receptionist sign-in",
        path: "receptionist/sign-in",
        element: Load(ReceptionistSignIn),
      },

      {
        icon: <ServerStackIcon {...icon} />,
        name: "School Admin sign-in",
        path: "schooladmin/sign-in",
        element: Load(SchoolAdminSignIn),
      },

      {
        icon: <RectangleStackIcon {...icon} />,
        name: "School Admin sign-up",
        path: "schooladmin/sign-up",
        element: Load(SchoolAdminSignUp),
      },
    ],
  },

  /* =====================================================
     SUPER ADMIN DASHBOARD
  ===================================================== */

  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Super Admin Dashboard",
        path: "/superadmin/home",
        element: Load(SuperAdminHome),
      },

      {
        icon: <BuildingLibraryIcon {...icon} />,
        name: "Manage Schools",
        path: "/superadmin/schools",
        element: Load(SchoolManagement),
      },

      {
        icon: <UserGroupIcon {...icon} />,
        name: "School Admins",
        path: "/superadmin/admins",
        element: Load(SchoolAdminPage),
      },
    ],
  },

  /* =====================================================
     RECEPTIONIST DASHBOARD
  ===================================================== */

  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Receptionist Dashboard",
        path: "/receptionist/home",
        element: Load(ReceptionistHome),
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Receptionist Information",
        path: "/receptionist/information",
        element: Load(ReceptionistInfo),
      },
      {
        icon: (
        <DocumentTextIcon{...icon} />),
        name: "Add Inquiry",
        path: "/receptionist/addinquiry",
        element: Load(AddInquiry),
      },
      {
        icon: (
        <DocumentTextIcon{...icon} />),
        name: "Inquiry List",
        path: "/receptionist/inquiryList",
        element: Load(InquiryList),
      },
      {
        icon: (
        <DocumentTextIcon{...icon} />),
        name: "Inquiry Details",
        path: "/receptionist/inquiryDetails/:id",
        element: Load(InquiryDetails),
      },

      {
        icon: (
        <DocumentTextIcon{...icon} />),
        name: "Call Log",
        path: "/receptionist/callLog",
        element: Load(CallLogs),
      },
      {
        icon: (
        <DocumentTextIcon{...icon} />),
        name: "Follow Up",
        path: "/receptionist/followups",
        element: Load(FollowUps),
      },

    ],
  },

  /* =====================================================
     SCHOOL ADMIN DASHBOARD
  ===================================================== */

  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Admin Dashboard",
        path: "/schooladmin/home",
        element: Load(SchoolAdminHome),
      },

      {
        icon: <UserCircleIcon {...icon} />,
        name: "Admin Information",
        path: "/schooladmin/information",
        element: Load(SchoolAdminInfo),
      },

      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Classes & Subjects",
        path: "/schooladmin/CreatClassAndSubject",
        element: Load(AdminCreatClassSubject),
      },

      {
        icon: <UserGroupIcon {...icon} />,
        name: "Our Principals",
        path: "/schooladmin/hods",
        element: Load(HODs),
      },

      {
        icon: <PencilIcon {...icon} />,
        name: "Create Teacher",
        path: "/schooladmin/create-teacher",
        element: Load(CreateTeacher),
      },

      {
        icon: <PencilIcon {...icon} />,
        name: "Create Student",
        path: "/schooladmin/create-student",
        element: Load(CreateStudent),
      },

      {
        icon: <PresentationChartBarIcon {...icon} />,
        name: "Teachers List",
        path: "/schooladmin/teachers",
        element: Load(Teachers),
      },

      {
        icon: <AcademicCapIcon {...icon} />,
        name: "Students List",
        path: "/schooladmin/students",
        element: Load(Students),
      },
      {
        icon: <ArrowTrendingUpIcon {...icon} />,
        name: "Students Promotion",
        path: "/schooladmin/studentpromotion",
        element: Load(StudentPromotion),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Archived Students",
        path: "/schooladmin/archived-students",
        element: Load(ArchivedStudents),
      },

      {
        icon: <CalendarDaysIcon {...icon} />,
        name: "Attendance",
        path: "/schooladmin/attendance",
        element: Load(Attendance),
      },

      {
        icon: <PhoneIcon {...icon} />,
        name: "Receptionists",
        path: "/schooladmin/receptionists",
        element: Load(Receptionists),
      },
    ],
  },

//============================================= PUBLIC PUBLISH INQUIRY PAGE
  {
    layout: "public",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Public School",
        path: "/school/:slug",
        element: <PublicSchoolPage />,
      },

    ],
  },


];

export default routes;