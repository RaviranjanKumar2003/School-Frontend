import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function HODSignIn() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ================= LOGIN =================
  const handleSignIn = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const response = await fetch(
        "http://localhost:8080/api/hods/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      // ================= LOGIN SUCCESS =================
      if (response.ok) {

        const data = await response.json();

        console.log("LOGIN RESPONSE:", data);

        const hodId = data.id;

        // SAVE ROLE
        localStorage.setItem("userRole", "hod");

        // SAVE HOD ID
        localStorage.setItem("hodId", hodId);

        // ================= FETCH FULL HOD =================
        const hodResponse = await fetch(
          `http://localhost:8080/api/hods/${hodId}`
        );

        if (hodResponse.ok) {

          const hodData = await hodResponse.json();

          console.log("FULL HOD DATA:", hodData);

          // ================= SAVE FULL DATA =================
          localStorage.setItem(
            "hodData",
            JSON.stringify(hodData)
          );

          /*
            IMPORTANT:
            schoolName yaha save hoga
          */

          console.log(
            "SCHOOL NAME:",
            hodData.schoolName
          );

          // ================= REDIRECT =================
          navigate("/dashboard/hod/home");

        } else {

          throw new Error(
            `Failed to fetch HOD data: ${hodResponse.statusText}`
          );
        }

      } else {

        const errorData = await response.text();

        setError(errorData || "Login failed");
      }

    } catch (error) {

      console.error("Login Error:", error);

      setError(
        "An error occurred during login. Please try again."
      );
    }
  };

  return (

    <section className="m-8 flex justify-center gap-4">

      <div className="w-full lg:w-3/5 mt-18">

        {/* ================= TITLE ================= */}
        <div className="text-center">

          <Typography
            variant="h2"
            className="font-bold mb-4"
          >
            HOD Sign In
          </Typography>

          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your username and password to Sign In.
          </Typography>

        </div>

        {/* ================= FORM ================= */}
        <form
          className="
            mt-8 mb-2 mx-auto
            w-80 max-w-screen-lg lg:w-1/2
          "
          onSubmit={handleSignIn}
        >

          <div className="mb-1 flex flex-col gap-6">

            {/* USERNAME */}
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Your Username
            </Typography>

            <Input
              size="lg"
              placeholder="HODUsername"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="
                !border-t-blue-gray-200
                focus:!border-t-gray-900
              "
              labelProps={{
                className:
                  "before:content-none after:content-none",
              }}
            />

            {/* PASSWORD */}
            <Typography
              variant="small"
              color="blue-gray"
              className="-mb-3 font-medium"
            >
              Password
            </Typography>

            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="
                !border-t-blue-gray-200
                focus:!border-t-gray-900
              "
              labelProps={{
                className:
                  "before:content-none after:content-none",
              }}
            />

          </div>

          {/* TERMS */}
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="
                  flex items-center justify-start
                  font-medium
                "
              >
                I agree to the&nbsp;

                <a
                  href="#"
                  className="
                    font-normal text-black
                    transition-colors
                    hover:text-gray-900
                    underline
                  "
                >
                  Terms and Conditions
                </a>

              </Typography>
            }
            containerProps={{
              className: "-ml-2.5",
            }}
          />

          {/* LOGIN BUTTON */}
          <Button
            className="mt-6"
            fullWidth
            type="submit"
          >
            Sign In
          </Button>

          {/* ERROR */}
          {error && (

            <Typography
              variant="small"
              color="red"
              className="mt-4 text-center"
            >
              {error}
            </Typography>

          )}

          {/* FORGOT PASSWORD */}
          <div className="flex items-center justify-between gap-2 mt-6">

            <Typography
              variant="small"
              className="font-medium text-gray-900"
            >
              <Link to="/auth/forgot-password">
                Forgot Password
              </Link>
            </Typography>

          </div>

          {/* SIGNUP */}
          <Typography
            variant="paragraph"
            className="
              text-center text-blue-gray-500
              font-medium mt-4
            "
          >
            Not registered?

            <Link
              to="/auth/hod/sign-up"
              className="text-gray-900 ml-1"
            >
              Create account
            </Link>

          </Typography>

        </form>

      </div>

    </section>
  );
}

export default HODSignIn;