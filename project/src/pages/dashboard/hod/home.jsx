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

  const navigate = useNavigate();

  // ✅ FETCH DATA
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/students");

      const students = res.data;

      // ✅ TOTAL COUNT
      setStats({
        students: students.length,
        teachers: 0,
      });

      // ✅ GROUP BY DAY (example: attendance style graph)
      const daysMap = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
      };

      students.forEach((s) => {
        if (s.day) {
          daysMap[s.day] += 1;
        }
      });

      // ✅ CONVERT TO ARRAY
      const labels = Object.keys(daysMap);
      const data = Object.values(daysMap);

      // ✅ SET CHART
      setChartData([
        {
          color: "green",
          title: "Students Activity",
          description: "Live from DB",
          footer: "Updated now",
          chart: {
            type: "bar",
            height: 220,
            series: [
              {
                name: "Students",
                data: data,
              },
            ],
            options: {
              xaxis: {
                categories: labels,
              },
            },
          },
        },
      ]);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-12">

      {/* 🔥 TOP CARDS */}
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">

        <div
          onClick={() => navigate("/dashboard/hod/students")}
          className="cursor-pointer"
        >
          <StatisticsCard
            title="Total Students"
            value={stats.students}
            icon={<i className="fas fa-users text-white" />}
            footer={<Typography>Live from DB</Typography>}
          />
        </div>

        <div
          onClick={() => navigate("/dashboard/hod/teachers")}
          className="cursor-pointer"
        >
          <StatisticsCard
            title="Total Teachers"
            value={stats.teachers}
            icon={<i className="fas fa-chalkboard-teacher text-white" />}
            footer={<Typography>Coming soon</Typography>}
          />
        </div>

        <div
          onClick={() => navigate("/dashboard/hod/toppers")}
          className="cursor-pointer"
        >
          <StatisticsCard
            title="Toppers of the Year"
            value="View"
            icon={<i className="fas fa-trophy text-white" />}
            footer={<Typography>Click to view</Typography>}
          />
        </div>

      </div>

      {/* 🔥 DYNAMIC CHART */}
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {chartData.map((props, index) => (
          <StatisticsChart key={index} {...props} />
        ))}
      </div>

      {/* 🔥 TABLE SAME */}
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">

        <Card className="xl:col-span-2 border shadow-sm">
          <CardHeader className="p-6">
            <Typography variant="h6">Subjects</Typography>
          </CardHeader>

          <CardBody>
            <p>Dynamic content coming from backend soon...</p>
          </CardBody>
        </Card>

        <Card className="border shadow-sm">
          <CardHeader className="p-6">
            <Typography variant="h6">Overview</Typography>
          </CardHeader>

          <CardBody>
            <p>Live updates enabled...</p>
          </CardBody>
        </Card>

      </div>

    </div>
  );
}

export default Home;