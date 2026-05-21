import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardBody,
  Typography,
  Button,
  Checkbox,
  Chip,
  Input,
  Spinner,
} from "@material-tailwind/react";

import {
  AcademicCapIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

const BASE_URL = "http://localhost:8080/api";

export default function StudentPromotion() {

  // ================= SCHOOL =================

  const adminData =
    JSON.parse(localStorage.getItem("schoolAdminData")) || {};

  const schoolId =
    adminData?.schoolId || adminData?.school?.id;

  // ================= STATES =================

  const [classes, setClasses] = useState([]);

  const [fromSections, setFromSections] = useState([]);
  const [toSections, setToSections] = useState([]);

  const [fromClass, setFromClass] = useState("");
  const [fromSection, setFromSection] = useState("");

  const [toClass, setToClass] = useState("");
  const [toSection, setToSection] = useState("");

  const [students, setStudents] = useState([]);

  const [selectedStudents, setSelectedStudents] =
    useState([]);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [promoting, setPromoting] =
    useState(false);

  // ================= LOAD CLASSES =================

  useEffect(() => {

    if (!schoolId) return;

    axios
      .get(`${BASE_URL}/classes/by-school/${schoolId}`)

      .then((res) => {

        setClasses(res.data || []);

      })

      .catch((err) => {

        console.log("Class Error:", err);

      });

  }, [schoolId]);

  // ================= FETCH SECTIONS =================

  const fetchSections = async (
    classId,
    type
  ) => {

    if (!classId) return;

    try {

      const res = await axios.get(
        `${BASE_URL}/sections/${schoolId}/${classId}`
      );

      if (type === "from") {

        setFromSections(res.data || []);

      } else {

        setToSections(res.data || []);
      }

    } catch (err) {

      console.log("Section Error:", err);

      if (type === "from") {

        setFromSections([]);

      } else {

        setToSections([]);
      }
    }
  };

  // ================= FETCH STUDENTS =================

  const fetchStudents = async (classId) => {

    if (!classId) return;

    try {

      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/students/school/${schoolId}/class/${classId}`
      );

      setStudents(res.data || []);

      setSelectedStudents([]);

    } catch (err) {

      console.log(
        "Student fetch error:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= HANDLERS =================

  const handleFromClass = async (e) => {

    const value = e.target.value;

    setFromClass(value);

    setFromSection("");

    setStudents([]);

    setSelectedStudents([]);

    await fetchSections(value, "from");
  };

  const handleFromSection = async (e) => {

    const value = e.target.value;

    setFromSection(value);

    if (fromClass) {

      await fetchStudents(fromClass);
    }
  };

  const handleToClass = async (e) => {

    const value = e.target.value;

    setToClass(value);

    setToSection("");

    await fetchSections(value, "to");
  };

  // ================= SELECT STUDENT =================

  const toggleStudent = (id) => {

    setSelectedStudents((prev) =>

      prev.includes(id)

        ? prev.filter((x) => x !== id)

        : [...prev, id]
    );
  };

  // ================= SELECT ALL =================

  const selectAll = () => {

    if (
      selectedStudents.length ===
      filteredStudents.length
    ) {

      setSelectedStudents([]);

    } else {

      setSelectedStudents(
        filteredStudents.map(
          (s) => s.id
        )
      );
    }
  };

  // ================= FILTER =================

  const filteredStudents =
    students.filter((s) => {

      const matchSearch =

        s.studfirstName
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        s.studlastName
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        s.studentId
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchSection =

        !fromSection ||

        s.section === fromSection;

      return (
        matchSearch &&
        matchSection
      );
    });

  // ================= PROMOTE =================

  const handlePromote = async () => {

    if (!fromClass || !toClass) {

      alert(
        "Select From & To Class"
      );

      return;
    }

    if (!toSection) {

      alert(
        "Select To Section"
      );

      return;
    }

    if (
      selectedStudents.length === 0
    ) {

      alert(
        "Select students first"
      );

      return;
    }

    try {

      setPromoting(true);

      const payload = {

        studentIds:
          selectedStudents,

        toClassId:
          Number(toClass),

        toSection:
          toSection,

        updatedBy:
          adminData?.id,

        actionType:
          "PROMOTION",
      };

      await axios.post(
        `${BASE_URL}/students/promote`,
        payload
      );

      alert(
        "Students Promoted Successfully 🎉"
      );

      if (fromClass) {

        await fetchStudents(
          fromClass
        );
      }

      setSelectedStudents([]);

    } catch (err) {

      console.log(
        "PROMOTION ERROR:",
        err
      );

      alert(

        err?.response?.data?.message ||

        "Promotion failed"
      );

    } finally {

      setPromoting(false);
    }
  };

  // ================= UI =================

  return (

    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* HEADER */}

      <div className="mb-6">

        <Typography
          variant="h3"
          className="font-bold text-blue-900"
        >

          Student Promotion

        </Typography>

        <Typography className="text-gray-600">

          Promote students class & section wise

        </Typography>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}

        <Card className="rounded-2xl shadow-lg">

          <CardBody>

            <div className="flex items-center gap-2 mb-4">

              <AcademicCapIcon className="h-6 w-6 text-blue-700" />

              <Typography variant="h5">

                Promotion Setup

              </Typography>

            </div>

            {/* FROM CLASS */}

            <Typography className="mb-2 font-semibold">

              From Class

            </Typography>

            <select
              value={fromClass}
              onChange={handleFromClass}
              className="w-full border border-gray-300 rounded-lg p-3 bg-white"
            >

              <option value="">
                Select Class
              </option>

              {classes.map((c) => (

                <option
                  key={c.id}
                  value={c.id}
                >

                  {c.className}

                </option>
              ))}

            </select>

            {/* FROM SECTION */}

            <Typography className="mt-4 mb-2 font-semibold">

              From Section

            </Typography>

            <select
              value={fromSection}
              onChange={handleFromSection}
              className="w-full border border-gray-300 rounded-lg p-3 bg-white"
            >

              <option value="">
                Select Section
              </option>

              {fromSections.map((s) => (

                <option
                  key={s.id}
                  value={s.sectionName}
                >

                  {s.sectionName}

                </option>
              ))}

            </select>

            {/* ARROW */}

            <div className="flex justify-center my-5">

              <ArrowRightIcon className="h-7 w-7 text-blue-700" />

            </div>

            {/* TO CLASS */}

            <Typography className="mb-2 font-semibold">

              To Class

            </Typography>

            <select
              value={toClass}
              onChange={handleToClass}
              className="w-full border border-gray-300 rounded-lg p-3 bg-white"
            >

              <option value="">
                Select Class
              </option>

              {classes.map((c) => (

                <option
                  key={c.id}
                  value={c.id}
                >

                  {c.className}

                </option>
              ))}

            </select>

            {/* TO SECTION */}

            <Typography className="mt-4 mb-2 font-semibold">

              To Section

            </Typography>

            <select
              value={toSection}
              onChange={(e) =>
                setToSection(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-lg p-3 bg-white"
            >

              <option value="">
                Select Section
              </option>

              {toSections.map((s) => (

                <option
                  key={s.id}
                  value={s.sectionName}
                >

                  {s.sectionName}

                </option>
              ))}

            </select>

            {/* BUTTON */}

            <Button
              onClick={handlePromote}
              disabled={promoting}
              className="w-full mt-6 bg-blue-700"
            >

              {promoting
                ? "Promoting..."
                : "Promote Students"}

            </Button>

          </CardBody>

        </Card>

        {/* RIGHT */}

        <div className="lg:col-span-2">

          <Card className="rounded-2xl shadow-lg">

            <CardBody>

              <div className="flex justify-between mb-4">

                <Typography variant="h5">

                  Students

                </Typography>

                <Chip
                  value={`${selectedStudents.length}/${filteredStudents.length}`}
                  color="blue"
                />

              </div>

              {/* SEARCH */}

              <div className="flex gap-2 mb-4">

                <Input
                  label="Search student"
                  icon={
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  }
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

                <Button onClick={selectAll}>

                  Select All

                </Button>

              </div>

              {/* LIST */}

              {loading ? (

                <div className="flex justify-center py-10">

                  <Spinner />

                </div>

              ) : (

                <div className="space-y-3 max-h-[420px] overflow-y-auto">

                  {filteredStudents.map((stu) => (

                    <div
                      key={stu.id}
                      className="flex justify-between items-center p-3 border rounded-xl hover:bg-gray-50"
                    >

                      <div className="flex items-center gap-3">

                        <Checkbox
                          checked={selectedStudents.includes(stu.id)}
                          onChange={() =>
                            toggleStudent(
                              stu.id
                            )
                          }
                        />

                        <div>

                          <p className="font-bold">

                            {stu.studfirstName}{" "}
                            {stu.studlastName}

                          </p>

                          <p className="text-sm text-gray-500">

                            {stu.studentId}

                          </p>

                        </div>

                      </div>

                      <CheckCircleIcon className="h-5 w-5 text-green-500" />

                    </div>
                  ))}

                  {!loading &&
                    filteredStudents.length === 0 && (

                    <div className="text-center py-10 text-gray-500">

                      No Students Found

                    </div>
                  )}

                </div>
              )}

            </CardBody>

          </Card>

        </div>

      </div>

    </div>
  );
}