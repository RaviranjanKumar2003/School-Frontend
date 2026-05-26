// ======================================================
// PublicSchoolPage.jsx
// FULL PREMIUM DYNAMIC PUBLIC SCHOOL PAGE
// ======================================================

import React, {
  useEffect,
  useState,
} from "react";

import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
  Chip,
  Avatar,
} from "@material-tailwind/react";

import {

  BuildingOffice2Icon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  ComputerDesktopIcon,
  TrophyIcon,
  CheckCircleIcon,
  StarIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  TruckIcon,
  PlayCircleIcon,

  // ADD THESE ↓↓↓

  BookOpenIcon,
  PresentationChartBarIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  DevicePhoneMobileIcon,
  WifiIcon,
  GlobeAltIcon,
  VideoCameraIcon,
  TvIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  HeartIcon,
  FireIcon,
  HomeModernIcon,
  FlagIcon,
  SunIcon,
  CakeIcon,
  BoltIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  MicrophoneIcon,
  SparklesIcon,

} from "@heroicons/react/24/solid";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaBus,
  FaWifi,
  FaSwimmingPool,
  FaBook,
} from "react-icons/fa";

import {
  useParams,
} from "react-router-dom";

import { motion } from "framer-motion";

import CountUp from "react-countup";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Autoplay,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

// ======================================================
// BASE URL
// ======================================================

const BASE_URL =
  "http://localhost:8080/api";

// ======================================================
// COMPONENT
// ======================================================

export default function PublicSchoolPage() {

  // ======================================================
  // PARAMS
  // ======================================================

  const { slug } = useParams();

  // ======================================================
  // STATES
  // ======================================================

  const [school, setSchool] =
    useState(null);

  const [statistics, setStatistics] =
    useState(null);

  const [testimonials, setTestimonials] =
    useState([]);

  const [facilities, setFacilities] =
    useState([]);

//============================================================= GALLERY STATES

const [gallery, setGallery] =
  useState([]);

const [previewOpen, setPreviewOpen] =
  useState(false);

const [selectedVideo, setSelectedVideo] =
  useState(null);

//=============================================================================  

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    testimonialSuccess,
    setTestimonialSuccess,
  ] = useState("");

  // ======================================================
  // INQUIRY FORM
  // ======================================================

  const [formData, setFormData] =
    useState({

      studentName: "",

      parentName: "",

      phone: "",

      email: "",

      classApplying: "",

      message: "",
    });

  // ======================================================
  // TESTIMONIAL FORM
  // ======================================================

  const [
    testimonialForm,
    setTestimonialForm,
  ] = useState({

    name: "",

    role: "",

    message: "",

    rating: 5,
  });

  // ======================================================
  // FETCH
  // ======================================================

  useEffect(() => {

    fetchSchool();

  }, [slug]);

