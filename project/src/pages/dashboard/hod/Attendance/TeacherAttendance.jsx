import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function TeacherAttendance() {

  // =====================================================
  // ====================== STATES ========================
  // =====================================================

  const [teachers, setTeachers] =
    useState([]);

  const [attendance, setAttendance] =
    useState({});

  const [viewData, setViewData] =
    useState([]);

  const [date, setDate] = useState(
    new Date()
      .toISOString()
      .split("T")[0]
  );

  const [mode, setMode] =
    useState("take");

  const [loading, setLoading] =
    useState(false);

  const [viewLoading, setViewLoading] =
    useState(false);

  // =====================================================
  // ================= LOGIN USER =========================
  // =====================================================

  const hodDataRaw =
    localStorage.getItem("hodData");

  const schoolAdminRaw =
    localStorage.getItem(
      "schoolAdminData"
    );

  const hodData = hodDataRaw
    ? JSON.parse(hodDataRaw)
    : null;

  const schoolAdminData =
    schoolAdminRaw
      ? JSON.parse(schoolAdminRaw)
      : null;

  const loginUser =
    hodData || schoolAdminData;

  // =====================================================
  // ================= SAFE IDS ===========================
  // =====================================================

  const schoolId = Number(

    loginUser?.school?.id ||

    loginUser?.schoolId ||

    0
  );

  const loginUserId = Number(
    loginUser?.id || 0
  );

  const loginRole =
    hodData
      ? "HOD"
      : "SCHOOL_ADMIN";

  // =====================================================
  // ================= LOAD TEACHERS ======================
  // =====================================================

  useEffect(() => {

    if (!schoolId) return;

    fetchTeachers();

  }, [schoolId]);

  // =====================================================
  // ================= FETCH TEACHERS =====================
  // =====================================================

  const fetchTeachers = async () => {

    try {

      setLoading(true);

      const res =
        await axios.get(

          `http://localhost:8080/api/professors?schoolId=${schoolId}`

        );

      setTeachers(res.data || []);

      const initial = {};

      (res.data || []).forEach((t) => {

        initial[t.id] = "P";

      });

      setAttendance(initial);

    } catch (err) {

      console.log(
        "TEACHER FETCH ERROR => ",
        err
      );

      alert(
        "Error fetching teachers"
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // ================= CHANGE ATTENDANCE ==================
  // =====================================================

  const handleChange = (
    teacherId,
    status
  ) => {

    setAttendance((prev) => ({

      ...prev,

      [teacherId]: status,
    }));
  };

  // =====================================================
  // ================= SAVE ATTENDANCE ====================
  // =====================================================

  const saveAttendance = async (
    forceUpdate = false
  ) => {

    if (!date) {

      alert(
        "Please select date"
      );

      return;
    }

    try {

      setLoading(true);

      const payload =
        teachers.map((t) => ({

          teacherId: Number(
            t.id
          ),

          status:
            attendance[t.id] || "P",

          attendanceDate:
            date,

          createdBy:
            loginUserId,

          createdByRole:
            loginRole,

          createdByName:
            loginUser?.name ||
            "Unknown",

          updatedBy:
            loginUserId,

          updatedByRole:
            loginRole,

          updatedByName:
            loginUser?.name ||
            "Unknown",
        }));

      const url =

        `http://localhost:8080/api/attendance/teacher/save?schoolId=${schoolId}&forceUpdate=${forceUpdate}`;

      const res =
        await axios.post(
          url,
          payload
        );

      // UPDATE CONFIRM

      if (

        typeof res.data ===
          "string" &&

        res.data.includes(
          "Do you want to update?"
        )

      ) {

        const confirmUpdate =
          window.confirm(
            res.data
          );

        if (confirmUpdate) {

          await saveAttendance(
            true
          );
        }

        return;
      }

      alert(res.data);

      setMode("view");

      fetchAttendance();

    } catch (err) {

      console.log(
        "SAVE ERROR => ",
        err
      );

      alert(

        err?.response?.data ||

        "Error saving attendance"
      );

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // ================= FETCH ATTENDANCE ===================
  // =====================================================

  const fetchAttendance = async () => {

    if (!date) {

      alert(
        "Please select date"
      );

      return;
    }

    try {

      setViewLoading(true);

      const url =

        `http://localhost:8080/api/attendance/teacher?schoolId=${schoolId}&attendanceDate=${date}`;

      const res =
        await axios.get(url);

      const merged =
        (res.data || []).map((a) => {

          const teacher =
            teachers.find(
              (t) =>
                Number(t.id) ===
                Number(a.teacherId)
            );

          return {

            ...a,

            name:

              a.teacherName ||

              teacher?.name ||

              "No Name",

            email:

              a.teacherEmail ||

              teacher?.email ||

              "-",
          };
        });

      setViewData(merged);

    } catch (err) {

      console.log(
        "FETCH ERROR => ",
        err
      );

      alert(

        err?.response?.data ||

        "Error fetching attendance"
      );

    } finally {

      setViewLoading(false);
    }
  };

  // =====================================================
  // ================= TAKE COUNTS ========================
  // =====================================================

  const presentCount =
    Object.values(attendance)
      .filter(
        (s) => s === "P"
      ).length;

  const absentCount =
    Object.values(attendance)
      .filter(
        (s) => s === "A"
      ).length;

  // =====================================================
  // ================= VIEW COUNTS ========================
  // =====================================================

  const viewPresentCount =
    useMemo(() => {

      return viewData.filter(
        (v) => v.status === "P"
      ).length;

    }, [viewData]);

  const viewAbsentCount =
    useMemo(() => {

      return viewData.filter(
        (v) => v.status === "A"
      ).length;

    }, [viewData]);

  // =====================================================
  // ====================== UI ============================
  // =====================================================

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-100
        via-blue-50
        to-purple-100
        p-2
        sm:p-4
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          bg-white/90
          backdrop-blur-xl
          rounded-[32px]
          overflow-hidden
          shadow-2xl
          border
          border-white
        "
      >

        {/* ================================================= */}
        {/* ===================== HEADER ==================== */}
        {/* ================================================= */}

        <div
          className="
            bg-gradient-to-r
            from-blue-700
            via-indigo-700
            to-purple-700
            p-5
            sm:p-8
            text-white
            relative
            overflow-hidden
          "
        >

          <div
            className="
              absolute
              top-0
              right-0
              h-52
              w-52
              rounded-full
              bg-white/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              flex
              flex-col
              xl:flex-row
              xl:items-center
              xl:justify-between
              gap-6
            "
          >

            {/* LEFT */}

            <div>

              <h1
                className="
                  text-2xl
                  sm:text-4xl
                  font-black
                  tracking-tight
                "
              >

                Teacher Attendance

              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  sm:text-base
                  text-blue-100
                "
              >

                Smart attendance management dashboard

              </p>

            </div>

            {/* RIGHT */}

            <div
              className="
                grid
                grid-cols-3
                gap-3
                w-full
                xl:w-auto
              "
            >

              {/* TOTAL */}

              <div
                className="
                  bg-white/15
                  backdrop-blur-xl
                  rounded-3xl
                  px-5
                  py-4
                  text-center
                  border
                  border-white/20
                "
              >

                <div
                  className="
                    text-2xl
                    font-black
                  "
                >

                  {mode === "take"
                    ? teachers.length
                    : viewData.length}

                </div>

                <div
                  className="
                    text-xs
                    mt-1
                    text-blue-100
                  "
                >

                  Total

                </div>

              </div>

              {/* PRESENT */}

              <div
                className="
                  bg-green-500/20
                  rounded-3xl
                  px-5
                  py-4
                  text-center
                  border
                  border-green-300/20
                "
              >

                <div
                  className="
                    text-2xl
                    font-black
                  "
                >

                  {mode === "take"
                    ? presentCount
                    : viewPresentCount}

                </div>

                <div
                  className="
                    text-xs
                    mt-1
                  "
                >

                  Present

                </div>

              </div>

              {/* ABSENT */}

              <div
                className="
                  bg-red-500/20
                  rounded-3xl
                  px-5
                  py-4
                  text-center
                  border
                  border-red-300/20
                "
              >

                <div
                  className="
                    text-2xl
                    font-black
                  "
                >

                  {mode === "take"
                    ? absentCount
                    : viewAbsentCount}

                </div>

                <div
                  className="
                    text-xs
                    mt-1
                  "
                >

                  Absent

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* ===================== TOP BAR =================== */}
        {/* ================================================= */}

        <div
          className="
            p-4
            sm:p-5
            bg-white
            border-b
          "
        >

          <div
            className="
              flex
              flex-col
              xl:flex-row
              xl:items-center
              xl:justify-between
              gap-4
            "
          >

            {/* MODE */}

            <div
              className="
                bg-gray-100
                rounded-2xl
                p-1
                flex
                w-full
                sm:w-fit
              "
            >

              <button
                onClick={() =>
                  setMode("take")
                }
                className={`
                  flex-1
                  sm:flex-none
                  px-5
                  py-3
                  rounded-2xl
                  text-sm
                  font-bold
                  transition-all
                  ${
                    mode === "take"
                      ? `
                        bg-gradient-to-r
                        from-blue-600
                        to-indigo-600
                        text-white
                        shadow-lg
                      `
                      : `
                        text-gray-700
                      `
                  }
                `}
              >

                Take Attendance

              </button>

              <button
                onClick={() =>
                  setMode("view")
                }
                className={`
                  flex-1
                  sm:flex-none
                  px-5
                  py-3
                  rounded-2xl
                  text-sm
                  font-bold
                  transition-all
                  ${
                    mode === "view"
                      ? `
                        bg-gradient-to-r
                        from-purple-600
                        to-pink-600
                        text-white
                        shadow-lg
                      `
                      : `
                        text-gray-700
                      `
                  }
                `}
              >

                View Attendance

              </button>

            </div>

            {/* RIGHT */}

            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-3
                w-full
                xl:w-auto
              "
            >

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(
                    e.target.value
                  )
                }
                className="
                  border
                  border-gray-300
                  rounded-2xl
                  px-4
                  py-3
                  text-sm
                  focus:ring-2
                  focus:ring-blue-500
                  outline-none
                  bg-white
                "
              />

              {mode === "view" && (

                <button
                  onClick={
                    fetchAttendance
                  }
                  disabled={viewLoading}
                  className="
                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600
                    text-white
                    px-6
                    py-3
                    rounded-2xl
                    text-sm
                    font-bold
                    shadow-lg
                    whitespace-nowrap
                  "
                >

                  {viewLoading
                    ? "Loading..."
                    : "Show Attendance"}

                </button>
              )}

            </div>

          </div>

        </div>

        {/* ================================================= */}
        {/* ================= TAKE MODE ===================== */}
        {/* ================================================= */}

        {mode === "take" && (

          <div className="p-3 sm:p-5">

            {loading ? (

              <div
                className="
                  flex
                  justify-center
                  items-center
                  py-24
                "
              >

                <div
                  className="
                    h-14
                    w-14
                    border-4
                    border-blue-600
                    border-t-transparent
                    rounded-full
                    animate-spin
                  "
                />

              </div>

            ) : (

              <>
                <div
                  className="
                    grid
                    grid-cols-1
                    xl:grid-cols-2
                    gap-4
                  "
                >

                  {teachers.map((t, i) => (

                    <div
                      key={t.id}
                      className="
                        bg-white
                        rounded-[28px]
                        border
                        border-gray-200
                        p-4
                        sm:p-5
                        shadow-sm
                        hover:shadow-xl
                        transition-all
                      "
                    >

                      <div
                        className="
                          flex
                          justify-between
                          gap-4
                        "
                      >

                        {/* LEFT */}

                        <div
                          className="
                            flex
                            gap-3
                            min-w-0
                          "
                        >

                          <div
                            className="
                              h-14
                              w-14
                              rounded-2xl
                              bg-gradient-to-r
                              from-blue-600
                              to-purple-600
                              text-white
                              flex
                              items-center
                              justify-center
                              font-black
                              shrink-0
                            "
                          >

                            {i + 1}

                          </div>

                          <div className="min-w-0">

                            <h2
                              className="
                                font-bold
                                text-gray-800
                                text-sm
                                sm:text-base
                                truncate
                              "
                            >

                              {t.name}

                            </h2>

                            <p
                              className="
                                text-xs
                                text-gray-500
                                mt-1
                                break-all
                              "
                            >

                              {t.email}

                            </p>

                          </div>

                        </div>

                        {/* RIGHT */}

                        <div
                          className="
                            flex
                            flex-col
                            gap-2
                          "
                        >

                          <button
                            onClick={() =>
                              handleChange(
                                t.id,
                                "P"
                              )
                            }
                            className={`
                              px-4
                              py-2
                              rounded-xl
                              text-xs
                              font-bold
                              transition
                              ${
                                attendance[
                                  t.id
                                ] === "P"
                                  ? `
                                    bg-green-600
                                    text-white
                                  `
                                  : `
                                    bg-gray-200
                                    text-gray-700
                                  `
                              }
                            `}
                          >

                            Present

                          </button>

                          <button
                            onClick={() =>
                              handleChange(
                                t.id,
                                "A"
                              )
                            }
                            className={`
                              px-4
                              py-2
                              rounded-xl
                              text-xs
                              font-bold
                              transition
                              ${
                                attendance[
                                  t.id
                                ] === "A"
                                  ? `
                                    bg-red-600
                                    text-white
                                  `
                                  : `
                                    bg-gray-200
                                    text-gray-700
                                  `
                              }
                            `}
                          >

                            Absent

                          </button>

                        </div>

                      </div>

                    </div>
                  ))}

                </div>

                {/* SUBMIT */}

                <div className="mt-6">

                  <button
                    onClick={() =>
                      saveAttendance(
                        false
                      )
                    }
                    disabled={loading}
                    className="
                      w-full
                      bg-gradient-to-r
                      from-blue-600
                      via-purple-600
                      to-indigo-600
                      text-white
                      py-4
                      rounded-3xl
                      font-black
                      text-base
                      shadow-xl
                    "
                  >

                    {loading
                      ? "Saving Attendance..."
                      : "Submit Attendance"}

                  </button>

                </div>

              </>
            )}

          </div>
        )}

        {/* ================================================= */}
        {/* ================= VIEW MODE ===================== */}
        {/* ================================================= */}

        {/* ================================================= */}
{/* ================= VIEW MODE ===================== */}
{/* ================================================= */}

{mode === "view" && (

  <div className="p-3 sm:p-5">

    {/* EMPTY */}

    {viewData.length === 0 &&
      !viewLoading && (

      <div
        className="
          bg-white
          rounded-3xl
          border
          p-12
          text-center
          text-gray-500
        "
      >

        No Attendance Found

      </div>
    )}

    {/* LOADING */}

    {viewLoading && (

      <div
        className="
          flex
          justify-center
          py-20
        "
      >

        <div
          className="
            h-14
            w-14
            border-4
            border-purple-600
            border-t-transparent
            rounded-full
            animate-spin
          "
        />

      </div>
    )}

    {/* INFO */}

    {viewData.length > 0 &&
      !viewLoading && (

      <>

        {/* ================= INFO CARD ================= */}

        <div
          className="
            bg-gradient-to-r
            from-blue-50
            via-indigo-50
            to-purple-50
            border
            border-blue-100
            rounded-[30px]
            p-5
            sm:p-6
            mb-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              flex-wrap
              gap-3
            "
          >

            <div>

              <h2
                className="
                  text-xl
                  font-black
                  text-blue-700
                "
              >

                Attendance Information

              </h2>

              <p
                className="
                  text-sm
                  text-gray-500
                  mt-1
                "
              >

                Complete attendance audit details

              </p>

            </div>

            <div
              className="
                px-4
                py-2
                rounded-2xl
                bg-white
                border
                shadow-sm
                text-sm
                font-bold
                text-gray-700
              "
            >

              {viewData[0]?.attendanceDate}

            </div>

          </div>

          {/* ================= DETAILS ================= */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-4
              mt-6
            "
          >

            {/* CREATED BY */}

            <div
              className="
                bg-white/80
                backdrop-blur-xl
                rounded-3xl
                p-5
                border
                border-blue-100
                shadow-sm
              "
            >

              <div
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-blue-600
                  font-bold
                "
              >

                Created By

              </div>

              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    h-12
                    w-12
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-600
                    to-indigo-600
                    text-white
                    flex
                    items-center
                    justify-center
                    font-black
                    text-lg
                  "
                >

                  {viewData[0]
                    ?.createdByName?.charAt(0)
                    ?.toUpperCase() || "U"}

                </div>

                <div>

                  <div
                    className="
                      font-black
                      text-gray-800
                      text-base
                    "
                  >

                    {viewData[0]
                      ?.createdByName || "-"}

                  </div>

                  <div
                    className="
                      text-sm
                      text-blue-600
                      font-semibold
                      mt-1
                    "
                  >

                    {viewData[0]
                      ?.createdByRole || "-"}

                  </div>

                </div>

              </div>

            </div>

            {/* UPDATED BY */}
            {/* ONLY SHOW IF UPDATED */}

            {viewData[0]?.updatedByName &&
              viewData[0]?.updatedByName !==
              viewData[0]?.createdByName && (

              <div
                className="
                  bg-white/80
                  backdrop-blur-xl
                  rounded-3xl
                  p-5
                  border
                  border-purple-100
                  shadow-sm
                "
              >

                <div
                  className="
                    text-xs
                    uppercase
                    tracking-wider
                    text-purple-600
                    font-bold
                  "
                >

                  Updated By

                </div>

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-3
                  "
                >

                  <div
                    className="
                      h-12
                      w-12
                      rounded-2xl
                      bg-gradient-to-r
                      from-purple-600
                      to-pink-600
                      text-white
                      flex
                      items-center
                      justify-center
                      font-black
                      text-lg
                    "
                  >

                    {viewData[0]
                      ?.updatedByName?.charAt(0)
                      ?.toUpperCase() || "U"}

                  </div>

                  <div>

                    <div
                      className="
                        font-black
                        text-gray-800
                        text-base
                      "
                    >

                      {viewData[0]
                        ?.updatedByName || "-"}

                    </div>

                    <div
                      className="
                        text-sm
                        text-purple-600
                        font-semibold
                        mt-1
                      "
                    >

                      {viewData[0]
                        ?.updatedByRole || "-"}

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* DATE */}

            <div
              className="
                bg-white/80
                backdrop-blur-xl
                rounded-3xl
                p-5
                border
                border-green-100
                shadow-sm
              "
            >

              <div
                className="
                  text-xs
                  uppercase
                  tracking-wider
                  text-green-600
                  font-bold
                "
              >

                Attendance Date

              </div>

              <div
                className="
                  mt-4
                  text-2xl
                  font-black
                  text-gray-800
                "
              >

                {viewData[0]
                  ?.attendanceDate || "-"}

              </div>

              <div
                className="
                  text-sm
                  text-gray-500
                  mt-1
                "
              >

                Official attendance record

              </div>

            </div>

          </div>

        </div>

        {/* ================= LIST ================= */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-4
          "
        >

          {viewData.map((a, i) => (

            <div
              key={i}
              className="
                bg-white
                border
                border-gray-200
                rounded-[30px]
                p-5
                shadow-sm
                hover:shadow-xl
                transition-all
                duration-300
              "
            >

              <div
                className="
                  flex
                  justify-between
                  items-start
                  gap-4
                "
              >

                {/* LEFT */}

                <div
                  className="
                    flex
                    gap-3
                    min-w-0
                  "
                >

                  <div
                    className="
                      h-14
                      w-14
                      rounded-2xl
                      bg-gradient-to-r
                      from-purple-600
                      to-pink-600
                      text-white
                      flex
                      items-center
                      justify-center
                      font-black
                      shrink-0
                    "
                  >

                    {i + 1}

                  </div>

                  <div className="min-w-0">

                    <h3
                      className="
                        font-black
                        text-gray-800
                        text-base
                        truncate
                      "
                    >

                      {a.name}

                    </h3>

                    <p
                      className="
                        text-xs
                        text-gray-500
                        mt-1
                        break-all
                      "
                    >

                      {a.email}

                    </p>

                  </div>

                </div>

                {/* STATUS */}

                <div>

                  <span
                    className={`
                      px-4
                      py-2
                      rounded-2xl
                      text-xs
                      font-black
                      shadow-sm
                      ${
                        a.status === "P"
                          ? `
                            bg-green-100
                            text-green-700
                          `
                          : `
                            bg-red-100
                            text-red-700
                          `
                      }
                    `}
                  >

                    {a.status === "P"
                      ? "Present"
                      : "Absent"}

                  </span>

                </div>

              </div>

            </div>
          ))}

        </div>

      </>
    )}

  </div>
)}

      </div>

    </div>
  );
}