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
  const userRole = localStorage.getItem("userRole");
  const [user, setUser] = useState(null);
  const logout = useLogout();

  // ✅ LOAD USER
  useEffect(() => {
    const storedData =
      localStorage.getItem("studentData") ||
      localStorage.getItem("professorData") ||
      localStorage.getItem("hodData");

    if (storedData) {
      try {
        setUser(JSON.parse(storedData));
      } catch (error) {
        console.error("Error parsing user data", error);
      }
    }
  }, []);

  // ✅ IMAGE URL
  const getImageUrl = () => {
    if (!user)
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    if (userRole === "hod") {
      return `http://localhost:8080/api/hods/image/get/${user?.id}`;
    }
    if (userRole === "student") {
      return `http://localhost:8080/api/students/image/get/${user?.id}`;
    }
    if (userRole === "professor") {
      return `http://localhost:8080/api/professors/image/get/${user?.id}`;
    }

    return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Menu open={openMenu} handler={setOpenMenu} placement="bottom-end">

      {/* ================= BUTTON ================= */}
      <MenuHandler className="hidden sm:flex justify-center items-center gap-2 rounded-full">
        <Button
          variant="text"
          className="flex items-center gap-2 px-2 py-1 md:px-3 md:py-2 
          bg-gray-100 rounded-full shadow-sm hover:shadow-md transition-all"
        >
          {/* Avatar ALWAYS visible */}
          <Avatar
            src={getImageUrl()}
            alt="User"
            className="rounded-full w-8 h-8 md:w-10 md:h-10"
            onError={(e) => {
              e.target.src =
                "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }}
          />

          {/* Name hidden only on very small screens */}
          <Typography
            variant="small"
            className="text-gray-700 hidden sm:block max-w-[100px] truncate"
          >
            {user.studName || user.name || "User"}
          </Typography>
        </Button>
      </MenuHandler>


      {/* ================= DROPDOWN ================= */}
      <MenuList className="w-60 p-2 shadow-xl rounded-xl">

        {/* 🔥 USER HEADER */}
        <div className="flex items-center gap-3 px-3 py-2 border-b">
          <Avatar
            src={getImageUrl()}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <Typography className="text-sm font-semibold">
              {user.studName || user.name || "User"}
            </Typography>
            <Typography className="text-xs text-gray-500 uppercase">
              {userRole}
            </Typography>
          </div>
        </div>

        {/* 👤 PROFILE */}
        <MenuItem className="p-0 mt-2">
          <Link
            to={`/dashboard/${userRole}/information`}
            className="flex items-center gap-3 px-3 py-2 w-full"
          >
            <AiOutlineUser className="text-gray-600 h-5 w-5" />
            <span className="text-sm">My Profile</span>
          </Link>
        </MenuItem>

        {/* 🚪 LOGOUT */}
        <MenuItem
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2"
        >
          <AiOutlineLogout className="text-red-500 h-5 w-5" />
          <span className="text-sm text-red-500 font-medium">Logout</span>
        </MenuItem>

      </MenuList>
    </Menu>
  );
}

export default ProfileMenu;