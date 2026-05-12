import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

export function StudentSignIn() {

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

      // ================= LOGIN API =================
      const response = await fetch(
        "http://localhost:8080/api/students/login",
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

      // ================= LOGIN FAILED =================
      if (!response.ok) {

        const errText =
          await response.text();

        throw new Error(
          errText ||
          "Invalid username or password"
        );
      }

      // ================= LOGIN RESPONSE =================
      const loginData =
        await response.json();

      console.log(
        "STUDENT LOGIN RESPONSE:",
        loginData
      );

      // ================= SAVE BASIC =================
      localStorage.setItem(
        "userRole",
        "student"
      );

      localStorage.setItem(
        "studentId",
        loginData.studentId || ""
      );

      localStorage.setItem(
        "id",
        loginData.id
      );

      localStorage.setItem(
        "schoolId",
        loginData.schoolId
      );

      // ================= FETCH FULL STUDENT =================
      const studentResponse =
        await fetch(
          `http://localhost:8080/api/students/${loginData.id}`
        );

      if (!studentResponse.ok) {

        throw new Error(
          "Failed to fetch student data"
        );
      }

      // ================= FULL DATA =================
      const studentData =
        await studentResponse.json();

      console.log(
        "FULL STUDENT DATA:",
        studentData
      );

      // ================= SAVE FULL DATA =================
      localStorage.setItem(
        "studentData",
        JSON.stringify(studentData)
      );

      // ================= SCHOOL INFO =================
      localStorage.setItem(
        "schoolName",
        loginData.schoolName ||
        "EduNova International School"
      );

      localStorage.setItem(
        "school",
        JSON.stringify({
          id: loginData.schoolId,
          name:
            loginData.schoolName ||
            "School",
          code:
            loginData.schoolCode || "",
        })
      );

      // ================= SUCCESS =================
      console.log(
        "Student Login Success"
      );

      // ================= REDIRECT =================
      navigate(
        "/dashboard/student/home"
      );

    } catch (error) {

      console.error(
        "Error during login:",
        error
      );

      setError(
        error.message ||
        "Login failed. Please check username or password."
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <section className="m-8 flex justify-center">

      <div className="w-full lg:w-3/5 mt-20">

        {/* ================= TITLE ================= */}
        <div className="text-center">

          <Typography
            variant="h2"
            className="
              font-bold
              mb-4
              text-blue-700
            "
          >
            Student Sign In
          </Typography>

          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg"
          >
            Enter your username and password
          </Typography>

        </div>

        {/* ================= FORM ================= */}
        <form
          className="
            mt-8
            mx-auto
            w-80
            lg:w-96
            bg-white
            p-8
            rounded-3xl
            shadow-2xl
          "
          onSubmit={handleSignIn}
        >

          <div className="flex flex-col gap-6">

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

          </div>

          {/* ================= BUTTON ================= */}
          <Button
            className="
              mt-8
              bg-blue-700
            "
            fullWidth
            type="submit"
            disabled={loading}
          >
            {
              loading
                ? "Signing In..."
                : "Sign In"
            }
          </Button>

          {/* ================= ERROR ================= */}
          {error && (

            <Typography
              color="red"
              className="
                mt-4
                text-center
                text-sm
              "
            >
              {error}
            </Typography>
          )}

          {/* ================= LINKS ================= */}
          <div className="flex justify-between mt-6">

            <Typography variant="small">

              <Link
                to="/auth/forgot-password"
                className="
                  text-blue-600
                  hover:underline
                "
              >
                Forgot Password
              </Link>

            </Typography>

            <Typography variant="small">

              <Link
                to="/auth/student/sign-up"
                className="
                  text-blue-600
                  hover:underline
                "
              >
                Create Account
              </Link>

            </Typography>

          </div>

        </form>

      </div>

    </section>
  );
}

export default StudentSignIn;