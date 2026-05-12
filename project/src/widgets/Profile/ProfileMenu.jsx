import { useLogout } from "@/utils/useLogout";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Typography,
} from "@material-tailwind/react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  AiOutlineUser,
  AiOutlineLogout,
} from "react-icons/ai";

function ProfileMenu({ openMenu, setOpenMenu }) {

  const userRole =
    localStorage.getItem("userRole");

  const [user, setUser] =
    useState(null);

  const logout = useLogout();

  // ================= LOAD USER =================
  useEffect(() => {

    let storedData = null;

    // ================= STUDENT =================
    if (userRole === "student") {

      storedData =
        localStorage.getItem("studentData");
    }

    // ================= PROFESSOR =================
    else if (userRole === "professor") {

      storedData =
        localStorage.getItem("professorData");
    }

    // ================= HOD =================
    else if (userRole === "hod") {

      storedData =
        localStorage.getItem("hodData");
    }

    // ================= SUPER ADMIN =================
    else if (userRole === "superadmin") {

      storedData =
        localStorage.getItem("adminData");
    }

    // ================= SCHOOL ADMIN =================
    else if (userRole === "schooladmin") {

      storedData =
        localStorage.getItem("schoolAdminData");
    }

    if (storedData) {

      try {

        const parsed =
          JSON.parse(storedData);

        setUser(parsed);

        console.log(
          "PROFILE USER:",
          parsed
        );

      } catch (error) {

        console.error(
          "Error parsing user data",
          error
        );
      }
    }

  }, [userRole]);

  // ================= IMAGE URL =================
  const getImageUrl = () => {

    if (!user) {

      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }

    // ================= HOD =================
    if (userRole === "hod") {

      return `http://localhost:8080/api/hods/image/get/${user?.id}`;
    }

    // ================= STUDENT =================
    if (userRole === "student") {

      return `http://localhost:8080/api/students/image/get/${user?.id}`;
    }

    // ================= PROFESSOR =================
    if (userRole === "professor") {

      return `http://localhost:8080/api/professors/image/get/${user?.id}`;
    }

    // ================= SUPER ADMIN =================
    if (userRole === "superadmin") {

      return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }

    // ================= SCHOOL ADMIN =================
    if (userRole === "schooladmin") {

      return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }

    return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };

  // ================= LOADING =================
  if (!user) {

    return (
      <div className="flex items-center justify-center">

        <div
          className="
            h-6 w-6
            animate-spin
            rounded-full
            border-2
            border-gray-400
            border-t-transparent
          "
        />

      </div>
    );
  }

  return (

    <Menu
      open={openMenu}
      handler={setOpenMenu}
      placement="bottom-end"
    >

      {/* ================= BUTTON ================= */}

      <MenuHandler
        className="
          hidden sm:flex
          justify-center items-center
          gap-2 rounded-full
        "
      >

        <Button
          variant="text"
          className="
            flex items-center gap-2
            px-2 py-1 md:px-3 md:py-2
            bg-gray-100
            rounded-full
            shadow-sm
            hover:shadow-md
            transition-all
          "
        >

          {/* ================= AVATAR ================= */}

          <Avatar
            src={getImageUrl()}
            alt="User"
            className="
              rounded-full
              w-8 h-8
              md:w-10 md:h-10
            "
            onError={(e) => {

              e.target.src =
                "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }}
          />

          {/* ================= NAME ================= */}

          <Typography
            variant="small"
            className="
              text-gray-700
              hidden sm:block
              max-w-[120px]
              truncate
              font-semibold
            "
          >
            {
              user?.studName ||
              user?.name ||
              user?.fullName ||
              `${user?.firstName || ""} ${user?.lastName || ""}` ||
              "User"
            }
          </Typography>

        </Button>

      </MenuHandler>

      {/* ================= DROPDOWN ================= */}

      <MenuList
        className="
          w-60 p-2
          shadow-xl
          rounded-xl
        "
      >

        {/* ================= USER HEADER ================= */}

        <div
          className="
            flex items-center gap-3
            px-3 py-2
            border-b
          "
        >

          <Avatar
            src={getImageUrl()}
            className="
              w-10 h-10
              rounded-full
            "
          />

          <div>

            <Typography
              className="
                text-sm
                font-semibold
              "
            >
              {
                user?.studName ||
                user?.name ||
                user?.fullName ||
                `${user?.firstName || ""} ${user?.lastName || ""}` ||
                "User"
              }
            </Typography>

            <Typography
              className="
                text-xs
                text-gray-500
                uppercase
              "
            >
              {userRole}
            </Typography>

          </div>

        </div>

        {/* ================= PROFILE ================= */}

        <MenuItem className="p-0 mt-2">

          <Link
            to={`/dashboard/${userRole}/information`}
            className="
              flex items-center gap-3
              px-3 py-2
              w-full
            "
          >

            <AiOutlineUser
              className="
                text-gray-600
                h-5 w-5
              "
            />

            <span className="text-sm">
              My Profile
            </span>

          </Link>

        </MenuItem>

        {/* ================= LOGOUT ================= */}

        <MenuItem
          onClick={logout}
          className="
            flex items-center gap-3
            px-3 py-2
          "
        >

          <AiOutlineLogout
            className="
              text-red-500
              h-5 w-5
            "
          />

          <span
            className="
              text-sm
              text-red-500
              font-medium
            "
          >
            Logout
          </span>

        </MenuItem>

      </MenuList>

    </Menu>
  );
}

export default ProfileMenu;