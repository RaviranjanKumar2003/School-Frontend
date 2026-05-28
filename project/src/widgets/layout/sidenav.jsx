
// import PropTypes from "prop-types";
// import { NavLink } from "react-router-dom";

// import {
//   XMarkIcon,
//   AcademicCapIcon,
// } from "@heroicons/react/24/outline";

// import {
//   Button,
//   IconButton,
//   Typography,
//   Avatar,
// } from "@material-tailwind/react";

// import {
//   useMaterialTailwindController,
//   setOpenSidenav,
// } from "@/context";

// import { useEffect, useState } from "react";

// export function Sidenav({ brandImg, routes }) {

//   const [controller, dispatch] =
//     useMaterialTailwindController();

//   const {
//     sidenavColor,
//     sidenavType,
//     openSidenav,
//   } = controller;

//   const [userRole, setUserRole] =
//     useState("student");

//   const [userData, setUserData] =
//     useState(null);

//   const [profileImage, setProfileImage] =
//     useState(brandImg);

//   // =====================================================
//   // SIDENAV TYPES
//   // =====================================================

//   const sidenavTypes = {

//     dark:
//       "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",

//     white:
//       "bg-white shadow-xl",

//     transparent:
//       "bg-white/90 backdrop-blur-lg shadow-xl",
//   };

//   // =====================================================
//   // PARSE STORAGE
//   // =====================================================

//   const getParsed = (key) => {

//     try {

//       const data =
//         localStorage.getItem(key);

//       return data
//         ? JSON.parse(data)
//         : null;

//     } catch (err) {

//       console.error(
//         "LocalStorage Parse Error:",
//         err
//       );

//       return null;
//     }
//   };

//   // =====================================================
//   // LOAD USER
//   // =====================================================

//   useEffect(() => {

//     const role =
//       localStorage.getItem("userRole") ||
//       "student";

//     setUserRole(role);

//     let data = null;

//     // ================= STUDENT =================

//     if (role === "student") {

//       data =
//         getParsed("studentData");

//       if (data?.id) {

//         setProfileImage(
//           `http://localhost:8080/api/students/image/get/${data.id}`
//         );
//       }
//     }

//     // ================= PROFESSOR =================

//     else if (role === "professor") {

//       data =
//         getParsed("professorData");

//       if (data?.id) {

//         setProfileImage(
//           `http://localhost:8080/api/professors/image/get/${data.id}`
//         );
//       }
//     }

//     // ================= HOD =================

//     else if (role === "hod") {

//       data =
//         getParsed("hodData");

//       if (data?.id) {

//         setProfileImage(
//           `http://localhost:8080/api/hods/image/get/${data.id}`
//         );
//       }
//     }

//     // ================= SCHOOL ADMIN =================

//     else if (role === "schooladmin") {

//       data =
//         getParsed("schoolAdminData");

//       if (data?.id) {

//         setProfileImage(
//           `http://localhost:8080/api/school-admin/image/get/${data.id}`
//         );
//       }
//     }

//     // ================= RECEPTIONIST =================

//     // ================= RECEPTIONIST =================

// else if (role === "receptionist") {

//   data = getParsed("receptionistData");

//   console.log("Receptionist Data =", data);

//   if (data?.imageUrl) {

//     setProfileImage(
//       `http://localhost:8080/api/receptionists/image/${data.imageUrl}`
//     );

//   } else if (data?.id) {

//     setProfileImage(
//       `http://localhost:8080/api/receptionists/image/get/${data.id}`
//     );

//   } else {

//     setProfileImage("/img/logo-ct.png");
//   }
// }
//     // ================= SUPER ADMIN =================

//     else if (role === "superadmin") {

//       data =
//         getParsed("adminData");

//       setProfileImage(
//         "/img/logo-ct.png"
//       );
//     }

//     setUserData(data);

//   }, []);

//   // =====================================================
//   // BODY SCROLL
//   // =====================================================

//   useEffect(() => {

//     if (openSidenav) {

//       document.body.style.overflow =
//         "hidden";

//     } else {

//       document.body.style.overflow =
//         "auto";
//     }

//   }, [openSidenav]);

//   // =====================================================
//   // CLOSE SIDEBAR
//   // =====================================================

//   const closeSidebar = () => {

