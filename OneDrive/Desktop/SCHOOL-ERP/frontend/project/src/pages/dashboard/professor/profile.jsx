import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Tooltip,
} from "@material-tailwind/react";

import {
  HomeIcon,
  Cog6ToothIcon,
  PencilIcon,
  CameraIcon,
} from "@heroicons/react/24/solid";

import { ProfileInfoCard } from "@/widgets/cards";

export function Profile() {

  const [professor, setProfessor] = useState(null);
  const [coverImages, setCoverImages] = useState([]); // ✅ FIX
  const [uploading, setUploading] = useState(false);
  const [coverIndex, setCoverIndex] = useState(0);

  const fileRef = useRef(null);

  // ================= LOAD PROFESSOR =================
  useEffect(() => {
    const stored = localStorage.getItem("professorData");

    if (stored) {
      try {
        setProfessor(JSON.parse(stored));
      } catch (e) {
        console.error("Invalid professor data");
      }
    }
  }, []);

  const professorId = professor?.id;
  const hodId = professor?.hodId;

  // ================= FETCH HOD COVER IMAGES (MAIN FIX) =================
  useEffect(() => {
    const fetchHodCovers = async () => {
      if (!hodId) return;

      try {
        const res = await axios.get(
          `http://localhost:8080/api/hods/${hodId}`
        );

        console.log("HOD COVER IMAGES:", res.data.coverImages);

        setCoverImages(res.data.coverImages || []);
      } catch (err) {
        console.error("HOD cover fetch error:", err);
      }
    };

    fetchHodCovers();
  }, [hodId]);

  // ================= PROFILE IMAGE =================
  const imageUrl = professorId
    ? `http://localhost:8080/api/professors/image/get/${professorId}`
    : "/img/user.png";

  // ================= COVER URL =================
  const coverUrl = (fileName) => {
    if (!fileName || !hodId) return null;

    return `http://localhost:8080/api/hods/cover/get-file/${hodId}/${fileName}`;
  };

  const currentCover =
    coverImages.length > 0
      ? coverUrl(coverImages[coverIndex])
      : null;

  // ================= AUTO SLIDER =================
  useEffect(() => {
    if (coverImages.length <= 1) return;

    const interval = setInterval(() => {
      setCoverIndex((prev) =>
        prev === coverImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [coverImages]);

  // ================= IMAGE UPLOAD =================
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !professorId) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const res = await axios.post(
        `http://localhost:8080/api/professors/image/upload/${professorId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updated = res.data;
      setProfessor(updated);
      localStorage.setItem("professorData", JSON.stringify(updated));

    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setUploading(false);
    }
  };

  // ================= GROUP DATA =================
  const groupedAssignments =
    professor?.assignments?.reduce((acc, item) => {
      const key = item.className || item.classId;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item.subjectName);
      return acc;
    }, {}) || {};

  if (!professor) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <>
      {/* ================= COVER ================= */}
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl">

        {currentCover ? (
          <img
            src={currentCover}
            className="w-full h-full object-cover transition-all duration-700"
            onError={(e) => {
              e.target.src = "/img/student-background.png";
            }}
          />
        ) : (
          <img
            src="/img/student-background.png"
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-black/60" />

        {/* DOTS */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {coverImages.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === coverIndex ? "bg-white" : "bg-gray-500"
              }`}
            />
          ))}
        </div>

      </div>

      {/* ================= PROFILE CARD ================= */}
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">

          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">

            {/* AVATAR */}
            <div className="flex items-center gap-6">

              <div className="relative group">

                <Avatar
                  src={imageUrl}
                  size="xl"
                  variant="rounded"
                  className="rounded-lg shadow-lg"
                />

                <div
                  onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer rounded-lg"
                >
                  <CameraIcon className="h-7 w-7 text-white" />
                </div>

                {uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm">
                    Uploading...
                  </div>
                )}

              </div>

              <div>
                <Typography variant="h5">{professor.name}</Typography>
                <Typography variant="small">{professor.email}</Typography>
              </div>

            </div>

            <Tabs value="info">
              <TabsHeader>
                <Tab value="info">
                  <HomeIcon className="h-5 w-5 mr-2 inline" />
                  Info
                </Tab>
                <Tab value="settings">
                  <Cog6ToothIcon className="h-5 w-5 mr-2 inline" />
                  Settings
                </Tab>
              </TabsHeader>
            </Tabs>

          </div>

          {/* FILE INPUT */}
          <input
            type="file"
            ref={fileRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />

          {/* DETAILS */}
          <ProfileInfoCard
            title="Professor Details"
            details={{
              "Full Name": professor.name,
              Email: professor.email,
              Phone: professor.phone,
              Designation: professor.designation,
              Qualification: professor.qualification,
              Experience: professor.experience,
            }}
            action={
              <Tooltip content="Edit Profile">
                <PencilIcon className="h-4 w-4 cursor-pointer" />
              </Tooltip>
            }
          />

          {/* ASSIGNMENTS */}
          <div className="mt-10">

            <Typography variant="h6" className="mb-4">
              Assigned Classes & Subjects
            </Typography>

            {Object.keys(groupedAssignments).length > 0 ? (
              Object.entries(groupedAssignments).map(([cls, subjects], i) => (
                <div key={i} className="p-4 border rounded-xl bg-gray-50 mb-3">
                  <Typography className="font-semibold">
                    Class: {cls}
                  </Typography>
                  <Typography className="text-gray-600">
                    Subjects: {subjects.join(", ")}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography>No assignments found</Typography>
            )}

          </div>

        </CardBody>
      </Card>
    </>
  );
}

export default Profile;