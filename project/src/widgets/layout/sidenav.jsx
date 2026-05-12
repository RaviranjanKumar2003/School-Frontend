import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import {
  XMarkIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

import {
  Button,
  IconButton,
  Typography,
  Avatar,
} from "@material-tailwind/react";

import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";

import { useEffect, useState } from "react";

export function Sidenav({ brandImg, routes }) {

  const [controller, dispatch] =
    useMaterialTailwindController();

  const {
    sidenavColor,
    sidenavType,
    openSidenav,
  } = controller;

  const [userRole, setUserRole] =
    useState("student");

  const [userData, setUserData] =
    useState(null);

  const [profileImage, setProfileImage] =
    useState(brandImg);

  // ================= SIDENAV TYPES =================
  const sidenavTypes = {
    dark:
      "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",

    white:
      "bg-white shadow-xl",

    transparent:
      "bg-white/90 backdrop-blur-lg shadow-xl",
  };

  // ================= LOAD USER =================
  useEffect(() => {

    const role =
      localStorage.getItem("userRole") || "student";

    const userId =
      localStorage.getItem("userId");

    setUserRole(role.toUpperCase());

    let data = null;

    const getParsed = (key) => {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch {
        return null;
      }
    };

    // ================= HOD =================
    if (role.toLowerCase() === "hod") {

      const hodData = getParsed("hodData");

      data = Array.isArray(hodData)
        ? hodData.find(h => String(h.id) === String(userId))
        : hodData;

      if (data?.id) {
        setProfileImage(
          `http://localhost:8080/api/hods/image/get/${data.id}`
        );
      }
    }

    // ================= PROFESSOR =================
    else if (role.toLowerCase() === "professor") {

      const professorData = getParsed("professorData");

      data = Array.isArray(professorData)
        ? professorData.find(p => String(p.id) === String(userId))
        : professorData;

      if (data?.id) {
        setProfileImage(
          `http://localhost:8080/api/professors/image/get/${data.id}`
        );
      }
    }

    // ================= STUDENT =================
    else if (role.toLowerCase() === "student") {

      const studentData = getParsed("studentData");

      data = Array.isArray(studentData)
        ? studentData.find(s => String(s.id) === String(userId))
        : studentData;

      if (data?.id) {
        setProfileImage(
          `http://localhost:8080/api/students/image/get/${data.id}`
        );
      }
    }

    setUserData(data || null);

  }, []);

  // ================= BODY SCROLL =================
  useEffect(() => {

    if (openSidenav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

  }, [openSidenav]);

  const closeSidebar = () => {
    setOpenSidenav(dispatch, false);
  };

  return (
    <>
      {/* ================= MOBILE BACKDROP ================= */}
      {openSidenav && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 xl:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          ${sidenavTypes[sidenavType]}
          ${
            openSidenav
              ? "translate-x-0"
              : "-translate-x-80"
          }

          fixed top-0 left-0 z-50
          my-4 ml-4
          h-[calc(100vh-32px)]
          w-72
          rounded-3xl
          transition-all duration-300
          xl:translate-x-0
          border border-blue-gray-100
          flex flex-col
          overflow-hidden
        `}
      >

        {/* ================= HEADER ================= */}
        <div
          className="
            relative
            bg-gradient-to-r
            from-blue-700
            via-indigo-700
            to-purple-700
            p-6
            text-white
          "
        >

          <IconButton
            variant="text"
            size="sm"
            ripple={false}
            className="
              absolute right-2 top-2
              grid xl:hidden text-white
            "
            onClick={closeSidebar}
          >
            <XMarkIcon
              strokeWidth={2.5}
              className="h-6 w-6"
            />
          </IconButton>

          <div className="flex flex-col items-center text-center">

            <Avatar
              src={profileImage}
              alt="profile"
              size="xxl"
              className="
                border-4 border-white
                shadow-2xl
                object-cover
              "
              onError={(e) => {
                e.target.src =
                  "/img/logo-ct.png";
              }}
            />

            {/* SCHOOL NAME (FIXED LOGIC SAFE) */}
            <Typography
              variant="h5"
              className="
                mt-4
                font-extrabold
                tracking-wide
                text-white
              "
            >
              {userData?.schoolName ||
                userData?.school?.schoolName ||
                "Your School"}
            </Typography>

            {/* ROLE */}
            <div
              className="
                mt-3
                bg-white/20
                px-4 py-1
                rounded-full
                flex items-center gap-2
                backdrop-blur-md
              "
            >
              <AcademicCapIcon className="h-4 w-4" />

              <Typography
                variant="small"
                className="
                  font-semibold
                  uppercase
                  tracking-widest
                "
              >
                {userRole}
              </Typography>
            </div>

            {/* USER NAME */}
            <Typography
              variant="small"
              className="
                mt-4
                text-blue-100
                font-semibold
                text-base
              "
            >
              {
                userData?.name ||
                userData?.studName + " " + userData?.studLastName ||
                userData?.fullName ||
                `${userData?.firstName || ""} ${userData?.lastName || ""}` ||
                "User"
              }
            </Typography>

            <Typography
              variant="small"
              className="
                text-xs
                tracking-[4px]
                uppercase
                text-white/70
                mt-1
              "
            >
              Dashboard Panel
            </Typography>

          </div>

        </div>

        {/* ================= MENU ================= */}
        <div className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">

          {routes.map(({ layout, title, pages }, key) => (
            <ul key={key} className="mb-5 flex flex-col gap-1">

              {title && (
                <li className="mx-3.5 mt-3 mb-2">
                  <Typography
                    variant="small"
                    color={sidenavType === "dark" ? "white" : "blue-gray"}
                    className="
                      font-black
                      uppercase
                      opacity-60
                      tracking-widest
                      text-[11px]
                    "
                  >
                    {title}
                  </Typography>
                </li>
              )}

              {pages.map(({ icon, name, path }) => (
                <li key={name}>
                  <NavLink
                    to={`/${layout}${path}`}
                    onClick={closeSidebar}
                  >
                    {({ isActive }) => (
                      <Button
                        variant={isActive ? "gradient" : "text"}
                        color={
                          isActive
                            ? sidenavColor || "blue"
                            : sidenavType === "dark"
                            ? "white"
                            : "blue-gray"
                        }
                        className={`
                          flex items-center gap-4
                          px-4 py-3
                          capitalize
                          rounded-2xl
                          transition-all duration-300
                          ${
                            isActive
                              ? "shadow-lg scale-[1.02]"
                              : "hover:bg-blue-gray-50"
                          }
                        `}
                        fullWidth
                      >
                        <div className="text-lg">{icon}</div>

                        <Typography className="font-semibold text-sm capitalize">
                          {name}
                        </Typography>
                      </Button>
                    )}
                  </NavLink>
                </li>
              ))}

            </ul>
          ))}

        </div>

      </aside>

      {/* ================= SCROLLBAR ================= */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;