//     setOpenSidenav(
//       dispatch,
//       false
//     );
//   };

//   // =====================================================
//   // GET USER NAME
//   // =====================================================

//   const getUserName = () => {

//     if (!userData)
//       return "User";

//     return (
//       userData?.name ||

//       userData?.fullName ||

//       `${userData?.firstName || ""} ${userData?.lastName || ""}` ||

//       `${userData?.studName || ""} ${userData?.studLastName || ""}` ||

//       "User"
//     );
//   };

//   // =====================================================
//   // GET SCHOOL NAME
//   // =====================================================

//   const getSchoolName = () => {

//     if (
//       userRole === "superadmin"
//     ) {

//       return "System Administration";
//     }

//     return (

//       userData?.school?.schoolName ||

//       userData?.schoolName ||

//       localStorage.getItem(
//         "schoolName"
//       ) ||

//       "School Dashboard"
//     );
//   };

//   return (
//     <>
//       {/* =====================================================
//           MOBILE BACKDROP
//       ===================================================== */}

//       {openSidenav && (

//         <div
//           className="
//             fixed
//             inset-0
//             bg-black/50
//             backdrop-blur-sm
//             z-40
//             xl:hidden
//           "
//           onClick={closeSidebar}
//         />

//       )}

//       {/* =====================================================
//           SIDEBAR
//       ===================================================== */}

//       <aside
//         className={`

//           ${sidenavTypes[sidenavType]}

//           ${
//             openSidenav
//               ? "translate-x-0"
//               : "-translate-x-80"
//           }

//           fixed
//           top-0
//           left-0
//           z-50
//           my-4
//           ml-4
//           h-[calc(100vh-32px)]
//           w-72
//           rounded-3xl
//           transition-all
//           duration-300
//           xl:translate-x-0
//           border
//           border-blue-gray-100
//           flex
//           flex-col
//           overflow-hidden
//         `}
//       >

//         {/* =====================================================
//             HEADER
//         ===================================================== */}

//         <div
//           className="
//             relative
//             bg-gradient-to-r
//             from-blue-700
//             via-indigo-700
//             to-purple-700
//             p-5
//             text-white
//           "
//         >

//           {/* CLOSE BUTTON */}

//           <IconButton
//             variant="text"
//             size="sm"
//             ripple={false}
//             className="
//               absolute
//               right-2
//               top-2
//               grid
//               xl:hidden
//               text-white
//             "
//             onClick={closeSidebar}
//           >

//             <XMarkIcon
//               strokeWidth={2.5}
//               className="h-6 w-6"
//             />

//           </IconButton>

//           {/* PROFILE */}

//           <div className="flex flex-col items-center text-center">

//             {/* IMAGE */}

//             <Avatar
//               src={profileImage}
//               alt="profile"
//               size="xxl"
//               className="
//                 border-4
//                 border-white
//                 shadow-2xl
//                 object-cover
//               "
//               onError={(e) => {

//                 e.target.onerror = null;

//                 e.target.src =
//                   "/img/logo-ct.png";
//               }}
//             />

//             {/* SCHOOL */}

//             <Typography
//               variant="h5"
//               className="
//                 mt-4
//                 font-extrabold
//                 tracking-wide
//                 text-white
//               "
//             >

//               {getSchoolName()}

//             </Typography>

//             {/* ROLE */}

//             <div
//               className="
//                 mt-3
//                 bg-white/20
//                 px-4
//                 py-1
//                 rounded-full
//                 flex
//                 items-center
//                 gap-2
//                 backdrop-blur-md
//               "
//             >

//               <AcademicCapIcon className="h-4 w-4" />

//               <Typography
//                 variant="small"
//                 className="
//                   font-semibold
//                   uppercase
//                   tracking-widest
//                 "
//               >

//                 {userRole}

//               </Typography>

//             </div>

//             {/* USER NAME */}

//             <Typography
//               variant="small"
//               className="
//                 mt-4
//                 text-blue-100
//                 font-semibold
//                 text-base
//               "
//             >

//               {getUserName()}

//             </Typography>

//             {/* PANEL */}

//             <Typography
//               variant="small"
//               className="
//                 text-xs
//                 tracking-[4px]
//                 uppercase
//                 text-white/70
//                 mt-1
//               "
//             >

