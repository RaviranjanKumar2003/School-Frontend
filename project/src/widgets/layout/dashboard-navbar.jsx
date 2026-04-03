import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";

import {
  UserCircleIcon,
  BellIcon,
  ClockIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";

import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "@/context";

import { useState } from "react";
import ProfileMenu from "../Profile/ProfileMenu";
import routes from "@/routes"; // ✅ IMPORTANT

export function DashboardNavbar({ notifications = [] }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();

  const [openMenu, setOpenMenu] = useState(false);

  const userRole = localStorage.getItem("userRole");

  // ✅ CLEAN PATHNAMES
  const pathnames = pathname
    .split("/")
    .filter((el) => el !== "" && el !== userRole);

  // ✅ GET PAGE NAME FROM ROUTES
  const getPageName = () => {
    for (let route of routes) {
      for (let page of route.pages) {
        if (pathname.includes(page.path)) {
          return page.name;
        }
      }
    }
    return "Dashboard";
  };

  // ✅ CLEAN TEXT (remove - and capitalize)
  const formatName = (name) => {
    return name.replace(/-/g, " ");
  };

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">

        {/* ================= BREADCRUMB ================= */}
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to="/dashboard">
              <Typography className="opacity-50 hover:text-blue-500">
                dashboard
              </Typography>
            </Link>

            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;

              return isLast ? (
                <Typography key={index} className="text-blue-gray-800">
                  {getPageName()}
                </Typography>
              ) : (
                <Link key={index} to={routeTo}>
                  <Typography className="opacity-50 hover:text-blue-500">
                    {formatName(name)}
                  </Typography>
                </Link>
              );
            })}
          </Breadcrumbs>

          {/* ================= PAGE TITLE ================= */}
          <Typography
            variant="h5"
            className="font-bold text-blue-gray-900 mt-1"
          >
            {getPageName()}
          </Typography>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center">

          {/* SEARCH */}
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" />
          </div>

          {/* SIDENAV BUTTON */}
          <IconButton
            variant="text"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon className="h-6 w-6" />
          </IconButton>

          {/* PROFILE */}
          <div className="flex items-center space-x-4">
            <IconButton
              variant="text"
              className="grid xl:hidden"
              onClick={() => setOpenMenu(!openMenu)}
            >
              <UserCircleIcon className="h-5 w-5" />
            </IconButton>

            <ProfileMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />
          </div>

          {/* NOTIFICATIONS */}
          <Menu>
            <MenuHandler>
              <IconButton variant="text">
                <BellIcon className="h-5 w-5" />
              </IconButton>
            </MenuHandler>

            <MenuList>

              {notifications.length === 0 ? (
                <MenuItem>
                  <Typography>No Notifications</Typography>
                </MenuItem>
              ) : (
                notifications.map((item, index) => (
                  <MenuItem key={index} className="flex gap-3">

                    {item.avatar && (
                      <Avatar src={item.avatar} size="sm" />
                    )}

                    <div>
                      <Typography>{item.message}</Typography>

                      <Typography className="text-xs opacity-60 flex gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {item.time}
                      </Typography>
                    </div>

                  </MenuItem>
                ))
              )}

            </MenuList>
          </Menu>

        </div>
      </div>
    </Navbar>
  );
}

export default DashboardNavbar;