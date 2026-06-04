// import { useLocation, Link } from "react-router-dom";
// import {
//   Navbar,
//   Typography,
//   IconButton,
//   Breadcrumbs,
//   Input,
//   Menu,
//   MenuHandler,
//   MenuList,
//   MenuItem,
//   Avatar,
// } from "@material-tailwind/react";

// import {
//   UserCircleIcon,
//   BellIcon,
//   ClockIcon,
//   Bars3Icon,
// } from "@heroicons/react/24/solid";

// import {
//   useMaterialTailwindController,
//   setOpenSidenav,
// } from "@/context";

// import { useState, useEffect } from "react";
// import ProfileMenu from "../Profile/ProfileMenu";
// import routes from "@/routes"; // ✅ IMPORTANT

// export function DashboardNavbar() {
//   const [controller, dispatch] = useMaterialTailwindController();
//   const { fixedNavbar, openSidenav } = controller;
//   const { pathname } = useLocation();
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [notifications, setNotifications] = useState([]);
//   const [selectedNotice, setSelectedNotice] = useState(null);
//   const [openModal, setOpenModal] = useState(false);
  

//   const [openMenu, setOpenMenu] = useState(false);

//   const userRole = localStorage.getItem("userRole");

//   // ✅ CLEAN PATHNAMES
//   const pathnames = pathname
//     .split("/")
//     .filter((el) => el !== "" && el !== userRole);

//   // ✅ GET PAGE NAME FROM ROUTES
//   const getPageName = () => {
//     for (let route of routes) {
//       for (let page of route.pages) {
//         if (pathname.includes(page.path)) {
//           return page.name;
//         }
//       }
//     }
//     return "Dashboard";
//   };


//   // Notification well icon work start.....
//   const handleRead = async (id) => {
//   try {
//     const studentId = localStorage.getItem("id");

//     await fetch(
//      `http://localhost:8080/api/notifications/read/${id}/${studentId}`,
//     {
//       method: "PUT",
//     }
//     );

//     // 🔥 REMOVE from list
//     setNotifications((prev) =>
//      prev.filter((n) => n.notificationId !== id)
//     );

//     // 🔥 update count
//     setUnreadCount((prev) => Math.max(prev - 1, 0));

//   } catch (err) {
//     console.error(err);
//   }
//   };

  
//   useEffect(() => {
//   const fetchNotifications = async () => {
//     try {
//       const userRole = localStorage.getItem("userRole");

//       let id = null;
//       if (userRole === "student") {
//         id = localStorage.getItem("id");
//       }

//       if (!id) return;

//       const res = await fetch(
//         `http://localhost:8080/api/notifications/student/${id}`
//       );

//       const data = await res.json();

//       // ✅ FIX HERE
      
//      setNotifications(data.filter((n) => !n.readStatus));

//     // 🔥 unread count backend से लो
//     const countRes = await fetch(
//       `http://localhost:8080/api/notifications/unread/${id}`
//     );

// const count = await countRes.json();
// setUnreadCount(count);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   fetchNotifications();
//   }, []);


//   // Notification well icon work end.....

//   // ✅ CLEAN TEXT (remove - and capitalize)
//   const formatName = (name) => {
//     return name.replace(/-/g, " ");
//   };

//   return (
//     <Navbar
//       color={fixedNavbar ? "white" : "transparent"}
//       className={`rounded-xl transition-all ${
//         fixedNavbar
//           ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5"
//           : "px-0 py-1"
//       }`}
//       fullWidth
//       blurred={fixedNavbar}
//     >
//       <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">

//         {/* ================= BREADCRUMB ================= */}
//         <div className="capitalize">
//           <Breadcrumbs
//             className={`bg-transparent p-0 ${
//               fixedNavbar ? "mt-1" : ""
//             }`}
//           >
//             <Link to="/dashboard">
//               <Typography className="opacity-50 hover:text-blue-500">
//                 dashboard
//               </Typography>
//             </Link>

//             {pathnames.map((name, index) => {
//               const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
//               const isLast = index === pathnames.length - 1;

//               return isLast ? (
//                 <Typography key={index} className="text-blue-gray-800">
//                   {getPageName()}
//                 </Typography>
//               ) : (
//                 <Link key={index} to={routeTo}>
//                   <Typography className="opacity-50 hover:text-blue-500">
//                     {formatName(name)}
//                   </Typography>
//                 </Link>
//               );
//             })}
//           </Breadcrumbs>

