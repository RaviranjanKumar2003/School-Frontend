import { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";

import { useParams, useNavigate } from "react-router-dom";

import {
  BuildingOffice2Icon,
  UserCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  KeyIcon,
} from "@heroicons/react/24/solid";

const BASE_URL = "http://localhost:8080/api";

export default function Schools() {

  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
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

  // ================= FETCH ALL =================
  const fetchSchools = async () => {
    try {
      const res = await fetch(`${BASE_URL}/schools`);
      const data = await res.json();
      setSchools(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // ================= FETCH BY ID (EDIT MODE) =================
  const fetchSchoolById = async () => {
    try {
      const res = await fetch(`${BASE_URL}/schools/${id}`);
      const data = await res.json();

      setForm({
        schoolName: data.schoolName || "",
        schoolCode: data.schoolCode || "",
        address: data.address || "",
        email: data.email || "",
        phone: data.phone || "",

        adminName: data.schoolAdmin?.name || "",
        adminUsername: data.schoolAdmin?.username || "",
        adminPassword: "",
        adminEmail: data.schoolAdmin?.email || "",
        adminPhone: data.schoolAdmin?.phone || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchSchoolById();
    }
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SAVE (CREATE + UPDATE) =================
  const saveSchool = async () => {
    try {
      setLoading(true);

      const payload = {
        schoolName: form.schoolName,
        schoolCode: form.schoolCode,
        address: form.address,
        email: form.email,
        phone: form.phone,

        schoolAdmin: {
          name: form.adminName,
          username: form.adminUsername,
          password: form.adminPassword,
          email: form.adminEmail,
          phone: form.adminPhone,
        },
      };

      const url = isEdit
        ? `${BASE_URL}/schools/${id}`
        : `${BASE_URL}/schools`;

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed");

      alert(
        isEdit
          ? "School Updated Successfully"
          : "School & School Admin Created Successfully"
      );

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

      if (isEdit) {
        navigate("/superadmin/home");
      }

    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">

      {/* HEADER */}
      <div className="mb-8">

        <Typography variant="h2" className="font-bold text-blue-700">
          School Management
        </Typography>

        <Typography className="text-gray-600 mt-2">
          Create School & School Admin Together
        </Typography>

      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* SCHOOL */}
        <Card className="rounded-3xl shadow-2xl border border-blue-100">
          <CardBody>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-2xl">
                <BuildingOffice2Icon className="h-7 w-7 text-blue-700" />
              </div>

              <div>
                <Typography variant="h4" className="font-bold">
                  School Details
                </Typography>
                <Typography className="text-sm text-gray-500">
                  Basic information about school
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Input label="School Name" name="schoolName" value={form.schoolName} onChange={handleChange} />
              <Input label="School Code" name="schoolCode" value={form.schoolCode} onChange={handleChange} />
              <Input label="School Email" name="email" value={form.email} onChange={handleChange} />
              <Input label="School Phone" name="phone" value={form.phone} onChange={handleChange} />

              <div className="md:col-span-2">
                <Input label="School Address" name="address" value={form.address} onChange={handleChange} />
              </div>

            </div>

          </CardBody>
        </Card>

        {/* ADMIN */}
        <Card className="rounded-3xl shadow-2xl border border-green-100">
          <CardBody>

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-3 rounded-2xl">
                <UserCircleIcon className="h-7 w-7 text-green-700" />
              </div>

              <div>
                <Typography variant="h4" className="font-bold">
                  School Admin Details
                </Typography>
                <Typography className="text-sm text-gray-500">
                  Login credentials for school admin
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <Input label="Admin Name" name="adminName" value={form.adminName} onChange={handleChange} />
              <Input label="Username" name="adminUsername" value={form.adminUsername} onChange={handleChange} />
              <Input label="Password" name="adminPassword" value={form.adminPassword} onChange={handleChange} />
              <Input label="Admin Email" name="adminEmail" value={form.adminEmail} onChange={handleChange} />

              <div className="md:col-span-2">
                <Input label="Admin Phone" name="adminPhone" value={form.adminPhone} onChange={handleChange} />
              </div>

            </div>

          </CardBody>
        </Card>

      </div>

      {/* BUTTON */}
      <div className="flex justify-center mt-10">

        <Button
          size="lg"
          color="blue"
          onClick={saveSchool}
          disabled={loading}
          className="rounded-2xl px-10 py-4 shadow-xl text-base"
        >
          {loading
            ? "Saving..."
            : isEdit
              ? "Update School"
              : "Create School & Admin"}
        </Button>

      </div>
    </div>
  );
}