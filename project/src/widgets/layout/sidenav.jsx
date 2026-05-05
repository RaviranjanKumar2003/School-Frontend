import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";
import { useEffect, useState } from "react";

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;

  const [userRole, setUserRole] = useState("student");

  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  // 🔥 ROLE SET
  useEffect(() => {
    const storedUserRole = localStorage.getItem("userRole") || "student";
    setUserRole(storedUserRole.toUpperCase());
  }, []);

  // 🔥 BODY SCROLL LOCK
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
      {/* 🔥 BACKDROP (Mobile) */}
      {openSidenav && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 xl:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`${sidenavTypes[sidenavType]} ${
          openSidenav ? "translate-x-0" : "-translate-x-80"
        } fixed top-0 left-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 
        rounded-xl transition-transform duration-300 
        xl:translate-x-0 border border-blue-gray-100 flex flex-col`}
      >
        {/* HEADER */}
        <div className="relative">
          <Link to="/dashboard" className="py-6 px-8 text-center block">
            <Typography
              variant="h6"
              color={sidenavType === "dark" ? "white" : "blue-gray"}
            >
              {`YOUR ${userRole} Dashboard`}
            </Typography>
          </Link>

          {/* CLOSE BUTTON */}
          <IconButton
            variant="text"
            size="sm"
            ripple={false}
            className="absolute right-2 top-2 grid xl:hidden"
            onClick={closeSidebar}
          >
            <XMarkIcon
              strokeWidth={2.5}
              className={`h-6 w-6 ${
                sidenavType === "dark" ? "text-white" : "text-black"
              }`}
            />
          </IconButton>
        </div>

        {/* MENU (SCROLL AREA) */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar">
          {routes.map(({ layout, title, pages }, key) => (
            <ul key={key} className="mb-4 flex flex-col gap-1">
              
              {/* SECTION TITLE */}
              {title && (
                <li className="mx-3.5 mt-4 mb-2">
                  <Typography
                    variant="small"
                    color={sidenavType === "dark" ? "white" : "blue-gray"}
                    className="font-black uppercase opacity-75"
                  >
                    {title}
                  </Typography>
                </li>
              )}

              {/* PAGES */}
              {pages.map(({ icon, name, path }) => (
                <li key={name}>
                  <NavLink to={`/${layout}${path}`} onClick={closeSidebar}>
                    {({ isActive }) => {
                      const validColors = [
                        "white","blue-gray","gray","brown","deep-orange",
                        "orange","amber","yellow","lime","light-green",
                        "green","teal","cyan","light-blue","blue",
                        "indigo","deep-purple","purple","pink","red",
                      ];

                      const resolvedColor = isActive
                        ? validColors.includes(sidenavColor)
                          ? sidenavColor
                          : "blue-gray"
                        : sidenavType === "dark"
                        ? "white"
                        : "blue-gray";

                      return (
                        <Button
                          variant={isActive ? "gradient" : "text"}
                          color={resolvedColor}
                          className="flex items-center gap-4 px-4 capitalize"
                          fullWidth
                        >
                          {icon}
                          <Typography
                            color="inherit"
                            className="font-medium capitalize"
                          >
                            {name}
                          </Typography>
                        </Button>
                      );
                    }}
                  </NavLink>
                </li>
              ))}

            </ul>
          ))}
        </div>
      </aside>

      {/* 🔥 CUSTOM SCROLLBAR STYLE */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #94a3b8;
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }
        `}
      </style>
    </>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Your school",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;