import React, {
  useEffect,
  useState,
  useRef,
} from "react";

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

  // ================= STATES =================
  const [professor, setProfessor] =
    useState(null);

  const [coverImages, setCoverImages] =
    useState([]);

  const [coverIndex, setCoverIndex] =
    useState(0);

  const [uploading, setUploading] =
    useState(false);

  const [refreshKey, setRefreshKey] =
    useState(Date.now());

  const fileRef = useRef(null);

  // ================= LOAD PROFESSOR =================
  useEffect(() => {

    const loadProfessor =
      async () => {

        try {

          const stored =
            localStorage.getItem(
              "professorData"
            );

          if (!stored) return;

          const parsed =
            JSON.parse(stored);

          // ===== ALWAYS FETCH LATEST DATA =====
          const res =
            await axios.get(
              `http://localhost:8080/api/professors/${parsed.id}`
            );

          console.log(
            "LATEST PROFESSOR =",
            res.data
          );

          setProfessor(res.data);

          localStorage.setItem(
            "professorData",
            JSON.stringify(res.data)
          );

        } catch (err) {

          console.error(
            "Professor load error:",
            err.response?.data ||
              err.message
          );
        }
      };

    loadProfessor();

  }, []);

  const professorId =
    professor?.id;

  // ================= SCHOOL ID =================
  const schoolId =
    professor?.school?.id;

  console.log(
    "SCHOOL ID =",
    schoolId
  );

  // ================= FETCH SCHOOL COVER IMAGES =================
  useEffect(() => {

    const fetchSchoolCover =
      async () => {

        if (!schoolId) return;

        try {

          const res =
            await axios.get(
              `http://localhost:8080/api/schools/${schoolId}`
            );

          console.log(
            "SCHOOL DATA =",
            res.data
          );

          console.log(
            "COVER IMAGES =",
            res.data.coverImages
          );

          setCoverImages(
            Array.isArray(
              res.data.coverImages
            )
              ? res.data.coverImages
              : []
          );

        } catch (err) {

          console.error(
            "School cover fetch error:",
            err.response?.data ||
              err.message
          );
        }
      };

    fetchSchoolCover();

  }, [schoolId]);

  // ================= AUTO SLIDER =================
  useEffect(() => {

    if (
      coverImages.length <= 1
    )
      return;

    const interval =
      setInterval(() => {

        setCoverIndex((prev) =>

          prev ===
          coverImages.length - 1

            ? 0
            : prev + 1

        );

      }, 3000);

    return () =>
      clearInterval(interval);

  }, [coverImages]);

  // ================= PROFILE IMAGE =================
  const imageUrl = professorId

    ? `http://localhost:8080/api/professors/image/get/${professorId}?t=${refreshKey}`

    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  // ================= SCHOOL COVER URL =================
  const coverUrl = (
    fileName
  ) => {

    if (!fileName)
      return null;

    // ✅ CORRECT API
    return `http://localhost:8080/api/schools/cover/get-file/${fileName}`;
  };

  // ================= CURRENT COVER =================
  const currentCover =

    coverImages.length > 0

      ? coverUrl(
          coverImages[
            coverIndex
          ]
        )

      : "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1200";

  console.log(
    "CURRENT COVER =",
    currentCover
  );

  // ================= IMAGE UPLOAD =================
  const handleImageChange =
    async (e) => {

      const file =
        e.target.files?.[0];

      if (
        !file ||
        !professorId
      )
        return;

      try {

        setUploading(true);

        const formData =
          new FormData();

        // ✅ BACKEND PARAM NAME
        formData.append(
          "file",
          file
        );

        await axios.post(

          `http://localhost:8080/api/professors/image/upload/${professorId}`,

          formData,

          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        // ================= REFRESH IMAGE =================
        setRefreshKey(
          Date.now()
        );

        // ================= REFRESH PROFESSOR =================
        const updated =
          await axios.get(
            `http://localhost:8080/api/professors/${professorId}`
          );

        setProfessor(
          updated.data
        );

        localStorage.setItem(
          "professorData",
          JSON.stringify(
            updated.data
          )
        );

      } catch (err) {

        console.error(
          "Upload Error:",
          err.response?.data ||
            err.message
        );

      } finally {

        setUploading(false);
      }
    };

  // ================= ASSIGNMENTS =================
  const groupedAssignments =

    professor?.assignments?.reduce(

      (acc, item) => {

        const key =
          item.className ||
          item.classId;

        if (!acc[key]) {

          acc[key] = [];
        }

        acc[key].push(
          item.subjectName
        );

        return acc;
      },

      {}
    ) || {};

  // ================= LOADING =================
  if (!professor) {

    return (

      <div className="text-center mt-10">

        Loading...

      </div>
    );
  }

  return (
    <>

      {/* ================= COVER ================= */}

      <div
        className="
          relative
          mt-8
          h-72
          w-full
          overflow-hidden
          rounded-2xl
          shadow-xl
        "
      >

        <img
          src={currentCover}
          alt="cover"
          className="
            w-full
            h-full
            object-cover
            transition-all
            duration-700
          "
          onError={(e) => {

            e.target.onerror =
              null;

            e.target.src =
              "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1200";
          }}
        />

        <div
          className="
            absolute
            inset-0
            bg-black/50
          "
        />

        {/* DOTS */}

        <div
          className="
            absolute
            bottom-4
            left-1/2
            -translate-x-1/2
            flex
            gap-2
          "
        >

          {coverImages.map(
            (_, i) => (

              <div
                key={i}
                className={`
                  w-3
                  h-3
                  rounded-full
                  ${
                    i ===
                    coverIndex
                      ? "bg-white"
                      : "bg-gray-400"
                  }
                `}
              />

            )
          )}

        </div>

      </div>

      {/* ================= PROFILE CARD ================= */}

      <Card
        className="
          mx-3
          -mt-16
          mb-6
          border
          border-blue-gray-100
          rounded-3xl
          shadow-xl
        "
      >

        <CardBody className="p-6">

          <div
            className="
              mb-10
              flex
              items-center
              justify-between
              flex-wrap
              gap-6
            "
          >

            {/* PROFILE */}

            <div
              className="
                flex
                items-center
                gap-6
              "
            >

              <div
                className="
                  relative
                  group
                "
              >

                <Avatar
                  src={imageUrl}
                  alt="profile"
                  size="xxl"
                  className="
                    rounded-xl
                    shadow-xl
                    border-4
                    border-white
                  "
                  onError={(e) => {

                    e.target.onerror =
                      null;

                    e.target.src =
                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                  }}
                />

                {/* CAMERA */}

                <div
                  onClick={() =>
                    fileRef.current?.click()
                  }
                  className="
                    absolute
                    inset-0
                    bg-black/50
                    flex
                    items-center
                    justify-center
                    opacity-0
                    group-hover:opacity-100
                    transition
                    cursor-pointer
                    rounded-xl
                  "
                >

                  <CameraIcon
                    className="
                      h-8
                      w-8
                      text-white
                    "
                  />

                </div>

                {/* LOADING */}

                {uploading && (

                  <div
                    className="
                      absolute
                      inset-0
                      bg-black/70
                      flex
                      items-center
                      justify-center
                      text-white
                      text-sm
                      rounded-xl
                    "
                  >

                    Uploading...

                  </div>

                )}

              </div>

              <div>

                <Typography variant="h4">

                  {professor.name}

                </Typography>

                <Typography
                  variant="small"
                  className="text-gray-600"
                >

                  {professor.email}

                </Typography>

                <Typography
                  variant="small"
                  className="text-blue-600 font-semibold mt-1"
                >

                  {professor?.school?.schoolName}

                </Typography>

              </div>

            </div>

            {/* TABS */}

            <Tabs value="info">

              <TabsHeader>

                <Tab value="info">

                  <HomeIcon
                    className="
                      h-5
                      w-5
                      mr-2
                      inline
                    "
                  />

                  Info

                </Tab>

                <Tab value="settings">

                  <Cog6ToothIcon
                    className="
                      h-5
                      w-5
                      mr-2
                      inline
                    "
                  />

                  Settings

                </Tab>

              </TabsHeader>

            </Tabs>

          </div>

          {/* FILE INPUT */}

          <input
            type="file"
            hidden
            ref={fileRef}
            accept="image/*"
            onChange={
              handleImageChange
            }
          />

          {/* DETAILS */}

          <ProfileInfoCard
            title="Professor Details"
            details={{
              School:
                professor?.school
                  ?.schoolName,
              "Full Name":
                professor.name,
              Email:
                professor.email,
              Phone:
                professor.phone,
              Designation:
                professor.designation,
              Qualification:
                professor.qualification,
              Experience:
                professor.experience,
            }}
            action={

              <Tooltip content="Edit Profile">

                <PencilIcon
                  className="
                    h-5
                    w-5
                    cursor-pointer
                  "
                />

              </Tooltip>

            }
          />

          {/* ASSIGNMENTS */}

          <div className="mt-10">

            <Typography
              variant="h6"
              className="mb-4"
            >

              Assigned Classes & Subjects

            </Typography>

            {Object.keys(
              groupedAssignments
            ).length > 0 ? (

              Object.entries(
                groupedAssignments
              ).map(
                (
                  [cls, subjects],
                  i
                ) => (

                  <div
                    key={i}
                    className="
                      p-4
                      border
                      rounded-xl
                      bg-gray-50
                      mb-3
                    "
                  >

                    <Typography className="font-semibold">

                      Class: {cls}

                    </Typography>

                    <Typography className="text-gray-600">

                      Subjects:{" "}
                      {subjects.join(
                        ", "
                      )}

                    </Typography>

                  </div>

                )
              )

            ) : (

              <Typography>

                No assignments found

              </Typography>

            )}

          </div>

        </CardBody>

      </Card>

    </>
  );
}

export default Profile;