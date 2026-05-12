import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";

import {
  HomeIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

import { ProfileInfoCard } from "@/widgets/cards";

export function Profile() {
  const [student, setStudent] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const id = localStorage.getItem("id");

    fetch(`http://localhost:8080/api/students/by-id/${id}`)
      .then((res) => res.json())
      .then((data) => setStudent(data))
      .catch((err) => console.log(err));
  }, []);

  const uploadImage = async () => {
    if (!selectedImage) {
      alert("❌ Please select image");
      return;
    }

    const id = student.id;

    const formData = new FormData();
    formData.append("image", selectedImage);

    const res = await fetch(
      `http://localhost:8080/api/students/image/upload/${id}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (res.ok) {
      alert("✅ Image Updated");
      setOpenEdit(false);

      const updated = await fetch(
        `http://localhost:8080/api/students/by-id/${id}`
      );

      const data = await updated.json();
      setStudent(data);
    } else {
      alert("❌ Upload failed");
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Background Banner */}
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/student-background.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>

      {/* Main Card */}
      <Card className="mx-3 -mt-16 mb-6 border border-blue-gray-100 shadow-lg lg:mx-4">
        <CardBody className="p-6">

          {/* Header Section */}
          <div className="mb-10 flex flex-wrap items-center justify-between gap-6">

            {/* Profile Section */}
            <div className="flex items-center gap-6">

              {/* Avatar with Hover Effect */}
              <div className="relative group">

                <Avatar
                  src={
                    student.imageUrl
                      ? `http://localhost:8080/api/students/image/get/${student.id}`
                      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  }
                  alt={student.studName}
                  size="xxl"
                  variant="rounded"
                  className="cursor-pointer rounded-2xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:opacity-80"
                  onClick={() => setOpenEdit(true)}
                />

                {/* Hover Overlay */}
                <div
                  onClick={() => setOpenEdit(true)}
                  className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-all duration-300 group-hover:opacity-100 cursor-pointer"
                >
                  <div className="rounded-full bg-white p-2 shadow-md">
                    <PencilIcon className="h-5 w-5 text-blue-gray-700" />
                  </div>
                </div>
              </div>

              {/* Student Info */}
              <div>
                <Typography
                  variant="h4"
                  color="blue-gray"
                  className="mb-1 font-bold"
                >
                  {`${student.studName} ${student.studLastName}`}
                </Typography>
              </div>
            </div>

            {/* Tabs */}
            <div className="w-full md:w-96">
              <Tabs value="info">
                <TabsHeader>
                  <Tab value="info">
                    <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Info
                  </Tab>

                  <Tab value="settings">
                    <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Settings
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>

          {/* Content Section */}
          <div className="grid grid-cols-1 gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">

            {/* Personal Info */}
            <div>
              <h3
                className={`mb-4 cursor-pointer text-lg transition-all duration-200 ${
                  activeTab === "info"
                    ? "font-bold text-blue-600"
                    : "text-blue-gray-700"
                }`}
                onClick={() => setActiveTab("info")}
              >
                Personal Information
              </h3>

              {activeTab === "info" && (
                <ProfileInfoCard
                  title="Student Details"
                  description="Here are the student's personal and academic details."
                  details={{
                    "Full Name": `${student.studName} ${student.studLastName}`,
                    "Father's Name": student.studFatherName,
                    "Roll Number": student.studRollNo,
                    "Date of Birth": student.studentDob,
                    "Phone Number": student.studPhoneNumber,
                    Email: student.email,
                    Category: student.studCategory,
                    Caste: student.studCaste,
                  }}
                />
              )}
            </div>

            {/* Academic Info */}
            <div>
              <h3
                className={`mb-4 cursor-pointer text-lg transition-all duration-200 ${
                  activeTab === "academic"
                    ? "font-bold text-blue-600"
                    : "text-blue-gray-700"
                }`}
                onClick={() => setActiveTab("academic")}
              >
                Academic Information
              </h3>

              {activeTab === "academic" && (
  <div className="space-y-8">

    {/* Academic Header */}
    <div className="rounded-[30px] bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 p-8 shadow-2xl">

      <div className="mb-8 text-center">

        <Typography
          variant="h4"
          className="font-extrabold tracking-wide text-white"
        >
          Academic Information
        </Typography>

        <Typography className="mt-2 text-sm text-white/80">
          Student class details and academic overview
        </Typography>

      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {/* Roll Number */}
        <div className="group rounded-3xl bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white/20 hover:shadow-2xl">

          <div className="mb-3 flex items-center justify-between">

            <Typography className="text-sm font-medium uppercase tracking-wider text-white/70">
              Roll Number
            </Typography>

            <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
              ID
            </div>
          </div>

          <Typography className="text-3xl font-extrabold text-white">
            {student.studRollNo}
          </Typography>

        </div>

        {/* Class Name */}
        <div className="group rounded-3xl bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white/20 hover:shadow-2xl">

          <div className="mb-3 flex items-center justify-between">

            <Typography className="text-sm font-medium uppercase tracking-wider text-white/70">
              Class Name
            </Typography>

            <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
              CLASS
            </div>
          </div>

          <Typography className="text-3xl font-extrabold text-white">
            {student.className}
          </Typography>

        </div>

        {/* Category */}
        <div className="group rounded-3xl bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-white/20 hover:shadow-2xl">

          <div className="mb-3 flex items-center justify-between">

            <Typography className="text-sm font-medium uppercase tracking-wider text-white/70">
              Category
            </Typography>

            <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
              INFO
            </div>
          </div>

          <Typography className="text-3xl font-extrabold text-white">
            {student.studCategory}
          </Typography>

        </div>

      </div>
    </div>
  </div>
)}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Edit Modal */}
      {openEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

          <div className="w-80 rounded-2xl bg-white p-6 shadow-2xl">

            <h2 className="mb-4 text-xl font-bold text-blue-gray-800">
              Update Profile Image
            </h2>

            <input
              type="file"
              onChange={handleImageChange}
              className="mb-6 w-full rounded-lg border border-gray-300 p-2"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setOpenEdit(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={uploadImage}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:bg-blue-700"
              >
                Upload
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;