import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import {
  BuildingOffice2Icon,
  UserGroupIcon,
  AcademicCapIcon,
  UsersIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  ExclamationTriangleIcon,
  ComputerDesktopIcon,
  ShieldCheckIcon,
  ServerStackIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";

const BASE_URL =
  "http://localhost:8080/api";

export default function SuperAdminHome() {

  // =====================================================
  // STATES
  // =====================================================

  const [adminName, setAdminName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [schools, setSchools] =
    useState([]);

  const [filteredSchools, setFilteredSchools] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [stats, setStats] =
    useState({

      totalSchools: 0,

      totalSchoolAdmins: 0,

      totalHods: 0,

      totalTeachers: 0,

      totalStudents: 0,

      totalClasses: 0,

      totalSubjects: 0,

      totalTimeTables: 0,
    });

    const navigate = useNavigate();

    const [openActionId, setOpenActionId] = useState(null);

  // =====================================================
  // LOAD ADMIN DATA
  // =====================================================

  useEffect(() => {

    const adminData =
      JSON.parse(
        localStorage.getItem(
          "adminData"
        )
      );

    if (adminData) {

      setAdminName(
        adminData?.name ||
          "Developer"
      );
    }

  }, []);

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {

    fetchDashboard();

  }, []);

  // =====================================================
  // SEARCH FILTER
  // =====================================================

  useEffect(() => {

    const filtered =
      schools.filter((school) => {

        const keyword =
          search.toLowerCase();

        return (

          school.schoolName
            ?.toLowerCase()
            .includes(keyword)

          ||

          school.email
            ?.toLowerCase()
            .includes(keyword)

          ||

          school.address
            ?.toLowerCase()
            .includes(keyword)

          ||

          school.schoolCode
            ?.toLowerCase()
            .includes(keyword)
        );
      });

    setFilteredSchools(
      filtered
    );

  }, [search, schools]);

  //===================================================================

   const handleEdit = (school) => {
     navigate(`/dashboard/superadmin/updateSchool/${school.id}`);
    };

    const handleDelete = async (id) => {
      try {
       await axios.delete(`${BASE_URL}/schools/${id}`);
       fetchDashboard(); // refresh list
      } catch (err) {
       console.log(err);
      }
    };

  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  const fetchDashboard =
    async () => {

      try {

        setLoading(true);

        const [

          schoolRes,

          adminRes,

          hodRes,

          teacherRes,

          subjectRes,

        ] = await Promise.all([

          axios.get(
            `${BASE_URL}/schools`
          ),

          axios.get(
            `${BASE_URL}/school-admin`
          ),

          axios.get(
            `${BASE_URL}/hods`
          ),

          axios.get(
            `${BASE_URL}/professors`
          ),

          axios.get(
            `${BASE_URL}/subjects`
          ),
        ]);

        // ============================================
        // SCHOOLS
        // ============================================

        const schoolsData =
          Array.isArray(
            schoolRes.data
          )
            ? schoolRes.data
            : [];

        // ============================================
        // TOTAL STUDENTS
        // ============================================

        let totalStudents = 0;

        for (
          const school of schoolsData
        ) {

          try {

            const res =
              await axios.get(
                `${BASE_URL}/students/count/${school.id}`
              );

            totalStudents +=
              Number(
                res.data || 0
              );

          } catch (err) {

            console.log(
              "Student count error",
              err
            );
          }
        }

        setSchools(
          schoolsData
        );

        setFilteredSchools(
          schoolsData
        );

        setStats({

          totalSchools:
            schoolsData.length,

          totalSchoolAdmins:
            Array.isArray(
              adminRes.data
            )
              ? adminRes.data.length
              : 0,

          totalHods:
            Array.isArray(
              hodRes.data
            )
              ? hodRes.data.length
              : 0,

          totalTeachers:
            Array.isArray(
              teacherRes.data
            )
              ? teacherRes.data.length
              : 0,

          totalStudents:
            totalStudents,

          totalClasses: 0,

          totalSubjects:
            Array.isArray(
              subjectRes.data
            )
              ? subjectRes.data.length
              : 0,

          totalTimeTables: 0,
        });

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);
      }
    };

  // =====================================================
  // CARD ARRAY
  // =====================================================

  const cards = [

    {
      title: "Total Schools",
      value:
        stats.totalSchools,
      icon:
        BuildingOffice2Icon,
      bg:
        "from-blue-600 to-indigo-700",
    },

    {
      title:
        "School Admins",
      value:
        stats.totalSchoolAdmins,
      icon:
        UserGroupIcon,
      bg:
        "from-green-500 to-emerald-600",
    },

    {
      title: "Total HODs",
      value:
        stats.totalHods,
      icon:
        AcademicCapIcon,
      bg:
        "from-purple-500 to-violet-700",
    },

    {
      title:
        "Teachers",
      value:
        stats.totalTeachers,
      icon:
        UsersIcon,
      bg:
        "from-orange-500 to-red-600",
    },

    {
      title:
        "Students",
      value:
        stats.totalStudents,
      icon:
        UsersIcon,
      bg:
        "from-pink-500 to-rose-600",
    },

    {
      title:
        "Subjects",
      value:
        stats.totalSubjects,
      icon:
        BookOpenIcon,
      bg:
        "from-yellow-500 to-orange-600",
    },

    {
      title:
        "ERP Security",
      value:
        "100%",
      icon:
        ShieldCheckIcon,
      bg:
        "from-cyan-500 to-blue-600",
    },

    {
      title:
        "System Health",
      value:
        "ONLINE",
      icon:
        ServerStackIcon,
      bg:
        "from-indigo-500 to-purple-700",
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-100
        via-gray-100
        to-blue-50
        p-4
        md:p-6
      "
    >

      {/* ================================================= */}
      {/* TOP HEADER */}
      {/* ================================================= */}

      <div
        className="
          bg-gradient-to-r
          from-indigo-800
          via-blue-700
          to-cyan-600
          rounded-[35px]
          p-6
          md:p-10
          shadow-2xl
          text-white
          mb-8
          overflow-hidden
          relative
        "
      >

        <div
          className="
            absolute
            top-0
            right-0
            w-72
            h-72
            bg-white/10
            rounded-full
            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10
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

            <div
              className="
                inline-flex
                items-center
                gap-2
                bg-white/15
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
                mb-4
              "
            >

              <ComputerDesktopIcon
                className="w-5 h-5"
              />

              SUPER ADMIN PANEL

            </div>

            <h1
              className="
                text-4xl
                md:text-6xl
                font-black
                leading-tight
              "
            >

              ERP Master Dashboard

            </h1>

            <p
              className="
                mt-4
                text-lg
                text-white/80
                max-w-2xl
              "
            >

              Welcome back

              {" "}

              <span className="font-bold">

                {adminName}

              </span>

              {" "}

              — manage schools,
              admins, HODs,
              teachers, students
              and complete ERP
              analytics from one
              powerful dashboard.

            </p>

          </div>

          {/* RIGHT */}

          <div
            className="
              bg-white/10
              border
              border-white/20
              backdrop-blur-xl
              rounded-3xl
              p-8
              shadow-2xl
              min-w-[300px]
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p className="text-white/70 text-sm">

                  SERVER STATUS

                </p>

                <h2
                  className="
                    text-5xl
                    font-black
                    mt-2
                  "
                >

                  ACTIVE

                </h2>

              </div>

              <div
                className="
                  bg-green-400
                  w-5
                  h-5
                  rounded-full
                  animate-pulse
                "
              />

            </div>

            <button
              onClick={
                fetchDashboard
              }
              className="
                mt-6
                w-full
                bg-white
                text-indigo-700
                font-bold
                py-3
                rounded-2xl
                hover:scale-[1.02]
                transition-all
                flex
                items-center
                justify-center
                gap-2
              "
            >

              <ArrowPathIcon
                className="w-5 h-5"
              />

              Refresh Dashboard

            </button>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading ? (

        <div
          className="
            bg-white
            rounded-3xl
            shadow-xl
            p-12
            text-center
          "
        >

          <div
            className="
              animate-spin
              rounded-full
              h-16
              w-16
              border-4
              border-indigo-600
              border-t-transparent
              mx-auto
              mb-5
            "
          />

          <h2
            className="
              text-2xl
              font-bold
              text-gray-700
            "
          >

            Loading Dashboard...

          </h2>

        </div>

      ) : (

        <>

          {/* ================================================= */}
          {/* STATS */}
          {/* ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-6
              mb-8
            "
          >

            {cards.map(
              (
                item,
                index
              ) => {

                const Icon =
                  item.icon;

                return (

                  <div
                    key={index}
                    className="
                      bg-white
                      rounded-[30px]
                      shadow-xl
                      overflow-hidden
                      hover:-translate-y-1
                      transition-all
                      duration-300
                    "
                  >

                    <div
                      className={`
                        bg-gradient-to-r
                        ${item.bg}
                        p-6
                        text-white
                      `}
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                        "
                      >

                        <div>

                          <p
                            className="
                              text-white/80
                              text-sm
                              font-semibold
                            "
                          >

                            {item.title}

                          </p>

                          <h2
                            className="
                              text-5xl
                              font-black
                              mt-3
                            "
                          >

                            {item.value}

                          </h2>

                        </div>

                        <div
                          className="
                            bg-white/20
                            p-4
                            rounded-3xl
                          "
                        >

                          <Icon
                            className="
                              w-12
                              h-12
                            "
                          />

                        </div>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>

          {/* ================================================= */}
          {/* SCHOOL TABLE */}
          {/* ================================================= */}

          <div
            className="
              bg-white
              rounded-[35px]
              shadow-2xl
              overflow-hidden
              mb-8
            "
          >

            {/* HEADER */}

            <div
              className="
                p-6
                md:p-8
                border-b
                bg-gradient-to-r
                from-gray-50
                to-blue-50
              "
            >

              <div
                className="
                  flex
                  flex-col
                  xl:flex-row
                  xl:items-center
                  xl:justify-between
                  gap-5
                "
              >

                <div>

                  <h2
                    className="
                      text-3xl
                      font-black
                      text-gray-800
                    "
                  >

                    Registered Schools

                  </h2>

                  <p
                    className="
                      text-gray-500
                      mt-2
                    "
                  >

                    All schools under
                    ERP management
                    system

                  </p>

                </div>

                <div
                  className="
                    flex
                    flex-col
                    md:flex-row
                    gap-4
                    items-start
                    md:items-center
                  "
                >

                  {/* SEARCH */}

                  <div
                    className="
                      relative
                      w-full
                      md:w-[320px]
                    "
                  >

                    <MagnifyingGlassIcon
                      className="
                        w-5
                        h-5
                        text-gray-400
                        absolute
                        top-3.5
                        left-3
                      "
                    />

                    <input
                      type="text"
                      placeholder="Search schools..."
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        pl-10
                        pr-4
                        py-3
                        rounded-2xl
                        border
                        border-gray-300
                        focus:outline-none
                        focus:ring-2
                        focus:ring-indigo-500
                      "
                    />

                  </div>

                  <button
                    onClick={() => navigate("/dashboard/superadmin/schools")}
                    className=" bg-green-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-green-700">
                     + Add School
                  </button>

                  <div
                    className="
                      bg-indigo-100
                      text-indigo-700
                      px-6
                      py-3
                      rounded-2xl
                      font-bold
                      text-lg
                      w-fit
                    "
                  >

                    {
                      filteredSchools.length
                    }
                    {" "}
                    Schools

                  </div>

                </div>

              </div>

            </div>

            {/* MOBILE VIEW */}

            <div
              className="
                lg:hidden
                p-4
                flex
                flex-col
                gap-4
              "
            >

              {filteredSchools.map(
                (school) => (

                  <div
                    key={school.id}
                    className="
                      border
                      rounded-3xl
                      p-5
                      shadow-md
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                      "
                    >

                      <div>

                        <h2
                          className="
                            text-xl
                            font-bold
                            text-indigo-700
                          "
                        >

                          {
                            school.schoolName
                          }

                        </h2>

                        <p className="text-gray-500 text-sm mt-1">

                          {
                            school.schoolCode
                          }

                        </p>

                      </div>

                      <span
                        className="
                          bg-green-100
                          text-green-700
                          px-3
                          py-1
                          rounded-full
                          text-xs
                          font-bold
                        "
                      >

                        ACTIVE

                      </span>

                    </div>

                    <div className="mt-4 space-y-2 text-sm">

                      <p>
                        <span className="font-bold">
                          Email :
                        </span>
                        {" "}
                        {school.email}
                      </p>

                      <p>
                        <span className="font-bold">
                          Phone :
                        </span>
                        {" "}
                        {
                          school.phone
                        }
                      </p>

                      <p>
                        <span className="font-bold">
                          Address :
                        </span>
                        {" "}
                        {
                          school.address
                        }
                      </p>

                      <p>
                        <span className="font-bold">
                          Admin :
                        </span>
                        {" "}
                        {
                          school
                            .schoolAdmin
                            ?.name
                        }
                      </p>

                    </div>

                  </div>
                )
              )}

            </div>

            {/* DESKTOP TABLE */}

            <div className="hidden lg:block overflow-x-auto">

              <table className="w-full">

                <thead
                  className="
                    bg-gray-100
                    text-gray-700
                  "
                >

                  <tr>

                    <th className="p-5 text-left">
                      School Name
                    </th>

                    <th className="p-5 text-left">
                      Code
                    </th>

                    <th className="p-5 text-left">
                      Email
                    </th>

                    <th className="p-5 text-left">
                      Phone
                    </th>

                    <th className="p-5 text-left">
                      Address
                    </th>

                    <th className="p-5 text-left">
                      Admin
                    </th>

                    <th className="p-5 text-left">
                      Status
                    </th>

                    <th className="p-5 text-center">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredSchools.map(
                    (
                      school,
                      index
                    ) => (

                      <tr
                        key={
                          school.id
                        }
                        className={`
                          border-b
                          hover:bg-blue-50
                          transition-all
                          ${
                            index % 2 === 0
                              ? "bg-white"
                              : "bg-gray-50"
                          }
                        `}
                      >

                        <td
                          className="
                            p-5
                            font-bold
                            text-gray-800
                          "
                        >

                          {
                            school.schoolName
                          }

                        </td>

                        <td className="p-5">

                          {
                            school.schoolCode
                          }

                        </td>

                        <td className="p-5">

                          {
                            school.email
                          }

                        </td>

                        <td className="p-5">

                          {
                            school.phone
                          }

                        </td>

                        <td className="p-5">

                          {
                            school.address
                          }

                        </td>

                        <td className="p-5">

                          <div className="flex flex-col">

                            <span className="font-semibold">

                              {
                                school
                                  .schoolAdmin
                                  ?.name
                              }

                            </span>

                            <span className="text-sm text-gray-500">

                              {
                                school
                                  .schoolAdmin
                                  ?.username
                              }

                            </span>

                          </div>

                        </td>

                        <td className="p-5">

                          <span
                            className="
                              bg-green-100
                              text-green-700
                              px-4
                              py-2
                              rounded-full
                              text-sm
                              font-bold
                            "
                          >

                            Active

                          </span>

                        </td>

                        <td className="p-5 text-center">

                          <div className="relative">
  
  <button
    onClick={() =>
      setOpenActionId(
        openActionId === school.id ? null : school.id
      )
    }
    className="
      bg-indigo-100
      hover:bg-indigo-200
      text-indigo-700
      p-3
      rounded-xl
      transition
    "
  >
    <EyeIcon className="w-5 h-5" />
  </button>

  {openActionId === school.id && (
    <div
      className="
        absolute
        right-0
        mt-2
        w-40
        bg-white
        shadow-xl
        rounded-xl
        overflow-hidden
        z-50
      "
    >
      <button
        onClick={() =>
         navigate(`/dashboard/superadmin/admins/${school.id}`)
        }
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        View
      </button>

      <button
       onClick={() => handleEdit(school)}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Edit
      </button>

      <button
        onClick={() => handleDelete(school.id)}
        className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
      >
        Delete
      </button>
    </div>
  )}
</div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* ================================================= */}
          {/* EXTRA FEATURES */}
          {/* ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-6
            "
          >

            {/* BILLING */}

            <div
              className="
                bg-white
                rounded-[30px]
                shadow-xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-5
                "
              >

                <div
                  className="
                    bg-green-100
                    p-4
                    rounded-3xl
                  "
                >

                  <CurrencyRupeeIcon
                    className="
                      w-10
                      h-10
                      text-green-700
                    "
                  />

                </div>

                <div>

                  <h2
                    className="
                      text-2xl
                      font-black
                    "
                  >

                    Revenue Analytics

                  </h2>

                  <p className="text-gray-500 mt-2">

                    Subscription,
                    payments & billing
                    management

                  </p>

                </div>

              </div>

            </div>

            {/* ERROR */}

            <div
              className="
                bg-white
                rounded-[30px]
                shadow-xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-5
                "
              >

                <div
                  className="
                    bg-red-100
                    p-4
                    rounded-3xl
                  "
                >

                  <ExclamationTriangleIcon
                    className="
                      w-10
                      h-10
                      text-red-700
                    "
                  />

                </div>

                <div>

                  <h2
                    className="
                      text-2xl
                      font-black
                    "
                  >

                    Error Logs

                  </h2>

                  <p className="text-gray-500 mt-2">

                    API failures,
                    security reports &
                    backend logs

                  </p>

                </div>

              </div>

            </div>

            {/* SYSTEM */}

            <div
              className="
                bg-white
                rounded-[30px]
                shadow-xl
                p-6
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-5
                "
              >

                <div
                  className="
                    bg-blue-100
                    p-4
                    rounded-3xl
                  "
                >

                  <ClockIcon
                    className="
                      w-10
                      h-10
                      text-blue-700
                    "
                  />

                </div>

                <div>

                  <h2
                    className="
                      text-2xl
                      font-black
                    "
                  >

                    System Monitor

                  </h2>

                  <p className="text-gray-500 mt-2">

                    Live server
                    monitoring & ERP
                    activity

                  </p>

                </div>

              </div>

            </div>

          </div>

        </>

      )}

    </div>
  );
}