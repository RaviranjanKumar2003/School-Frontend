import React, {
  useEffect,
  useState,
  useMemo,
} from "react";

import axios from "axios";

import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaUserTie,
  FaPercentage,
  FaClipboardCheck,
  FaSearch,
  FaCalendarDay,
  FaUserClock,
  FaChartLine,
} from "react-icons/fa";

const BASE_URL =
  "http://localhost:8080/api";

function MyAttendance() {

  // =========================================================
  // STATES
  // =========================================================

  const [attendance, setAttendance] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [searchDate, setSearchDate] =
    useState("");

  const [userInfo, setUserInfo] =
    useState(null);

  // =========================================================
  // GET USER
  // =========================================================

  useEffect(() => {

    const role =
      localStorage
        .getItem("userRole")
        ?.toLowerCase();

    // ================= STUDENT =================

    if (role === "student") {

      const studentData =
        JSON.parse(
          localStorage.getItem(
            "studentData"
          )
        );

      setUserInfo({

        role: "student",

        id: studentData?.id,

        name:
          studentData?.fullName ||
          `${studentData?.studfirstName || ""} ${studentData?.studlastName || ""}`,

        studentId:
          studentData?.studentId,

        image:
          studentData?.profileImage
            ? `${BASE_URL}/students/image/get/${studentData?.id}`
            : null,
      });
    }

    // ================= TEACHER =================

    else if (
      role === "teacher" ||
      role === "professor"
    ) {

      const teacherData =
        JSON.parse(
          localStorage.getItem(
            "professorData"
          )
        );

      setUserInfo({

        role: "teacher",

        id: teacherData?.id,

        name:
          teacherData?.name ||
          teacherData?.professorName,

        image:
          teacherData?.profileImage
            ? `${BASE_URL}/professors/image/${teacherData?.id}`
            : null,
      });
    }

    // ================= HOD =================

    else if (role === "hod") {

      const hodData =
        JSON.parse(
          localStorage.getItem(
            "hodData"
          )
        );

      setUserInfo({

        role: "hod",

        id: hodData?.id,

        name:
          hodData?.name ||
          hodData?.hodName,

        image:
          hodData?.profileImage
            ? `${BASE_URL}/hod/image/${hodData?.id}`
            : null,
      });
    }

  }, []);

  // =========================================================
  // FETCH ATTENDANCE
  // =========================================================

  // =========================================================
// FETCH ATTENDANCE
// =========================================================

const fetchAttendance =
  async (date = "") => {

    if (!userInfo) return;

    try {

      setLoading(true);

      let url = "";

      // =====================================================
      // STUDENT
      // =====================================================

      if (
        userInfo.role === "student"
      ) {

        url =
          `${BASE_URL}/stu-attendance/student/${userInfo.id}`;

        if (date) {

          url +=
            `?attendanceDate=${date}`;
        }
      }

      // =====================================================
      // TEACHER
      // =====================================================

      else if (
        userInfo.role === "teacher"
      ) {

        url =
          `${BASE_URL}/attendance/teacher/my-attendance`;

        url +=
          `?teacherId=${userInfo.id}`;

        if (date) {

          url +=
            `&attendanceDate=${date}`;
        }
      }

      // =====================================================
      // HOD
      // =====================================================

      else if (
        userInfo.role === "hod"
      ) {

        // =============================
        // DATE WISE
        // =============================

        if (date) {

          url =
            `${BASE_URL}/hod-attendance/date/${date}`;

          const res =
            await axios.get(url);

          let data =
            Array.isArray(res.data)
              ? res.data
              : [];

          // FILTER CURRENT HOD

          data = data.filter(
            (item) =>
              Number(item.hodId) ===
              Number(userInfo.id)
          );

          data = data.map(
            (item) => ({

              ...item,

              markedBy:
                item.createdByName ||
                item.updatedByName ||
                item.markedBy ||
                "N/A",
            })
          );

          setAttendance(data);

          return;
        }

        // =============================
        // ALL HOD ATTENDANCE
        // =============================

        url =
          `${BASE_URL}/hod-attendance/hod/${userInfo.id}`;
      }

      // =====================================================
      // API CALL
      // =====================================================

      const res =
        await axios.get(url);

      let data =
        Array.isArray(res.data)
          ? res.data
          : [];

      // =====================================================
      // STUDENT DATE FILTER
      // =====================================================

      if (
        date &&
        userInfo.role === "student"
      ) {

        data = data.filter(
          (item) =>
            item.attendanceDate ===
            date
        );
      }

      // =====================================================
      // COMMON MARKED BY
      // =====================================================

      data = data.map(
        (item) => ({

          ...item,

          markedBy:
            item.createdByName ||
            item.updatedByName ||
            item.takenByName ||
            item.teacherName ||
            item.professorName ||
            item.markedBy ||
            "N/A",
        })
      );

      setAttendance(data);

    } catch (err) {

      console.error(
        "Attendance Error => ",
        err
      );

      setAttendance([]);

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {

    if (userInfo) {

      // =============================================
      // STUDENT => EMPTY BY DEFAULT
      // =============================================

      if (
        userInfo.role === "student"
      ) {

        setAttendance([]);

        return;
      }

      // =============================================
      // TEACHER / HOD => LOAD ALL
      // =============================================

      fetchAttendance();
    }

  }, [userInfo]);

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch =
    async () => {

      if (!searchDate) {

        alert(
          "Please select date"
        );

        return;
      }

      await fetchAttendance(
        searchDate
      );
    };

  // =========================================================
  // CLEAR
  // =========================================================

  const clearFilter =
    async () => {

      setSearchDate("");

      // =============================================
      // STUDENT => EMPTY
      // =============================================

      if (
        userInfo?.role ===
        "student"
      ) {

        setAttendance([]);

        return;
      }

      // =============================================
      // OTHERS => RELOAD
      // =============================================

      await fetchAttendance();
    };

  // =========================================================
  // STATS
  // =========================================================

  const totalDays =
    attendance.length;

  const presentDays =
    attendance.filter(
      (a) =>
        a.status === "P"
    ).length;

  const absentDays =
    attendance.filter(
      (a) =>
        a.status === "A"
    ).length;

  const percentage =
    totalDays > 0
      ? (
          (presentDays /
            totalDays) *
          100
        ).toFixed(1)
      : 0;

  // =========================================================
  // ROLE ICON
  // =========================================================

  const getRoleIcon =
    () => {

      if (
        userInfo?.role ===
        "student"
      ) {

        return (
          <FaUserGraduate />
        );
      }

      if (
        userInfo?.role ===
        "teacher"
      ) {

        return (
          <FaChalkboardTeacher />
        );
      }

      return <FaUserTie />;
    };

  // =========================================================
  // ROLE LABEL
  // =========================================================

  const roleLabel =
    useMemo(() => {

      if (
        userInfo?.role ===
        "student"
      ) {

        return "Student";
      }

      if (
        userInfo?.role ===
        "teacher"
      ) {

        return "Teacher";
      }

      return "HOD";

    }, [userInfo]);

  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 lg:p-6">

      <div className="max-w-7xl mx-auto">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 shadow-2xl">

          <div className="absolute inset-0 opacity-10">

            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />

            <div className="absolute bottom-0 right-0 w-56 h-56 bg-white rounded-full blur-3xl" />

          </div>

          <div className="relative p-4 sm:p-6 lg:p-8">

            <div className="flex flex-col xl:flex-row gap-6 xl:items-center xl:justify-between">

              {/* USER */}

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">

                <div className="text-white">

                  <h1 className="text-3xl sm:text-4xl font-black">

                    My Attendance

                  </h1>

                  <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 text-lg text-indigo-100">

                    {getRoleIcon()}

                    <span>

                      {userInfo?.name}

                    </span>

                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">

                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-semibold">

                      {roleLabel}

                    </div>

                    {userInfo?.studentId && (

                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl text-sm font-semibold">

                        ID :
                        {" "}
                        {userInfo?.studentId}

                      </div>

                    )}

                  </div>

                </div>

              </div>

              {/* STATS */}

              <div className="grid grid-cols-2 gap-4 w-full xl:w-auto">

                <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-4 min-w-[150px] text-white shadow-lg">

                  <div className="flex items-center gap-2 text-sm opacity-90 mb-2">

                    <FaCalendarDay />

                    Total

                  </div>

                  <h2 className="text-3xl font-black">

                    {totalDays}

                  </h2>

                </div>

                <div className="bg-green-500 rounded-3xl p-4 text-white shadow-lg">

                  <div className="flex items-center gap-2 text-sm mb-2">

                    <FaCheckCircle />

                    Present

                  </div>

                  <h2 className="text-3xl font-black">

                    {presentDays}

                  </h2>

                </div>

                <div className="bg-red-500 rounded-3xl p-4 text-white shadow-lg">

                  <div className="flex items-center gap-2 text-sm mb-2">

                    <FaTimesCircle />

                    Absent

                  </div>

                  <h2 className="text-3xl font-black">

                    {absentDays}

                  </h2>

                </div>

                <div className="bg-yellow-400 rounded-3xl p-4 text-gray-900 shadow-lg">

                  <div className="flex items-center gap-2 text-sm mb-2">

                    <FaChartLine />

                    Percentage

                  </div>

                  <h2 className="text-3xl font-black">

                    {percentage}%

                  </h2>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* SEARCH */}
        {/* ================================================= */}

        <div className="bg-white rounded-[28px] shadow-xl mt-5 p-4 sm:p-6">

          <div className="flex flex-col lg:flex-row gap-4">

            <div className="flex-1 relative">

              <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

              <input
                type="date"
                value={searchDate}
                onChange={(e) =>
                  setSearchDate(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              />

            </div>

            <button
              onClick={handleSearch}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all text-white px-6 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
            >

              <FaSearch />

              Search

            </button>

            <button
              onClick={clearFilter}
              className="bg-gray-800 hover:bg-black active:scale-[0.98] transition-all text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg"
            >

              Clear

            </button>

          </div>

        </div>

        {/* ================================================= */}
        {/* LOADING */}
        {/* ================================================= */}

        {loading && (

          <div className="bg-white rounded-[28px] shadow-xl mt-5 p-10 text-center">

            <div className="animate-pulse text-indigo-600 text-lg sm:text-xl font-bold">

              Loading Attendance...

            </div>

          </div>

        )}

        {/* ================================================= */}
        {/* LIST */}
        {/* ================================================= */}

        {!loading && (

          <div className="mt-5 space-y-4">

            {attendance.length === 0 ? (

              <div className="bg-white rounded-[28px] shadow-xl p-8 sm:p-12 text-center">

                <div className="flex justify-center text-6xl text-gray-300 mb-5">

                  <FaClipboardCheck />

                </div>

                <h2 className="text-2xl font-bold text-gray-700">

                  No Attendance Found

                </h2>

              </div>

            ) : (

              attendance.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={index}
                    className="bg-white rounded-[28px] shadow-lg border border-gray-100 p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 hover:shadow-2xl transition-all duration-300"
                  >

                    {/* LEFT */}

                    <div className="flex items-center gap-4">

                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg ${
                          item.status === "P"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >

                        {item.status === "P"
                          ? (
                            <FaCheckCircle />
                          )
                          : (
                            <FaTimesCircle />
                          )}

                      </div>

                      <div>

                        <h2 className="text-xl font-bold text-gray-800">

                          {item.status === "P"
                            ? "Present"
                            : "Absent"}

                        </h2>

                        <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm sm:text-base">

                          <FaCalendarAlt />

                          {item.attendanceDate}

                        </p>

                      </div>

                    </div>

                    {/* RIGHT */}

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">

                      <div
                        className={`px-5 py-3 rounded-2xl text-white font-bold text-center shadow-md ${
                          item.status === "P"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >

                        {item.status === "P"
                          ? "Present"
                          : "Absent"}

                      </div>

                      {/* MARKED BY */}

                      <div className="bg-indigo-100 text-indigo-700 px-5 py-3 rounded-2xl font-semibold flex items-center gap-2 text-sm sm:text-base">

                        <FaUserClock />

                        <span className="break-all">

                          Marked By :
                          {" "}

                          {item.markedBy}

                        </span>

                      </div>

                    </div>

                  </div>
                )
              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default MyAttendance;