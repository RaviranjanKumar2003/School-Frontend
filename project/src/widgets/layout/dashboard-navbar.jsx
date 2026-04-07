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

import { useState, useEffect } from "react";
import ProfileMenu from "../Profile/ProfileMenu";
import routes from "@/routes"; // ✅ IMPORTANT

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  

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


  // Notification well icon work start.....
  const handleRead = async (id) => {
  try {
    await fetch(`http://localhost:8080/api/notifications/read/${id}`, {
      method: "PUT",
    });

    // 🔥 REMOVE from list
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    // 🔥 update count
    setUnreadCount((prev) => Math.max(prev - 1, 0));

  } catch (err) {
    console.error(err);
  }
  };

  
  useEffect(() => {
  const fetchNotifications = async () => {
    try {
      const userRole = localStorage.getItem("userRole");

      let id = null;
      if (userRole === "student") {
        id = localStorage.getItem("id");
      }

      if (!id) return;

      const res = await fetch(
        `http://localhost:8080/api/notifications/student/${id}`
      );

      const data = await res.json();

      // ✅ FIX HERE
      const unreadOnly = data.filter((n) => !n.readStatus);

      setNotifications(unreadOnly);
      setUnreadCount(unreadOnly.length);

    } catch (err) {
      console.error(err);
    }
  };

  fetchNotifications();
  }, []);


  // Notification well icon work end.....

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
              <IconButton variant="text" className="relative">
              <BellIcon className="h-8 w-8" />

             {unreadCount > 0 && (
             <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 rounded-full">
             {unreadCount}
            </span>
           )}
            </IconButton>
            </MenuHandler>

            <MenuList>

              {notifications.length === 0 ? (
                <MenuItem>
                  <Typography>No Notifications</Typography>
                </MenuItem>
              ) : (
                notifications.map((item, index) => (
                  <MenuItem
                    key={index}
                    className="flex gap-3 cursor-pointer"
                    onClick={() => {
                    setSelectedNotice(item);
                     setOpenModal(true);
                     handleRead(item.id);
                    }}
                    >
                    {item.avatar && (
                      <Avatar src={item.avatar} size="sm" />
                    )}

                    <div>
                      <Typography className="font-semibold">{item.title}</Typography>
                      <Typography className="text-xs opacity-70">
                      {item.message}
                      </Typography>
                    </div>
                  </MenuItem>
                ))
              )}

            </MenuList>
          </Menu>

        </div>
      </div>
      {openModal && selectedNotice && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
      
      <h2 className="text-xl font-bold mb-2">
        {selectedNotice.title}
      </h2>

      <p className="text-gray-700 mb-4">
        {selectedNotice.message}
      </p>

      <button
        onClick={() => setOpenModal(false)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Close
      </button>

    </div>
  </div>
)}
    </Navbar>
  );
}

export default DashboardNavbar;