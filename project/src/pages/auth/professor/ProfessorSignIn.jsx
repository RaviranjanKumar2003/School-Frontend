import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function ProfessorSignIn() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ================= LOGIN =================
  const handleSignIn = async (e) => {

    e.preventDefault();

    if (!username || !password) {

      setError("Please enter username and password");

      return;
    }

    try {

      // ================= LOGIN API =================
      const response = await fetch(
        "http://localhost:8080/api/professors/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password
          })
        }
      );

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }

      const loginData = await response.json();

      const professorId =
        loginData.id || loginData.professorId;

      // ================= GET FULL PROFESSOR =================
      const professorResponse = await fetch(
        `http://localhost:8080/api/professors/${professorId}`
      );

      if (!professorResponse.ok) {
        throw new Error("Failed to fetch professor data");
      }

      const professorData = await professorResponse.json();

      // ================= SAVE LOCAL STORAGE =================
      localStorage.setItem("userRole", "professor");

      localStorage.setItem(
        "professorId",
        professorId
      );

      localStorage.setItem(
        "professorData",
        JSON.stringify(professorData)
      );

      // ✅ SCHOOL NAME ALSO SAVE
      localStorage.setItem(
        "schoolName",
        professorData.schoolName || "EduNova International School"
      );

      console.log(
        "Professor Login Success:",
        professorData
      );

      // ================= REDIRECT =================
      navigate("/dashboard/professor/home");

    } catch (err) {

      console.error("Login error:", err);

      setError(
        "Login failed. Please check username or password."
      );
    }
  };

  return (

    <section className="m-8 flex justify-center">

      <div className="w-full lg:w-3/5 mt-20">

        {/* ================= HEADING ================= */}
        <div className="text-center">

          <Typography
            variant="h2"
            className="font-bold mb-3 text-blue-700"
          >
            Professor Sign In
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
          className="mt-8 mx-auto w-80 lg:w-96 bg-white p-8 rounded-3xl shadow-2xl"
          onSubmit={handleSignIn}
        >

          <div className="flex flex-col gap-6">

            <Input
              size="lg"
              label="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />

            <Input
              type="password"
              size="lg"
              label="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          {/* ================= BUTTON ================= */}
          <Button
            className="mt-8 bg-blue-700"
            fullWidth
            type="submit"
          >
            Sign In
          </Button>

          {/* ================= ERROR ================= */}
          {error && (

            <Typography
              color="red"
              className="mt-4 text-center text-sm"
            >
              {error}
            </Typography>
          )}

          {/* ================= LINKS ================= */}
          <div className="flex justify-between mt-6">

            <Typography variant="small">
              <Link
                to="/auth/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password
              </Link>
            </Typography>

            <Typography variant="small">
              <Link
                to="/auth/professor/sign-up"
                className="text-blue-600 hover:underline"
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

export default ProfessorSignIn;