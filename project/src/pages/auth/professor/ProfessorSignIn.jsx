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

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {

      // ================= LOGIN =================
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

      // ================= FULL DATA =================
      const professorResponse = await fetch(
        `http://localhost:8080/api/professors/${professorId}`
      );

      const professorData = await professorResponse.json();

      // ================= SCHOOL FETCH (IMPORTANT FIX) =================
      let schoolData = null;

      if (professorData?.school?.id) {
        const schoolRes = await fetch(
          `http://localhost:8080/api/schools/${professorData.school.id}`
        );
        schoolData = await schoolRes.json();
      }

      // ================= LOCAL STORAGE =================
      localStorage.setItem("userRole", "professor");

      localStorage.setItem("professorId", professorId);

      localStorage.setItem(
        "professorData",
        JSON.stringify({
          ...professorData,
          school: schoolData
        })
      );

      localStorage.setItem(
        "schoolId",
        schoolData?.id || ""
      );

      localStorage.setItem(
        "schoolName",
        schoolData?.schoolName || "School ERP"
      );

      console.log("Professor Login Success:", professorData);

      navigate("/dashboard/professor/home");

    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check username or password.");
    }
  };

  return (
    <section className="m-8 flex justify-center">

      <div className="w-full lg:w-3/5 mt-20">

        <div className="text-center">

          <Typography
            variant="h2"
            className="font-bold mb-3 text-blue-700"
          >
            Professor Sign In
          </Typography>

          <Typography variant="paragraph">
            Enter your username and password
          </Typography>

        </div>

        <form
          className="mt-8 mx-auto w-80 lg:w-96 bg-white p-8 rounded-3xl shadow-2xl"
          onSubmit={handleSignIn}
        >

          <div className="flex flex-col gap-6">

            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          </div>

          <Button className="mt-8 bg-blue-700" fullWidth type="submit">
            Sign In
          </Button>

          {error && (
            <Typography color="red" className="mt-4 text-center text-sm">
              {error}
            </Typography>
          )}

          <div className="flex justify-between mt-6">

            <Typography variant="small">
              <Link to="/auth/forgot-password" className="text-blue-600">
                Forgot Password
              </Link>
            </Typography>

            <Typography variant="small">
              <Link to="/auth/professor/sign-up" className="text-blue-600">
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