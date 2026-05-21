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
  AcademicCapIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

import { ProfileInfoCard } from "@/widgets/cards";

export function Profile() {

  // ================= STATES =================

  const [student, setStudent] =
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

  // ================= LOAD STUDENT =================

  useEffect(() => {

    const loadStudent =
      async () => {

        try {

          const stored =
            localStorage.getItem(
              "studentData"
            );

          let studentId = null;

          if (stored) {

            const parsed =
              JSON.parse(stored);

            studentId =
              parsed?.id;
          }

          // fallback
          if (!studentId) {

            studentId =
              localStorage.getItem(
                "id"
              );
          }

          if (!studentId)
            return;

          // ================= FETCH LATEST =================

          const res =
            await axios.get(
              `http://localhost:8080/api/students/${studentId}`
            );

          console.log(
            "LATEST STUDENT =",
            res.data
          );

          setStudent(
            res.data
          );

          localStorage.setItem(
            "studentData",
            JSON.stringify(
              res.data
            )
          );

        } catch (err) {

          console.error(
            "Student load error:",
            err.response?.data ||
              err.message
          );
        }
      };

    loadStudent();

  }, []);

  // ================= SCHOOL ID =================
  // ✅ FIXED

  const schoolId =
    student?.schoolId;

  console.log(
    "SCHOOL ID =",
    schoolId
  );

  // ================= FETCH SCHOOL COVER =================

  useEffect(() => {

    const fetchSchoolCover =
      async () => {

        if (!schoolId)
          return;

        try {

          const res =
            await axios.get(
              `http://localhost:8080/api/schools/${schoolId}`
            );

          console.log(
            "SCHOOL DATA =",
            res.data
          );

          // ✅ HANDLE MULTIPLE POSSIBLE FIELDS

          const covers =

            res.data.coverImages ||

            res.data.schoolCoverImages ||

            res.data.covers ||

            [];

          setCoverImages(

            Array.isArray(covers)
              ? covers
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
      clearInterval(
        interval
      );

  }, [coverImages]);

  // ================= PROFILE IMAGE =================

  const imageUrl =
    student?.id

      ? `http://localhost:8080/api/students/image/get/${student.id}?t=${refreshKey}`

      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  // ================= COVER URL =================

  const coverUrl = (
    fileName
  ) => {

    if (!fileName)
      return null;

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

  // ================= IMAGE UPLOAD =================

  const handleImageChange =
    async (e) => {

      const file =
        e.target.files?.[0];

      if (
        !file ||
        !student?.id
      )
        return;

      try {

        setUploading(true);

        const formData =
          new FormData();

        formData.append(
          "image",
          file
        );

        await axios.post(

          `http://localhost:8080/api/students/image/upload/${student.id}`,

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

        // ================= REFRESH DATA =================

        const updated =
          await axios.get(
            `http://localhost:8080/api/students/${student.id}`
          );

        setStudent(
          updated.data
        );

        localStorage.setItem(
          "studentData",
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

  // ================= LOADING =================

  if (!student) {

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

        {/* ================= DOTS ================= */}

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
                  transition-all
                  ${
                    i ===
                    coverIndex

                      ? "bg-white scale-110"

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

          {/* ================= HEADER ================= */}

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

            {/* ================= PROFILE ================= */}

            <div
              className="
                flex
                items-center
                gap-6
              "
            >

              {/* ================= IMAGE ================= */}

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

                {/* ================= CAMERA OVERLAY ================= */}

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

                {/* ================= LOADING ================= */}

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

              {/* ================= INFO ================= */}

              <div>

                <Typography variant="h4">

                  {student.studfirstName}{" "}
                  {student.studlastName}

                </Typography>

                <Typography
                  variant="small"
                  className="text-gray-600"
                >

                  {student.email}

                </Typography>

                <Typography
                  variant="small"
                  className="text-blue-600 font-semibold mt-1"
                >

                  {student.schoolName}

                </Typography>

                <div className="mt-2 flex gap-2 flex-wrap">

                  <div
                    className="
                      rounded-full
                      bg-blue-100
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-blue-700
                    "
                  >
                    Roll No :
                    {" "}
                    {
                      student.studRollNo
                    }
                  </div>

                  <div
                    className="
                      rounded-full
                      bg-green-100
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-green-700
                    "
                  >
                    Class :
                    {" "}
                    {
                      student.className
                    }
                  </div>

                </div>

              </div>

            </div>

            {/* ================= TABS ================= */}

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

          {/* ================= FILE INPUT ================= */}

          <input
            type="file"
            hidden
            ref={fileRef}
            accept="image/*"
            onChange={
              handleImageChange
            }
          />

          {/* ================= CONTENT ================= */}

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
              gap-8
            "
          >

            {/* ================= PERSONAL ================= */}

            <div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-4
                "
              >

                <Typography
                  variant="h5"
                >

                  Personal Details

                </Typography>

              </div>

              <ProfileInfoCard
                title="Student Details"
                details={{
                  School:
                    student.schoolName,

                  "Full Name":
                    `${student.studfirstName} ${student.studlastName}`,

                  "Father Name":
                    student.studFatherName,

                  Email:
                    student.email,

                  Phone:
                    student.studPhoneNumber,

                  Gender:
                    student.gender,

                  Category:
                    student.studCategory,

                  Caste:
                    student.studCaste,

                  "Date of Birth":
                    student.studentDob,
                }}
                
              />

            </div>

            {/* ================= ACADEMIC ================= */}

            <div>

              <div
                className="
                  rounded-3xl
                  bg-gradient-to-r
                  from-blue-700
                  via-indigo-600
                  to-purple-600
                  p-8
                  shadow-2xl
                "
              >

                {/* ================= HEADER ================= */}

                <div className="mb-8 text-center">

                  <Typography
                    variant="h4"
                    className="
                      font-extrabold
                      tracking-wide
                      text-white
                    "
                  >

                    Academic Information

                  </Typography>

                  <Typography
                    className="
                      mt-2
                      text-sm
                      text-white/80
                    "
                  >

                    Student class details
                    and academic overview

                  </Typography>

                </div>

                {/* ================= CARDS ================= */}

                <div
                  className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-5
                  "
                >

                  {/* ================= ROLL ================= */}

                  <div
                    className="
                      group
                      rounded-3xl
                      bg-white/10
                      p-6
                      backdrop-blur-md
                      transition-all
                      duration-300
                      hover:-translate-y-2
                      hover:bg-white/20
                      hover:shadow-2xl
                    "
                  >

                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <Typography
                        className="
                          text-sm
                          font-medium
                          uppercase
                          tracking-wider
                          text-white/70
                        "
                      >

                        Roll Number

                      </Typography>

                      <UserIcon
                        className="
                          h-6
                          w-6
                          text-white
                        "
                      />

                    </div>

                    <Typography
                      className="
                        text-3xl
                        font-extrabold
                        text-white
                      "
                    >

                      {
                        student.studRollNo
                      }

                    </Typography>

                  </div>

                  {/* ================= CLASS ================= */}

                  <div
                    className="
                      group
                      rounded-3xl
                      bg-white/10
                      p-6
                      backdrop-blur-md
                      transition-all
                      duration-300
                      hover:-translate-y-2
                      hover:bg-white/20
                      hover:shadow-2xl
                    "
                  >

                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <Typography
                        className="
                          text-sm
                          font-medium
                          uppercase
                          tracking-wider
                          text-white/70
                        "
                      >

                        Class Name

                      </Typography>

                      <AcademicCapIcon
                        className="
                          h-6
                          w-6
                          text-white
                        "
                      />

                    </div>

                    <Typography
                      className="
                        text-3xl
                        font-extrabold
                        text-white
                      "
                    >

                      {
                        student.className
                      }

                    </Typography>

                  </div>

                  {/* ================= SECTION ================= */}

                  <div
                    className="
                      group
                      rounded-3xl
                      bg-white/10
                      p-6
                      backdrop-blur-md
                      transition-all
                      duration-300
                      hover:-translate-y-2
                      hover:bg-white/20
                      hover:shadow-2xl
                    "
                  >

                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <Typography
                        className="
                          text-sm
                          font-medium
                          uppercase
                          tracking-wider
                          text-white/70
                        "
                      >

                        Section

                      </Typography>

                    </div>

                    <Typography
                      className="
                        text-3xl
                        font-extrabold
                        text-white
                      "
                    >

                      {
                        student.section ||
                        "N/A"
                      }

                    </Typography>

                  </div>

                  {/* ================= CATEGORY ================= */}

                  <div
                    className="
                      group
                      rounded-3xl
                      bg-white/10
                      p-6
                      backdrop-blur-md
                      transition-all
                      duration-300
                      hover:-translate-y-2
                      hover:bg-white/20
                      hover:shadow-2xl
                    "
                  >

                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <Typography
                        className="
                          text-sm
                          font-medium
                          uppercase
                          tracking-wider
                          text-white/70
                        "
                      >

                        Category

                      </Typography>

                    </div>

                    <Typography
                      className="
                        text-3xl
                        font-extrabold
                        text-white
                      "
                    >

                      {
                        student.studCategory
                      }

                    </Typography>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </CardBody>

      </Card>

    </>
  );
}

export default Profile;