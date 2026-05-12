import { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";

import {
  BuildingOffice2Icon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  KeyIcon,
} from "@heroicons/react/24/solid";

export default function Schools() {

  const [schools, setSchools] = useState([]);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({

    // ================= SCHOOL =================
    schoolName: "",
    schoolCode: "",
    address: "",
    email: "",
    phone: "",

    // ================= SCHOOL ADMIN =================
    adminName: "",
    adminUsername: "",
    adminPassword: "",
    adminEmail: "",
    adminPhone: "",

  });

  // ================= FETCH =================
  const fetchSchools = async () => {

    try {

      const res = await fetch(
        "http://localhost:8080/api/schools"
      );

      const data = await res.json();

      setSchools(data);

    } catch (err) {

      console.log(err);
    }
  };

  useEffect(() => {

    fetchSchools();

  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= CREATE SCHOOL =================
  const createSchool = async () => {

    try {

      setLoading(true);

      const payload = {

        // ================= SCHOOL =================
        schoolName: form.schoolName,
        schoolCode: form.schoolCode,
        address: form.address,
        email: form.email,
        phone: form.phone,

        // ================= SCHOOL ADMIN =================
        schoolAdmin: {

          name: form.adminName,
          username: form.adminUsername,
          password: form.adminPassword,
          email: form.adminEmail,
          phone: form.adminPhone,

        },
      };

      const response = await fetch(
        "http://localhost:8080/api/schools",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {

        throw new Error("Failed");
      }

      alert(
        "School & School Admin Created Successfully"
      );

      // ================= RESET =================
      setForm({

        schoolName: "",
        schoolCode: "",
        address: "",
        email: "",
        phone: "",

        adminName: "",
        adminUsername: "",
        adminPassword: "",
        adminEmail: "",
        adminPhone: "",

      });

      fetchSchools();

    } catch (err) {

      console.log(err);

      alert("Something went wrong");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">

      {/* ================= HEADER ================= */}
      <div className="mb-8">

        <Typography
          variant="h2"
          className="font-bold text-blue-700"
        >
          School Management
        </Typography>

        <Typography className="text-gray-600 mt-2">
          Create School & School Admin Together
        </Typography>

      </div>

      {/* ================= FORM SECTION ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ================= SCHOOL DETAILS ================= */}
        <Card className="rounded-3xl shadow-2xl border border-blue-100">

          <CardBody>

            <div className="flex items-center gap-3 mb-6">

              <div className="bg-blue-100 p-3 rounded-2xl">

                <BuildingOffice2Icon className="h-7 w-7 text-blue-700" />

              </div>

              <div>

                <Typography
                  variant="h4"
                  className="font-bold"
                >
                  School Details
                </Typography>

                <Typography className="text-sm text-gray-500">
                  Basic information about school
                </Typography>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Input
                label="School Name"
                name="schoolName"
                value={form.schoolName}
                onChange={handleChange}
              />

              <Input
                label="School Code"
                name="schoolCode"
                value={form.schoolCode}
                onChange={handleChange}
              />

              <Input
                label="School Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                icon={
                  <EnvelopeIcon className="h-5 w-5" />
                }
              />

              <Input
                label="School Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                icon={
                  <PhoneIcon className="h-5 w-5" />
                }
              />

              <div className="md:col-span-2">

                <Input
                  label="School Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />

              </div>

            </div>

          </CardBody>

        </Card>

        {/* ================= SCHOOL ADMIN ================= */}
        <Card className="rounded-3xl shadow-2xl border border-green-100">

          <CardBody>

            <div className="flex items-center gap-3 mb-6">

              <div className="bg-green-100 p-3 rounded-2xl">

                <UserCircleIcon className="h-7 w-7 text-green-700" />

              </div>

              <div>

                <Typography
                  variant="h4"
                  className="font-bold"
                >
                  School Admin Details
                </Typography>

                <Typography className="text-sm text-gray-500">
                  Login credentials for school admin
                </Typography>

              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Input
                label="Admin Name"
                name="adminName"
                value={form.adminName}
                onChange={handleChange}
              />

              <Input
                label="Username"
                name="adminUsername"
                value={form.adminUsername}
                onChange={handleChange}
                icon={
                  <UserCircleIcon className="h-5 w-5" />
                }
              />

              <Input
                type="password"
                label="Password"
                name="adminPassword"
                value={form.adminPassword}
                onChange={handleChange}
                icon={
                  <KeyIcon className="h-5 w-5" />
                }
              />

              <Input
                label="Admin Email"
                name="adminEmail"
                value={form.adminEmail}
                onChange={handleChange}
                icon={
                  <EnvelopeIcon className="h-5 w-5" />
                }
              />

              <div className="md:col-span-2">

                <Input
                  label="Admin Phone"
                  name="adminPhone"
                  value={form.adminPhone}
                  onChange={handleChange}
                  icon={
                    <PhoneIcon className="h-5 w-5" />
                  }
                />

              </div>

            </div>

          </CardBody>

        </Card>

      </div>

      {/* ================= BUTTON ================= */}
      <div className="flex justify-center mt-10">

        <Button
          size="lg"
          color="blue"
          onClick={createSchool}
          disabled={loading}
          className="rounded-2xl px-10 py-4 shadow-xl text-base"
        >
          {loading
            ? "Creating..."
            : "Create School & Admin"}
        </Button>

      </div>

      {/* ================= TABLE ================= */}
      <Card className="mt-12 rounded-3xl shadow-2xl overflow-hidden">

        <CardBody>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>

              <Typography
                variant="h4"
                className="font-bold"
              >
                All Schools
              </Typography>

              <Typography className="text-gray-500">
                Manage all registered schools
              </Typography>

            </div>

            <div className="bg-blue-100 text-blue-700 px-5 py-2 rounded-xl font-semibold w-fit">

              Total Schools : {schools.length}

            </div>

          </div>

          {/* ================= MOBILE VIEW ================= */}
          <div className="lg:hidden flex flex-col gap-4">

            {schools.map((school) => (

              <Card
                key={school.id}
                className="border shadow-md"
              >

                <CardBody>

                  <Typography
                    variant="h6"
                    className="font-bold text-blue-700"
                  >
                    {school.schoolName}
                  </Typography>

                  <div className="mt-3 space-y-1 text-sm">

                    <p>
                      <span className="font-semibold">
                        Code :
                      </span>{" "}
                      {school.schoolCode}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Email :
                      </span>{" "}
                      {school.email}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Phone :
                      </span>{" "}
                      {school.phone}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Admin :
                      </span>{" "}
                      {school.schoolAdmin?.name}
                    </p>

                    <p>
                      <span className="font-semibold">
                        Username :
                      </span>{" "}
                      {school.schoolAdmin?.username}
                    </p>

                  </div>

                </CardBody>

              </Card>

            ))}

          </div>

          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden lg:block overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead>

                <tr className="bg-blue-600 text-white">

                  <th className="p-4 text-left">
                    School
                  </th>

                  <th className="p-4 text-left">
                    Code
                  </th>

                  <th className="p-4 text-left">
                    Email
                  </th>

                  <th className="p-4 text-left">
                    Phone
                  </th>

                  <th className="p-4 text-left">
                    Address
                  </th>

                  <th className="p-4 text-left">
                    School Admin
                  </th>

                </tr>

              </thead>

              <tbody>

                {schools.map((school, index) => (

                  <tr
                    key={school.id}
                    className={`border-b transition hover:bg-blue-50 ${
                      index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50"
                    }`}
                  >

                    <td className="p-4 font-semibold">
                      {school.schoolName}
                    </td>

                    <td className="p-4">
                      {school.schoolCode}
                    </td>

                    <td className="p-4">
                      {school.email}
                    </td>

                    <td className="p-4">
                      {school.phone}
                    </td>

                    <td className="p-4">
                      {school.address}
                    </td>

                    <td className="p-4">

                      <div className="flex flex-col">

                        <span className="font-semibold">
                          {school.schoolAdmin?.name}
                        </span>

                        <span className="text-sm text-gray-500">
                          {school.schoolAdmin?.username}
                        </span>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </CardBody>

      </Card>

    </div>
  );
}