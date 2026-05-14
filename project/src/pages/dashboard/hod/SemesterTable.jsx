import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
} from "@material-tailwind/react";

const BASE_URL = "http://localhost:8080/api";

export default function SchoolDashboard() {

  // ================= GET SCHOOL =================
  const hodData = JSON.parse(localStorage.getItem("hodData"));

  console.log("School HOD Data :", hodData);

  const schoolId = hodData?.school?.id;

  // ================= STATES =================
  const [classes, setClasses] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  // ================= LOAD DATA =================
  useEffect(() => {

    if (schoolId) {
      fetchClasses();
    }

  }, [schoolId]);

  // ================= FETCH CLASSES =================
  const fetchClasses = async () => {

    try {

      // ONLY CURRENT SCHOOL CLASSES
      const res = await axios.get(
        `${BASE_URL}/classes/by-school/${schoolId}`
      );

      setClasses(res.data || []);

    } catch (err) {

      console.error("Fetch Classes Error:", err);

    }
  };

  // ================= TOGGLE =================
  const toggleDetails = (index) => {

    setOpenIndex(openIndex === index ? null : index);

  };

  return (

    <div className="p-6 flex flex-col gap-6 bg-gray-100 min-h-screen">

      {/* TOP DASHBOARD CARD */}
      <Card className="shadow-lg border border-blue-gray-100">

        <CardBody className="flex flex-col md:flex-row justify-between items-center gap-4">

          <div>

            <Typography
              variant="h4"
              className="font-bold text-blue-gray-900"
            >
              Academic Dashboard
            </Typography>

            <Typography className="text-gray-600 mt-1">
              Principal / HOD can only monitor classes & subjects
            </Typography>

          </div>

          <div className="flex gap-3 flex-wrap">

            <Chip
              value={`Total Classes : ${classes.length}`}
              color="blue"
              className="text-sm"
            />

          </div>

        </CardBody>

      </Card>

      {/* CLASS LIST */}
      {classes.map((cls, index) => {

        const hasComputer = cls.subjects?.some(
          (s) =>
            s?.subjectName?.toLowerCase() === "computer science"
        );

        return (

          <Card
            key={cls.id}
            className="shadow-md border border-blue-gray-50"
          >

            {/* HEADER */}
            <CardHeader
              floated={false}
              shadow={false}
              className="m-0 rounded-none bg-gradient-to-r from-blue-600 to-indigo-600 p-5 flex justify-between items-center"
            >

              <div>

                <Typography
                  variant="h6"
                  color="white"
                  className="font-bold"
                >
                  {cls.className}
                </Typography>

                <Typography
                  color="white"
                  className="text-sm opacity-80"
                >
                  Class Number : {cls.classNumber}
                </Typography>

              </div>

              <Chip
                value={`${cls.subjects?.length || 0} Subjects`}
                className="bg-white text-blue-700"
              />

            </CardHeader>

            {/* BODY */}
            <CardBody>

              {/* TOP SECTION */}
              <div className="flex justify-between items-center flex-wrap gap-3">

                <div>

                  <Typography
                    variant="small"
                    className="font-semibold text-blue-gray-700"
                  >
                    Subject Management
                  </Typography>

                  <Typography
                    variant="small"
                    className="text-gray-500"
                  >
                    View all assigned subjects
                  </Typography>

                </div>

                <Button
                  size="sm"
                  color="blue"
                  variant="gradient"
                  onClick={() => toggleDetails(index)}
                >
                  {openIndex === index ? "Hide Subjects" : "View Subjects"}
                </Button>

              </div>

              {/* SUBJECTS */}
              {openIndex === index && (

                <div className="mt-5">

                  {cls.subjects?.length === 0 ? (

                    <div className="bg-gray-100 rounded-lg p-4">

                      <Typography className="text-gray-500">
                        No subjects assigned
                      </Typography>

                    </div>

                  ) : (

                    <div className="flex flex-wrap gap-3">

                      {cls.subjects.map((sub, i) => (

                        <Chip
                          key={i}
                          value={sub.subjectName}
                          color="blue"
                          className="rounded-full"
                        />

                      ))}

                    </div>

                  )}

                </div>

              )}

              {/* FEATURES */}
              <div className="mt-6 flex gap-3 flex-wrap">

                <Chip
                  value="✔ Exams Enabled"
                  color="green"
                />

                <Chip
                  value="✔ Practical Classes"
                  color="blue"
                />

                {hasComputer && (

                  <Chip
                    value="✔ Computer Lab"
                    color="purple"
                  />

                )}

              </div>

            </CardBody>

          </Card>

        );
      })}

      {/* EMPTY STATE */}
      {classes.length === 0 && (

        <Card className="shadow-md">

          <CardBody className="text-center py-10">

            <Typography
              variant="h6"
              className="text-gray-500"
            >
              No Classes Available
            </Typography>

            <Typography className="text-gray-400 mt-2">
              School Admin has not created any classes yet
            </Typography>

          </CardBody>

        </Card>

      )}

    </div>
  );
}