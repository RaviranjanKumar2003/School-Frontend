import React from "react";

import {
  Card,
  CardBody,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";

import {
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  BellAlertIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  PlusCircleIcon,
  UserPlusIcon,
  BuildingLibraryIcon,
  ClipboardIcon,
} from "@heroicons/react/24/solid";

import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  // ================= QUICK ACTIONS =================
  const quickActions = [
    {
      title: "Add Student",
      icon: UserPlusIcon,
      color: "bg-blue-500",
      path: "/dashboard/schooladmin/create-student",
    },
    {
      title: "Add Teacher",
      icon: UsersIcon,
      color: "bg-green-500",
      path: "/dashboard/schooladmin/create-teacher",
    },
    {
      title: "Create Class",
      icon: BuildingLibraryIcon,
      color: "bg-purple-500",
      path: "/dashboard/schooladmin/CreatClassAndSubject",
    },
    {
      title: "Attendance",
      icon: ClipboardDocumentCheckIcon,
      color: "bg-orange-500",
      path: "/dashboard/schooladmin/attendance",
    },
    {
      title: "Send Notice",
      icon: BellAlertIcon,
      color: "bg-red-500",
      path: "/dashboard/schooladmin/notices",
    },
    {
      title: "Create Exam",
      icon: ClipboardIcon,
      color: "bg-cyan-500",
      path: "/dashboard/schooladmin/exams",
    },
  ];

  // ================= STATS =================
  const stats = [
    {
      title: "Total Students",
      value: "1,248",
      sub: "Boys: 720 | Girls: 528",
      icon: AcademicCapIcon,
      color: "bg-blue-500",
    },
    {
      title: "Total Teachers",
      value: "84",
      sub: "Active Staff Members",
      icon: UsersIcon,
      color: "bg-green-500",
    },
    {
      title: "Parents",
      value: "1,032",
      sub: "Registered Parents",
      icon: UserGroupIcon,
      color: "bg-purple-500",
    },
  ];

  // ================= FINANCE =================
  const financeCards = [
    {
      title: "Total Fees Collected",
      value: "₹12,45,000",
      color: "bg-green-600",
    },
    {
      title: "Pending Fees",
      value: "₹2,15,000",
      color: "bg-red-500",
    },
    {
      title: "Today Collection",
      value: "₹18,500",
      color: "bg-cyan-600",
    },
    {
      title: "Monthly Expense",
      value: "₹4,80,000",
      color: "bg-orange-500",
    },
  ];

  // ================= ACTIVITIES =================
  const recentActivities = [
    "New student admitted in Class 9",
    "Mathematics teacher added",
    "Fee payment received from 18 students",
    "Science exam schedule uploaded",
    "New class timetable published",
  ];

  // ================= NOTIFICATIONS =================
  const notifications = [
    "15 students have pending fees",
    "Class 10 attendance below 75%",
    "Annual exam starts next week",
    "3 teachers leave requests pending",
  ];

  // ================= CLASS OVERVIEW =================
  const classOverview = [
    {
      className: "Class 1",
      subjects: 5,
      students: 42,
    },
    {
      className: "Class 2",
      subjects: 6,
      students: 39,
    },
    {
      className: "Class 3",
      subjects: 7,
      students: 44,
    },
    {
      className: "Class 4",
      subjects: 8,
      students: 40,
    },
  ];

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

        <div>

          <Typography
            variant="h3"
            className="font-bold text-gray-800"
          >
            School Admin Dashboard
          </Typography>

          <Typography className="text-gray-600 mt-1">
            Welcome back! Manage your school activities here.
          </Typography>

        </div>

        <div className="mt-4 md:mt-0 flex gap-3">

          {/* ADD STUDENT BUTTON */}
          <Button
            onClick={() =>
              navigate("/dashboard/schooladmin/create-student")
            }
            className="bg-blue-600 flex items-center gap-2"
          >

            <PlusCircleIcon className="h-5 w-5" />

            Add Student

          </Button>

          {/* SCHEDULE EVENT BUTTON */}
          <Button
            onClick={() =>
              navigate("/dashboard/schooladmin/events")
            }
            className="bg-green-600 flex items-center gap-2"
          >

            <CalendarDaysIcon className="h-5 w-5" />

            Schedule Event

          </Button>

        </div>

      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <div className="mb-8">

        <Typography
          variant="h5"
          className="mb-4 text-gray-800"
        >
          Quick Actions
        </Typography>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {quickActions.map((item, index) => {

            const Icon = item.icon;

            return (

              <Card
                key={index}
                onClick={() => navigate(item.path)}
                className={`${item.color} cursor-pointer shadow-lg hover:scale-105 transition-transform duration-300`}
              >

                <CardBody className="flex flex-col items-center justify-center text-center text-white py-6">

                  <Icon className="h-10 w-10 mb-3" />

                  <Typography
                    variant="small"
                    className="font-semibold"
                  >
                    {item.title}
                  </Typography>

                </CardBody>

              </Card>
            );
          })}

        </div>

      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        {stats.map((item, index) => {

          const Icon = item.icon;

          return (

            <Card
              key={index}
              className={`${item.color} text-white shadow-xl`}
            >

              <CardBody>

                <div className="flex items-center justify-between">

                  <div>

                    <Typography className="text-sm opacity-90">
                      {item.title}
                    </Typography>

                    <Typography
                      variant="h3"
                      className="font-bold mt-1"
                    >
                      {item.value}
                    </Typography>

                  </div>

                  <Icon className="h-12 w-12 opacity-80" />

                </div>

                <Typography className="mt-3 text-sm opacity-90">
                  {item.sub}
                </Typography>

              </CardBody>

            </Card>
          );
        })}

      </div>

      {/* ================= FINANCE ================= */}

      <div className="mb-8">

        <Typography
          variant="h5"
          className="mb-4 text-gray-800"
        >
          Finance Overview
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {financeCards.map((item, index) => (

            <Card
              key={index}
              className={`${item.color} text-white shadow-lg`}
            >

              <CardBody>

                <div className="flex items-center justify-between">

                  <div>

                    <Typography className="text-sm">
                      {item.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      className="mt-2 font-bold"
                    >
                      {item.value}
                    </Typography>

                  </div>

                  <CurrencyDollarIcon className="h-10 w-10 opacity-80" />

                </div>

              </CardBody>

            </Card>
          ))}

        </div>

      </div>

      {/* ================= CHART + SUMMARY ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

        {/* CHART */}

        <Card className="xl:col-span-2 shadow-lg">

          <CardBody>

            <div className="flex items-center justify-between mb-5">

              <Typography
                variant="h5"
                className="text-gray-800"
              >
                Monthly Attendance Report
              </Typography>

              <Chip
                value="2026"
                color="blue"
              />

            </div>

            <div className="h-80 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center border border-dashed border-blue-300">

              <div className="text-center">

                <ClipboardDocumentCheckIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />

                <Typography
                  variant="h6"
                  className="text-gray-700"
                >
                  Attendance Analytics Chart
                </Typography>

                <Typography className="text-gray-500 mt-2">
                  Integrate Recharts / Chart.js Here
                </Typography>

              </div>

            </div>

          </CardBody>

        </Card>

        {/* SIDE */}

        <div className="space-y-5">

          <Card className="shadow-lg">

            <CardBody>

              <Typography
                variant="h6"
                className="mb-4 text-gray-800"
              >
                Today's Summary
              </Typography>

              <div className="space-y-3">

                <div className="flex justify-between">
                  <span>Total Present</span>
                  <Chip value="1120" color="green" />
                </div>

                <div className="flex justify-between">
                  <span>Total Absent</span>
                  <Chip value="128" color="red" />
                </div>

                <div className="flex justify-between">
                  <span>Late Students</span>
                  <Chip value="17" color="orange" />
                </div>

              </div>

            </CardBody>

          </Card>

        </div>

      </div>

      {/* ================= BOTTOM ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ACTIVITIES */}

        <Card className="shadow-lg">

          <CardBody>

            <Typography
              variant="h6"
              className="mb-4 text-gray-800"
            >
              Recent Activities
            </Typography>

            <div className="space-y-3">

              {recentActivities.map((item, index) => (

                <div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg"
                >

                  <Typography className="text-sm">
                    {item}
                  </Typography>

                </div>
              ))}

            </div>

          </CardBody>

        </Card>

        {/* CLASS OVERVIEW */}

        <Card className="shadow-lg">

          <CardBody>

            <Typography
              variant="h6"
              className="mb-4 text-gray-800"
            >
              Class Overview
            </Typography>

            <div className="space-y-4">

              {classOverview.map((item, index) => (

                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >

                  <div>

                    <Typography className="font-semibold">
                      {item.className}
                    </Typography>

                    <Typography className="text-sm text-gray-600">
                      Subjects: {item.subjects}
                    </Typography>

                  </div>

                  <Chip
                    value={`${item.students} Students`}
                    color="blue"
                  />

                </div>
              ))}

            </div>

          </CardBody>

        </Card>

        {/* NOTIFICATIONS */}

        <Card className="shadow-lg">

          <CardBody>

            <Typography
              variant="h6"
              className="mb-4 text-gray-800"
            >
              Notifications & Alerts
            </Typography>

            <div className="space-y-3">

              {notifications.map((item, index) => (

                <div
                  key={index}
                  className="p-3 rounded-lg bg-red-50 border-l-4 border-red-500"
                >

                  <Typography className="text-sm text-gray-700">
                    {item}
                  </Typography>

                </div>
              ))}

            </div>

          </CardBody>

        </Card>

      </div>

      {/* ================= FOOTER ================= */}

      <div className="mt-10 text-center text-gray-500 text-sm">
        © 2026 School ERP Management System
      </div>

    </div>
  );
}