//           {/* ================= PAGE TITLE ================= */}
//           <Typography
//             variant="h5"
//             className="font-bold text-blue-gray-900 mt-1"
//           >
//             {getPageName()}
//           </Typography>
//         </div>

//         {/* ================= RIGHT SIDE ================= */}
//         <div className="flex items-center">

//           {/* SEARCH */}
//           <div className="mr-auto md:mr-4 md:w-56">
//             <Input label="Search" />
//           </div>

//           {/* SIDENAV BUTTON */}
//           <IconButton
//             variant="text"
//             className="grid xl:hidden"
//             onClick={() => setOpenSidenav(dispatch, !openSidenav)}
//           >
//             <Bars3Icon className="h-6 w-6" />
//           </IconButton>

//           {/* PROFILE */}
//           <div className="flex items-center space-x-4">
//             <IconButton
//               variant="text"
//               className="grid xl:hidden"
//               onClick={() => setOpenMenu(!openMenu)}
//             >
//               <UserCircleIcon className="h-5 w-5" />
//             </IconButton>

//             <ProfileMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />
//           </div>

//           {/* NOTIFICATIONS */}
//           <Menu>
//             <MenuHandler>
//               <IconButton variant="text" className="relative">
//               <BellIcon className="h-8 w-8" />

//              {unreadCount > 0 && (
//              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 rounded-full">
//              {unreadCount}
//             </span>
//            )}
//             </IconButton>
//             </MenuHandler>

//             <MenuList>

//               {notifications.length === 0 ? (
//                 <MenuItem>
//                   <Typography>No Notifications</Typography>
//                 </MenuItem>
//               ) : (
//                 notifications.map((item, index) => (
//                   <MenuItem
//                     key={index}
//                     className="flex gap-3 cursor-pointer"
//                     onClick={() => {
//                     setSelectedNotice(item);
//                      setOpenModal(true);
//                      handleRead(item.notificationId);
//                     }}
//                     >
//                     {item.avatar && (
//                       <Avatar src={item.avatar} size="sm" />
//                     )}

//                     <div>
//                       <Typography className="font-semibold">{item.title}</Typography>
//                       <Typography className="text-xs opacity-70">
//                       {item.message}
//                       </Typography>
//                     </div>
//                   </MenuItem>
//                 ))
//               )}

//             </MenuList>
//           </Menu>

//         </div>
//       </div>
//       {openModal && selectedNotice && (
//   <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//     <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
      
//       <h2 className="text-xl font-bold mb-2">
//         {selectedNotice.title}
//       </h2>

//       <p className="text-gray-700 mb-4">
//         {selectedNotice.message}
//       </p>

//       <button
//         onClick={() => setOpenModal(false)}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Close
//       </button>

//     </div>
//   </div>
// )}
//     </Navbar>
//   );
// }