//               Dashboard Panel

//             </Typography>

//           </div>

//         </div>

//         {/* =====================================================
//             MENU
//         ===================================================== */}

//         <div
//           className="
//             flex-1
//             overflow-y-auto
//             px-3
//             py-4
//             custom-scrollbar
//           "
//         >

//           {routes.map(
//             (
//               {
//                 layout,
//                 title,
//                 pages,
//               },
//               key
//             ) => (

//               <ul
//                 key={key}
//                 className="
//                   mb-5
//                   flex
//                   flex-col
//                   gap-1
//                 "
//               >

//                 {/* TITLE */}

//                 {title && (

//                   <li
//                     className="
//                       mx-3.5
//                       mt-3
//                       mb-2
//                     "
//                   >

//                     <Typography
//                       variant="small"
//                       color={
//                         sidenavType ===
//                         "dark"
//                           ? "white"
//                           : "blue-gray"
//                       }
//                       className="
//                         font-black
//                         uppercase
//                         opacity-60
//                         tracking-widest
//                         text-[11px]
//                       "
//                     >

//                       {title}

//                     </Typography>

//                   </li>

//                 )}

//                 {/* PAGES */}

//                 {pages.map(
//                   ({
//                     icon,
//                     name,
//                     path,
//                   }) => (

//                     <li key={name}>

//                       <NavLink
//                         to={`/${layout}${path}`}
//                         onClick={closeSidebar}
//                       >

//                         {({
//                           isActive,
//                         }) => (

//                           <Button
//                             variant={
//                               isActive
//                                 ? "gradient"
//                                 : "text"
//                             }
//                             color={
//                               isActive
//                                 ? sidenavColor ||
//                                   "blue"
//                                 : sidenavType ===
//                                   "dark"
//                                 ? "white"
//                                 : "blue-gray"
//                             }
//                             className={`
//                               flex
//                               items-center
//                               gap-4
//                               px-4
//                               py-3
//                               capitalize
//                               rounded-2xl
//                               transition-all
//                               duration-300

//                               ${
//                                 isActive
//                                   ? `
//                                     shadow-lg
//                                     scale-[1.02]
//                                   `
//                                   : `
//                                     hover:bg-blue-gray-50
//                                   `
//                               }
//                             `}
//                             fullWidth
//                           >

//                             <div className="text-lg">

//                               {icon}

//                             </div>

//                             <Typography
//                               className="
//                                 font-semibold
//                                 text-sm
//                                 capitalize
//                               "
//                             >

//                               {name}

//                             </Typography>

//                           </Button>

//                         )}

//                       </NavLink>

//                     </li>

//                   )
//                 )}

//               </ul>

//             )
//           )}

//         </div>

//       </aside>

//       {/* =====================================================
//           CUSTOM SCROLLBAR
//       ===================================================== */}

//       <style>{`

//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }

//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }

//         .custom-scrollbar::-webkit-scrollbar-thumb {

//           background: #94a3b8;

//           border-radius: 20px;
//         }

//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {

//           background: #64748b;
//         }

//       `}</style>
//     </>
//   );
// }

// Sidenav.defaultProps = {
//   brandImg: "/img/logo-ct.png",
// };

// Sidenav.propTypes = {
//   brandImg: PropTypes.string,
//   routes: PropTypes.arrayOf(
//     PropTypes.object
//   ).isRequired,
// };

// export default Sidenav;




