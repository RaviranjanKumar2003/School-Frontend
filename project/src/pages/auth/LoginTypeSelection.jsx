import {
  Card,
  Button,
  Typography,
} from "@material-tailwind/react";

import {
  AcademicCapIcon,
  UserGroupIcon,
  UserIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/solid";

import { Link, useNavigate } from "react-router-dom";

export default function LoginTypeSelection() {

  const navigate = useNavigate();

  const handleLoginType = (type) => {
    navigate(`/auth/${type}/sign-in`);
  };

  return (

    <section
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-blue-600
        via-cyan-500
        to-teal-400
        px-4
      "
    >

      <Card
        className="
          w-full
          max-w-lg
          p-8
          rounded-3xl
          shadow-2xl
          border
          border-white/20
          backdrop-blur-sm
        "
      >

        {/* ================= HEADER ================= */}

        <div className="text-center mb-8">

          <Typography
            variant="h2"
            className="
              font-extrabold
              text-gray-800
              tracking-tight
            "
          >
            School ERP Login
          </Typography>

          <Typography
            variant="paragraph"
            className="
              mt-2
              text-gray-600
              text-base
            "
          >
            Select your role to access dashboard
          </Typography>

        </div>

        {/* ================= LOGIN BUTTONS ================= */}

        <div className="space-y-5">

          {/* HOD */}

          <Button
            fullWidth
            color="blue"
            size="lg"
            onClick={() => handleLoginType("hod")}
            className="
              flex
              items-center
              justify-center
              gap-3
              rounded-xl
              py-4
              text-base
              shadow-lg
              transition-all
              duration-300
              hover:scale-[1.02]
            "
          >

            <AcademicCapIcon className="h-6 w-6" />

            HOD Login

          </Button>

          {/* PROFESSOR */}

          <Button
            fullWidth
            color="green"
            size="lg"
            onClick={() => handleLoginType("professor")}
            className="
              flex
              items-center
              justify-center
              gap-3
              rounded-xl
              py-4
              text-base
              shadow-lg
              transition-all
              duration-300
              hover:scale-[1.02]
            "
          >

            <UserGroupIcon className="h-6 w-6" />

            Professor Login

          </Button>

          {/* STUDENT */}

          <Button
            fullWidth
            color="purple"
            size="lg"
            onClick={() => handleLoginType("student")}
            className="
              flex
              items-center
              justify-center
              gap-3
              rounded-xl
              py-4
              text-base
              shadow-lg
              transition-all
              duration-300
              hover:scale-[1.02]
            "
          >

            <UserIcon className="h-6 w-6" />

            Student Login

          </Button>

          {/* SCHOOL ADMIN */}

          <Button
            fullWidth
            color="amber"
            size="lg"
            onClick={() => handleLoginType("schooladmin")}
            className="
              flex
              items-center
              justify-center
              gap-3
              rounded-xl
              py-4
              text-base
              shadow-lg
              transition-all
              duration-300
              hover:scale-[1.02]
            "
          >

            <BuildingOffice2Icon className="h-6 w-6" />

            School Admin Login

          </Button>

          {/* SUPER ADMIN */}

          <Button
            fullWidth
            color="red"
            size="lg"
            onClick={() => handleLoginType("superadmin")}
            className="
              flex
              items-center
              justify-center
              gap-3
              rounded-xl
              py-4
              text-base
              shadow-lg
              transition-all
              duration-300
              hover:scale-[1.02]
            "
          >

            <ShieldCheckIcon className="h-6 w-6" />

            Super Admin Login

          </Button>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="mt-8 text-center">

          <Typography
            variant="small"
            className="text-gray-700"
          >
            Not registered yet?

            <Link
              to="/auth/sign-up"
              className="
                ml-1
                font-semibold
                text-blue-700
                hover:underline
              "
            >
              Create an account
            </Link>

          </Typography>

        </div>

      </Card>

    </section>
  );
}