// export default DashboardNavbar;


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

    const userRole =
      localStorage.getItem("userRole");

    let userId = null;
    let backendRole = "";

    // ✅ STUDENT
    if (userRole === "student") {

      userId =
        localStorage.getItem("id");

      backendRole = "STUDENT";

    }

    // ✅ TEACHER
    else if (
      userRole === "teacher" ||
      userRole === "professor"
    ) {

      userId =
        localStorage.getItem("professorId");

      backendRole = "TEACHER";

    }

    // ✅ HOD
    else if (userRole === "hod") {

      userId =
        localStorage.getItem("hodId");

      backendRole = "HOD";

    }

    // ✅ ADMIN
    else if (
      userRole === "admin" ||
      userRole === "schooladmin"
    ) {

      userId =
        localStorage.getItem("schoolAdminId");

      backendRole = "ADMIN";

    }

    console.log(
      `http://localhost:8080/api/notifications/read/${id}/${userId}/${backendRole}`
    );

    await fetch(
      `http://localhost:8080/api/notifications/read/${id}/${userId}/${backendRole}`,
      {
        method: "PUT",
      }
    );

    // ✅ remove locally
    setNotifications((prev) =>
      prev.filter(
        (n) => n.notificationId !== id
      )
    );

    setUnreadCount((prev) =>
      Math.max(prev - 1, 0)
    );

  } catch (err) {

    console.error(err);

  }

};

  useEffect(() => {

  const fetchNotifications = async () => {

    try {

      const userRole =
        localStorage.getItem("userRole");

      let endpoint = "";

      // ✅ STUDENT
      if (userRole === "student") {

        const id =
          localStorage.getItem("id");

        endpoint =
        `http://localhost:8080/api/notifications/student/${id}`;

      }

      // ✅ TEACHER / PROFESSOR
      else if (
        userRole === "teacher" ||
        userRole === "professor"
      ) {

        const id =
          localStorage.getItem("professorId");

        endpoint =
        `http://localhost:8080/api/notifications/professor/${id}`;

      }

      // ✅ HOD
      else if (userRole === "hod") {

        const id =
          localStorage.getItem("hodId");

        endpoint =
        `http://localhost:8080/api/notifications/hod/${id}`;

      }

      // ✅ ADMIN
      else if (
        userRole === "admin" ||
        userRole === "schooladmin"
      ) {

        const id =
          localStorage.getItem("schoolAdminId");

        endpoint =
        `http://localhost:8080/api/notifications/admin/${id}`;

      }

      console.log(endpoint);

      const res =
        await fetch(endpoint);

      const data =
        await res.json();

      console.log(data);

      const unread =
        data.filter(
          (n) => !n.readStatus
        );

      setNotifications(unread);

      setUnreadCount(
        unread.length
      );

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
          <Menu placement="bottom-end">
            <MenuHandler>
              <IconButton variant="text" className="relative">
              <BellIcon className="h-6 w-6 text-blue-gray-700" />

             {unreadCount > 0 && (
             <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 rounded-full">
             {unreadCount}
            </span>
           )}
            </IconButton>
            </MenuHandler>

            <MenuList className="max-h-96 w-96 overflow-y-auto p-2">

              {notifications.length === 0 ? (
                <MenuItem>
                  <Typography>No Notifications</Typography>
                </MenuItem>
              ) : (
                notifications.map((item, index) => (
                  <MenuItem
                    key={index}
                    className="flex gap-3 cursor-pointer rounded-xl p-4 hover:bg-blue-50 transition-all duration-200 border-b border-gray-100"
                    onClick={() => {
                    setSelectedNotice(item);
                     setOpenModal(true);
                     handleRead(item.notificationId);
                    }}
                    >
                    {item.avatar && (
                      <Avatar src={item.avatar} size="sm" />
                    )}

                    <div className="flex flex-col w-full">

                  {/* TITLE */}
                  <Typography className="font-semibold text-sm text-blue-gray-900">
                  {item.title}
                  </Typography>

                  {/* SENDER */}
                  <Typography className="text-[11px] text-blue-500 font-medium">
                  From: {item.senderType}
                 </Typography>

                 {/* MESSAGE PREVIEW */}
                 <Typography
                 className="text-xs text-gray-600 mt-1"
                 style={{
                 display: "-webkit-box",
                 WebkitLineClamp: 2,
                 WebkitBoxOrient: "vertical",
                 overflow: "hidden",
                }}
                 >
               {item.message}
               </Typography>
               {/* DATE */}
               <Typography className="text-[10px] text-gray-400 mt-1">
               {new Date(item.sentAt).toLocaleString()}
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

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

    <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 animate-fadeIn">

      {/* HEADER */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-6 text-white">

        <button
          onClick={() => setOpenModal(false)}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 transition flex items-center justify-center text-sm"
        >
          ✕
        </button>

        <div className="flex items-center gap-4">

          <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-lg">
            🔔
          </div>

          <div>

            <h2 className="text-xl font-bold leading-tight">
              {selectedNotice.title}
            </h2>

            <p className="text-sm text-blue-100 mt-1">
              Sent by {selectedNotice.senderType}
            </p>

          </div>

        </div>

      </div>

      {/* BODY */}
      <div className="p-6">

        {/* MESSAGE CARD */}
        <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5">

          <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Notification Message
          </p>

          <p className="text-gray-700 leading-7 text-[15px] break-words">
            {selectedNotice.message}
          </p>

        </div>

        {/* FOOTER */}
        <div className="mt-5 flex items-center justify-between">

          <div>

            <p className="text-[11px] uppercase text-gray-400 font-semibold">
              Received On
            </p>

            <p className="text-sm text-gray-600 mt-1">
              {new Date(
                selectedNotice.sentAt
              ).toLocaleString()}
            </p>

          </div>

          <div className="bg-green-100 text-green-700 text-xs font-semibold px-4 py-2 rounded-full">
            Viewed
          </div>

        </div>

      </div>

    </div>

  </div>

  )}
    </Navbar>
  );
}

export default DashboardNavbar;