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
  ArrowRightIcon,
  PhotoIcon

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

  const [aboutSchool, setAboutSchool] =
    useState(null);

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

//============================================================= FETCH SCHOOL

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

    // About School
    fetchAboutSchool(data.id);
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


//=============================================================== FETCH ABOUT SCHOOL

const fetchAboutSchool = async (
  schoolId
) => {

  try {

    const response =
      await fetch(
        `${BASE_URL}/about-school/${schoolId}`
      );

    if (response.ok) {

      const data =
        await response.json();

      setAboutSchool(data);
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
{/* PREMIUM HERO SECTION */}
{/* ====================================================== */}

<section
  className="
    relative
    h-screen
    overflow-hidden
    bg-black
  "
>

  {/* SLIDER */}

  <Swiper
    modules={[
      Autoplay,
      Pagination,
    ]}
    autoplay={{
      delay: 4500,
      disableOnInteraction: false,
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

                {/* IMAGE */}

                <img
                  src={getImageUrl(
                    img
                  )}
                  alt="school"
                  className="
                    h-full
                    w-full
                    object-cover
                    scale-105
                    animate-[slowZoom_10s_linear_infinite]
                  "
                />

                {/* DARK OVERLAY */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-black/60
                  "
                />

                {/* GRADIENT */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-black/80
                    via-black/50
                    to-black/20
                  "
                />

              </div>

            </SwiperSlide>
          )
        )

      ) : (

        <SwiperSlide>

          <div className="relative h-screen">

            <img
              src={defaultImage}
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
    }

  </Swiper>

  {/* FLOATING BLUR EFFECTS */}

  <div
    className="
      absolute
      top-[-100px]
      left-[-100px]
      h-[300px]
      w-[300px]
      rounded-full
      bg-cyan-500/20
      blur-3xl
      z-10
    "
  />

  <div
    className="
      absolute
      bottom-[-100px]
      right-[-100px]
      h-[300px]
      w-[300px]
      rounded-full
      bg-blue-700/20
      blur-3xl
      z-10
    "
  />

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
        w-full
        px-4
        sm:px-6
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
          duration: 0.9,
        }}

        className="
          max-w-4xl
        "
      >

        {/* TOP BADGE */}

        <div
          className="
            inline-flex
            items-center
            gap-3
            rounded-full
            border
            border-white/20
            bg-white/10
            backdrop-blur-xl
            px-5
            py-2
            text-white
            shadow-2xl
          "
        >

          <AcademicCapIcon
            className="
              h-5
              w-5
              text-cyan-400
            "
          />

          <span
            className="
              text-sm
              font-semibold
              tracking-wider
            "
          >
            {
              aboutSchool?.board ||
              "PREMIUM SCHOOL"
            }
          </span>

        </div>

        {/* TITLE */}

        <Typography
          variant="h1"
          className="
            mt-8
            text-white
            text-4xl
            sm:text-5xl
            md:text-6xl
            lg:text-7xl
            font-black
            leading-tight
          "
        >

          {
            school?.schoolName
          }

          <span
            className="
              block
              mt-3
              bg-gradient-to-r
              from-cyan-400
              via-blue-400
              to-cyan-300
              bg-clip-text
              text-transparent
            "
          >
            Future Starts Here
          </span>

        </Typography>

        {/* DESCRIPTION */}

        <Typography
          className="
            mt-8
            text-gray-200
            text-base
            sm:text-lg
            md:text-xl
            leading-relaxed
            max-w-3xl
          "
        >
          {
            aboutSchool?.about ||
            "Quality education with innovation, leadership, discipline and future-ready learning experiences."
          }
        </Typography>

        {/* BUTTONS */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-4
            mt-10
          "
        >

          {/* APPLY */}

          <Button
            size="lg"
            className="
              rounded-full
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              px-8
              py-4
              text-base
              shadow-[0_10px_40px_rgba(6,182,212,0.4)]
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

          {/* CONTACT */}

          <Button
            size="lg"
            variant="outlined"
            className="
              rounded-full
              border-2
              border-white/50
              bg-white/10
              backdrop-blur-xl
              text-white
              px-8
              py-4
              text-base
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

        {/* STATS */}

        <div
          className="
            grid
            grid-cols-3
            gap-4
            sm:gap-6
            mt-14
            max-w-2xl
          "
        >

          {/* STUDENTS */}

          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/10
              backdrop-blur-2xl
              p-5
              text-center
            "
          >

            <Typography
              className="
                text-2xl
                sm:text-3xl
                font-black
                text-white
              "
            >
              {
                statistics?.totalStudents ||
                "2K+"
              }
            </Typography>

            <Typography
              className="
                mt-1
                text-sm
                text-gray-300
              "
            >
              Students
            </Typography>

          </div>

          {/* TEACHERS */}

          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/10
              backdrop-blur-2xl
              p-5
              text-center
            "
          >

            <Typography
              className="
                text-2xl
                sm:text-3xl
                font-black
                text-white
              "
            >
              {
                statistics?.totalTeachers ||
                "100+"
              }
            </Typography>

            <Typography
              className="
                mt-1
                text-sm
                text-gray-300
              "
            >
              Teachers
            </Typography>

          </div>

          {/* FACILITIES */}

          <div
            className="
              rounded-3xl
              border
              border-white/10
              bg-white/10
              backdrop-blur-2xl
              p-5
              text-center
            "
          >

            <Typography
              className="
                text-2xl
                sm:text-3xl
                font-black
                text-white
              "
            >
              {
                facilities?.length ||
                "25+"
              }
            </Typography>

            <Typography
              className="
                mt-1
                text-sm
                text-gray-300
              "
            >
              Facilities
            </Typography>

          </div>

        </div>

      </motion.div>

    </div>

  </div>

  {/* SCROLL INDICATOR */}

  <div
    className="
      absolute
      bottom-6
      left-1/2
      -translate-x-1/2
      z-30
      flex
      flex-col
      items-center
      text-white
    "
  >

    <span
      className="
        text-xs
        tracking-[4px]
        uppercase
        text-gray-300
      "
    >
      Scroll
    </span>

    <div
      className="
        mt-2
        h-10
        w-6
        rounded-full
        border
        border-white/40
        flex
        justify-center
      "
    >

      <div
        className="
          mt-2
          h-2
          w-2
          rounded-full
          bg-white
          animate-bounce
        "
      />

    </div>

  </div>

</section>
      
{/* ====================================================== */}
{/* PREMIUM ABOUT SCHOOL SECTION */}
{/* ====================================================== */}

<section
  id="about-school"
  className="
    relative
    overflow-hidden
    py-16
    sm:py-20
    lg:py-28
    px-4
    sm:px-6
    bg-gradient-to-b
    from-[#f8fbff]
    via-white
    to-[#f3f9ff]
  "
>

  {/* BACKGROUND EFFECTS */}

  <div
    className="
      absolute
      top-[-120px]
      left-[-120px]
      h-[260px]
      w-[260px]
      sm:h-[320px]
      sm:w-[320px]
      rounded-full
      bg-blue-200/40
      blur-3xl
    "
  />

  <div
    className="
      absolute
      bottom-[-120px]
      right-[-120px]
      h-[260px]
      w-[260px]
      sm:h-[320px]
      sm:w-[320px]
      rounded-full
      bg-cyan-200/40
      blur-3xl
    "
  />

  <div
    className="
      relative
      z-10
      max-w-7xl
      mx-auto
    "
  >

    <div
      className="
        grid
        lg:grid-cols-2
        gap-14
        lg:gap-20
        items-center
      "
    >

      {/* LEFT CONTENT */}

      <motion.div

        initial={{
          opacity: 0,
          y: 40,
        }}

        whileInView={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.7,
        }}

        viewport={{
          once: true,
        }}

        className="order-2 lg:order-1"
      >

        {/* BADGE */}

        <div
          className="
            inline-flex
            items-center
            gap-3
            rounded-full
            bg-blue-100
            px-5
            py-2.5
            text-xs
            sm:text-sm
            font-bold
            text-blue-700
            shadow-md
          "
        >

          <AcademicCapIcon
            className="
              h-5
              w-5
            "
          />

          ABOUT OUR SCHOOL

        </div>

        {/* TITLE */}

        <Typography
          variant="h1"
          className="
            mt-6
            text-3xl
            sm:text-5xl
            lg:text-6xl
            font-black
            leading-tight
            text-gray-900
          "
        >

          {
            school?.schoolName
          }

          <span
            className="
              block
              mt-3
              bg-gradient-to-r
              from-blue-700
              via-cyan-500
              to-blue-500
              bg-clip-text
              text-transparent
            "
          >
            Building Future Leaders
          </span>

        </Typography>

        {/* DESCRIPTION */}

        <Typography
          className="
            mt-7
            text-gray-600
            text-sm
            sm:text-base
            lg:text-lg
            leading-[2]
          "
        >
          {
            aboutSchool?.about ||
            school?.description
          }
        </Typography>

        {/* FEATURES */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-5
            mt-10
          "
        >

          {/* ESTABLISHED */}

          <motion.div
            whileHover={{
              y: -6,
            }}
          >

            <Card
              className="
                rounded-[28px]
                border
                border-blue-100
                bg-white/80
                backdrop-blur-xl
                shadow-xl
                overflow-hidden
                h-full
              "
            >

              <CardBody
                className="
                  p-6
                  sm:p-7
                "
              >

                <div
                  className="
                    h-16
                    w-16
                    rounded-2xl
                    bg-gradient-to-br
                    from-blue-600
                    to-cyan-500
                    flex
                    items-center
                    justify-center
                    shadow-xl
                  "
                >

                  <BuildingLibraryIcon
                    className="
                      h-8
                      w-8
                      text-white
                    "
                  />

                </div>

                <Typography
                  className="
                    mt-5
                    text-gray-500
                    font-medium
                  "
                >
                  Established
                </Typography>

                <Typography
                  className="
                    mt-2
                    text-3xl
                    font-black
                    text-gray-900
                  "
                >
                  {
                    aboutSchool?.establishedYear ||
                    "2000"
                  }
                </Typography>

              </CardBody>

            </Card>

          </motion.div>

          {/* MEDIUM */}

          <motion.div
            whileHover={{
              y: -6,
            }}
          >

            <Card
              className="
                rounded-[28px]
                border
                border-cyan-100
                bg-white/80
                backdrop-blur-xl
                shadow-xl
                overflow-hidden
                h-full
              "
            >

              <CardBody
                className="
                  p-6
                  sm:p-7
                "
              >

                <div
                  className="
                    h-16
                    w-16
                    rounded-2xl
                    bg-gradient-to-br
                    from-cyan-500
                    to-blue-700
                    flex
                    items-center
                    justify-center
                    shadow-xl
                  "
                >

                  <BookOpenIcon
                    className="
                      h-8
                      w-8
                      text-white
                    "
                  />

                </div>

                <Typography
                  className="
                    mt-5
                    text-gray-500
                    font-medium
                  "
                >
                  Medium
                </Typography>

                <Typography
                  className="
                    mt-2
                    text-2xl
                    sm:text-3xl
                    font-black
                    text-gray-900
                    break-words
                  "
                >
                  {
                    aboutSchool?.medium ||
                    "English"
                  }
                </Typography>

              </CardBody>

            </Card>

          </motion.div>

        </div>

      </motion.div>

      {/* RIGHT IMAGE */}

      <motion.div

        initial={{
          opacity: 0,
          scale: 0.9,
        }}

        whileInView={{
          opacity: 1,
          scale: 1,
        }}

        transition={{
          duration: 0.7,
        }}

        viewport={{
          once: true,
        }}

        className="
          relative
          order-1
          lg:order-2
        "
      >

        {/* MAIN IMAGE CARD */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[32px]
            sm:rounded-[40px]
            bg-gradient-to-br
            from-blue-700
            to-cyan-500
            p-[6px]
            shadow-[0_25px_80px_rgba(0,0,0,0.18)]
          "
        >

          <div
            className="
              relative
              overflow-hidden
              rounded-[28px]
              sm:rounded-[36px]
              bg-white
            "
          >

            <img
              src={
                aboutSchool?.logo
                  ? getImageUrl(
                      aboutSchool.logo
                    )
                  : defaultImage
              }
              alt="school-logo"
              className="
                h-[320px]
                sm:h-[480px]
                lg:h-[620px]
                w-full
                object-contain
                bg-white
                p-6
                sm:p-10
              "
            />

            {/* OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/50
                via-black/10
                to-transparent
              "
            />

          </div>

        </div>

        {/* FLOATING CARD */}

        <motion.div

          initial={{
            opacity: 0,
            y: 30,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.7,
            delay: 0.2,
          }}

          viewport={{
            once: true,
          }}

          className="
            relative
            sm:absolute
            mt-6
            sm:mt-0
            sm:bottom-[-30px]
            sm:left-1/2
            sm:-translate-x-1/2
            lg:left-auto
            lg:right-8
            lg:translate-x-0
            w-full
            sm:w-[92%]
            lg:w-auto
          "
        >

          <div
            className="
              rounded-[28px]
              border
              border-white/30
              bg-white/90
              backdrop-blur-2xl
              shadow-2xl
              px-5
              sm:px-6
              py-5
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
                sm:gap-5
              "
            >

              {/* MINI LOGO */}

              <div
                className="
                  h-16
                  w-16
                  sm:h-20
                  sm:w-20
                  rounded-3xl
                  overflow-hidden
                  border-4
                  border-white
                  shadow-xl
                  bg-white
                  flex-shrink-0
                "
              >

                <img
                  src={
                    aboutSchool?.logo
                      ? getImageUrl(
                          aboutSchool.logo
                        )
                      : defaultImage
                  }
                  alt="logo"
                  className="
                    h-full
                    w-full
                    object-contain
                    p-2
                  "
                />

              </div>

              {/* INFO */}

              <div className="min-w-0">

                <Typography
                  variant="h5"
                  className="
                    font-black
                    text-gray-900
                    leading-tight
                    text-lg
                    sm:text-xl
                    break-words
                  "
                >
                  {
                    school?.schoolName
                  }
                </Typography>

                <Typography
                  className="
                    mt-1
                    text-cyan-600
                    font-semibold
                    text-sm
                    sm:text-base
                  "
                >
                  {
                    school?.board ||
                    "Premium Education"
                  }
                </Typography>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mt-3
                  "
                >

                  <CheckCircleIcon
                    className="
                      h-5
                      w-5
                      text-green-500
                      flex-shrink-0
                    "
                  />

                  <Typography
                    className="
                      text-xs
                      sm:text-sm
                      font-semibold
                      text-gray-600
                    "
                  >
                    Trusted By Parents
                  </Typography>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </motion.div>

    </div>

  </div>

</section>

{/* ====================================================== */}
{/* STATS School Statistics */}
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
  id="facilities"
  className="
    relative
    overflow-hidden
    py-16
    sm:py-20
    lg:py-28
    px-4
    sm:px-6
    bg-gradient-to-b
    from-[#f8fbff]
    via-white
    to-[#eef7ff]
  "
>

  {/* BACKGROUND EFFECTS */}

  <div
    className="
      absolute
      top-[-120px]
      left-[-120px]
      h-[260px]
      w-[260px]
      sm:h-[360px]
      sm:w-[360px]
      rounded-full
      bg-blue-200/40
      blur-3xl
    "
  />

  <div
    className="
      absolute
      bottom-[-120px]
      right-[-120px]
      h-[260px]
      w-[260px]
      sm:h-[360px]
      sm:w-[360px]
      rounded-full
      bg-cyan-200/40
      blur-3xl
    "
  />

  <div
    className="
      relative
      z-10
      max-w-7xl
      mx-auto
    "
  >

    {/* HEADING */}

    <motion.div

      initial={{
        opacity: 0,
        y: 40,
      }}

      whileInView={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.7,
      }}

      viewport={{
        once: true,
      }}

      className="text-center"
    >

      {/* BADGE */}

      <div
        className="
          inline-flex
          items-center
          gap-3
          rounded-full
          bg-blue-100
          px-5
          py-2.5
          text-xs
          sm:text-sm
          font-bold
          text-blue-700
          shadow-md
        "
      >

        <SparklesIcon
          className="
            h-5
            w-5
          "
        />

        PREMIUM CAMPUS

      </div>

      {/* TITLE */}

      <Typography
        variant="h1"
        className="
          mt-6
          text-3xl
          sm:text-5xl
          lg:text-6xl
          font-black
          text-gray-900
          leading-tight
        "
      >

        World Class

        <span
          className="
            block
            mt-2
            bg-gradient-to-r
            from-blue-700
            via-cyan-500
            to-blue-500
            bg-clip-text
            text-transparent
          "
        >
          School Facilities
        </span>

      </Typography>

      {/* DESC */}

      <Typography
        className="
          mt-6
          max-w-3xl
          mx-auto
          text-sm
          sm:text-base
          lg:text-lg
          text-gray-600
          leading-[2]
        "
      >
        Modern infrastructure,
        innovative learning spaces &
        premium campus facilities
        designed to create future-ready
        students with excellence.
      </Typography>

    </motion.div>

    {/* FACILITY GRID */}

    {
      facilities?.length > 0 ? (

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            gap-6
            sm:gap-8
            mt-14
            sm:mt-20
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
                      y: 50,
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

                    className="h-full"
                  >

                    <Card
                      className="
                        relative
                        h-full
                        overflow-hidden
                        rounded-[30px]
                        sm:rounded-[38px]
                        border
                        border-white/60
                        bg-white/70
                        backdrop-blur-2xl
                        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
                        transition-all
                        duration-500
                        group
                        hover:shadow-[0_20px_60px_rgba(37,99,235,0.18)]
                      "
                    >

                      {/* TOP GLOW */}

                      <div
                        className="
                          absolute
                          top-0
                          right-0
                          h-36
                          w-36
                          bg-blue-200/30
                          rounded-full
                          blur-3xl
                          opacity-0
                          group-hover:opacity-100
                          transition-all
                          duration-500
                        "
                      />

                      {/* BORDER LIGHT */}

                      <div
                        className="
                          absolute
                          inset-x-0
                          top-0
                          h-[3px]
                          bg-gradient-to-r
                          from-blue-500
                          via-cyan-400
                          to-blue-500
                        "
                      />

                      <CardBody
                        className="
                          relative
                          z-10
                          p-6
                          sm:p-8
                          lg:p-10
                        "
                      >

                        {/* ICON */}

                        <div
                          className="
                            relative
                            h-20
                            w-20
                            sm:h-24
                            sm:w-24
                            rounded-[28px]
                            bg-gradient-to-br
                            from-blue-700
                            via-blue-600
                            to-cyan-500
                            flex
                            items-center
                            justify-center
                            shadow-[0_15px_40px_rgba(37,99,235,0.35)]
                            group-hover:scale-110
                            transition-all
                            duration-500
                          "
                        >

                          <div
                            className="
                              absolute
                              inset-0
                              rounded-[28px]
                              bg-white/10
                            "
                          />

                          <Icon
                            className="
                              relative
                              z-10
                              h-10
                              w-10
                              sm:h-12
                              sm:w-12
                              text-white
                            "
                          />

                        </div>

                        {/* COUNT */}

                        <div className="mt-7">

                          <Chip
                            value={`Total ${facility.totalCount}`}
                            className="
                              w-fit
                              rounded-full
                              bg-blue-100
                              text-blue-700
                              font-bold
                            "
                          />

                        </div>

                        {/* TITLE */}

                        <Typography
                          variant="h4"
                          className="
                            mt-6
                            text-2xl
                            sm:text-3xl
                            font-black
                            text-gray-900
                            leading-snug
                          "
                        >
                          {facility.title}
                        </Typography>

                        {/* DESC */}

                        <Typography
                          className="
                            mt-5
                            text-sm
                            sm:text-base
                            text-gray-600
                            leading-[2]
                          "
                        >
                          {
                            facility.description
                          }
                        </Typography>

                        {/* FOOTER */}

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            mt-8
                            pt-6
                            border-t
                            border-gray-100
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
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
                                text-sm
                                font-semibold
                                text-green-600
                              "
                            >
                              Premium Facility
                            </Typography>

                          </div>

                          <ArrowRightIcon
                            className="
                              h-5
                              w-5
                              text-blue-600
                              group-hover:translate-x-1
                              transition-all
                            "
                          />

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

        <div
          className="
            text-center
            py-20
            sm:py-24
          "
        >

          <div
            className="
              mx-auto
              h-24
              w-24
              rounded-full
              bg-blue-100
              flex
              items-center
              justify-center
            "
          >

            <BuildingOffice2Icon
              className="
                h-12
                w-12
                text-blue-600
              "
            />

          </div>

          <Typography
            variant="h4"
            className="
              mt-8
              font-black
              text-gray-800
            "
          >
            No Facilities Available
          </Typography>

          <Typography
            className="
              mt-3
              text-gray-500
            "
          >
            Facilities will appear here soon.
          </Typography>

        </div>
      )
    }

  </div>

</section>

{/* ====================================================== */}
{/* GALLERY */}
{/* ====================================================== */}

<section
  id="gallery"
  className="
    relative
    overflow-hidden
    py-16
    sm:py-20
    lg:py-28
    px-4
    sm:px-6
    bg-gradient-to-b
    from-[#f8fbff]
    via-white
    to-[#f4f9ff]
  "
>

  {/* BG EFFECTS */}

  <div
    className="
      absolute
      top-[-120px]
      left-[-120px]
      h-[280px]
      w-[280px]
      rounded-full
      bg-blue-200/30
      blur-3xl
    "
  />

  <div
    className="
      absolute
      bottom-[-120px]
      right-[-120px]
      h-[280px]
      w-[280px]
      rounded-full
      bg-cyan-200/30
      blur-3xl
    "
  />

  <div
    className="
      relative
      z-10
      max-w-7xl
      mx-auto
    "
  >

    {/* HEADER */}

    <div className="text-center">

      <div
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-blue-100
          px-5
          py-2
          text-sm
          font-bold
          text-blue-700
          shadow-md
        "
      >

        <PhotoIcon
          className="
            h-5
            w-5
          "
        />

        SCHOOL GALLERY

      </div>

      <Typography
        variant="h1"
        className="
          mt-6
          text-3xl
          sm:text-4xl
          md:text-5xl
          lg:text-6xl
          font-black
          text-gray-900
          leading-tight
        "
      >
        Capturing Beautiful
        <span
          className="
            block
            mt-2
            bg-gradient-to-r
            from-blue-700
            to-cyan-500
            bg-clip-text
            text-transparent
          "
        >
          School Moments
        </span>
      </Typography>

      <Typography
        className="
          mt-6
          text-gray-600
          text-sm
          sm:text-base
          lg:text-lg
          leading-relaxed
          max-w-3xl
          mx-auto
        "
      >
        Explore campus life,
        achievements, events,
        celebrations & unforgettable
        student memories.
      </Typography>

    </div>

    {/* GALLERY */}

    {
      gallery?.length > 0 ? (

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            gap-6
            lg:gap-8
            mt-14
            sm:mt-16
            lg:mt-20
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
                    delay: index * 0.1,
                  }}

                  viewport={{
                    once: true,
                  }}

                  whileHover={{
                    y: -10,
                  }}

                  className="h-full"
                >

                  <Card
                    className="
                      relative
                      overflow-hidden
                      rounded-[32px]
                      border
                      border-white/60
                      bg-white/80
                      backdrop-blur-xl
                      shadow-xl
                      hover:shadow-2xl
                      transition-all
                      duration-500
                      h-full
                      group
                    "
                  >

                    {/* TOP IMAGE / VIDEO */}

                    <div
                      className="
                        relative
                        overflow-hidden
                        h-[240px]
                        sm:h-[280px]
                        lg:h-[320px]
                      "
                    >

                      {
                        item.type ===
                        "VIDEO" ? (

                          <div
                            className="
                              relative
                              h-full
                              cursor-pointer
                            "
                            onClick={() =>
                              openVideoPreview(
                                item
                              )
                            }
                          >

                            <img
                              src={
                                item.thumbnail ||
                                "https://via.placeholder.com/600x400?text=Video"
                              }
                              alt={
                                item.title ||
                                "Video"
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

                            {/* OVERLAY */}

                            <div
                              className="
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-black/70
                                via-black/20
                                to-transparent
                                flex
                                items-center
                                justify-center
                              "
                            >

                              <div
                                className="
                                  h-20
                                  w-20
                                  sm:h-24
                                  sm:w-24
                                  rounded-full
                                  bg-white/20
                                  backdrop-blur-xl
                                  flex
                                  items-center
                                  justify-center
                                  border
                                  border-white/30
                                  shadow-2xl
                                  group-hover:scale-110
                                  transition-all
                                  duration-500
                                "
                              >

                                <PlayCircleIcon
                                  className="
                                    h-14
                                    w-14
                                    sm:h-16
                                    sm:w-16
                                    text-white
                                  "
                                />

                              </div>

                            </div>

                          </div>

                        ) : (

                          <img
                            src={
                              item.fileName
                            }
                            alt={
                              item.title ||
                              "Gallery"
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

                        )
                      }

                      {/* TOP CHIPS */}

                      <div
                        className="
                          absolute
                          top-4
                          left-4
                          right-4
                          flex
                          items-center
                          justify-between
                          gap-2
                        "
                      >

                        <Chip
                          value={
                            item.type ||
                            "IMAGE"
                          }
                          className={`
                            ${
                              item.type ===
                              "VIDEO"
                                ? "bg-purple-500"
                                : "bg-green-500"
                            }
                            text-white
                            shadow-lg
                          `}
                        />

                        <div
                          className="
                            px-3
                            py-1
                            rounded-full
                            bg-white/20
                            backdrop-blur-xl
                            text-white
                            text-xs
                            font-bold
                            border
                            border-white/20
                          "
                        >
                          ACTIVE
                        </div>

                      </div>

                    </div>

                    {/* CONTENT */}

                    <CardBody
                      className="
                        p-5
                        sm:p-6
                        lg:p-7
                      "
                    >

                      <Typography
                        variant="h4"
                        className="
                          font-black
                          text-gray-900
                          text-xl
                          sm:text-2xl
                          leading-tight
                        "
                      >
                        {
                          item.title ||
                          "Gallery Title"
                        }
                      </Typography>

                      <Typography
                        className="
                          mt-4
                          text-gray-600
                          text-sm
                          sm:text-base
                          leading-relaxed
                          line-clamp-3
                        "
                      >
                        {
                          item.description ||
                          "School activity and campus memories showcased beautifully."
                        }
                      </Typography>

                      {/* FOOTER */}

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mt-6
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
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
                              text-sm
                              font-semibold
                              text-green-600
                            "
                          >
                            Verified Media
                          </Typography>

                        </div>

                        <div
                          className="
                            h-11
                            w-11
                            rounded-2xl
                            bg-gradient-to-br
                            from-blue-600
                            to-cyan-500
                            flex
                            items-center
                            justify-center
                            shadow-lg
                            group-hover:rotate-45
                            transition-all
                            duration-500
                          "
                        >

                          <ArrowRightIcon
                            className="
                              h-5
                              w-5
                              text-white
                            "
                          />

                        </div>

                      </div>

                    </CardBody>

                  </Card>

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
            sm:py-24
          "
        >

          <div
            className="
              mx-auto
              h-28
              w-28
              rounded-full
              bg-blue-100
              flex
              items-center
              justify-center
            "
          >

            <PhotoIcon
              className="
                h-14
                w-14
                text-blue-600
              "
            />

          </div>

          <Typography
            variant="h4"
            className="
              mt-8
              font-black
              text-gray-800
            "
          >
            No Gallery Available
          </Typography>

          <Typography
            className="
              mt-3
              text-gray-500
              max-w-md
              mx-auto
            "
          >
            Gallery photos & videos
            will appear here once
            uploaded by the school.
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
  id="testimonials"
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
{/* PREMIUM MOBILE FIRST FOOTER */}
{/* ====================================================== */}

<footer
  className="
    relative
    overflow-hidden
    bg-[#020617]
    text-white
  "
>

  {/* BG EFFECTS */}

  <div
    className="
      absolute
      top-[-120px]
      left-[-120px]
      h-[260px]
      w-[260px]
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
      h-[260px]
      w-[260px]
      rounded-full
      bg-blue-600/20
      blur-3xl
    "
  />

  <div
    className="
      relative
      z-10
      max-w-7xl
      mx-auto
      px-5
      py-16
    "
  >

    {/* TOP GRID */}

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-12
      "
    >

      {/* ====================================================== */}
      {/* SCHOOL INFO */}
      {/* ====================================================== */}

      <div>

        {/* LOGO */}

        <div className="flex items-center gap-4">

          <div
            className="
              h-16
              w-16
              rounded-3xl
              overflow-hidden
              border
              border-white/10
              bg-white
              shadow-2xl
            "
          >

            <img
              src={
                aboutSchool?.logo
                  ? getImageUrl(
                      aboutSchool.logo
                    )
                  : defaultImage
              }
              alt="logo"
              className="
                h-full
                w-full
                object-cover
              "
            />

          </div>

          <div>

            <Typography
              variant="h4"
              className="
                font-black
                text-white
                leading-tight
              "
            >
              {
                school?.schoolName
              }
            </Typography>

            <Typography
              className="
                text-cyan-400
                text-sm
                mt-1
              "
            >
              {
                aboutSchool?.board ||
                "Premium School"
              }
            </Typography>

          </div>

        </div>

        {/* TAGLINE */}

        <Typography
          className="
            mt-7
            text-gray-400
            leading-relaxed
            text-[15px]
          "
        >
          {
            aboutSchool?.tagline ||
            "Building future-ready students through modern education."
          }
        </Typography>

        {/* WEBSITE */}

        {
          aboutSchool?.website && (

            <a
              href={
                aboutSchool.website.startsWith(
                  "http"
                )
                  ? aboutSchool.website
                  : `https://${aboutSchool.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="
                mt-6
                inline-flex
                items-center
                gap-3
                rounded-2xl
                border
                border-cyan-400/20
                bg-cyan-500/10
                px-5
                py-3
                text-cyan-300
                font-semibold
                hover:bg-cyan-500/20
                transition-all
                duration-300
              "
            >

              <GlobeAltIcon
                className="
                  h-5
                  w-5
                "
              />

              Visit Website

            </a>
          )
        }

        {/* SOCIALS */}

        <div className="flex gap-4 mt-8">

          {
            aboutSchool?.facebookLink && (

              <a
                href={
                  aboutSchool.facebookLink
                }
                target="_blank"
                rel="noopener noreferrer"
                className="
                  h-12
                  w-12
                  rounded-2xl
                  bg-blue-600
                  flex
                  items-center
                  justify-center
                  text-white
                  text-lg
                  hover:scale-110
                  transition-all
                  duration-300
                  shadow-lg
                "
              >
                <FaFacebookF />
              </a>
            )
          }

          {
            aboutSchool?.instagramLink && (

              <a
                href={
                  aboutSchool.instagramLink
                }
                target="_blank"
                rel="noopener noreferrer"
                className="
                  h-12
                  w-12
                  rounded-2xl
                  bg-gradient-to-r
                  from-pink-500
                  to-orange-500
                  flex
                  items-center
                  justify-center
                  text-white
                  text-lg
                  hover:scale-110
                  transition-all
                  duration-300
                  shadow-lg
                "
              >
                <FaInstagram />
              </a>
            )
          }

          {
            aboutSchool?.youtubeLink && (

              <a
                href={
                  aboutSchool.youtubeLink
                }
                target="_blank"
                rel="noopener noreferrer"
                className="
                  h-12
                  w-12
                  rounded-2xl
                  bg-red-600
                  flex
                  items-center
                  justify-center
                  text-white
                  text-lg
                  hover:scale-110
                  transition-all
                  duration-300
                  shadow-lg
                "
              >
                <FaYoutube />
              </a>
            )
          }

        </div>

      </div>

      {/* ====================================================== */}
      {/* CONTACT INFO */}
      {/* ====================================================== */}

      <div>

        <Typography
          variant="h5"
          className="
            font-black
            text-white
            mb-8
          "
        >
          Contact Info
        </Typography>

        <div className="space-y-6">

          {/* PHONE */}

          <div className="flex gap-4">

            <div
              className="
                h-12
                w-12
                rounded-2xl
                bg-blue-500/10
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >

              <PhoneIcon
                className="
                  h-5
                  w-5
                  text-cyan-400
                "
              />

            </div>

            <div>

              <Typography
                className="
                  text-sm
                  text-gray-500
                "
              >
                Phone
              </Typography>

              <Typography
                className="
                  text-white
                  font-medium
                  break-all
                "
              >
                {
                  school?.phone ||
                  "N/A"
                }
              </Typography>

            </div>

          </div>

          {/* EMAIL */}

          <div className="flex gap-4">

            <div
              className="
                h-12
                w-12
                rounded-2xl
                bg-blue-500/10
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >

              <EnvelopeIcon
                className="
                  h-5
                  w-5
                  text-cyan-400
                "
              />

            </div>

            <div>

              <Typography
                className="
                  text-sm
                  text-gray-500
                "
              >
                Email
              </Typography>

              <Typography
                className="
                  text-white
                  font-medium
                  break-all
                "
              >
                {
                  school?.email ||
                  "N/A"
                }
              </Typography>

            </div>

          </div>

          {/* ADDRESS */}

          <div className="flex gap-4">

            <div
              className="
                h-12
                w-12
                rounded-2xl
                bg-blue-500/10
                flex
                items-center
                justify-center
                flex-shrink-0
              "
            >

              <MapPinIcon
                className="
                  h-5
                  w-5
                  text-cyan-400
                "
              />

            </div>

            <div>

              <Typography
                className="
                  text-sm
                  text-gray-500
                "
              >
                Address
              </Typography>

              <Typography
                className="
                  text-white
                  leading-relaxed
                "
              >
                {
                  school?.address ||
                  "N/A"
                }
              </Typography>

            </div>

          </div>

        </div>

      </div>

      {/* ====================================================== */}
      {/* QUICK LINKS */}
      {/* ====================================================== */}

      <div>

        <Typography
          variant="h5"
          className="
            font-black
            text-white
            mb-8
          "
        >
          Quick Links
        </Typography>

        <div className="space-y-5">

          {
            [
              {
                label: "About School",
                id: "about-school",
              },
              {
                label: "Facilities",
                id: "facilities",
              },
              {
                label: "Gallery",
                id: "gallery",
              },
              {
                label: "Testimonials",
                id: "testimonials",
              },
              {
                label: "Admission Inquiry",
                id: "admission-inquiry",
              },
            ].map((item, index) => (

              <button
                key={index}
                onClick={() => {

                  const section =
                    document.getElementById(
                      item.id
                    );

                  if (section) {

                    section.scrollIntoView({
                      behavior:
                        "smooth",
                    });
                  }
                }}
                className="
                  flex
                  items-center
                  gap-3
                  text-gray-400
                  hover:text-cyan-400
                  transition-all
                  duration-300
                "
              >

                <CheckCircleIcon
                  className="
                    h-4
                    w-4
                  "
                />

                {item.label}

              </button>
            ))
          }

        </div>

      </div>

      {/* ====================================================== */}
      {/* ADMISSION */}
      {/* ====================================================== */}

      <div>

        <div
          className="
            rounded-[32px]
            border
            border-white/10
            bg-white/5
            backdrop-blur-xl
            p-8
          "
        >

          <Typography
            variant="h4"
            className="
              font-black
              text-white
              leading-tight
            "
          >
            Admissions Open
          </Typography>

          <Typography
            className="
              mt-5
              text-gray-400
              leading-relaxed
            "
          >
            Enroll your child in one of
            the best modern schools for
            future-ready education.
          </Typography>

          <Button
            fullWidth
            onClick={() => {

              const section =
                document.getElementById(
                  "admission-inquiry"
                );

              if (section) {

                section.scrollIntoView({
                  behavior:
                    "smooth",
                });
              }
            }}
            className="
              mt-8
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              to-blue-600
              py-4
              text-base
              shadow-2xl
            "
          >
            Apply Now
          </Button>

        </div>

      </div>

    </div>

    {/* ====================================================== */}
    {/* BOTTOM */}
    {/* ====================================================== */}

    <div
      className="
        mt-16
        border-t
        border-white/10
        pt-8
        flex
        flex-col
        md:flex-row
        items-center
        justify-between
        gap-5
      "
    >

      <Typography
        className="
          text-gray-500
          text-center
          md:text-left
          text-sm
        "
      >
        © 2026 {
          school?.schoolName
        }. All Rights Reserved.
      </Typography>

      <Typography
        className="
          text-gray-600
          text-sm
          text-center
        "
      >
        Designed with ❤️ for modern
        education
      </Typography>

    </div>

  </div>

</footer>

    </div>
  );
}