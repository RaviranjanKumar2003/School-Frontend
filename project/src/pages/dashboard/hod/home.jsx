import React, {
  useEffect,
  useState,
} from "react";

import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Spinner,
} from "@material-tailwind/react";

import {
  StatisticsCard,
} from "@/widgets/cards";

import {
  StatisticsChart,
} from "@/widgets/charts";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

const BASE_URL =
  "http://localhost:8080/api";

export function Home() {

  // =====================================================
  // ROLE & USER DATA
  // =====================================================

  const role =
    localStorage
      .getItem("userRole")
      ?.toLowerCase();

  const hodData = JSON.parse(
    localStorage.getItem("hodData")
  );

  const schoolAdminData = JSON.parse(
    localStorage.getItem("schoolAdminData")
  );

  // =====================================================
  // SCHOOL ID
  // =====================================================

  const schoolId =
    role === "hod"
      ? (
          hodData?.school?.id ||
          hodData?.schoolId
        )
      : schoolAdminData?.schoolId;

  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      students: 0,
      teachers: 0,
    });

  const [chartData, setChartData] =
    useState([]);

  const navigate =
    useNavigate();

  // =====================================================
  // APEX STYLE FIX
  // =====================================================

  useEffect(() => {

    const style =
      document.createElement("style");

    style.innerHTML = `

      .apexcharts-menu {
        background: white !important;
        color: black !important;
        border-radius: 10px !important;
      }

      .apexcharts-menu-item {
        color: black !important;
      }

      .apexcharts-tooltip {
        color: black !important;
      }

      .apexcharts-canvas {
        width: 100% !important;
      }

      .apexcharts-svg {
        width: 100% !important;
      }

    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };

  }, []);

  // =====================================================
  // FETCH DATA
  // =====================================================

  const fetchData = async () => {

    try {

      setLoading(true);

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      console.log(
        "TODAY DATE:",
        today
      );

      // =====================================================
      // API CALLS
      // =====================================================

      const [
        studentRes,
        teacherRes,
        feeRes,
        stuTodayRes,
        stuWeeklyRes,
        teacherTodayRes,
        teacherWeeklyRes,
      ] = await Promise.allSettled([

        // =====================================================
        // STUDENTS
        // =====================================================

        axios.get(
          `${BASE_URL}/students/school/${schoolId}`
        ),

        // =====================================================
        // TEACHERS
        // =====================================================

        axios.get(
          `${BASE_URL}/professors/by-school/${schoolId}`
        ),

        // =====================================================
        // FEES
        // IMPORTANT FIX
        // =====================================================

        axios.get(
          `${BASE_URL}/fees/summary/${schoolId}`,
          {
            params: {
              schoolId,
            },
          }
        ),

        // =====================================================
        // STUDENT DAILY
        // =====================================================

        axios.get(
          `${BASE_URL}/stu-attendance/summary/${schoolId}`,
          {
            params: {
              attendanceDate: today,
            },
          }
        ),

        // =====================================================
        // STUDENT WEEKLY
        // =====================================================

        axios.get(
          `${BASE_URL}/stu-attendance/weekly-summary/${schoolId}`
        ),

        // =====================================================
        // TEACHER DAILY
        // =====================================================

        axios.get(
          `${BASE_URL}/attendance/teacher/summary/${schoolId}`,
          {
            params: {
              attendanceDate: today,
            },
          }
        ),

        // =====================================================
        // TEACHER WEEKLY
        // =====================================================

        axios.get(
          `${BASE_URL}/attendance/teacher/weekly-summary/${schoolId}`
        ),
      ]);

      // =====================================================
      // STUDENTS
      // =====================================================

      const students =
        studentRes.status === "fulfilled"
          ? (
              Array.isArray(
                studentRes.value?.data
              )
                ? studentRes.value.data
                : []
            )
          : [];

      // =====================================================
      // TEACHERS
      // =====================================================

      let teachers = [];

      if (
        teacherRes.status ===
        "fulfilled"
      ) {

        console.log(
          "Teacher API:",
          teacherRes.value.data
        );

        if (
          Array.isArray(
            teacherRes.value.data
          )
        ) {

          teachers =
            teacherRes.value.data;

        } else if (
          Array.isArray(
            teacherRes.value.data?.data
          )
        ) {

          teachers =
            teacherRes.value.data.data;
        }
      }

      // =====================================================
      // FEES
      // =====================================================

      let fee = {};

      if (
        feeRes.status === "fulfilled"
      ) {

        fee =
          feeRes.value?.data || {};

      } else {

        console.log(
          "FEE API ERROR:",
          feeRes.reason
        );

        fee = {
          paidStudents: 0,
          pendingStudents: 0,
          totalFeeAmount: 0,
          totalCollectionAmount: 0,
          totalPendingAmount: 0,
        };
      }

      // =====================================================
      // STUDENT TODAY
      // =====================================================

      const stuToday =
        stuTodayRes.status ===
        "fulfilled"
          ? (
              stuTodayRes.value?.data || {}
            )
          : {};

      // =====================================================
      // STUDENT WEEKLY
      // =====================================================

      const stuWeekly =
        stuWeeklyRes.status ===
        "fulfilled"
          ? (
              Array.isArray(
                stuWeeklyRes.value?.data
              )
                ? stuWeeklyRes.value.data
                : []
            )
          : [];

      // =====================================================
      // TEACHER TODAY
      // =====================================================

      const teacherToday =
        teacherTodayRes.status ===
        "fulfilled"
          ? (
              teacherTodayRes.value?.data || {}
            )
          : {};

      // =====================================================
      // TEACHER WEEKLY
      // =====================================================

      const teacherWeekly =
        teacherWeeklyRes.status ===
        "fulfilled"
          ? (
              Array.isArray(
                teacherWeeklyRes.value?.data
              )
                ? teacherWeeklyRes.value.data
                : []
            )
          : [];

      // =====================================================
      // DEBUG
      // =====================================================

      console.log(
        "Students:",
        students
      );

      console.log(
        "Teachers:",
        teachers
      );

      console.log(
        "Fee:",
        fee
      );

      console.log(
        "Teacher Weekly:",
        teacherWeekly
      );

      // =====================================================
      // STATS
      // =====================================================

      setStats({

        students:
          students.length || 0,

        teachers:
          teachers.length || 0,
      });

      // =====================================================
      // STUDENT DATE LABELS
      // =====================================================

      const studentDates =
        stuWeekly.map((d) =>
          d?.date
            ? new Date(
                d.date
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                }
              )
            : ""
        );

      // =====================================================
      // SAFE TEACHER DATA
      // =====================================================

      const safeTeacherWeekly =
        teacherWeekly.length > 0
          ? teacherWeekly
          : [
              {
                attendanceDate: today,

                present:
                  Number(
                    teacherToday?.present
                  ) || 0,

                absent:
                  Number(
                    teacherToday?.absent
                  ) || 0,
              },
            ];

      // =====================================================
      // SAFE TEACHER DATES
      // =====================================================

      const safeTeacherDates =
        safeTeacherWeekly.map((d) =>
          d?.attendanceDate
            ? new Date(
                d.attendanceDate
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                }
              )
            : ""
        );

      // =====================================================
      // CHARTS
      // =====================================================

      setChartData([

        // =====================================================
        // FEE STATUS
        // =====================================================

        {
          color: "blue",

          title: "Fee Status",

          description:
            "Paid vs Pending",

          chart: {

            type: "bar",

            height: 320,

            series: [
              {
                name: "Students",

                data: [
                  Number(
                    fee?.paidStudents
                  ) || 0,

                  Number(
                    fee?.pendingStudents
                  ) || 0,
                ],
              },
            ],

            options: {

              chart: {
                toolbar: {
                  show: true,
                },
              },

              plotOptions: {
                bar: {
                  borderRadius: 6,
                  columnWidth: "40%",
                },
              },

              dataLabels: {
                enabled: true,
              },

              xaxis: {
                categories: [
                  "Paid",
                  "Pending",
                ],
              },
            },
          },
        },

        // =====================================================
        // FEE COLLECTION
        // =====================================================

        {
          color: "green",

          title:
            "Fee Collection",

          description:
            "Total / Collected / Pending",

          chart: {

            type: "bar",

            height: 320,

            series: [
              {
                name: "Amount",

                data: [
                  Number(
                    fee?.totalFeeAmount
                  ) || 0,

                  Number(
                    fee?.totalCollectionAmount
                  ) || 0,

                  Number(
                    fee?.totalPendingAmount
                  ) || 0,
                ],
              },
            ],

            options: {

              chart: {
                toolbar: {
                  show: true,
                },
              },

              plotOptions: {
                bar: {
                  borderRadius: 6,
                  columnWidth: "40%",
                },
              },

              dataLabels: {
                enabled: true,
              },

              xaxis: {
                categories: [
                  "Total",
                  "Collected",
                  "Pending",
                ],
              },
            },
          },
        },

        // =====================================================
        // STUDENT DAILY
        // =====================================================

        {
          color: "purple",

          title:
            "Student Daily Attendance",

          description:
            "Today Attendance",

          chart: {

            type: "pie",

            height: 320,

            series: [
              Number(
                stuToday?.present
              ) || 0,

              Number(
                stuToday?.absent
              ) || 0,
            ],

            options: {

              labels: [
                "Present",
                "Absent",
              ],

              legend: {
                position: "bottom",
              },

              dataLabels: {
                enabled: true,
              },
            },
          },
        },

        // =====================================================
        // STUDENT WEEKLY
        // =====================================================

        {
          color: "orange",

          title:
            "Student Weekly Attendance",

          description:
            "Last 7 Days",

          chart: {

            type: "line",

            height: 320,

            series: [
              {
                name: "Present",

                data:
                  stuWeekly.map(
                    (d) =>
                      Number(
                        d?.present
                      ) || 0
                  ),
              },

              {
                name: "Absent",

                data:
                  stuWeekly.map(
                    (d) =>
                      Number(
                        d?.absent
                      ) || 0
                  ),
              },
            ],

            options: {

              chart: {
                toolbar: {
                  show: true,
                },

                zoom: {
                  enabled: false,
                },
              },

              stroke: {
                curve: "smooth",
                width: 4,
              },

              markers: {
                size: 5,
              },

              dataLabels: {
                enabled: false,
              },

              xaxis: {
                categories:
                  studentDates,
              },
            },
          },
        },

        // =====================================================
        // TEACHER DAILY
        // =====================================================

        {
          color: "indigo",

          title:
            "Teacher Daily Attendance",

          description:
            "Today Attendance",

          chart: {

            type: "donut",

            height: 320,

            series: [
              Number(
                teacherToday?.present
              ) || 0,

              Number(
                teacherToday?.absent
              ) || 0,
            ],

            options: {

              labels: [
                "Present",
                "Absent",
              ],

              legend: {
                position: "bottom",
              },

              dataLabels: {
                enabled: true,
              },
            },
          },
        },

        // =====================================================
        // TEACHER WEEKLY
        // =====================================================

        {
          color: "teal",

          title:
            "Teacher Weekly Attendance",

          description:
            "Last 7 Days",

          chart: {

            type: "area",

            height: 320,

            series: [
              {
                name: "Present",

                data:
                  safeTeacherWeekly.map(
                    (d) =>
                      Number(
                        d?.present
                      ) || 0
                  ),
              },

              {
                name: "Absent",

                data:
                  safeTeacherWeekly.map(
                    (d) =>
                      Number(
                        d?.absent
                      ) || 0
                  ),
              },
            ],

            options: {

              chart: {
                toolbar: {
                  show: true,
                },
              },

              stroke: {
                curve: "smooth",
                width: 4,
              },

              markers: {
                size: 5,
              },

              dataLabels: {
                enabled: false,
              },

              xaxis: {
                categories:
                  safeTeacherDates,
              },
            },
          },
        },
      ]);

    } catch (err) {

      console.log(
        "HOME DASHBOARD ERROR:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {

    if (schoolId) {

      fetchData();
    }

  }, [schoolId]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div
        className="
          flex
          justify-center
          items-center
          h-[70vh]
        "
      >
        <Spinner
          className="
            h-12
            w-12
          "
        />
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="mt-6 px-3">

      {/* =====================================================
          TOP CARDS
      ===================================================== */}

      <div
        className="
          mb-8
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-3
          gap-5
        "
      >

        {/* STUDENTS */}

        <div
          onClick={() =>
            navigate(
              "/dashboard/hod/students"
            )
          }
          className="
            cursor-pointer
            hover:scale-[1.02]
            transition-all
          "
        >

          <StatisticsCard
            title="Total Students"
            value={String(
              stats.students || 0
            )}
            icon={
              <i
                className="
                  fas
                  fa-users
                  text-white
                "
              />
            }
          />

        </div>

        {/* TEACHERS */}

        <div
          onClick={() =>
            navigate(
              "/dashboard/hod/teachers"
            )
          }
          className="
            cursor-pointer
            hover:scale-[1.02]
            transition-all
          "
        >

          <StatisticsCard
            title="Total Teachers"
            value={String(
              stats.teachers || 0
            )}
            icon={
              <i
                className="
                  fas
                  fa-chalkboard-teacher
                  text-white
                "
              />
            }
          />

        </div>

        {/* TOPPERS */}

        <div
          onClick={() =>
            navigate(
              "/dashboard/hod/toppers"
            )
          }
          className="
            cursor-pointer
            hover:scale-[1.02]
            transition-all
          "
        >

          <StatisticsCard
            title="Toppers"
            value="View"
            icon={
              <i
                className="
                  fas
                  fa-trophy
                  text-white
                "
              />
            }
          />

        </div>

      </div>

      {/* =====================================================
          CHARTS
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-5
        "
      >

        {chartData.map(
          (item, index) => (

            <Card
              key={index}
              className="
                rounded-2xl
                border
                shadow-lg
              "
            >

              <CardHeader
                floated={false}
                shadow={false}
                className="
                  rounded-none
                  border-b
                  bg-white
                  p-4
                  m-0
                "
              >

                <Typography
                  variant="h6"
                  className="
                    font-bold
                  "
                >
                  {item.title}
                </Typography>

                <Typography
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  {item.description}
                </Typography>

              </CardHeader>

              <CardBody
                className="
                  p-4
                "
              >

                <div
                  className="
                    w-full
                    overflow-x-auto
                  "
                >

                  <StatisticsChart
                    key={`${item.title}-${index}`}
                    color={item.color}
                    title={item.title}
                    description={item.description}
                    chart={item.chart}
                  />

                </div>

              </CardBody>

            </Card>
          )
        )}

      </div>

    </div>
  );
}

export default Home;