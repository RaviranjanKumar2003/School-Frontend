import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function SuperAdminSignIn() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= LOGIN =================
  const handleSignIn = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await fetch(
        "http://localhost:8080/api/super-admin/login",
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

      // ================= SUCCESS =================
      if (response.ok) {

        const data = await response.json();

        console.log("SUPER ADMIN DATA:", data);

        const adminId = data.id;

        // SAVE ROLE
        localStorage.setItem(
          "userRole",
          "superadmin"
        );

        // SAVE ID
        localStorage.setItem(
          "adminId",
          adminId
        );

        // SAVE FULL ADMIN DATA
        localStorage.setItem(
          "adminData",
          JSON.stringify(data)
        );

        console.log(
          "SUPER ADMIN NAME:",
          data.name
        );

        // REDIRECT
        navigate("/dashboard/superadmin/home");

      } else {

        const errorText = await response.text();

        setError(
          errorText || "Invalid credentials"
        );
      }

    } catch (err) {

      console.error("LOGIN ERROR:", err);

      setError(
        "Login failed. Please try again."
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
            className="font-bold mb-4"
          >
            Super Admin Sign In
          </Typography>

          <Typography variant="paragraph">
            Enter credentials to access system control
          </Typography>

        </div>

        {/* ================= FORM ================= */}
        <form
          className="
            mt-8 mx-auto
            w-80 lg:w-96
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
                setUsername(e.target.value)
              }
            />

            {/* PASSWORD */}
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

          {/* BUTTON */}
          <Button
            className="mt-8"
            color="blue-gray"
            fullWidth
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          {/* ERROR */}
          {error && (

            <Typography
              className="
                mt-4
                text-red-500
                text-center
              "
            >
              {error}
            </Typography>

          )}

        </form>

      </div>

    </section>
  );
}

export default SuperAdminSignIn;