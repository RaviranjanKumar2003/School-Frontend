import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";

import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";

import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Home() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  const navigate = useNavigate();

  // OUTSIDE CLICK
  useEffect(() => {
    const handleClick = () => setOpenMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // 🔥 FIX: ApexCharts Download Menu Text Color
useEffect(() => {
  const style = document.createElement("style");
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

  // FETCH DATA  
  const fetchData = async () => {
    try {
      const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

      const [
        studentRes,
        teacherRes,
        feeRes,

        // 🔥 STUDENT
        stuTodayRes,
        stuWeeklyRes,

        // 🔥 TEACHER
        teacherTodayRes,
        teacherWeeklyRes,
      ] = await Promise.all([
        axios.get("http://localhost:8080/api/students"),
        axios.get("http://localhost:8080/api/professors"),
        axios.get("http://localhost:8080/api/fees/summary"),

        axios.get(
          `http://localhost:8080/api/stu-attendance/summary?date=${today}`
        ),
        axios.get(
          "http://localhost:8080/api/stu-attendance/weekly-summary"
        ),

        axios.get(
          `http://localhost:8080/api/attendance/teacher/summary?date=${today}`
        ),
        axios.get(
          "http://localhost:8080/api/attendance/teacher/weekly-summary"
        ),
      ]);

      const students = studentRes.data;
      const teachers = teacherRes.data;
      const fee = feeRes.data;

      const stuToday = stuTodayRes.data;
      const stuWeekly = stuWeeklyRes.data;

      const teacherToday = teacherTodayRes.data;
      const teacherWeekly = teacherWeeklyRes.data;

      // TOP STATS
      setStats({
        students: students.length,
        teachers: teachers.length,
      });

      // CHARTS
      setChartData([
        // FEES
        {
          color: "blue",
          title: "Fee Status",
          description: "Paid vs Pending",
          chart: {
            type: "bar",
            height: 220,
            series: [
              {
                name: "Students",
                data: [
                  fee.paidStudents || 0,
                  fee.pendingStudents || 0,
                ],
              },
            ],
            options: {
              xaxis: {
                categories: ["Paid", "Pending"],
              },
            },
          },
        },

        // COLLECTION
        {
          color: "green",
          title: "Collection",
          description: "Total / Collected / Pending",
          chart: {
            type: "bar",
            height: 220,
            series: [
              {
                name: "Amount",
                data: [
                  fee.totalFeeAmount || 0,
                  fee.totalCollectionAmount || 0,
                  fee.totalPendingAmount || 0,
                ],
              },
            ],
            options: {
              xaxis: {
                categories: ["Total", "Collected", "Pending"],
              },
            },
          },
        },

        // 🟣 STUDENT DAILY
        {
          color: "purple",
          title: "Student Daily Attendance",
          description: "Present vs Absent",
          chart: {
            type: "bar",
            height: 220,
            series: [
              {
                name: "Students",
                data: [
                  stuToday.present || 0,
                  stuToday.absent || 0,
                ],
              },
            ],
            options: {
              xaxis: {
                categories: ["Present", "Absent"],
              },
            },
          },
        },

        // 🟡 STUDENT WEEKLY
        {
          color: "orange",
          title: "Student Weekly Attendance",
          description: "Last 7 Days",
          chart: {
            type: "line",
            height: 220,
            series: [
              {
                name: "Present",
                data: stuWeekly.map((d) => d.present),
              },
            ],
            options: {
              xaxis: {
                categories: stuWeekly.map((d) => d.date),
              },
            },
          },
        },

        // 🔵 TEACHER DAILY
        {
          color: "indigo",
          title: "Teacher Daily Attendance",
          description: "Present vs Absent",
          chart: {
            type: "bar",
            height: 220,
            series: [
              {
                name: "Teachers",
                data: [
                  teacherToday.present || 0,
                  teacherToday.absent || 0,
                ],
              },
            ],
            options: {
              xaxis: {
                categories: ["Present", "Absent"],
              },
            },
          },
        },

        // 🟢 TEACHER WEEKLY
        {
          color: "teal",
          title: "Teacher Weekly Attendance",
          description: "Last 7 Days",
          chart: {
            type: "line",
            height: 220,
            series: [
              {
                name: "Present",
                data: teacherWeekly.map((d) => d.present),
              },
            ],
            options: {
              xaxis: {
                categories: teacherWeekly.map((d) => d.date),
              },
            },
          },
        },
      ]);
    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="mt-6 px-3">
      {/* TOP CARDS */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <div onClick={() => navigate("/dashboard/hod/students")} className="cursor-pointer">
          <StatisticsCard
            title="Total Students"
            value={stats.students}
            icon={<i className="fas fa-users text-white" />}
          />
        </div>

        <div onClick={() => navigate("/dashboard/hod/teachers")} className="cursor-pointer">
          <StatisticsCard
            title="Total Teachers"
            value={stats.teachers}
            icon={<i className="fas fa-chalkboard-teacher text-white" />}
          />
        </div>

        <div onClick={() => navigate("/dashboard/hod/toppers")} className="cursor-pointer">
          <StatisticsCard
            title="Toppers"
            value="View"
            icon={<i className="fas fa-trophy text-white" />}
          />
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {chartData.map((item, index) => (
          <Card key={index} className="shadow">
            <CardHeader className="p-4">
              <Typography variant="h6">{item.title}</Typography>
              <Typography className="text-sm text-gray-500">
                {item.description}
              </Typography>
            </CardHeader>

            <CardBody>
              <StatisticsChart {...item} />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Home;