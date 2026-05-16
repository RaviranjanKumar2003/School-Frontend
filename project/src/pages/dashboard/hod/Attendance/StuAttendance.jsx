import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaPlus,
  FaEye,
  FaQrcode,
  FaArrowLeft,
  FaCheckCircle,
  FaUsers,
} from "react-icons/fa";

const BASE_URL =
  "http://localhost:8080/api";

function StuAttendance() {

  // =========================================================
  // STATES
  // =========================================================

  const [classes, setClasses] =
    useState([]);

  const [sections, setSections] =
    useState([]);

  const [selectedClass, setSelectedClass] =
    useState(null);

  const [selectedSection, setSelectedSection] =
    useState("");

  const [mode, setMode] =
    useState("");

  const [students, setStudents] =
    useState([]);

  const [attendance, setAttendance] =
    useState({});

  const [attendanceDate, setAttendanceDate] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [takenInfo, setTakenInfo] =
    useState(null);

  const [showQrBox, setShowQrBox] =
    useState(false);

  const [qrStudentId, setQrStudentId] =
    useState("");

  const [searchText, setSearchText] =
    useState("");

  // =========================================================
  // USER INFO
  // =========================================================

  const role =
    localStorage.getItem("userRole");

  let user = null;

  // =========================================================
  // HOD
  // =========================================================

  if (role?.toLowerCase() === "hod") {

    const hodData = JSON.parse(
      localStorage.getItem("hodData")
    );

    user = {

      id: hodData?.id,

      name:
        hodData?.name ||
        hodData?.hodName ||
        "HOD",

      role: "HOD",

      schoolId:
        hodData?.schoolId ||
        hodData?.school?.id,
    };
  }

  // =========================================================
  // TEACHER
  // =========================================================

  else if (
    role?.toLowerCase() === "teacher" ||
    role?.toLowerCase() === "professor"
  ) {

    const teacherData = JSON.parse(
      localStorage.getItem("professorData")
    );

    user = {

      id: teacherData?.id,

      name:
        teacherData?.name ||
        teacherData?.professorName ||
        "Teacher",

      role: "Teacher",

      schoolId:
        teacherData?.schoolId ||
        teacherData?.school?.id,
    };
  }

  // =========================================================
  // SCHOOL ADMIN
  // =========================================================

  else if (
    role?.toLowerCase() === "schooladmin"
  ) {

    const adminData = JSON.parse(
      localStorage.getItem("schoolAdminData")
    );

    user = {

      id: adminData?.id,

      name:
        adminData?.name ||
        adminData?.schoolName ||
        "School Admin",

      role: "SchoolAdmin",

      schoolId:
        adminData?.schoolId ||
        adminData?.school?.id,
    };
  }

  const schoolId =
    user?.schoolId;

  // =========================================================
  // LOAD CLASSES
  // =========================================================

  useEffect(() => {

    if (schoolId) {

      loadClasses();
    }

  }, [schoolId]);

  const loadClasses = async () => {

    try {

      const res = await axios.get(

        `${BASE_URL}/classes/by-school/${schoolId}`
      );

      setClasses(res.data);

    } catch (err) {

      console.error(err);

      alert("Failed to load classes");
    }
  };

  // =========================================================
  // LOAD SECTIONS
  // =========================================================

  const loadSections = async (
    classId
  ) => {

    try {

      const res = await axios.get(

        `${BASE_URL}/sections/${schoolId}/${classId}`
      );

      setSections(res.data);

    } catch (err) {

      console.error(err);

      setSections([]);
    }
  };

  // =========================================================
  // SELECT CLASS
  // =========================================================

  const loadStudents = async (
    cls,
    type
  ) => {

    setMode(type);

    setSelectedClass(cls);

    setStudents([]);

    setAttendance({});

    setTakenInfo(null);

    setAttendanceDate("");

    setSelectedSection("");

    setSections([]);

    setShowQrBox(false);

    await loadSections(cls.id);
  };

  // =========================================================
  // FETCH STUDENTS FOR TAKE MODE
  // =========================================================

  const fetchStudentsBySection =
    async (sectionName) => {

      if (!selectedClass) return;

      try {

        const res = await axios.get(

          `${BASE_URL}/students/school/${schoolId}/class/${selectedClass.className}`
        );

        const filtered =
          res.data.filter(
            (s) =>
              s.section
                ?.toLowerCase()
                ===
              sectionName
                ?.toLowerCase()
          );

        const mappedStudents =
          filtered.map((s) => ({

            id: s.id,

            studentId:
              s.studentId,

            studName:
              s.studName,

            studLastName:
              s.studLastName,

            fullName:
              s.fullName,

            email:
              s.email,

            section:
              s.section,

            profileImage:
              s.profileImage
                ? `${BASE_URL}/students/image/get/${s.id}`
                : null,

            studRollNo:
              s.studRollNo,
          }));

        setStudents(mappedStudents);

        // DEFAULT PRESENT

        const initial = {};

        mappedStudents.forEach((s) => {

          initial[s.id] = "P";
        });

        setAttendance(initial);

      } catch (err) {

        console.error(err);

        alert("Failed to load students");
      }
    };

  // =========================================================
  // SECTION CHANGE
  // =========================================================

  const handleSectionChange =
    async (value) => {

      setSelectedSection(value);

      setStudents([]);

      setAttendance({});

      setTakenInfo(null);

      // TAKE MODE => AUTO LOAD
      if (
        value &&
        mode === "take"
      ) {

        await fetchStudentsBySection(
          value
        );
      }
    };

  // =========================================================
  // CHANGE ATTENDANCE
  // =========================================================

  const handleChange = (
    studentId,
    value
  ) => {

    setAttendance((prev) => ({

      ...prev,

      [studentId]: value,
    }));
  };

  // =========================================================
  // LOAD ATTENDANCE
  // =========================================================

  const loadAttendance = async () => {

    if (
      !attendanceDate ||
      !selectedSection
    ) {

      alert(
        "Please select date & section"
      );

      return;
    }

    try {

      setLoading(true);

      const res = await axios.get(

        `${BASE_URL}/stu-attendance?schoolId=${schoolId}&classId=${selectedClass.id}&section=${selectedSection}&attendanceDate=${attendanceDate}`
      );

      if (
        !res.data ||
        res.data.length === 0
      ) {

        alert(
          "No attendance found"
        );

        setStudents([]);

        return;
      }

      const mappedStudents =
        res.data.map((s) => ({

          id: s.studentId,

          studentId:
            s.studentUniqueId,

          studName:
            s.studentName,

          studLastName:
            s.studentLastName,

          fullName:
            s.fullName,

          email:
            s.email,

          section:
            s.section,

          profileImage:
            s.profileImage
              ? `${BASE_URL}/students/image/get/${s.studentId}`
              : null,

          studRollNo:
            s.studRollNo,
        }));

      setStudents(mappedStudents);

      const attMap = {};

      res.data.forEach((s) => {

        attMap[s.studentId] =
          s.status;
      });

      setAttendance(attMap);

      setTakenInfo({

        takenBy:
          res.data[0]
            ?.takenByName,

        role:
          res.data[0]
            ?.takenByRole,
      });

    } catch (err) {

      console.error(err);

      alert(
        err?.response?.data ||
        "Failed to load attendance"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // SAVE ATTENDANCE
  // =========================================================

  const handleSubmit = async () => {

    if (
      !attendanceDate ||
      !selectedSection
    ) {

      alert(
        "Please select date & section"
      );

      return;
    }

    try {

      setLoading(true);

      let alreadyExists = false;

      let existingData = null;

      try {

        const checkRes =
          await axios.get(

            `${BASE_URL}/stu-attendance?schoolId=${schoolId}&classId=${selectedClass.id}&section=${selectedSection}&attendanceDate=${attendanceDate}`
          );

        if (
          checkRes.data &&
          checkRes.data.length > 0
        ) {

          alreadyExists = true;

          existingData =
            checkRes.data[0];
        }

      } catch {}

      if (alreadyExists) {

        const confirmUpdate =
          window.confirm(

            `Attendance already created by ${existingData?.takenByName} (${existingData?.takenByRole}).
Do you want to update attendance ?`
          );

        if (!confirmUpdate) {

          setLoading(false);

          return;
        }
      }

      const payload =
        students.map((s) => ({

          studentId: s.id,

          status:
            attendance[s.id],
        }));

      await axios.post(

        `${BASE_URL}/stu-attendance/save?schoolId=${schoolId}&classId=${selectedClass.id}&section=${selectedSection}&attendanceDate=${attendanceDate}&takenById=${user.id}&takenByName=${encodeURIComponent(user.name)}&takenByRole=${user.role}`,

        payload
      );

      alert(

        alreadyExists
          ? "Attendance Updated Successfully"
          : "Attendance Saved Successfully"
      );

    } catch (err) {

      console.error(err);

      alert(
        err?.response?.data ||
        "Attendance save failed"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // QR ATTENDANCE
  // =========================================================

  const handleQrAttendance =
    async () => {

      if (
        !qrStudentId ||
        !attendanceDate ||
        !selectedSection
      ) {

        alert(
          "Enter Student ID + Date + Section"
        );

        return;
      }

      try {

        setLoading(true);

        const res =
          await axios.post(

            `${BASE_URL}/stu-attendance/scan-qr?studentId=${qrStudentId}&schoolId=${schoolId}&classId=${selectedClass.id}&section=${selectedSection}&attendanceDate=${attendanceDate}&takenById=${user.id}&takenByName=${encodeURIComponent(user.name)}&takenByRole=${user.role}`
          );

        alert(res.data);

        const found =
          students.find(
            (s) =>
              s.studentId ===
              qrStudentId
          );

        if (found) {

          setAttendance((prev) => ({

            ...prev,

            [found.id]: "P",
          }));
        }

        setQrStudentId("");

      } catch (err) {

        console.error(err);

        alert(
          err?.response?.data ||
          "QR Attendance Failed"
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================================================
  // BACK
  // =========================================================

  const goBack = () => {

    setSelectedClass(null);

    setSelectedSection("");

    setSections([]);

    setStudents([]);

    setAttendance({});

    setMode("");

    setAttendanceDate("");

    setTakenInfo(null);

    setShowQrBox(false);
  };

  // =========================================================
  // FILTER STUDENTS
  // =========================================================

  const filteredStudents =
    students.filter((s) => {

      const keyword =
        searchText.toLowerCase();

      return (

        s.fullName
          ?.toLowerCase()
          .includes(keyword) ||

        s.studName
          ?.toLowerCase()
          .includes(keyword) ||

        s.studentId
          ?.toLowerCase()
          .includes(keyword) ||

        String(
          s.studRollNo
        ).includes(keyword)
      );
    });

  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">

      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">

          {/* HEADER */}

          <div className="bg-blue-600 text-white px-4 py-5 sm:px-6 sm:py-6 text-center">

            <h1 className="text-2xl sm:text-3xl font-bold">

              Student Attendance

            </h1>

            <p className="text-xs sm:text-sm mt-2">

              Logged in as :
              {" "}
              {user?.name}
              {" "}
              (
              {user?.role}
              )

            </p>

          </div>

          {/* CLASS LIST */}

          {!selectedClass && (

            <div className="p-3 sm:p-6 space-y-4">

              {classes.length === 0 && (

                <div className="text-center text-red-500 font-semibold">

                  No Classes Found

                </div>
              )}

              {classes.map((cls) => (

                <div
                  key={cls.id}
                  className="bg-gray-50 border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 hover:shadow-lg transition"
                >

                  <div>

                    <h2 className="text-lg sm:text-xl font-bold">

                      Class :
                      {" "}
                      {cls.className}

                    </h2>

                    <p className="text-gray-500 text-sm mt-1">

                      Take or View Attendance

                    </p>

                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                    <button
                      onClick={() =>
                        loadStudents(
                          cls,
                          "take"
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto"
                    >

                      <FaPlus />

                      Take

                    </button>

                    <button
                      onClick={() =>
                        loadStudents(
                          cls,
                          "view"
                        )
                      }
                      className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto"
                    >

                      <FaEye />

                      View

                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

          {/* ATTENDANCE AREA */}

          {selectedClass && (

            <div className="p-3 sm:p-6">

              {/* CLASS INFO */}

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-5 flex items-center gap-3">

                <div className="bg-blue-600 text-white p-3 rounded-xl">

                  <FaUsers />

                </div>

                <div>

                  <h2 className="font-bold text-lg sm:text-2xl">

                    Class :
                    {" "}
                    {selectedClass.className}

                  </h2>

                  <p className="text-sm text-gray-600 mt-1">

                    {mode === "take"
                      ? "You are creating attendance for this class"
                      : "You are viewing attendance"}

                  </p>

                </div>

              </div>

              {/* BACK */}

              <button
                onClick={goBack}
                className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-xl flex items-center gap-2 mb-6 text-sm sm:text-base"
              >

                <FaArrowLeft />

                Back

              </button>

              {/* FILTERS */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-5">

                {/* DATE */}

                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) =>
                    setAttendanceDate(
                      e.target.value
                    )
                  }
                  className="border p-3 rounded-xl w-full"
                />

                {/* SECTION */}

                <select
                  value={selectedSection}
                  onChange={(e) =>
                    handleSectionChange(
                      e.target.value
                    )
                  }
                  className="border p-3 rounded-xl w-full"
                >

                  <option value="">
                    Select Section
                  </option>

                  {sections.map((sec) => (

                    <option
                      key={sec.id}
                      value={
                        sec.sectionName
                      }
                    >

                      {sec.sectionName}

                    </option>
                  ))}

                </select>

                {/* SEARCH */}

                <input
                  type="text"
                  placeholder="Search Student"
                  value={searchText}
                  onChange={(e) =>
                    setSearchText(
                      e.target.value
                    )
                  }
                  className="border p-3 rounded-xl w-full"
                />

                {/* VIEW LOAD BUTTON */}

                {mode === "view" && (

                  <button
                    onClick={
                      loadAttendance
                    }
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 py-3 w-full"
                  >

                    Load Attendance

                  </button>
                )}

                {/* QR BUTTON ONLY IN TAKE MODE */}

                {mode === "take" && (

                  <button
                    onClick={() =>
                      setShowQrBox(
                        !showQrBox
                      )
                    }
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4 py-3 flex items-center justify-center gap-2 w-full"
                  >

                    <FaQrcode />

                    QR Attendance

                  </button>
                )}

              </div>

              {/* QR BOX */}

              {mode === "take" &&
                showQrBox && (

                <div className="bg-green-50 border border-green-300 rounded-2xl p-4 sm:p-5 mb-6">

                  <h3 className="font-bold text-base sm:text-lg mb-3">

                    Scan QR / Enter Student ID

                  </h3>

                  <div className="flex flex-col sm:flex-row gap-3">

                    <input
                      type="text"
                      placeholder="Enter Student ID"
                      value={qrStudentId}
                      onChange={(e) =>
                        setQrStudentId(
                          e.target.value
                        )
                      }
                      className="border p-3 rounded-xl flex-1"
                    />

                    <button
                      onClick={
                        handleQrAttendance
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
                    >

                      Mark Present

                    </button>

                  </div>

                </div>
              )}

              {/* TAKEN INFO */}

              {takenInfo && (

                <div className="bg-yellow-100 border border-yellow-300 rounded-2xl p-4 mb-5 text-center text-sm sm:text-base">

                  Attendance already created by

                  <b>
                    {" "}
                    {takenInfo.takenBy}
                  </b>

                  {" "}
                  (
                  {takenInfo.role}
                  )

                </div>
              )}

              {/* STUDENTS */}

              <div className="space-y-4">

                {filteredStudents.map((stu) => (

                  <div
                    key={stu.id}
                    className="bg-gray-50 rounded-2xl shadow-sm border p-4 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4"
                  >

                    {/* LEFT */}

                    <div className="flex items-center gap-4 min-w-0">

                      <img
                        src={
                          stu.profileImage ||
                          "https://via.placeholder.com/100"
                        }
                        alt=""
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border shrink-0"
                      />

                      <div className="min-w-0">

                        <h3 className="font-bold text-base sm:text-lg break-words">

                          {stu.fullName ||
                            `${stu.studName} ${stu.studLastName}`}

                        </h3>

                        <p className="text-xs sm:text-sm text-gray-600 break-all">

                          Student ID :
                          {" "}
                          {stu.studentId}

                        </p>

                        <p className="text-xs sm:text-sm text-gray-600">

                          Roll :
                          {" "}
                          {stu.studRollNo}

                        </p>

                        <p className="text-xs sm:text-sm text-gray-600">

                          Section :
                          {" "}
                          {stu.section}

                        </p>

                        <p className="text-xs sm:text-sm text-gray-600 break-all">

                          {stu.email}

                        </p>

                      </div>

                    </div>

                    {/* RIGHT */}

                    <div className="w-full lg:w-auto">

                      {mode === "take" ? (

                        <select
                          value={
                            attendance[
                              stu.id
                            ]
                          }
                          onChange={(e) =>
                            handleChange(
                              stu.id,
                              e.target.value
                            )
                          }
                          className={`border rounded-xl px-4 py-3 font-bold w-full lg:w-auto ${
                            attendance[
                              stu.id
                            ] === "P"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >

                          <option value="P">
                            Present
                          </option>

                          <option value="A">
                            Absent
                          </option>

                        </select>

                      ) : (

                        <div
                          className={`px-5 py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 w-full lg:w-auto ${
                            attendance[
                              stu.id
                            ] === "P"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        >

                          <FaCheckCircle />

                          {attendance[
                            stu.id
                          ] === "P"
                            ? "Present"
                            : "Absent"}

                        </div>
                      )}

                    </div>

                  </div>
                ))}

              </div>

              {/* SAVE */}

              {mode === "take" && (

                <div className="text-center mt-8">

                  <button
                    onClick={
                      handleSubmit
                    }
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-8 sm:px-12 py-4 rounded-2xl text-base sm:text-lg font-bold"
                  >

                    {loading
                      ? "Saving..."
                      : "Save Attendance"}

                  </button>

                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default StuAttendance;