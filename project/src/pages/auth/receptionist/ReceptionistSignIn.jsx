// ==========================================
// ReceptionistSignIn.jsx
// ==========================================

import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

import {
  PhoneIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";

import { useState } from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

export function ReceptionistSignIn() {

  // ==========================================
  // STATES
  // ==========================================

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSignIn = async (e) => {

    e.preventDefault();

    setError("");

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!username || !password) {

      setError(
        "Please enter username and password"
      );

      return;
    }

    try {

      setLoading(true);

      // ==========================================
      // LOGIN API
      // ==========================================

      const response = await fetch(
        "http://localhost:8080/api/receptionists/login",
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

      // ==========================================
      // INVALID LOGIN
      // ==========================================

      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            "Invalid username or password"
        );
      }

      // ==========================================
      // LOGIN DATA
      // ==========================================

      const loginData =
        await response.json();

      console.log(
        "Receptionist Login:",
        loginData
      );

      const receptionistId =
        loginData?.id ||
        loginData?.receptionistId;

      // ==========================================
      // CHECK ID
      // ==========================================

      if (!receptionistId) {

        throw new Error(
          "Receptionist ID not found"
        );
      }

      // ==========================================
      // GET FULL RECEPTIONIST DATA
      // ==========================================

      const receptionistResponse =
        await fetch(
          `http://localhost:8080/api/receptionists/${receptionistId}`
        );

      if (!receptionistResponse.ok) {

        throw new Error(
          "Failed to fetch receptionist data"
        );
      }

      const receptionistData =
        await receptionistResponse.json();

      console.log(
        "Receptionist Full Data:",
        receptionistData
      );

      // ==========================================
      // SCHOOL DATA
      // ==========================================

      let schoolData = null;

      if (
        receptionistData?.school?.id
      ) {

        const schoolRes =
          await fetch(
            `http://localhost:8080/api/schools/${receptionistData.school.id}`
          );

        if (schoolRes.ok) {

          schoolData =
            await schoolRes.json();
        }
      }

      // ==========================================
      // CLEAR OLD STORAGE
      // ==========================================

      localStorage.clear();

      // ==========================================
      // SAVE LOGIN DATA
      // ==========================================

      localStorage.setItem(
        "userRole",
        "receptionist"
      );

      localStorage.setItem(
        "receptionistId",
        receptionistId
      );

      localStorage.setItem(
        "receptionistData",
        JSON.stringify({
          ...receptionistData,
          school: schoolData,
        })
      );

      // ==========================================
      // SAVE SCHOOL DATA
      // ==========================================

      localStorage.setItem(
        "schoolId",
        schoolData?.id || ""
      );

      localStorage.setItem(
        "schoolName",
        schoolData?.schoolName ||
          "School ERP"
      );

      // ==========================================
      // DEBUG
      // ==========================================

      console.log(
        "Saved receptionistId =",
        receptionistId
      );

      console.log(
        "Saved schoolId =",
        schoolData?.id
      );

      // ==========================================
      // REDIRECT
      // ==========================================

      navigate(
        "/dashboard/receptionist/home"
      );

    } catch (err) {

      console.error(
        "Receptionist Login Error:",
        err
      );

      setError(
        err.message ||
          "Login failed. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (

    <section
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-cyan-700
        via-blue-600
        to-sky-500
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

          {/* ==========================================
              ICON
          ========================================== */}

          <div className="flex justify-center mb-4">

            <div
              className="
                bg-cyan-100
                p-4
                rounded-full
              "
            >

              <PhoneIcon
                className="
                  h-10
                  w-10
                  text-cyan-700
                "
              />

            </div>

          </div>

          {/* ==========================================
              TITLE
          ========================================== */}

          <div className="text-center mb-8">

            <Typography
              variant="h3"
              className="
                font-extrabold
                text-gray-800
              "
            >
              Receptionist Login
            </Typography>

            <Typography
              className="
                text-gray-600
                mt-2
              "
            >
              Welcome back 👋
            </Typography>

          </div>

          {/* ==========================================
              FORM
          ========================================== */}

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

            {/* BUTTON */}

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
              className="
                bg-cyan-700
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

          </form>

          {/* ==========================================
              FOOTER
          ========================================== */}

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
                  text-cyan-700
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

export default ReceptionistSignIn;