import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

import {
  BuildingOffice2Icon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export function SchoolAdminSignIn() {

  // ================= STATES =================
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  // ================= LOGIN =================
  const handleSignIn = async (e) => {

    e.preventDefault();

    setError("");

    // ================= VALIDATION =================
    if (!username || !password) {

      setError(
        "Please enter username and password"
      );

      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/school-admin/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      // ================= SUCCESS =================
      if (response.ok) {

        const data =
          await response.json();

        console.log(
          "School Admin Login:",
          data
        );

        // ================= CLEAR OLD STORAGE =================
        localStorage.clear();

        // ================= SAVE LOGIN DATA =================
        localStorage.setItem(
          "userRole",
          "schooladmin"
        );

        localStorage.setItem(
          "schoolAdminId",
          data.id
        );

        localStorage.setItem(
          "schoolAdminData",
          JSON.stringify(data)
        );

        // ================= SCHOOL DATA =================
        localStorage.setItem(
          "schoolId",
          data.schoolId
        );

        localStorage.setItem(
          "schoolName",
          data.schoolName || "School ERP"
        );

        localStorage.setItem(
          "schoolCode",
          data.schoolCode || ""
        );

        // ================= DEBUG =================
        console.log(
          "Saved schoolId =",
          localStorage.getItem("schoolId")
        );

        // ================= REDIRECT =================
        navigate(
          "/dashboard/schooladmin/home"
        );

      } else {

        const errorText =
          await response.text();

        setError(
          errorText ||
            "Invalid credentials"
        );
      }

    } catch (err) {

      console.error(
        "School Admin Login Error:",
        err
      );

      setError(
        "Login failed. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <section
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-blue-700
        via-indigo-600
        to-cyan-500
        px-4
      "
    >

      <Card
        className="
          w-full
          max-w-md
          rounded-3xl
          shadow-2xl
          border
          border-white/20
        "
      >

        <CardBody className="p-8">

          {/* ================= ICON ================= */}
          <div className="flex justify-center mb-4">

            <div
              className="
                bg-blue-100
                p-4
                rounded-full
              "
            >

              <BuildingOffice2Icon
                className="
                  h-10
                  w-10
                  text-blue-700
                "
              />

            </div>

          </div>

          {/* ================= TITLE ================= */}
          <div className="text-center mb-8">

            <Typography
              variant="h3"
              className="
                font-extrabold
                text-gray-800
              "
            >
              School Admin Login
            </Typography>

            <Typography
              className="
                text-gray-600
                mt-2
              "
            >
              Manage your school operations
            </Typography>

          </div>

          {/* ================= FORM ================= */}
          <form
            onSubmit={handleSignIn}
            className="space-y-6"
          >

            {/* USERNAME */}
            <Input
              size="lg"
              label="Username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
            />

            {/* PASSWORD */}
            <Input
              type="password"
              size="lg"
              label="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            {/* BUTTON */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
              className="
                bg-blue-700
                flex
                items-center
                justify-center
                gap-2
                rounded-xl
                shadow-lg
              "
            >

              <ShieldCheckIcon
                className="h-5 w-5"
              />

              {
                loading
                  ? "Signing In..."
                  : "Sign In"
              }

            </Button>

            {/* ERROR */}
            {error && (

              <Typography
                color="red"
                className="
                  text-center
                  text-sm
                  font-medium
                "
              >
                {error}
              </Typography>

            )}

          </form>

          {/* ================= FOOTER ================= */}
          <div className="mt-8 text-center">

            <Typography
              variant="small"
              className="text-gray-600"
            >
              Forgot password?

              <Link
                to="/auth/forgot-password"
                className="
                  ml-1
                  text-blue-700
                  font-semibold
                  hover:underline
                "
              >
                Reset Here
              </Link>

            </Typography>

          </div>

        </CardBody>

      </Card>

    </section>
  );
}

export default SchoolAdminSignIn;