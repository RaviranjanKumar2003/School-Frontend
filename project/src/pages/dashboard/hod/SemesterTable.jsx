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

import {
  BookOpenIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/solid";

const BASE_URL = "http://localhost:8080/api";

export default function SchoolDashboard() {

  // ================= GET SCHOOL =================
  const hodData = JSON.parse(
    localStorage.getItem("hodData")
  );

  console.log("School HOD Data :", hodData);

  const schoolId = hodData?.school?.id;

  // ================= STATES =================
  const [classes, setClasses] = useState([]);
  const [openIndex, setOpenIndex] =
    useState(null);

  // ================= LOAD DATA =================
  useEffect(() => {

    if (schoolId) {
      fetchClasses();
    }

  }, [schoolId]);

  // ================= FETCH CLASSES =================
  const fetchClasses = async () => {

    try {

      // ================= GET CLASSES =================
      const classRes = await axios.get(
        `${BASE_URL}/classes/by-school/${schoolId}`
      );

      const classData =
        classRes.data || [];

      // ================= GET SECTIONS =================
      const updatedClasses =
        await Promise.all(

          classData.map(async (cls) => {

            try {

              const sectionRes =
                await axios.get(
                  `${BASE_URL}/sections/${schoolId}/${cls.id}`
                );

              return {
                ...cls,
                sections:
                  sectionRes.data || [],
              };

            } catch (err) {

              console.error(
                "Section Fetch Error :",
                err
              );

              return {
                ...cls,
                sections: [],
              };
            }
          })
        );

      setClasses(updatedClasses);

    } catch (err) {

      console.error(
        "Fetch Classes Error:",
        err
      );

    }
  };

  // ================= TOGGLE =================
  const toggleDetails = (index) => {

    setOpenIndex(
      openIndex === index
        ? null
        : index
    );

  };

  return (

    <div className="min-h-screen bg-gray-100 p-6 flex flex-col gap-6">

      {/* ================= TOP CARD ================= */}
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
              Principal / HOD can monitor classes,
              sections & subjects
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

      {/* ================= CLASS LIST ================= */}
      {classes.map((cls, index) => {

        const hasComputer =
          cls.subjects?.some(
            (s) =>
              s?.subjectName?.toLowerCase() ===
              "computer science"
          );

        return (

          <Card
            key={cls.id}
            className="shadow-md border border-blue-gray-50 overflow-hidden"
          >

            {/* ================= HEADER ================= */}
            <CardHeader
              floated={false}
              shadow={false}
              className="m-0 rounded-none bg-gradient-to-r from-blue-600 to-indigo-600 p-5"
            >

              <div className="flex justify-between items-start flex-wrap gap-4">

                {/* ================= LEFT ================= */}
                <div>

                  <Typography
                    variant="h5"
                    color="white"
                    className="font-bold"
                  >
                    {cls.className}
                  </Typography>

                  <Typography
                    color="white"
                    className="text-sm opacity-80 mt-1"
                  >
                    Sections Overview
                  </Typography>

                  {/* ================= SECTIONS ================= */}
                  <div className="flex flex-wrap gap-2 mt-4">

                    {cls.sections?.length > 0 ? (

                      cls.sections.map((sec) => (

                        <div
                          key={sec.id}
                          className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-sm font-medium border border-white/20"
                        >

                          {sec.sectionName}

                        </div>

                      ))

                    ) : (

                      <Typography
                        color="white"
                        className="text-sm opacity-80"
                      >
                        No Sections Available
                      </Typography>

                    )}

                  </div>

                </div>

                {/* ================= RIGHT ================= */}
                <div className="flex items-center gap-2 flex-wrap">

                  <Chip
                    value={`${cls.subjects?.length || 0} Subjects`}
                    className="bg-white text-blue-700"
                  />

                  <Chip
                    value={`${cls.sections?.length || 0} Sections`}
                    className="bg-green-100 text-green-700"
                  />

                </div>

              </div>

            </CardHeader>

            {/* ================= BODY ================= */}
            <CardBody>

              {/* ================= TOP ACTIONS ================= */}
              <div className="flex justify-between items-center flex-wrap gap-3">

                <div>

                  <Typography className="font-semibold text-blue-gray-700">
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
                  onClick={() =>
                    toggleDetails(index)
                  }
                >
                  {openIndex === index
                    ? "Hide Subjects"
                    : "View Subjects"}
                </Button>

              </div>

              {/* ================= SUBJECTS ================= */}
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

                      {cls.subjects.map(
                        (sub, i) => (

                          <div
                            key={i}
                            className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full"
                          >

                            <BookOpenIcon className="h-4 w-4 text-blue-700" />

                            <Typography
                              variant="small"
                              className="font-medium text-blue-gray-800"
                            >
                              {sub.subjectName}
                            </Typography>

                          </div>
                        )
                      )}

                    </div>

                  )}

                </div>

              )}

              {/* ================= FEATURES ================= */}
              <div className="mt-6 flex gap-3 flex-wrap">

                <Chip
                  value="✔ Exams Enabled"
                  color="green"
                />

                <Chip
                  value="✔ Practical Classes"
                  color="blue"
                />

                <Chip
                  value="✔ Smart Sections"
                  color="orange"
                />

                {hasComputer && (

                  <Chip
                    value="✔ Computer Lab"
                    color="purple"
                  />

                )}

              </div>

              {/* ================= SUMMARY ================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                <div className="bg-gray-50 rounded-xl p-4 border">

                  <div className="flex items-center gap-3">

                    <Squares2X2Icon className="h-8 w-8 text-indigo-600" />

                    <div>

                      <Typography className="font-semibold text-blue-gray-800">
                        Total Sections
                      </Typography>

                      <Typography className="text-sm text-gray-600">
                        {cls.sections?.length || 0} Sections Available
                      </Typography>

                    </div>

                  </div>

                </div>

                <div className="bg-gray-50 rounded-xl p-4 border">

                  <div className="flex items-center gap-3">

                    <BookOpenIcon className="h-8 w-8 text-blue-600" />

                    <div>

                      <Typography className="font-semibold text-blue-gray-800">
                        Total Subjects
                      </Typography>

                      <Typography className="text-sm text-gray-600">
                        {cls.subjects?.length || 0} Subjects Assigned
                      </Typography>

                    </div>

                  </div>

                </div>

              </div>

            </CardBody>

          </Card>

        );
      })}

      {/* ================= EMPTY STATE ================= */}
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