//============================================================= FETCH SCHOOL=

  const fetchSchool = async () => {

    try {

      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/public/schools/${slug}`
      );

      if (!response.ok) {

        throw new Error(
          "School not found"
        );
      }

      const data =
        await response.json();

      console.log(
        "SCHOOL DATA = ",
        data
      );

    setSchool(data);
    // Statistics
    fetchStatistics(data.id);
    // GALLERY
    fetchGallery(data.id);
    // TESTIMONIALS
    fetchTestimonials(data.id);
    // FACILITIES
    fetchFacilities(data.id);

    } catch (err) {

      console.log(err);

      setError(
        "Failed to load school"
      );

    } finally {

      setLoading(false);
    }
  };


//==================================================== FETCH GALLERY

const fetchGallery = async (
  schoolId
) => {

  try {

    const response =
      await fetch(
        `${BASE_URL}/gallery/school/${schoolId}`
      );

    if (response.ok) {

      const data =
        await response.json();

      // ONLY ACTIVE ITEMS

      const activeGallery =
        (data || []).filter(
          (item) =>
            item.active === true
        );

      setGallery(activeGallery);
    }

  } catch (err) {

    console.log(err);
  }
};


//=================================================== FETCH STATISTICS

  const fetchStatistics = async (
    schoolId
  ) => {

    try {

      const response =
        await fetch(

          `${BASE_URL}/statistics/school/${schoolId}`

        );

      if (response.ok) {

        const data =
          await response.json();

        setStatistics(data);
      }

    } catch (err) {

      console.log(err);
    }
  };

//========================================================= FETCH TESTIMONIALS

  const fetchTestimonials = async (
    schoolId
  ) => {

    try {

      const response =
        await fetch(

          `${BASE_URL}/testimonials/school/${schoolId}`

        );

      if (response.ok) {

        const data =
          await response.json();

        const activeTestimonials =
          data.filter(
            (item) =>
              item.active === true
          );

        setTestimonials(
          activeTestimonials
        );
      }

    } catch (err) {

      console.log(err);
    }
  };


//================================================================ FETCH FACILITIES

const fetchFacilities = async (
  schoolId
) => {

  try {

    const response =
      await fetch(
        `${BASE_URL}/facilities/school/${schoolId}`
      );

    if (response.ok) {

      const data =
        await response.json();

      const activeFacilities =
        (data || []).filter(
          (item) =>
            item.active === true
        );

      setFacilities(
        activeFacilities
      );
    }

  } catch (err) {

    console.log(err);
  }
};

//====================== HANDLE INPUT

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

//========================================== HANDLE TESTIMONIAL INPUT

  const handleTestimonialChange = (
    e
  ) => {

    setTestimonialForm({

      ...testimonialForm,

      [e.target.name]:
        e.target.value,
    });
  };

//=============================================== SUBMIT INQUIRY

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSuccess("");
    setError("");

    try {

      const response =
        await fetch(

          `${BASE_URL}/inquiries`,

          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              ...formData,

              schoolCode:
                school?.schoolCode,
            }),
          }
        );

      if (!response.ok) {

        throw new Error(
          "Failed to submit inquiry"
        );
      }

      setSuccess(
        "Inquiry submitted successfully"
      );

      setFormData({

        studentName: "",

        parentName: "",

        phone: "",

        email: "",

        classApplying: "",

        message: "",
      });

    } catch (err) {

      console.log(err);

      setError(
        "Failed to submit inquiry"
      );
    }
  };

//========================================================== SUBMIT TESTIMONIAL

  const handleTestimonialSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const response =
          await fetch(

            `${BASE_URL}/testimonials`,

            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                ...testimonialForm,

                active: false,

                schoolId:
                  school?.id,
              }),
            }
          );

        if (!response.ok) {

          throw new Error(
            "Failed"
          );
        }

        setTestimonialSuccess(
          "Thank you! Your testimonial submitted for approval."
        );

        setTestimonialForm({

          name: "",

          role: "",

          message: "",

          rating: 5,
        });

      } catch (err) {

        console.log(err);
      }
    };


//==================================== OPEN VIDEO PREVIEW

const openVideoPreview = (
  item
) => {

  setSelectedVideo(item);

  setPreviewOpen(true);
};

//=================================== CLOSE VIDEO PREVIEW

const closeVideoPreview = () => {

  setPreviewOpen(false);

  setSelectedVideo(null);
};

//========================================= LOADING

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            h-16
            w-16
            rounded-full
            border-4
            border-blue-700
            border-t-transparent
            animate-spin
          "
        />

      </div>
    );
  }

//======================================== ERROR

  if (error && !school) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >

        <Typography
          color="red"
          variant="h4"
        >
          {error}
        </Typography>

      </div>
    );
  }

//=============================== DEFAULT IMAGE

  const defaultImage =
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1400";



//================================ IMAGE URL

  const getImageUrl = (
    imageName
  ) => {

    if (!imageName)
      return defaultImage;

    if (
      imageName.startsWith(
        "http"
      )
    ) {

      return imageName;
    }

    return `${BASE_URL}/schools/cover/get-file/${imageName}`;
  };



//============================== FACILITY ICONS

const facilityIcons = {

  library: BookOpenIcon,
  computer: ComputerDesktopIcon,
  smartclass: PresentationChartBarIcon,
  classroom: AcademicCapIcon,
  laboratory: BeakerIcon,
  science: BeakerIcon,
  exam: ClipboardDocumentCheckIcon,
  digital: DevicePhoneMobileIcon,

  wifi: WifiIcon,
  internet: GlobeAltIcon,
  cctv: VideoCameraIcon,
  projector: TvIcon,
  ai: CpuChipIcon,

  transport: TruckIcon,
  bus: TruckIcon,
  parking: TruckIcon,

  security: ShieldCheckIcon,
  medical: HeartIcon,
  firstaid: HeartIcon,
  fire: FireIcon,

  hostel: HomeModernIcon,
  campus: BuildingOffice2Icon,
  playground: FlagIcon,
  garden: SunIcon,
  cafeteria: CakeIcon,
  canteen: CakeIcon,

  sports: TrophyIcon,
  cricket: TrophyIcon,
  football: TrophyIcon,
  basketball: TrophyIcon,
  gym: BoltIcon,
  yoga: SparklesIcon,

  music: MusicalNoteIcon,
  dance: SparklesIcon,
  art: PaintBrushIcon,
  auditorium: MicrophoneIcon,

  default: BuildingOffice2Icon,
};




//=============================== STATS ARRAY

  const stats = [

    {
      label: "Students",
      value:
        statistics?.totalStudents ||
        0,
    },

    {
      label: "Teachers",
      value:
        statistics?.totalTeachers ||
        0,
    },

    {
      label: "Classrooms",
      value:
        statistics?.totalClassrooms ||
        0,
    },

    {
      label: "Labs",
      value:
        statistics?.totalLabs ||
        0,
    },

    {
      label: "Libraries",
      value:
        statistics?.totalLibraries ||
        0,
    },

    {
      label: "Buses",
      value:
        statistics?.totalBuses ||
        0,
    },
  ];


  // ======================================================
//================================== UI
  // ======================================================

  return (

    <div className="bg-white overflow-hidden">

      {/* ====================================================== */}
      {/* HERO */}
      {/* ====================================================== */}

      <section className="relative h-screen">

        <Swiper
          modules={[
            Autoplay,
            Pagination,
          ]}
          autoplay={{
            delay: 4000,
          }}
          pagination={{
            clickable: true,
          }}
          loop
          className="h-full"
        >

          {
            school?.coverImages
              ?.length > 0 ? (

              school.coverImages.map(
                (
                  img,
                  index
                ) => (

                  <SwiperSlide
                    key={index}
                  >

                    <div className="relative h-screen">

                      <img
                        src={getImageUrl(
                          img
                        )}
                        alt="school"
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-black/60
                        "
                      />

                    </div>

                  </SwiperSlide>
                )
              )

            ) : (

              <SwiperSlide>

                <img
                  src={defaultImage}
                  alt="school"
                  className="
                    h-full
                    w-full
                    object-cover
                  "
                />

              </SwiperSlide>
            )
          }

        </Swiper>

        {/* HERO CONTENT */}

        <div
          className="
            absolute
            inset-0
            z-20
            flex
            items-center
          "
        >

          <div
            className="
              max-w-7xl
              mx-auto
              px-6
              w-full
            "
          >

            <motion.div

              initial={{
                opacity: 0,
                y: 50,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                duration: 0.8,
              }}
            >

              <Chip
                value={
                  school?.board ||
                  "Premium School"
                }
                className="
                  w-fit
                  mb-6
                  bg-white/20
                "
              />

              <Typography
                variant="h1"
                className="
                  text-white
                  text-5xl
                  md:text-7xl
                  font-black
                "
              >
                {
                  school?.schoolName
                }
              </Typography>

              <Typography
                className="
                  text-blue-100
                  mt-8
                  text-xl
                  max-w-3xl
                "
              >
                {
                  school?.description ||
                  "Quality education with innovation and excellence."
                }
              </Typography>

              <div
                className="
                  flex
                  flex-wrap
                  gap-4
                  mt-10
                "
              >

                <Button
  size="lg"
  className="
    rounded-full
    bg-white
    text-blue-700
    hover:scale-105
    transition-all
    duration-300
  "
  onClick={() => {

    const section =
      document.getElementById(
        "admission-inquiry"
      );

    if (section) {

      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  }}
>
  Apply Admission
</Button>

                <Button
  size="lg"
  variant="outlined"
  className="
    rounded-full
    border-white
    text-white
    hover:bg-white
    hover:text-blue-700
    transition-all
    duration-300
  "
  onClick={() => {

    const section =
      document.getElementById(
        "contact-school"
      );

    if (section) {

      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  }}
>
  Contact School
</Button>

              </div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* ABOUT */}
      {/* ====================================================== */}

      <section className="py-24 px-6 bg-white">

        <div
          className="
            max-w-7xl
            mx-auto
            grid
            lg:grid-cols-2
            gap-16
            items-center
          "
        >

          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            viewport={{
              once: true,
            }}
          >

            <Typography
              variant="h2"
              className="
                font-black
                text-5xl
              "
            >
              About School
            </Typography>

            <Typography
              className="
                mt-8
                text-gray-600
                text-lg
                leading-relaxed
              "
            >
              {
                school?.about ||
                school?.description
              }
            </Typography>

            <div
              className="
                grid
                grid-cols-2
                gap-5
                mt-10
              "
            >

              <Card className="rounded-3xl shadow-xl">

                <CardBody>

                  <Typography className="text-gray-500">
                    Established
                  </Typography>

                  <Typography
                    className="
                      text-3xl
                      font-black
                      mt-2
                    "
                  >
                    {
                      school?.establishedYear ||
                      "2000"
                    }
                  </Typography>

                </CardBody>

              </Card>

              <Card className="rounded-3xl shadow-xl">

                <CardBody>

                  <Typography className="text-gray-500">
                    Medium
                  </Typography>

                  <Typography
                    className="
                      text-3xl
                      font-black
                      mt-2
                    "
                  >
                    {
                      school?.medium ||
                      "English"
                    }
                  </Typography>

                </CardBody>

              </Card>

            </div>

          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            viewport={{
              once: true,
            }}
          >

            <img
              src={
                school?.coverImages
                  ?.length > 0
                  ? getImageUrl(
                      school
                        ?.coverImages[0]
                    )
                  : defaultImage
              }
              alt="about"
              className="
                rounded-[40px]
                shadow-2xl
              "
            />

          </motion.div>

        </div>

      </section>

      {/* ====================================================== */}
      {/* STATS */}
      {/* ====================================================== */}

      <section
        className="
          py-24
          bg-gradient-to-r
          from-blue-700
          to-cyan-600
          px-6
        "
      >

        <div className="max-w-7xl mx-auto">

          <Typography
            variant="h2"
            className="
              text-center
              text-white
              font-black
              text-5xl
            "
          >
            School Statistics
          </Typography>

          <div
            className="
              grid
              md:grid-cols-2
              lg:grid-cols-3
              gap-8
              mt-16
            "
          >

            {
              stats.map(
                (item, index) => (

                  <Card
                    key={index}
                    className="
                      bg-white/10
                      backdrop-blur-xl
                      text-white
                      rounded-[32px]
                    "
                  >

                    <CardBody className="text-center">

                      <Typography
                        className="
                          text-6xl
                          font-black
                        "
                      >
                        <CountUp
                          end={item.value}
                          duration={3}
                        />
                        +
                      </Typography>

                      <Typography className="mt-4">
                        {item.label}
                      </Typography>

                    </CardBody>

                  </Card>
                )
              )
            }

          </div>

        </div>

      </section>

{/* ====================================================== */}
{/* FACILITIES */}
{/* ====================================================== */}

<section
  className="
    py-28
    px-6
    bg-gradient-to-b
    from-white
    via-blue-50/40
    to-white
    relative
    overflow-hidden
  "
>

  {/* BG BLUR */}

  <div
    className="
      absolute
      top-0
      left-0
      h-72
      w-72
      bg-blue-200/30
      blur-3xl
      rounded-full
    "
  />

  <div
    className="
      absolute
      bottom-0
      right-0
      h-72
      w-72
      bg-cyan-200/30
      blur-3xl
      rounded-full
    "
  />

  <div className="max-w-7xl mx-auto relative z-10">

    {/* HEADING */}

    <div className="text-center">

      <Chip
        value="PREMIUM CAMPUS"
        className="
          mx-auto
          w-fit
          bg-blue-100
          text-blue-700
          mb-6
        "
      />

      <Typography
        variant="h2"
        className="
          text-5xl
          md:text-6xl
          font-black
          text-gray-900
        "
      >
        School Facilities
      </Typography>

      <Typography
        className="
          mt-6
          text-gray-600
          max-w-3xl
          mx-auto
          text-lg
          leading-relaxed
        "
      >
        Modern infrastructure &
        world-class facilities designed
        for future-ready education.
      </Typography>

    </div>

    {/* GRID */}

    {
      facilities?.length > 0 ? (

        <div
          className="
            grid
            md:grid-cols-2
            xl:grid-cols-3
            gap-8
            mt-20
          "
        >

          {
            facilities.map(
              (
                facility,
                index
              ) => {

                const Icon =
                  facilityIcons[
                    facility.icon
                  ] ||
                  BuildingOffice2Icon;

                return (

                  <motion.div
                    key={facility.id}
                    initial={{
                      opacity: 0,
                      y: 40,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay:
                        index * 0.1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    whileHover={{
                      y: -10,
                    }}
                  >

                    <Card
                      className="
                        rounded-[36px]
                        border
                        border-white
                        bg-white/80
                        backdrop-blur-xl
                        shadow-xl
                        hover:shadow-2xl
                        transition-all
                        overflow-hidden
                        h-full
                        group
                      "
                    >

                      <CardBody className="p-10 relative">

                        {/* GLOW */}

                        <div
                          className="
                            absolute
                            top-0
                            right-0
                            h-32
                            w-32
                            bg-blue-100
                            blur-3xl
                            opacity-0
                            group-hover:opacity-100
                            transition-all
                          "
                        />

                        {/* ICON */}

                        <div
                          className="
                            h-24
                            w-24
                            rounded-[28px]
                            bg-gradient-to-br
                            from-blue-600
                            to-cyan-500
                            flex
                            items-center
                            justify-center
                            shadow-2xl
                            relative
                            z-10
                          "
                        >

                          <Icon
                            className="
                              h-12
                              w-12
                              text-white
                            "
                          />

                        </div>

                        {/* COUNT */}

                        <div className="mt-8">

                          <Chip
                            value={`Total ${facility.totalCount}`}
                            className="
                              w-fit
                              bg-blue-50
                              text-blue-700
                            "
                          />

                        </div>

                        {/* TITLE */}

                        <Typography
                          variant="h4"
                          className="
                            font-black
                            mt-6
                            text-gray-900
                          "
                        >
                          {facility.title}
                        </Typography>

                        {/* DESC */}

                        <Typography
                          className="
                            mt-5
                            text-gray-600
                            leading-relaxed
                            text-lg
                          "
                        >
                          {
                            facility.description
                          }
                        </Typography>

                        {/* ACTIVE */}

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            mt-8
                          "
                        >

                          <CheckCircleIcon
                            className="
                              h-5
                              w-5
                              text-green-500
                            "
                          />

                          <Typography
                            className="
                              text-green-600
                              font-semibold
                            "
                          >
                            Premium Facility
                          </Typography>

                        </div>

                      </CardBody>

                    </Card>

                  </motion.div>
                );
              }
            )
          }

        </div>

      ) : (

        <div className="text-center py-24">

          <Typography
            variant="h5"
            className="text-gray-500"
          >
            No Facilities Available
          </Typography>

        </div>
      )
    }

  </div>

</section>

{/* ====================================================== */}
{/* GALLERY */}
{/* ====================================================== */}

<section className="py-24 px-6 bg-white">

  <div className="max-w-7xl mx-auto">

    <Typography
      variant="h2"
      className="
        text-center
        font-black
        text-5xl
      "
    >
      School Gallery
    </Typography>

    <Typography
      className="
        text-center
        text-gray-500
        mt-5
        max-w-2xl
        mx-auto
      "
    >
      Explore moments, achievements,
      campus life & activities.
    </Typography>

    {
      gallery?.length > 0 ? (

        <div
          className="
            grid
            md:grid-cols-2
            lg:grid-cols-3
            gap-8
            mt-16
          "
        >

          {
            gallery.map(
              (
                item,
                index
              ) => (

                <motion.div
                  key={index}
                  whileHover={{
                    y: -10,
                  }}
                  className="
                    rounded-[32px]
                    overflow-hidden
                    shadow-2xl
                    bg-white
                    group
                    cursor-pointer
                  "
                >

                  {/* VIDEO */}

                  {
                    item.type ===
                    "VIDEO" ? (

                      <div
                        className="
                          relative
                          h-[320px]
                        "
                        onClick={() =>
                          openVideoPreview(
                            item
                          )
                        }
                      >

                        {/* THUMBNAIL */}

                        <img
                          src={
                            item.thumbnail ||
                            "https://via.placeholder.com/600x400?text=Video"
                          }
                          alt={
                            item.title
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                          "
                        />

                        {/* OVERLAY */}

                        <div
                          className="
                            absolute
                            inset-0
                            bg-black/30
                            group-hover:bg-black/40
                            transition-all
                            flex
                            items-center
                            justify-center
                          "
                        >

                          <PlayCircleIcon
                            className="
                              h-24
                              w-24
                              text-white
                              drop-shadow-2xl
                            "
                          />

                        </div>

                      </div>

                    ) : (

                      // IMAGE

                      <div
                        className="
                          overflow-hidden
                          h-[320px]
                        "
                      >

                        <img
                          src={
                            item.fileName
                          }
                          alt={
                            item.title
                          }
                          className="
                            h-full
                            w-full
                            object-cover
                            group-hover:scale-110
                            transition-all
                            duration-700
                          "
                        />

                      </div>
                    )
                  }

                  {/* CONTENT */}

                  <div className="p-6">

                    <div className="flex items-center justify-between">

                      <Chip
                        value={
                          item.type
                        }
                        color={
                          item.type ===
                          "VIDEO"
                            ? "purple"
                            : "green"
                        }
                      />

                      <Chip
                        value="ACTIVE"
                        color="green"
                      />

                    </div>

                    <Typography
                      variant="h5"
                      className="
                        font-black
                        mt-5
                      "
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      className="
                        mt-3
                        text-gray-600
                        line-clamp-3
                      "
                    >
                      {
                        item.description
                      }
                    </Typography>

                  </div>

                </motion.div>
              )
            )
          }

        </div>

      ) : (

        <div
          className="
            text-center
            py-20
          "
        >

          <Typography
            variant="h5"
            className="text-gray-500"
          >
            No Gallery Available
          </Typography>

        </div>
      )
    }

  </div>

</section>

{/* ====================================================== */}
{/* TESTIMONIALS What Parents Say*/}
{/* ====================================================== */}

<section
  className="
    relative
    py-32
    px-6
    overflow-hidden
    bg-[#030712]
  "
>

  {/* BACKGROUND EFFECTS */}

  <div
    className="
      absolute
      top-[-120px]
      left-[-120px]
      h-[350px]
      w-[350px]
      rounded-full
      bg-cyan-500/20
      blur-3xl
    "
  />

  <div
    className="
      absolute
      bottom-[-120px]
      right-[-120px]
      h-[350px]
      w-[350px]
      rounded-full
      bg-blue-600/20
      blur-3xl
    "
  />

  <div className="max-w-7xl mx-auto relative z-10">

    {/* HEADER */}

    <div className="text-center">

      <Typography
        className="
          text-cyan-400
          font-bold
          tracking-[6px]
          uppercase
        "
      >
        Testimonials
      </Typography>

      <Typography
        variant="h1"
        className="
          mt-6
          text-white
          text-5xl
          md:text-7xl
          font-black
          leading-tight
        "
      >
        Parents Love
        <span
          className="
            block
            bg-gradient-to-r
            from-cyan-400
            to-blue-500
            bg-clip-text
            text-transparent
          "
        >
          Our School
        </span>
      </Typography>

      <Typography
        className="
          mt-8
          text-gray-400
          max-w-3xl
          mx-auto
          text-lg
          leading-relaxed
        "
      >
        Real stories from parents and
        students about academic
        excellence, discipline, campus
        life and modern education.
      </Typography>

    </div>

    {/* CARDS */}

    <div
      className="
        grid
        md:grid-cols-2
        xl:grid-cols-3
        gap-10
        mt-24
      "
    >

      {
        testimonials?.length > 0 ? (

          testimonials.map(
            (
              item,
              index
            ) => (

              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay:
                    index * 0.15,
                }}
                viewport={{
                  once: true,
                }}
                whileHover={{
                  y: -12,
                }}
              >

                <div
                  className="
                    relative
                    h-full
                    rounded-[40px]
                    border
                    border-white/10
                    bg-white/5
                    backdrop-blur-2xl
                    overflow-hidden
                    group
                    transition-all
                    duration-500
                    hover:border-cyan-400/40
                    hover:shadow-[0_0_50px_rgba(34,211,238,0.25)]
                  "
                >

                  {/* TOP LIGHT */}

                  <div
                    className="
                      absolute
                      inset-x-0
                      top-0
                      h-[2px]
                      bg-gradient-to-r
                      from-transparent
                      via-cyan-400
                      to-transparent
                    "
                  />

                  {/* CONTENT */}

                  <div className="p-10">

                    {/* STARS */}

                    <div className="flex gap-1">

                      {
                        [...Array(
                          item.rating || 5
                        )].map(
                          (_, i) => (

                            <StarIcon
                              key={i}
                              className="
                                h-5
                                w-5
                                text-yellow-400
                              "
                            />
                          )
                        )
                      }

                    </div>

                    {/* QUOTE */}

                    <div
                      className="
                        mt-8
                        text-[90px]
                        leading-none
                        font-black
                        text-cyan-400/20
                      "
                    >
                      “
                    </div>

                    {/* MESSAGE */}

                    <Typography
                      className="
                        -mt-10
                        text-gray-200
                        text-lg
                        leading-relaxed
                        min-h-[180px]
                        relative
                        z-10
                      "
                    >
                      {item.message}
                    </Typography>

                    {/* USER SECTION */}

                    <div
                      className="
                        mt-10
                        flex
                        items-center
                        gap-5
                      "
                    >

                      {/* IMAGE */}

                      <div className="relative">

                        {
                          item.image ? (

                            <img
                              src={getImageUrl(
                                item.image
                              )}
                              alt={item.name}
                              className="
                                h-20
                                w-20
                                rounded-2xl
                                object-cover
                                border
                                border-cyan-400/40
                              "
                            />

                          ) : (

                            <div
                              className="
                                h-20
                                w-20
                                rounded-2xl
                                bg-gradient-to-r
                                from-cyan-500
                                to-blue-600
                                flex
                                items-center
                                justify-center
                                text-white
                                text-3xl
                                font-black
                              "
                            >
                              {
                                item?.name
                                  ?.charAt(0)
                                  ?.toUpperCase()
                              }
                            </div>

                          )
                        }

                        {/* ONLINE DOT */}

                        <div
                          className="
                            absolute
                            -bottom-1
                            -right-1
                            h-5
                            w-5
                            rounded-full
                            bg-green-400
                            border-2
                            border-[#030712]
                          "
                        />

                      </div>

                      {/* INFO */}

                      <div>

                        <Typography
                          variant="h5"
                          className="
                            text-white
                            font-black
                          "
                        >
                          {item.name}
                        </Typography>

                        <Typography
                          className="
                            mt-1
                            text-cyan-400
                            font-medium
                          "
                        >
                          {item.role}
                        </Typography>

                      </div>

                    </div>

                  </div>

                </div>

              </motion.div>
            )
          )

        ) : (

          <div
            className="
              col-span-full
              text-center
              py-20
            "
          >

            <Typography
              variant="h4"
              className="
                text-gray-400
                font-bold
              "
            >
              No Testimonials Available
            </Typography>

          </div>

        )
      }

    </div>

  </div>

</section>


{/* ====================================================== */}
{/* ADD TESTIMONIAL */}
{/* ====================================================== */}

      <section
        className="
          py-24
          px-6
          bg-white
        "
      >

        <div className="max-w-4xl mx-auto">

          <Card
            className="
              rounded-[40px]
              shadow-2xl
            "
          >

            <CardBody className="p-10">

              <Typography
                variant="h2"
                className="
                  text-center
                  font-black
                  mb-10
                "
              >
                Share Your Experience
              </Typography>

              <form
                onSubmit={
                  handleTestimonialSubmit
                }
                className="space-y-6"
              >

                <Input
                  size="lg"
                  label="Your Name"
                  name="name"
                  value={
                    testimonialForm.name
                  }
                  onChange={
                    handleTestimonialChange
                  }
                  required
                />

                <Input
                  size="lg"
                  label="Role (Parent / Student)"
                  name="role"
                  value={
                    testimonialForm.role
                  }
                  onChange={
                    handleTestimonialChange
                  }
                  required
                />

                <Input
                  size="lg"
                  type="number"
                  label="Rating (1-5)"
                  name="rating"
                  min="1"
                  max="5"
                  value={
                    testimonialForm.rating
                  }
                  onChange={
                    handleTestimonialChange
                  }
                />

                <Textarea
                  label="Your Experience"
                  name="message"
                  value={
                    testimonialForm.message
                  }
                  onChange={
                    handleTestimonialChange
                  }
                  required
                />

                {
                  testimonialSuccess && (

                    <Typography
                      color="green"
                      className="text-center"
                    >
                      {
                        testimonialSuccess
                      }
                    </Typography>
                  )
                }

                <Button
                  type="submit"
                  fullWidth
                  className="
                    rounded-2xl
                    py-4
                    bg-blue-700
                  "
                >
                  Submit Testimonial
                </Button>

              </form>

            </CardBody>

          </Card>

        </div>

      </section>



{/* ====================================================== */}
{/* INQUIRY */}
{/* ====================================================== */}

      <section
  id="admission-inquiry"
  
  className="
    py-24
    px-6
    bg-gray-100
  "
>

        <div className="max-w-5xl mx-auto">

          <Card
            className="
              rounded-[40px]
              overflow-hidden
            "
          >

            <div className="grid lg:grid-cols-2">

              {/* LEFT */}

              {/* LEFT */}

<div
  id="contact-school"
  className="
    bg-gradient-to-br
    from-blue-700
    to-cyan-600
    p-12
    text-white
  "
>

                <Typography
                  variant="h2"
                  className="
                    font-black
                    text-5xl
                  "
                >
                  Admission Inquiry
                </Typography>

                <div className="space-y-8 mt-12">

                  <div className="flex gap-4">

                    <PhoneIcon className="h-6 w-6" />

                    <span>
                      {school?.phone}
                    </span>

                  </div>

                  <div className="flex gap-4">

                    <EnvelopeIcon className="h-6 w-6" />

                    <span>
                      {school?.email}
                    </span>

                  </div>

                  <div className="flex gap-4">

                    <MapPinIcon className="h-6 w-6" />

                    <span>
                      {school?.address}
                    </span>

                  </div>

                </div>

              </div>

              {/* RIGHT */}

              <div className="p-12">

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >

                  <Input
                    size="lg"
                    label="Student Name"
                    name="studentName"
                    value={
                      formData.studentName
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Input
                    size="lg"
                    label="Parent Name"
                    name="parentName"
                    value={
                      formData.parentName
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Input
                    size="lg"
                    label="Phone Number"
                    name="phone"
                    value={
                      formData.phone
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Input
                    size="lg"
                    label="Email"
                    name="email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Input
                    size="lg"
                    label="Class Applying For"
                    name="classApplying"
                    value={
                      formData.classApplying
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <Textarea
                    label="Message"
                    name="message"
                    value={
                      formData.message
                    }
                    onChange={
                      handleChange
                    }
                  />

                  {
                    success && (

                      <Typography
                        color="green"
                      >
                        {success}
                      </Typography>
                    )
                  }

                  {
                    error && (

                      <Typography
                        color="red"
                      >
                        {error}
                      </Typography>
                    )
                  }

                  <Button
                    type="submit"
                    fullWidth
                    className="
                      bg-blue-700
                      rounded-2xl
                      py-4
                    "
                  >
                    Submit Inquiry
                  </Button>

                </form>

              </div>

            </div>

          </Card>

        </div>

      </section>

{/* ====================================================== */}
{/* VIDEO PREVIEW */}
{/* ====================================================== */}

{
  previewOpen &&
  selectedVideo && (

    <div
      className="
        fixed
        inset-0
        z-[9999]
        bg-black/80
        flex
        items-center
        justify-center
        p-4
      "
      onClick={() =>
        setPreviewOpen(false)
      }
    >

      <div
        className="
          bg-white
          rounded-3xl
          overflow-hidden
          max-w-5xl
          w-full
          relative
        "
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* CLOSE */}

        <button
          onClick={() =>
            setPreviewOpen(false)
          }
          className="
            absolute
            top-4
            right-4
            z-20
            h-10
            w-10
            rounded-full
            bg-black/70
            text-white
          "
        >
          ✕
        </button>

        {/* VIDEO */}

        <video
          src={
            selectedVideo.videoUrl
          }
          controls
          autoPlay
          playsInline
          className="
            w-full
            max-h-[80vh]
            bg-black
          "
        />

        {/* CONTENT */}

        <div className="p-6">

          <Typography
            variant="h4"
            className="font-black"
          >
            {
              selectedVideo.title
            }
          </Typography>

          <Typography
            className="
              mt-3
              text-gray-600
            "
          >
            {
              selectedVideo.description
            }
          </Typography>

        </div>

      </div>

    </div>
  )
}

{/* ====================================================== */}
{/* FOOTER */}
{/* ====================================================== */}

      <footer className="bg-gray-950 text-white py-20 px-6">

        <div
          className="
            max-w-7xl
            mx-auto
            grid
            lg:grid-cols-4
            gap-12
          "
        >

          <div>

            <Typography
              variant="h4"
              className="font-black"
            >
              {
                school?.schoolName
              }
            </Typography>

            <Typography
              className="
                mt-6
                text-gray-400
              "
            >
              Building future-ready students through modern education.
            </Typography>

            <div className="flex gap-4 mt-8">

              <div
                className="
                  h-12
                  w-12
                  rounded-full
                  bg-white/10
                  flex
                  items-center
                  justify-center
                "
              >
                <FaFacebookF />
              </div>

              <div
                className="
                  h-12
                  w-12
                  rounded-full
                  bg-white/10
                  flex
                  items-center
                  justify-center
                "
              >
                <FaInstagram />
              </div>

              <div
                className="
                  h-12
                  w-12
                  rounded-full
                  bg-white/10
                  flex
                  items-center
                  justify-center
                "
              >
                <FaYoutube />
              </div>

            </div>

          </div>

          <div>

            <Typography
              variant="h5"
              className="
                font-black
                mb-6
              "
            >
              Contact Info
            </Typography>

            <div className="space-y-5 text-gray-400">

              <div className="flex gap-3">

                <PhoneIcon className="h-5 w-5" />

                <span>
                  {school?.phone}
                </span>

              </div>

              <div className="flex gap-3">

                <EnvelopeIcon className="h-5 w-5" />

                <span>
                  {school?.email}
                </span>

              </div>

              <div className="flex gap-3">

                <MapPinIcon className="h-5 w-5" />

                <span>
                  {school?.address}
                </span>

              </div>

            </div>

          </div>

        </div>

        <div
          className="
            border-t
            border-white/10
            mt-16
            pt-8
            text-center
            text-gray-500
          "
        >
          © 2026 {
            school?.schoolName
          }. All Rights Reserved.
        </div>

      </footer>

    </div>
  );
}