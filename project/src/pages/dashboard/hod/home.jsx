
import React, { useEffect, useState } from "react";

import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Spinner,
} from "@material-tailwind/react";

import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";

import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Home() {

  // ================= HOD DATA =================
  const hodData = JSON.parse(
    localStorage.getItem("hodData")
  );

  console.log(
    "Hod Details Now :",
    hodData
  );

  // ================= SAFE SCHOOL ID =================
  const schoolId =
    hodData?.school?.id ||
    hodData?.schoolId;

  const hodId =
    hodData?.id;

  console.log(
    "School ID :",
    schoolId
  );

  console.log(
    "HOD ID :",
    hodId
  );

  // ================= STATES =================
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      students: 0,
      teachers: 0,
    });

  const [chartData, setChartData] =
    useState([]);

  const navigate = useNavigate();

  // ================= APEX STYLE FIX =================
  useEffect(() => {

    const style =
      document.createElement("style");

    style.innerHTML = `
      .apexcharts-menu {
        background: white !important;
        color: black !important;
        border-radius: 8px;
      }

      .apexcharts-menu-item {
        color: black !important;
        font-size: 12px;
      }

      .apexcharts-menu-item:hover {
        background: #f3f4f6 !important;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };

  }, []);

  // ================= FETCH DATA =================
  const fetchData = async () => {

    try {

      setLoading(true);

      const today =
        new Date()
          .toLocaleDateString("en-CA");

      console.log(
        "Fetching Dashboard Data..."
      );

      // ================= STUDENTS =================
      let studentRes = { data: [] };

      try {

        studentRes = await axios.get(
          `http://localhost:8080/api/students/school/${schoolId}`
        );

        console.log(
          "Students API Success"
        );

      } catch (e) {

        console.log(
          "Students API Failed",
          e
        );
      }

      // ================= TEACHERS =================
      let teacherRes = { data: [] };

      try {

        teacherRes = await axios.get(
          `http://localhost:8080/api/professors/by-hod/${schoolId}/${hodId}`
        );

        console.log(
          "Teachers API Success"
        );

      } catch (e) {

        console.log(
          "Teachers API Failed",
          e
        );
      }

      // ================= FEES =================
      let feeRes = { data: {} };

      try {

        feeRes = await axios.get(
          `http://localhost:8080/api/fees/summary/${schoolId}`
        );

        console.log(
          "Fees API Success"
        );

      } catch (e) {

        console.log(
          "Fee API Failed",
          e
        );
      }

      // ================= STUDENT DAILY =================
      let stuTodayRes = {
        data: {
          present: 0,
          absent: 0,
        },
      };

      try {

        stuTodayRes =
          await axios.get(
            `http://localhost:8080/api/stu-attendance/summary/${schoolId}?date=${today}`
          );

        console.log(
          "Student Today API Success"
        );

      } catch (e) {

        console.log(
          "Student Today API Failed",
          e
        );
      }

      // ================= STUDENT WEEKLY =================
      let stuWeeklyRes = {
        data: [],
      };

      try {

        stuWeeklyRes =
          await axios.get(
            `http://localhost:8080/api/stu-attendance/weekly-summary/${schoolId}`
          );

        console.log(
          "Student Weekly API Success"
        );

      } catch (e) {

        console.log(
          "Student Weekly API Failed",
          e
        );
      }

      // ================= TEACHER DAILY =================
      let teacherTodayRes = {
        data: {
          present: 0,
          absent: 0,
        },
      };

      try {

        teacherTodayRes =
          await axios.get(
            `http://localhost:8080/api/attendance/teacher/summary/${schoolId}?date=${today}`
          );

        console.log(
          "Teacher Today API Success"
        );

      } catch (e) {

        console.log(
          "Teacher Today API Failed",
          e
        );
      }

      // ================= TEACHER WEEKLY =================
      let teacherWeeklyRes = {
        data: [],
      };

      try {

        teacherWeeklyRes =
          await axios.get(
            `http://localhost:8080/api/attendance/teacher/weekly-summary/${schoolId}`
          );

        console.log(
          "Teacher Weekly API Success"
        );

      } catch (e) {

        console.log(
          "Teacher Weekly API Failed",
          e
        );
      }

      // ================= RESPONSE =================
      const students =
        Array.isArray(studentRes.data)
          ? studentRes.data
          : [];

      const teachers =
        Array.isArray(teacherRes.data)
          ? teacherRes.data
          : [];

      const fee =
        feeRes.data || {};

      const stuToday =
        stuTodayRes.data || {};

      const stuWeekly =
        Array.isArray(
          stuWeeklyRes.data
        )
          ? stuWeeklyRes.data
          : [];

      const teacherToday =
        teacherTodayRes.data || {};

      const teacherWeekly =
        Array.isArray(
          teacherWeeklyRes.data
        )
          ? teacherWeeklyRes.data
          : [];

      // ================= DEBUG =================
      console.log(
        "Students Response :",
        students
      );

      console.log(
        "Teachers Response :",
        teachers
      );

      console.log(
        "Students Count :",
        students.length
      );

      console.log(
        "Teachers Count :",
        teachers.length
      );

      // ================= SET STATS =================
      setStats({

        students:
          Number(
            students.length
          ) || 0,

        teachers:
          Number(
            teachers.length
          ) || 0,
      });

      // ================= CHART DATA =================
      setChartData([

        // ================= FEE STATUS =================
        {
          color: "blue",

          title: "Fee Status",

          description:
            "Paid vs Pending",

          chart: {
            type: "bar",

            height: 220,

            series: [
              {
                name: "Students",

                data: [
                  fee?.paidStudents || 0,

                  fee?.pendingStudents || 0,
                ],
              },
            ],

            options: {
              chart: {
                toolbar: {
                  show: true,
                },
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

        // ================= COLLECTION =================
        {
          color: "green",

          title: "Collection",

          description:
            "Total / Collected / Pending",

          chart: {
            type: "bar",

            height: 220,

            series: [
              {
                name: "Amount",

                data: [
                  fee?.totalFeeAmount || 0,

                  fee?.totalCollectionAmount || 0,

                  fee?.totalPendingAmount || 0,
                ],
              },
            ],

            options: {
              chart: {
                toolbar: {
                  show: true,
                },
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

        // ================= STUDENT DAILY =================
        {
          color: "purple",

          title:
            "Student Daily Attendance",

          description:
            "Present vs Absent",

          chart: {
            type: "bar",

            height: 220,

            series: [
              {
                name: "Students",

                data: [
                  stuToday?.present || 0,

                  stuToday?.absent || 0,
                ],
              },
            ],

            options: {
              chart: {
                toolbar: {
                  show: true,
                },
              },

              xaxis: {
                categories: [
                  "Present",
                  "Absent",
                ],
              },
            },
          },
        },

        // ================= STUDENT WEEKLY =================
        {
          color: "orange",

          title:
            "Student Weekly Attendance",

          description:
            "Last 7 Days",

          chart: {
            type: "line",

            height: 220,

            series: [
              {
                name: "Present",

                data:
                  stuWeekly.map(
                    (d) =>
                      d?.present || 0
                  ),
              },
            ],

            options: {
              chart: {
                toolbar: {
                  show: true,
                },
              },

              xaxis: {
                categories:
                  stuWeekly.map(
                    (d) =>
                      d?.date || ""
                  ),
              },
            },
          },
        },

        // ================= TEACHER DAILY =================
        {
          color: "indigo",

          title:
            "Teacher Daily Attendance",

          description:
            "Present vs Absent",

          chart: {
            type: "bar",

            height: 220,

            series: [
              {
                name: "Teachers",

                data: [
                  teacherToday?.present || 0,

                  teacherToday?.absent || 0,
                ],
              },
            ],

            options: {
              chart: {
                toolbar: {
                  show: true,
                },
              },

              xaxis: {
                categories: [
                  "Present",
                  "Absent",
                ],
              },
            },
          },
        },

        // ================= TEACHER WEEKLY =================
        {
          color: "teal",

          title:
            "Teacher Weekly Attendance",

          description:
            "Last 7 Days",

          chart: {
            type: "line",

            height: 220,

            series: [
              {
                name: "Present",

                data:
                  teacherWeekly.map(
                    (d) =>
                      d?.present || 0
                  ),
              },
            ],

            options: {
              chart: {
                toolbar: {
                  show: true,
                },
              },

              xaxis: {
                categories:
                  teacherWeekly.map(
                    (d) =>
                      d?.date || ""
                  ),
              },
            },
          },
        },
      ]);

    } catch (err) {

      console.log(
        "HOME DASHBOARD ERROR :",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= LOAD =================
  useEffect(() => {

    if (
      schoolId &&
      hodId
    ) {

      fetchData();
    }

  }, [
    schoolId,
    hodId,
  ]);

  // ================= LOADING =================
  if (loading) {

    return (

      <div className="
        flex
        justify-center
        items-center
        h-[70vh]
      ">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (

    <div className="mt-6 px-3">

      {/* ================= TOP CARDS ================= */}
      <div
        className="
          mb-8
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >

        {/* ================= STUDENTS ================= */}
        <div
          onClick={() =>
            navigate(
              "/dashboard/hod/students"
            )
          }
          className="cursor-pointer"
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

        {/* ================= TEACHERS ================= */}
        <div
          onClick={() =>
            navigate(
              "/dashboard/hod/teachers"
            )
          }
          className="cursor-pointer"
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

        {/* ================= TOPPERS ================= */}
        <div
          onClick={() =>
            navigate(
              "/dashboard/hod/toppers"
            )
          }
          className="cursor-pointer"
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

      {/* ================= CHARTS ================= */}
      <div
        className="
          grid
          grid-cols-1
          gap-4
          md:grid-cols-2
        "
      >

        {chartData.map(
          (item, index) => (

            <Card
              key={index}
              className="
                shadow
                border
              "
            >

              <CardHeader className="p-4">

                <Typography variant="h6">
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

              <CardBody>

                <StatisticsChart
                  {...item}
                />

              </CardBody>

            </Card>
          )
        )}

      </div>

    </div>
  );
}

export default Home;