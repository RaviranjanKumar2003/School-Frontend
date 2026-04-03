import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  EnvelopeIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { lazy, Suspense } from "react";

const HODHome = lazy(() => import("@/pages/dashboard/hod/Home"));
const HODProfile = lazy(() => import("@/pages/dashboard/hod/Profile"));
const Email = lazy(() => import("@/components/email/MailSender"));
const HODSemesterTable = lazy(() =>
  import("@/pages/dashboard/hod/SemesterTable")
);
const HODNotifications = lazy(() =>
  import("@/pages/dashboard/hod/Notifications")
);

/* ===== HOD NEW PAGES ===== */

const CreateTeacher = lazy(() =>
  import("@/pages/dashboard/hod/CreateTeacher")
);

const CreateStudent = lazy(() =>
  import("@/pages/dashboard/hod/CreateStudent")
);

const Teachers = lazy(() =>
  import("@/pages/dashboard/hod/Teachers")
);

const Students = lazy(() =>
  import("@/pages/dashboard/hod/Students")
);

const ArchivedStudents = lazy(() =>
  import("@/pages/dashboard/hod/ArchivedStudents")
);

const StudentFees = lazy(() =>
  import("@/pages/dashboard/hod/StudentFees")
);

const HODAttendance = lazy(() =>
  import("@/pages/dashboard/hod/Attendance")
);

/* ========================= */

const ProfessorHome = lazy(() => import("@/pages/dashboard/professor/Home"));
const ProfessorProfile = lazy(() =>
  import("@/pages/dashboard/professor/Profile")
);
const ProfessorNotifications = lazy(() =>
  import("@/pages/dashboard/professor/Notifications")
);

const AttendancePage = lazy(() =>
  import("@/pages/dashboard/professor/Attendance/AttendanceFlow")
);

const StudentHome = lazy(() => import("@/pages/dashboard/student/Home"));
const StudentProfile = lazy(() => import("@/pages/dashboard/student/Profile"));
const StudentNotifications = lazy(() =>
  import("@/pages/dashboard/student/Notifications")
);
const StudentSemesterTable = lazy(() =>
  import("@/pages/dashboard/student/SemesterTable")
);

// ✅ NEW ADD (Archived Notifications Page)
const ArchivedNotifications = lazy(() =>
  import("@/pages/dashboard/student/ArchivedNotifications")
);

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

const ForgotPasswordFlow = lazy(() =>
  import("./pages/forgotPassword/ForgotPasswordFlow")
);

const icon = {
  className: "w-5 h-5 text-inherit",
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="relative">
      <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
      <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin"></div>
    </div>
  </div>
);

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "HOD dashboard",
        path: "/hod/home",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HODHome />
          </Suspense>
        ),
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "HOD Information",
        path: "/hod/information",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HODProfile />
          </Suspense>
        ),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Our Classes",
        path: "/hod/semesters",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HODSemesterTable />
          </Suspense>
        ),
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "HOD notifications",
        path: "/hod/notifications",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HODNotifications />
          </Suspense>
        ),
      },
      {
        icon: <EnvelopeIcon {...icon} />,
        name: "HOD E-Mail",
        path: "/hod/email",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Email />
          </Suspense>
        ),
      },

      {
        icon: <PencilIcon {...icon} />,
        name: "Create Teacher",
        path: "/hod/create-teacher",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CreateTeacher />
          </Suspense>
        ),
      },
      {
        icon: <PencilIcon {...icon} />,
        name: "Create Student",
        path: "/hod/create-student",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CreateStudent />
          </Suspense>
        ),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Teachers List",
        path: "/hod/teachers",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Teachers />
          </Suspense>
        ),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Students List",
        path: "/hod/students",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Students />
          </Suspense>
        ),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Archived Students",
        path: "/hod/archived-students",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ArchivedStudents />
          </Suspense>
        ),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Students Fees",
        path: "/hod/fees",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentFees />
          </Suspense>
        ),
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Attendance",
        path: "/hod/attendance",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HODAttendance />
          </Suspense>
        ),
      },
    ],
  },

  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Professor dashboard",
        path: "/professor/home",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfessorHome />
          </Suspense>
        ),
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Professor Information",
        path: "/professor/information",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfessorProfile />
          </Suspense>
        ),
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Professor notifications",
        path: "/professor/notifications",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfessorNotifications />
          </Suspense>
        ),
      },
      {
        icon: <PencilIcon {...icon} />,
        name: "Student Attendence",
        path: "/professor/Attendence",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AttendancePage />
          </Suspense>
        ),
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
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentHome />
          </Suspense>
        ),
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Student Information",
        path: "/student/information",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentProfile />
          </Suspense>
        ),
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Student notifications",
        path: "/student/notifications",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentNotifications />
          </Suspense>
        ),
      },

      // ✅ NEW ROUTE (ONLY ADDED)
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Archived Notifications",
        path: "/student/archived-notifications",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ArchivedNotifications />
          </Suspense>
        ),
      },

      {
        icon: <TableCellsIcon {...icon} />,
        name: "Student Semester Table",
        path: "/student/semestertable",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentSemesterTable />
          </Suspense>
        ),
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
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentSignIn />
          </Suspense>
        ),
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Student sign-up",
        path: "student/sign-up",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudentSignUp />
          </Suspense>
        ),
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "forgot password",
        path: "/forgot-password",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ForgotPasswordFlow />
          </Suspense>
        ),
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Professor sign-in",
        path: "professor/sign-in",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfessorSignIn />
          </Suspense>
        ),
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Professor sign-up",
        path: "professor/sign-up",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ProfessorSignUp />
          </Suspense>
        ),
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "HOD sign-in",
        path: "hod/sign-in",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HODSignIn />
          </Suspense>
        ),
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "HOD sign-up",
        path: "hod/sign-up",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HODSignUp />
          </Suspense>
        ),
      },
    ],
  },
];

export default routes;