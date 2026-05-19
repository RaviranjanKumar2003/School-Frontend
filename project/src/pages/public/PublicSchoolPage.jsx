// ======================================================
// PublicSchoolPage.jsx
// Dynamic Public School Page
// URL => /school/:slug
// ======================================================

import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Textarea,
  Carousel,
} from "@material-tailwind/react";

import {
  BuildingOffice2Icon,
  PhoneIcon,
  MapPinIcon,
  AcademicCapIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

import {
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

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

  const [loading, setLoading] =
    useState(true);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  // ======================================================
  // FORM DATA
  // ======================================================

  const [formData, setFormData] =
    useState({

      studentName: "",

      parentName: "",

      phone: "",

      email: "",

      message: "",
    });

  // ======================================================
  // FETCH SCHOOL
  // ======================================================

  useEffect(() => {

    fetchSchool();

  }, [slug]);

  // ======================================================
  // FETCH SCHOOL API
  // ======================================================

  const fetchSchool = async () => {

    try {

      setLoading(true);

      setError("");

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
        "PUBLIC SCHOOL DATA = ",
        data
      );

      setSchool(data);

    } catch (err) {

      console.error(err);

      setError(
        "Failed to load school"
      );

    } finally {

      setLoading(false);
    }
  };

  // ======================================================
  // HANDLE INPUT
  // ======================================================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  // ======================================================
  // SUBMIT INQUIRY
  // ======================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    try {

      const response = await fetch(

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

      // RESET FORM

      setFormData({

        studentName: "",

        parentName: "",

        phone: "",

        email: "",

        message: "",
      });

    } catch (err) {

      console.error(err);

      setError(
        err.message
      );
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gray-100
        "
      >

        <div
          className="
            h-16
            w-16
            rounded-full
            border-4
            border-blue-600
            border-t-transparent
            animate-spin
          "
        />

      </div>
    );
  }

  // ======================================================
  // ERROR
  // ======================================================

  if (error && !school) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gray-100
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

  // ======================================================
  // DEFAULT IMAGE
  // ======================================================

  const defaultImage =
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1400";

  // ======================================================
  // COVER IMAGE URL
  // ======================================================

  const getCoverImageUrl = (
    imageName
  ) => {

    if (!imageName)
      return defaultImage;

    // FULL URL ALREADY EXISTS

    if (
      imageName.startsWith("http")
    ) {

      return imageName;
    }

    // LOCAL FILE

    return `${BASE_URL}/schools/cover/get-file/${imageName}`;
  };

  // ======================================================
  // UI
  // ======================================================

  return (

    <section
      className="
        min-h-screen
        bg-gradient-to-br
        from-blue-50
        via-white
        to-cyan-50
      "
    >

      {/* ======================================================
          HERO SECTION
      ====================================================== */}

      <div
        className="
          bg-gradient-to-r
          from-blue-700
          via-indigo-700
          to-cyan-600
          text-white
          py-20
          px-6
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            grid
            lg:grid-cols-2
            gap-12
            items-center
          "
        >

          {/* ======================================================
              LEFT CONTENT
          ====================================================== */}

          <div>

            <div
              className="
                flex
                items-center
                gap-4
                mb-6
              "
            >

              <BuildingOffice2Icon
                className="h-12 w-12"
              />

              <Typography
                variant="h1"
                className="
                  text-4xl
                  md:text-5xl
                  font-black
                "
              >
                {school?.schoolName}
              </Typography>

            </div>

            <Typography
              className="
                text-lg
                text-blue-100
                leading-relaxed
              "
            >
              Welcome to our school.
              We focus on quality education,
              discipline, technology,
              and holistic student growth.
            </Typography>

            {/* INFO */}

            <div
              className="
                mt-8
                space-y-4
              "
            >

              {/* PHONE */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <PhoneIcon
                  className="h-5 w-5"
                />

                <span>
                  {school?.phone ||
                    "Not Available"}
                </span>

              </div>

              {/* EMAIL */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <EnvelopeIcon
                  className="h-5 w-5"
                />

                <span>
                  {school?.email ||
                    "No Email"}
                </span>

              </div>

              {/* ADDRESS */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <MapPinIcon
                  className="h-5 w-5"
                />

                <span>
                  {school?.address ||
                    "Address not available"}
                </span>

              </div>

            </div>

          </div>

          {/* ======================================================
              RIGHT IMAGE / CAROUSEL
          ====================================================== */}

          <div
            className="
              rounded-3xl
              overflow-hidden
              shadow-2xl
              bg-white
            "
          >

            {
              school?.coverImages &&
              school.coverImages.length > 0 ? (

                <Carousel
                  autoplay
                  loop
                  className="h-[420px]"
                >

                  {
                    school.coverImages.map(
                      (img, index) => (

                        <img
                          key={index}

                          src={getCoverImageUrl(img)}

                          alt={`school-${index}`}

                          className="
                            h-full
                            w-full
                            object-cover
                          "

                          onError={(e) => {

                            console.log(
                              "IMAGE FAILED = ",
                              img
                            );

                            e.target.onerror =
                              null;

                            e.target.src =
                              defaultImage;
                          }}
                        />
                      )
                    )
                  }

                </Carousel>

              ) : (

                <img
                  src={defaultImage}
                  alt="school"

                  className="
                    h-[420px]
                    w-full
                    object-cover
                  "
                />

              )
            }

          </div>

        </div>

      </div>

      {/* ======================================================
          FEATURES
      ====================================================== */}

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-20
        "
      >

        <Typography
          variant="h2"
          className="
            text-center
            font-black
            mb-14
          "
        >
          Why Choose Us?
        </Typography>

        <div
          className="
            grid
            md:grid-cols-3
            gap-8
          "
        >

          {/* CARD 1 */}

          <Card
            className="
              rounded-3xl
              shadow-xl
              hover:shadow-2xl
              transition-all
            "
          >

            <CardBody className="text-center">

              <AcademicCapIcon
                className="
                  h-16
                  w-16
                  mx-auto
                  text-blue-700
                  mb-5
                "
              />

              <Typography
                variant="h5"
                className="font-bold"
              >
                Quality Education
              </Typography>

              <Typography
                className="
                  mt-4
                  text-gray-600
                "
              >
                Modern curriculum,
                smart learning,
                and experienced faculty.
              </Typography>

            </CardBody>

          </Card>

          {/* CARD 2 */}

          <Card
            className="
              rounded-3xl
              shadow-xl
              hover:shadow-2xl
              transition-all
            "
          >

            <CardBody className="text-center">

              <BuildingOffice2Icon
                className="
                  h-16
                  w-16
                  mx-auto
                  text-indigo-700
                  mb-5
                "
              />

              <Typography
                variant="h5"
                className="font-bold"
              >
                Smart Campus
              </Typography>

              <Typography
                className="
                  mt-4
                  text-gray-600
                "
              >
                Smart classrooms,
                labs,
                activities,
                and digital systems.
              </Typography>

            </CardBody>

          </Card>

          {/* CARD 3 */}

          <Card
            className="
              rounded-3xl
              shadow-xl
              hover:shadow-2xl
              transition-all
            "
          >

            <CardBody className="text-center">

              <PhoneIcon
                className="
                  h-16
                  w-16
                  mx-auto
                  text-cyan-700
                  mb-5
                "
              />

              <Typography
                variant="h5"
                className="font-bold"
              >
                Parent Support
              </Typography>

              <Typography
                className="
                  mt-4
                  text-gray-600
                "
              >
                Fast inquiry support
                and parent-school
                communication.
              </Typography>

            </CardBody>

          </Card>

        </div>

      </div>

      {/* ======================================================
          INQUIRY FORM
      ====================================================== */}

      <div
        className="
          max-w-3xl
          mx-auto
          px-6
          pb-24
        "
      >

        <Card
          className="
            rounded-3xl
            shadow-2xl
          "
        >

          <CardBody className="p-8 md:p-12">

            <Typography
              variant="h2"
              className="
                text-center
                font-black
                mb-10
              "
            >
              Admission Inquiry
            </Typography>

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
                onChange={handleChange}
                required
              />

              <Input
                size="lg"
                label="Parent Name"
                name="parentName"
                value={
                  formData.parentName
                }
                onChange={handleChange}
                required
              />

              <Input
                size="lg"
                label="Phone Number"
                name="phone"
                value={
                  formData.phone
                }
                onChange={handleChange}
                required
              />

              <Input
                size="lg"
                type="email"
                label="Email"
                name="email"
                value={
                  formData.email
                }
                onChange={handleChange}
              />

              <Textarea
                label="Message"
                name="message"
                value={
                  formData.message
                }
                onChange={handleChange}
              />

              {/* SUCCESS */}

              {success && (

                <Typography
                  color="green"
                  className="
                    text-center
                    font-medium
                  "
                >
                  {success}
                </Typography>
              )}

              {/* ERROR */}

              {error && (

                <Typography
                  color="red"
                  className="
                    text-center
                    font-medium
                  "
                >
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                className="
                  bg-blue-700
                  rounded-xl
                  py-4
                  text-base
                  shadow-lg
                "
              >
                Submit Inquiry
              </Button>

            </form>

          </CardBody>

        </Card>

      </div>

    </section>
  );
}