//============================================================================
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
import axios from "axios";

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

  // =========================================
  // SCHOOL LOGO STATE
  // =========================================

  const [schoolLogo, setSchoolLogo] =
    useState("/img/logo-ct.png");

  const [loadingLogo, setLoadingLogo] =
    useState(false);

  // =====================================================
  // SIDENAV TYPES
  // =====================================================

  const sidenavTypes = {

    dark:
      "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",

    white:
      "bg-white shadow-xl",

    transparent:
      "bg-white/90 backdrop-blur-lg shadow-xl",
  };

  // =====================================================
  // PARSE STORAGE
  // =====================================================

  const getParsed = (key) => {

    try {

      const data =
        localStorage.getItem(key);

      return data
        ? JSON.parse(data)
        : null;

    } catch (err) {

      console.error(
        "LocalStorage Parse Error:",
        err
      );

      return null;
    }
  };

  // =====================================================
  // LOAD USER + SCHOOL LOGO
  // =====================================================

  useEffect(() => {

    let isMounted = true;

    const role =
      localStorage.getItem("userRole") ||
      "student";

    const schoolId =
      localStorage.getItem("schoolId");

    setUserRole(role);

    let data = null;

    // ================= STUDENT =================

    if (role === "student") {

      data =
        getParsed("studentData");
    }

    // ================= PROFESSOR =================

    else if (role === "professor") {

      data =
        getParsed("professorData");
    }

    // ================= HOD =================

    else if (role === "hod") {

      data = getParsed("hodData");
      console.log("hod d : ",data);
      
    }

    // ================= SCHOOL ADMIN =================

    else if (role === "schooladmin") {

      data =
        getParsed("schoolAdminData");
    }

    // ================= RECEPTIONIST =================

    else if (role === "receptionist") {

      data =
        getParsed("receptionistData");
    }

    // ================= SUPER ADMIN =================

    else if (role === "superadmin") {

      data =
        getParsed("adminData");
    }

    if (isMounted) {

      setUserData(data);
    }

    // =====================================================
    // LOAD SCHOOL LOGO FOR ALL USERS
    // =====================================================

    const loadSchoolLogo = async () => {

  if (role === "superadmin") {

    setSchoolLogo("/img/logo-ct.png");
    return;
  }

  const schoolId =

    data?.school?.id ||

    data?.schoolId ||

    localStorage.getItem("schoolId");

  if (!schoolId) return;

  try {

    setLoadingLogo(true);

    const res = await axios.get(
      `http://localhost:8080/api/about-school/${schoolId}`
    );

    const logo = res?.data?.logo;

    if (isMounted) {

      setSchoolLogo(
        logo || "/img/logo-ct.png"
      );
    }

  } catch (err) {

    console.log(
      "School Logo API Error:",
      err
    );

    if (isMounted) {

      setSchoolLogo(
        "/img/logo-ct.png"
      );
    }

  } finally {

    if (isMounted) {

      setLoadingLogo(false);
    }
  }
};

    loadSchoolLogo();

    return () => {

      isMounted = false;
    };

  }, []);

  // =====================================================
  // BODY SCROLL
  // =====================================================

  useEffect(() => {

    if (openSidenav) {

      document.body.style.overflow =
        "hidden";

    } else {

      document.body.style.overflow =
        "auto";
    }

  }, [openSidenav]);

  // =====================================================
  // CLOSE SIDEBAR
  // =====================================================

  const closeSidebar = () => {

    setOpenSidenav(
      dispatch,
      false
    );
  };

  // =====================================================
  // GET USER NAME
  // =====================================================

  const getUserName = () => {

    if (!userData)
      return "User";

    return (

      userData?.name ||

      userData?.fullName ||

      `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() ||

      `${userData?.studName || ""} ${userData?.studLastName || ""}`.trim() ||

      "User"
    );
  };

  // =====================================================
  // GET SCHOOL NAME
  // =====================================================

  const getSchoolName = () => {

    if (
      userRole === "superadmin"
    ) {

      return "System Administration";
    }

    return (

      userData?.school?.schoolName ||

      userData?.schoolName ||

      localStorage.getItem(
        "schoolName"
      ) ||

      "School Dashboard"
    );
  };

  return (
    <>
      {/* =====================================================
          MOBILE BACKDROP
      ===================================================== */}

      {openSidenav && (

        <div
          className="
            fixed
            inset-0
            bg-black/50
            backdrop-blur-sm
            z-40
            xl:hidden
          "
          onClick={closeSidebar}
        />

      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`

          ${sidenavTypes[sidenavType]}

          ${
            openSidenav
              ? "translate-x-0"
              : "-translate-x-80"
          }

          fixed
          top-0
          left-0
          z-50
          my-4
          ml-4
          h-[calc(100vh-32px)]
          w-72
          rounded-3xl
          transition-all
          duration-300
          xl:translate-x-0
          border
          border-blue-gray-100
          flex
          flex-col
          overflow-hidden
        `}
      >

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            relative
            bg-gradient-to-r
            from-blue-700
            via-indigo-700
            to-purple-700
            p-5
            text-white
          "
        >

          {/* CLOSE BUTTON */}

          <IconButton
            variant="text"
            size="sm"
            ripple={false}
            className="
              absolute
              right-2
              top-2
              grid
              xl:hidden
              text-white
            "
            onClick={closeSidebar}
          >

            <XMarkIcon
              strokeWidth={2.5}
              className="h-6 w-6"
            />

          </IconButton>

          {/* PROFILE */}

          <div className="flex flex-col items-center text-center">

            {/* SCHOOL LOGO */}

            {/* <Avatar
              src={schoolLogo}
              alt="school-logo"
              size="xxl"
              className="
                border-4
                p-1
                border-white
                shadow-2xl
                object-cover
              "
              onError={(e) => {

                e.target.onerror = null;

                e.target.src =
                  "/img/logo-ct.png";
              }}
            /> */}
            <div
  className="
    w-28
    h-28
    rounded-full
    bg-white
    p-2
    shadow-2xl
    border-4
    border-white
    overflow-hidden
    flex
    items-center
    justify-center
  "
>

  <img
    src={schoolLogo}
    alt="school-logo"
    className="
      w-full
      h-full
      object-contain
    "
    onError={(e) => {

      e.target.onerror = null;

      e.target.src =
        "/img/logo-ct.png";
    }}
  />

</div>

            {/* SCHOOL */}

            <Typography
              variant="h5"
              className="
                mt-4
                font-extrabold
                tracking-wide
                text-white
              "
            >

              {getSchoolName()}

            </Typography>

            {/* ROLE */}

            <div
              className="
                mt-3
                bg-white/20
                px-4
                py-1
                rounded-full
                flex
                items-center
                gap-2
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

              {getUserName()}

            </Typography>

            {/* PANEL */}

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

            {/* LOADING */}

            {loadingLogo && (

              <Typography
                variant="small"
                className="
                  text-xs
                  text-blue-100
                  mt-2
                "
              >

                Loading logo...

              </Typography>

            )}

          </div>

        </div>

        {/* =====================================================
            MENU
        ===================================================== */}

        <div
          className="
            flex-1
            overflow-y-auto
            px-3
            py-4
            custom-scrollbar
          "
        >

          {routes.map(
            (
              {
                layout,
                title,
                pages,
              },
              key
            ) => (

              <ul
                key={key}
                className="
                  mb-5
                  flex
                  flex-col
                  gap-1
                "
              >

                {/* TITLE */}

                {title && (

                  <li
                    className="
                      mx-3.5
                      mt-3
                      mb-2
                    "
                  >

                    <Typography
                      variant="small"
                      color={
                        sidenavType ===
                        "dark"
                          ? "white"
                          : "blue-gray"
                      }
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

                {/* PAGES */}

                {pages.map(
                  ({
                    icon,
                    name,
                    path,
                  }) => (

                    <li key={name}>

                      <NavLink
                        to={`/${layout}${path}`}
                        onClick={closeSidebar}
                      >

                        {({
                          isActive,
                        }) => (

                          <Button
                            variant={
                              isActive
                                ? "gradient"
                                : "text"
                            }
                            color={
                              isActive
                                ? sidenavColor ||
                                  "blue"
                                : sidenavType ===
                                  "dark"
                                ? "white"
                                : "blue-gray"
                            }
                            className={`
                              flex
                              items-center
                              gap-4
                              px-4
                              py-3
                              capitalize
                              rounded-2xl
                              transition-all
                              duration-300

                              ${
                                isActive
                                  ? `
                                    shadow-lg
                                    scale-[1.02]
                                  `
                                  : `
                                    hover:bg-blue-gray-50
                                  `
                              }
                            `}
                            fullWidth
                          >

                            <div className="text-lg">

                              {icon}

                            </div>

                            <Typography
                              className="
                                font-semibold
                                text-sm
                                capitalize
                              "
                            >

                              {name}

                            </Typography>

                          </Button>

                        )}

                      </NavLink>

                    </li>

                  )
                )}

              </ul>

            )
          )}

        </div>

      </aside>

      {/* =====================================================
          CUSTOM SCROLLBAR
      ===================================================== */}

      <style>{`

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

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
  routes: PropTypes.arrayOf(
    PropTypes.object
  ).isRequired,
};

export default Sidenav;