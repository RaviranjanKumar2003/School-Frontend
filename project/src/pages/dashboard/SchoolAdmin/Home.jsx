import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Card,
  CardBody,
  Typography,
  Chip,
  Button,
  Spinner,
} from "@material-tailwind/react";

import {
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  BellAlertIcon,
  ClipboardIcon,
  CalendarDaysIcon,
  PlusCircleIcon,
  UserPlusIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/solid";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
} from "recharts";

import { useNavigate } from "react-router-dom";

export default function Home() {

  const navigate = useNavigate();

  // =====================================================
  // LOGIN DATA
  // =====================================================

  const schoolId =
    localStorage.getItem("schoolId");

  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] =
    useState(true);

  const [dashboardStats, setDashboardStats] =
    useState({

      totalStudents: 0,

      totalTeachers: 0,

      totalBoys: 0,

      totalGirls: 0,

      totalParents: 0,
    });

  // =====================================================
  // ATTENDANCE STATES
  // =====================================================

  const [todayAttendance, setTodayAttendance] =
    useState({

      present: 0,

      absent: 0,

      late: 0,
    });

  const [attendanceChart, setAttendanceChart] =
    useState([]);

  // =====================================================
  // CLASS OVERVIEW STATE
  // =====================================================

  const [classOverview, setClassOverview] =
    useState([]);

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  useEffect(() => {

    fetchDashboardData();

  }, []);

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      // =========================================
      // API CALLS
      // =========================================

      const [

        studentsRes,

        teachersRes,

        boysRes,

        girlsRes,

        classesRes,

        allStudentsRes,

        attendanceTodayRes,

        attendanceWeeklyRes,

      ] = await Promise.all([

        axios.get(
          `http://localhost:8080/api/students/count/${schoolId}`
        ),

        axios.get(
          `http://localhost:8080/api/professors/by-school/${schoolId}`
        ),

        axios.get(
          `http://localhost:8080/api/students/count/boys/${schoolId}`
        ),

        axios.get(
          `http://localhost:8080/api/students/count/girls/${schoolId}`
        ),

        axios.get(
          `http://localhost:8080/api/classes/by-school/${schoolId}`
        ),

        axios.get(
          `http://localhost:8080/api/students/school/${schoolId}`
        ),

        // =========================================
        // TODAY ATTENDANCE
        // =========================================

        axios.get(
          `http://localhost:8080/api/stu-attendance/summary/${schoolId}?attendanceDate=${today}`
        ),

        // =========================================
        // WEEKLY ATTENDANCE
        // =========================================

        axios.get(
          `http://localhost:8080/api/stu-attendance/weekly-summary/${schoolId}`
        ),
      ]);

      // =========================================
      // TODAY ATTENDANCE
      // =========================================

      const todayData =
        attendanceTodayRes.data || {};

      setTodayAttendance({

        present:
          Number(todayData.present) || 0,

        absent:
          Number(todayData.absent) || 0,

        late:
          Number(todayData.late) || 0,
      });

      // =========================================
      // WEEKLY ATTENDANCE CHART
      // =========================================

      const weeklyData =
        attendanceWeeklyRes.data || [];

      console.log(
        "Weekly Attendance API =>",
        weeklyData
      );

      const formattedChart =
        weeklyData.map((item) => ({

          day: item.date
            ? new Date(item.date)
                .toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                  }
                )
            : "",

          // ✅ IMPORTANT FIX
          present:
            Number(
              item.presentCount ??
              item.present ??
              0
            ),

          absent:
            Number(
              item.absentCount ??
              item.absent ??
              0
            ),
        }));

      console.log(
        "Formatted Chart =>",
        formattedChart
      );

      setAttendanceChart(formattedChart);

      // =========================================
      // CLASS OVERVIEW DATA
      // =========================================

      const classesData =
        classesRes.data || [];

      const allStudents =
        allStudentsRes.data || [];

      // =========================================
      // FETCH SUBJECTS + STUDENTS PER CLASS
      // =========================================

      const overviewData =
        await Promise.all(

          classesData.map(async (cls) => {

            const classId =
              cls.id ||
              cls.classId;

            try {

              // ================= SUBJECTS =================

              let subjectsCount = 0;

              try {

                const subjectsRes =
                  await axios.get(
                    `http://localhost:8080/api/subjects/school/${schoolId}/class/${classId}`
                  );

                subjectsCount =
                  subjectsRes.data?.length || 0;

              } catch (subjectError) {

                console.log(
                  "Subjects not found for class",
                  classId
                );

                subjectsCount = 0;
              }

              // ================= STUDENTS =================

              const classStudents =
                allStudents.filter((student) => {

                  const studentClassId =
                    Number(
                      student.classId ||
                      student.classNumber ||
                      student.classEntity?.id ||
                      student.classEntity?.classId
                    );

                  return (
                    studentClassId === Number(classId)
                  );
                });

              return {

                className:
                  cls.className ||
                  cls.name ||
                  `Class ${classId}`,

                subjects: subjectsCount,

                students: classStudents.length,
              };

            } catch (error) {

              console.error(
                "Class overview error",
                error
              );

              return {

                className:
                  cls.className ||
                  cls.name ||
                  `Class ${classId}`,

                subjects: 0,

                students: 0,
              };
            }
          })
        );

      setClassOverview(overviewData);

      // =========================================
      // SET DASHBOARD STATS
      // =========================================

      setDashboardStats({

        totalStudents:
          studentsRes.data || 0,

        totalTeachers:
          teachersRes.data?.length || 0,

        totalBoys:
          boysRes.data || 0,

        totalGirls:
          girlsRes.data || 0,

        totalParents:
          studentsRes.data || 0,
      });

    } catch (error) {

      console.error(
        "Dashboard fetch error",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // QUICK ACTIONS
  // =====================================================

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

  // =====================================================
  // STATS
  // =====================================================

  const stats = [

    {
      title: "Total Students",

      value: loading
        ? "..."
        : dashboardStats.totalStudents,

      sub: `Boys: ${dashboardStats.totalBoys} | Girls: ${dashboardStats.totalGirls}`,

      icon: AcademicCapIcon,

      color: "bg-blue-500",
    },

    {
      title: "Total Teachers",

      value: loading
        ? "..."
        : dashboardStats.totalTeachers,

      sub: "Active Staff Members",

      icon: UsersIcon,

      color: "bg-green-500",
    },

    {
      title: "Parents",

      value: loading
        ? "..."
        : dashboardStats.totalParents,

      sub: "Registered Parents",

      icon: UserGroupIcon,

      color: "bg-purple-500",
    },
  ];

  // =====================================================
  // FINANCE
  // =====================================================

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

  // =====================================================
  // ACTIVITIES
  // =====================================================

  const recentActivities = [

    "New student admitted in Class 9",

    "Mathematics teacher added",

    "Fee payment received from 18 students",

    "Science exam schedule uploaded",

    "New class timetable published",
  ];

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const notifications = [

    "15 students have pending fees",

    "Class 10 attendance below 75%",

    "Annual exam starts next week",

    "3 teachers leave requests pending",
  ];

  // =====================================================
  // CUSTOM TOOLTIP
  // =====================================================

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {

    if (
      active &&
      payload &&
      payload.length
    ) {

      return (

        <div className="bg-white shadow-xl border rounded-xl p-4">

          <Typography className="font-bold text-gray-800 mb-2">
            {label}
          </Typography>

          <Typography className="text-green-600 font-semibold">
            Present :
            {" "}
            {payload[0]?.value}
          </Typography>

          <Typography className="text-red-600 font-semibold">
            Absent :
            {" "}
            {payload[1]?.value}
          </Typography>

        </div>
      );
    }

    return null;
  };

  // =====================================================
  // UI
  // =====================================================

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

          <Button
            onClick={() =>
              navigate("/dashboard/schooladmin/create-student")
            }
            className="bg-blue-600 flex items-center gap-2"
          >

            <PlusCircleIcon className="h-5 w-5" />

            Add Student

          </Button>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">

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

        {/* ================= ATTENDANCE CHART ================= */}

        <Card className="xl:col-span-2 shadow-lg">

          <CardBody>

            <div className="flex items-center justify-between mb-5">

              <Typography
                variant="h5"
                className="text-gray-800 font-bold"
              >
                Weekly Attendance Report
              </Typography>

              <Chip
                value="Live Data"
                color="green"
              />

            </div>

            {loading ? (

              <div className="h-80 flex items-center justify-center">

                <Spinner className="h-10 w-10" />

              </div>

            ) : (

              <div className="h-80">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <AreaChart data={attendanceChart}>

                    <defs>

                      <linearGradient
                        id="presentColor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="5%"
                          stopColor="#22c55e"
                          stopOpacity={0.8}
                        />

                        <stop
                          offset="95%"
                          stopColor="#22c55e"
                          stopOpacity={0.1}
                        />

                      </linearGradient>

                      <linearGradient
                        id="absentColor"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="5%"
                          stopColor="#ef4444"
                          stopOpacity={0.8}
                        />

                        <stop
                          offset="95%"
                          stopColor="#ef4444"
                          stopOpacity={0.1}
                        />

                      </linearGradient>

                    </defs>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="day" />

                    <YAxis />

                    {/* ✅ FIXED TOOLTIP */}
                    <Tooltip
                      content={<CustomTooltip />}
                    />

                    <Legend />

                    <Area
                      type="monotone"
                      dataKey="present"
                      name="Present"
                      stroke="#22c55e"
                      fillOpacity={1}
                      fill="url(#presentColor)"
                      strokeWidth={3}
                    />

                    <Area
                      type="monotone"
                      dataKey="absent"
                      name="Absent"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#absentColor)"
                      strokeWidth={3}
                    />

                  </AreaChart>

                </ResponsiveContainer>

              </div>
            )}

          </CardBody>

        </Card>

        {/* ================= TODAY SUMMARY ================= */}

        <div className="space-y-5">

          <Card className="shadow-lg">

            <CardBody>

              <div className="flex items-center justify-between mb-5">

                <Typography
                  variant="h6"
                  className="text-gray-800 font-bold"
                >
                  Today's Summary
                </Typography>

                <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-500" />

              </div>

              <div className="space-y-4">

                <div className="flex items-center justify-between bg-green-50 p-4 rounded-xl">

                  <div>

                    <Typography className="font-semibold text-green-700">
                      Total Present
                    </Typography>

                    <Typography className="text-sm text-gray-500">
                      Students Present Today
                    </Typography>

                  </div>

                  <Chip
                    value={todayAttendance.present}
                    color="green"
                    className="text-sm"
                  />

                </div>

                <div className="flex items-center justify-between bg-red-50 p-4 rounded-xl">

                  <div>

                    <Typography className="font-semibold text-red-700">
                      Total Absent
                    </Typography>

                    <Typography className="text-sm text-gray-500">
                      Students Absent Today
                    </Typography>

                  </div>

                  <Chip
                    value={todayAttendance.absent}
                    color="red"
                    className="text-sm"
                  />

                </div>

                <div className="flex items-center justify-between bg-orange-50 p-4 rounded-xl">

                  <div>

                    <Typography className="font-semibold text-orange-700">
                      Late Students
                    </Typography>

                    <Typography className="text-sm text-gray-500">
                      Late Entry Records
                    </Typography>

                  </div>

                  <Chip
                    value={todayAttendance.late}
                    color="orange"
                    className="text-sm"
                  />

                </div>

              </div>

            </CardBody>

          </Card>

        </div>

      </div>

      {/* ================= BOTTOM ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

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

              {loading ? (

                <Typography>
                  Loading...
                </Typography>

              ) : classOverview.length === 0 ? (

                <Typography>
                  No Classes Found
                </Typography>

              ) : (

                classOverview.map((item, index) => (

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
                ))
              )}

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