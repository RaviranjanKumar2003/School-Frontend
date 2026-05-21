import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

export default function HODAttendance() {

  // =====================================================
  // ====================== STATES ========================
  // =====================================================

  const [hods, setHods] =
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

  const schoolAdminRaw =
    localStorage.getItem(
      "schoolAdminData"
    );

  const principalRaw =
    localStorage.getItem(
      "principalData"
    );

  const hodRaw =
    localStorage.getItem(
      "hodData"
    );

  const schoolAdminData =
    schoolAdminRaw
      ? JSON.parse(schoolAdminRaw)
      : null;

  const principalData =
    principalRaw
      ? JSON.parse(principalRaw)
      : null;

  const hodData =
    hodRaw
      ? JSON.parse(hodRaw)
      : null;

  const loginUser =
    schoolAdminData ||
    principalData ||
    hodData;

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
    schoolAdminData
      ? "SCHOOL_ADMIN"
      : principalData
      ? "PRINCIPAL"
      : "HOD";

  // =====================================================
  // ================= LOAD HODS ==========================
  // =====================================================

  useEffect(() => {

    if (!schoolId) return;

    fetchHods();

  }, [schoolId]);

  // =====================================================
  // ================= FETCH HODS =========================
  // =====================================================

  const fetchHods =
    async () => {

      try {

        setLoading(true);

        const res =
          await axios.get(

            `http://localhost:8080/api/hods/school/${schoolId}`

          );

        setHods(
          res.data || []
        );

        const initial = {};

        (res.data || []).forEach(
          (h) => {

            initial[h.id] = "P";

          }
        );

        setAttendance(initial);

      } catch (err) {

        console.log(
          "HOD FETCH ERROR => ",
          err
        );

        alert(
          "Error fetching HODs"
        );

      } finally {

        setLoading(false);
      }
    };

  // =====================================================
  // ================= CHANGE ATTENDANCE ==================
  // =====================================================

  const handleChange = (
    hodId,
    status
  ) => {

    setAttendance((prev) => ({

      ...prev,

      [hodId]: status,
    }));
  };

  // =====================================================
  // ================= SAVE ATTENDANCE ====================
  // =====================================================

  const saveAttendance = async () => {

  if (!date) {

    alert("Please select date");

    return;
  }

  try {

    setLoading(true);

    for (const h of hods) {

      const payload = {

        hodId: Number(h.id),

        status:
          attendance[h.id] || "P",

        attendanceDate: date,

        createdBy: loginUserId,

        createdByRole: loginRole,

        createdByName:
          loginUser?.name || "Unknown",

        updatedBy: loginUserId,

        updatedByRole: loginRole,

        updatedByName:
          loginUser?.name || "Unknown",
      };

      await axios.post(

        "http://localhost:8080/api/hod-attendance/mark",

        payload
      );
    }

    alert(
      "Attendance Saved Successfully"
    );

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

    alert("Please select date");

    return;
  }

  try {

    setViewLoading(true);

    const res =
      await axios.get(

        `http://localhost:8080/api/hod-attendance/date/${date}`

      );

    // ============================================
    // MATCH HODS OF CURRENT SCHOOL
    // ============================================

    const merged =
      (res.data || [])
        .filter((a) => {

          const hod =
            hods.find(
              (h) =>
                Number(h.id) ===
                Number(a.hodId)
            );

          return hod;
        })
        .map((a) => {

          const hod =
            hods.find(
              (h) =>
                Number(h.id) ===
                Number(a.hodId)
            );

          return {

            ...a,

            name:
              a.hodName ||
              hod?.name ||
              "No Name",

            email:
              a.hodEmail ||
              hod?.email ||
              "-",

            image:
              hod?.id
                ? `http://localhost:8080/api/hods/image/get/${hod.id}`
                : null,
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
        via-cyan-50
        to-indigo-100
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
            from-cyan-700
            via-blue-700
            to-indigo-700
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

                HOD Attendance

              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  sm:text-base
                  text-cyan-100
                "
              >

                Smart HOD attendance management dashboard

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
                    ? hods.length
                    : viewData.length}

                </div>

                <div
                  className="
                    text-xs
                    mt-1
                    text-cyan-100
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
                        from-cyan-600
                        to-blue-600
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
                        from-indigo-600
                        to-cyan-600
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
                  focus:ring-cyan-500
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
                    from-cyan-600
                    to-indigo-600
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
                    border-cyan-600
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

                  {hods.map(
                    (h, i) => (

                    <div
                      key={h.id}
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
                              overflow-hidden
                              bg-gray-200
                              shrink-0
                            "
                          >

                            <div
  className="
    h-14
    w-14
    rounded-2xl
    overflow-hidden
    bg-gray-200
    shrink-0
  "
>

  <img
    src={`http://localhost:8080/api/hods/image/get/${h.id}`}
    alt="hod"
    className="
      h-full
      w-full
      object-cover
    "
    onError={(e) => {

      e.target.style.display = "none";

      e.target.parentNode.innerHTML = `
        <div
          style="
            height:100%;
            width:100%;
            display:flex;
            align-items:center;
            justify-content:center;
            background:linear-gradient(to right,#0891b2,#4f46e5);
            color:white;
            font-weight:900;
          "
        >
          ${i + 1}
        </div>
      `;
    }}
  />

</div>

                              <div
                                className="
                                  h-full
                                  w-full
                                  bg-gradient-to-r
                                  from-cyan-600
                                  to-indigo-600
                                  text-white
                                  flex
                                  items-center
                                  justify-center
                                  font-black
                                "
                              >

                                {i + 1}

                              </div>
                            

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

                              {h.name}

                            </h2>

                            <p
                              className="
                                text-xs
                                text-gray-500
                                mt-1
                                break-all
                              "
                            >

                              {h.email}

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
                                h.id,
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
                                  h.id
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
                                h.id,
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
                                  h.id
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
                      from-cyan-600
                      via-blue-600
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

        {mode === "view" && (

          <div className="p-3 sm:p-5">

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
                    border-cyan-600
                    border-t-transparent
                    rounded-full
                    animate-spin
                  "
                />

              </div>
            )}

            {viewData.length > 0 &&
              !viewLoading && (

              <div
                className="
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  gap-4
                "
              >

                {viewData.map(
                  (a, i) => (

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
                            overflow-hidden
                            bg-gray-200
                            shrink-0
                          "
                        >

                          {a.image ? (

                            <img
                              src={a.image}
                              alt="hod"
                              className="
                                h-full
                                w-full
                                object-cover
                              "
                            />

                          ) : (

                            <div
                              className="
                                h-full
                                w-full
                                bg-gradient-to-r
                                from-cyan-600
                                to-indigo-600
                                text-white
                                flex
                                items-center
                                justify-center
                                font-black
                              "
                            >

                              {i + 1}

                            </div>
                          )}

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

                          <div
                            className="
                              mt-3
                              text-xs
                              text-gray-500
                              space-y-1
                            "
                          >

                            <div>
                              Created By :
                              {" "}
                              <span className="font-bold text-blue-600">

                                {a.createdByName ||
                                  "-"}

                              </span>
                            </div>

                            <div>
                              Updated By :
                              {" "}
                              <span className="font-bold text-indigo-600">

                                {a.updatedByName ||
                                  "-"}

                              </span>
                            </div>

                          </div>

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
                              a.status ===
                              "P"
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

                          {a.status ===
                          "P"
                            ? "Present"
                            : "Absent"}

                        </span>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}