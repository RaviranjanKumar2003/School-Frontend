import React, { useEffect, useState, useRef  } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import {
  Card,
  CardBody,
  Typography,
  Button,
  Avatar,
  Progress,
  Chip,
  Spinner,
} from "@material-tailwind/react";

import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  PhoneIcon,
  CalendarDaysIcon,
  BellAlertIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ArrowPathIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

// ======================================================
// BASE URL
// ======================================================

const BASE_URL =
  "http://localhost:8080/api";

// ======================================================
// RECEPTIONIST DASHBOARD
// ======================================================

function Home() {

    const navigate = useNavigate();
    
    const inquiriesRef = useRef(null);

  // ======================================================
  // LOCAL STORAGE
  // ======================================================

  const receptionistData = JSON.parse(
    localStorage.getItem(
      "receptionistData"
    )
  );

  const schoolCode =
    receptionistData?.school
      ?.schoolCode;

  const schoolName =
    receptionistData?.school
      ?.schoolName;

  // ======================================================
  // STATES
  // ======================================================

  const [loading, setLoading] =
    useState(true);

  const [inquiries, setInquiries] =
    useState([]);

  // ======================================================
  // FETCH INQUIRIES
  // ======================================================

  const fetchInquiries =
    async () => {

      try {

        setLoading(true);

        const response =
          await axios.get(

            `${BASE_URL}/inquiries/school/${schoolCode}`

          );

        setInquiries(
          response.data || []
        );

      } catch (err) {

        console.error(
          "Inquiry Fetch Error:",
          err.response?.data ||
            err.message
        );

      } finally {

        setLoading(false);
      }
    };

  // ======================================================
  // USE EFFECT
  // ======================================================

  useEffect(() => {

    if (schoolCode) {

      fetchInquiries();
    }

  }, [schoolCode]);

  // ======================================================
  // STATS
  // ======================================================

  const totalInquiries =
    inquiries.length;

  const todayInquiries =
    inquiries.filter((item) => {

      const today =
        new Date().toDateString();

      return (
        new Date(
          item.createdAt
        ).toDateString() ===
        today
      );
    }).length;

  const totalCalls =
    inquiries.length * 2;

  const followUps =
    inquiries.filter(
      (item) =>
        item.status ===
        "FOLLOW_UP"
    ).length;

  // ======================================================
  // STATS ARRAY
  // ======================================================

  const stats = [

    {
      title: "Total Inquiries",
      value:
        totalInquiries || 0,
      icon:
        ClipboardDocumentListIcon,
      color:
        "from-blue-500 to-cyan-500",
    },

    {
      title: "Today's Inquiries",
      value:
        todayInquiries || 0,
      icon: UserGroupIcon,
      color:
        "from-indigo-500 to-purple-500",
    },

    {
      title: "Parent Calls",
      value: totalCalls || 0,
      icon: PhoneIcon,
      color:
        "from-orange-500 to-red-500",
    },

    {
      title: "Follow Ups",
      value: followUps || 0,
      icon: CalendarDaysIcon,
      color:
        "from-green-500 to-emerald-500",
    },
  ];

  // ======================================================
  // TASKS
  // ======================================================

  const todayTasks = [

    "Confirm admission inquiry calls",

    "Manage front desk visitors",

    "Follow-up pending admissions",

    "Update inquiry records",

    "Handle parent communication",
  ];

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
          bg-gradient-to-br
          from-blue-50
          to-cyan-50
        "
      >

        <Spinner
          className="
            h-14
            w-14
          "
        />

      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-blue-50
        via-white
        to-cyan-50
        p-4
        md:p-6
      "
    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="
          bg-gradient-to-r
          from-blue-700
          via-indigo-700
          to-cyan-600
          rounded-3xl
          p-6
          md:p-10
          text-white
          shadow-2xl
          relative
          overflow-hidden
        "
      >

        {/* BG CIRCLES */}

        <div
          className="
            absolute
            -right-10
            -top-10
            h-44
            w-44
            rounded-full
            bg-white/10
          "
        />

        <div
          className="
            absolute
            -bottom-16
            -left-10
            h-60
            w-60
            rounded-full
            bg-white/10
          "
        />

        <div
          className="
            relative
            z-10
            flex
            flex-col
            xl:flex-row
            items-start
            xl:items-center
            justify-between
            gap-8
          "
        >

          {/* LEFT */}

          <div>

            <Typography
              variant="h1"
              className="
                text-3xl
                md:text-5xl
                font-black
              "
            >
              Reception Dashboard
            </Typography>

            <Typography
              className="
                mt-4
                text-blue-100
                text-base
                md:text-lg
                max-w-3xl
              "
            >
              Manage admission inquiries,
              visitors, parent communication,
              front desk operations,
              and school reception activities.
            </Typography>

            {/* SCHOOL */}

            <div
              className="
                mt-6
                flex
                items-center
                gap-3
              "
            >

              <BuildingOffice2Icon
                className="
                  h-6
                  w-6
                "
              />

              <Typography
                className="
                  text-lg
                  font-semibold
                "
              >
                {schoolName ||
                  "School"}
              </Typography>

            </div>

            {/* ACTIONS */}

            <div
              className="
                mt-6
                flex
                flex-wrap
                gap-3
              "
            >

              <Button
  onClick={() => {
    inquiriesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }}
  className="bg-white text-blue-700 rounded-xl"
>
  New Inquiry
</Button>

              <Button
                onClick={
                  fetchInquiries
                }
                variant="outlined"
                className="
                  border-white
                  text-white
                  rounded-xl
                  flex
                  items-center
                  gap-2
                "
              >

                <ArrowPathIcon
                  className="
                    h-5
                    w-5
                  "
                />

                Refresh

              </Button>

            </div>

          </div>

          {/* RIGHT */}

          <div
            className="
              bg-white/10
              backdrop-blur-lg
              rounded-3xl
              p-5
              w-full
              md:w-auto
              flex
              items-center
              gap-4
            "
          >

            <Avatar
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              size="xxl"
              className="
                border-4
                border-white
                shadow-xl
              "
            />

            <div>

              <Typography
                variant="h4"
                className="
                  font-bold
                "
              >
                Receptionist
              </Typography>

              <Typography
                className="
                  text-blue-100
                "
              >
                Front Desk Manager
              </Typography>

              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-2
                "
              >

                <CheckCircleIcon
                  className="
                    h-5
                    w-5
                    text-green-300
                  "
                />

                <Typography
                  className="
                    text-sm
                    text-green-100
                  "
                >
                  Active Today
                </Typography>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          xl:grid-cols-4
          gap-6
          mt-8
        "
      >

        {stats.map(
          (item, index) => {

            const Icon =
              item.icon;

            return (

              <Card
                key={index}
                className="
                  rounded-3xl
                  shadow-xl
                  border
                  border-gray-100
                  hover:-translate-y-1
                  transition-all
                "
              >

                <CardBody>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <Typography
                        className="
                          text-gray-500
                          font-medium
                        "
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        variant="h2"
                        className="
                          mt-2
                          font-black
                        "
                      >
                        {item.value}
                      </Typography>

                    </div>

                    <div
                      className={`
                        h-16
                        w-16
                        rounded-2xl
                        bg-gradient-to-r
                        ${item.color}
                        flex
                        items-center
                        justify-center
                        shadow-lg
                      `}
                    >

                      <Icon
                        className="
                          h-8
                          w-8
                          text-white
                        "
                      />

                    </div>

                  </div>

                </CardBody>

              </Card>
            );
          }
        )}

      </div>

      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-3
          gap-6
          mt-8
        "
      >

        {/* ================================================= */}
        {/* LEFT */}
        {/* ================================================= */}

        <div
          className="
            xl:col-span-2
            space-y-6
          "
        >

          {/* ================================================= */}
          {/* RECENT INQUIRIES */}
          {/* ================================================= */}

          <Card
          ref={inquiriesRef}
            className="
              rounded-3xl
              shadow-xl
            "
          >

            <CardBody>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-6
                "
              >

                <Typography
                  variant="h4"
                  className="
                    font-black
                  "
                >
                  Recent Inquiries
                </Typography>

                <Chip
                  value={`${totalInquiries} Total`}
                  color="blue"
                />

              </div>

              {/* EMPTY */}

              {inquiries.length ===
              0 ? (

                <div
                  className="
                    py-16
                    text-center
                  "
                >

                  <ClipboardDocumentListIcon
                    className="
                      h-16
                      w-16
                      mx-auto
                      text-gray-300
                    "
                  />

                  <Typography
                    variant="h5"
                    className="
                      mt-4
                      font-bold
                      text-gray-600
                    "
                  >
                    No Inquiries Found
                  </Typography>

                </div>

              ) : (

                <div className="space-y-4">

                  {inquiries
                    .slice(0, 8)
                    .map(
                      (
                        item,
                        index
                      ) => (

                        <div
                          key={index}
                          className="
                            p-4
                            rounded-3xl
                            border
                            border-gray-100
                            hover:bg-blue-50
                            transition-all
                            flex
                            flex-col
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                            gap-5
                          "
                        >

                          {/* LEFT */}

                          <div
                            className="
                              flex
                              items-start
                              gap-4
                            "
                          >

                            <div
                              className="
                                h-16
                                w-16
                                rounded-2xl
                                bg-blue-100
                                flex
                                items-center
                                justify-center
                                shrink-0
                              "
                            >

                              <AcademicCapIcon
                                className="
                                  h-8
                                  w-8
                                  text-blue-700
                                "
                              />

                            </div>

                            <div>

                              <Typography
                                variant="h6"
                                className="
                                  font-bold
                                "
                              >
                                {
                                  item.studentName
                                }
                              </Typography>

                              <Typography
                                className="
                                  text-sm
                                  text-gray-600
                                  mt-1
                                "
                              >
                                Parent:{" "}
                                {
                                  item.parentName
                                }
                              </Typography>

                              <div
                                className="
                                  mt-2
                                  flex
                                  flex-col
                                  sm:flex-row
                                  sm:items-center
                                  gap-2
                                  sm:gap-4
                                "
                              >

                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-2
                                  "
                                >

                                  <PhoneIcon
                                    className="
                                      h-4
                                      w-4
                                      text-gray-500
                                    "
                                  />

                                  <Typography
                                    className="
                                      text-sm
                                      text-gray-700
                                    "
                                  >
                                    {
                                      item.phone
                                    }
                                  </Typography>

                                </div>

                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-2
                                  "
                                >

                                  <EnvelopeIcon
                                    className="
                                      h-4
                                      w-4
                                      text-gray-500
                                    "
                                  />

                                  <Typography
                                    className="
                                      text-sm
                                      text-gray-700
                                    "
                                  >
                                    {item.email ||
                                      "No Email"}
                                  </Typography>

                                </div>

                              </div>

                            </div>

                          </div>

                          {/* RIGHT */}

                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >

                            <Chip
                              value={
                                item.status ||
                                "NEW"
                              }
                              color="blue"
                              className="
                                rounded-full
                              "
                            />

                            <Button
                              size="sm"
                              className="
                                rounded-xl
                                flex
                                items-center
                                gap-2
                                bg-blue-700
                              "
                            >

                              <EyeIcon
                                className="
                                  h-4
                                  w-4
                                "
                              />

                              View

                            </Button>

                          </div>

                        </div>
                      )
                    )}

                </div>
              )}

            </CardBody>

          </Card>

          {/* ================================================= */}
          {/* PERFORMANCE */}
          {/* ================================================= */}

          <Card
            className="
              rounded-3xl
              shadow-xl
            "
          >

            <CardBody>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-8
                "
              >

                <ArrowTrendingUpIcon
                  className="
                    h-8
                    w-8
                    text-green-600
                  "
                />

                <Typography
                  variant="h4"
                  className="
                    font-black
                  "
                >
                  Monthly Performance
                </Typography>

              </div>

              <div className="space-y-7">

                <div>

                  <div
                    className="
                      flex
                      justify-between
                      mb-2
                    "
                  >

                    <Typography>
                      Inquiry Response Rate
                    </Typography>

                    <Typography
                      className="
                        font-bold
                      "
                    >
                      88%
                    </Typography>

                  </div>

                  <Progress
                    value={88}
                  />

                </div>

                <div>

                  <div
                    className="
                      flex
                      justify-between
                      mb-2
                    "
                  >

                    <Typography>
                      Parent Satisfaction
                    </Typography>

                    <Typography
                      className="
                        font-bold
                      "
                    >
                      92%
                    </Typography>

                  </div>

                  <Progress
                    value={92}
                  />

                </div>

                <div>

                  <div
                    className="
                      flex
                      justify-between
                      mb-2
                    "
                  >

                    <Typography>
                      Admission Conversion
                    </Typography>

                    <Typography
                      className="
                        font-bold
                      "
                    >
                      76%
                    </Typography>

                  </div>

                  <Progress
                    value={76}
                  />

                </div>

              </div>

            </CardBody>

          </Card>

        </div>

        {/* ================================================= */}
        {/* RIGHT */}
        {/* ================================================= */}

        <div className="space-y-6">

          {/* ================================================= */}
          {/* TASKS */}
          {/* ================================================= */}

          <Card
            className="
              rounded-3xl
              shadow-xl
            "
          >

            <CardBody>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-6
                "
              >

                <ClipboardDocumentListIcon
                  className="
                    h-7
                    w-7
                    text-blue-700
                  "
                />

                <Typography
                  variant="h4"
                  className="
                    font-black
                  "
                >
                  Today's Tasks
                </Typography>

              </div>

              <div className="space-y-4">

                {todayTasks.map(
                  (
                    task,
                    index
                  ) => (

                    <div
                      key={index}
                      className="
                        flex
                        items-start
                        gap-3
                        p-4
                        rounded-2xl
                        bg-blue-50
                      "
                    >

                      <CheckCircleIcon
                        className="
                          h-6
                          w-6
                          text-blue-700
                          mt-0.5
                        "
                      />

                      <Typography
                        className="
                          text-sm
                          font-medium
                        "
                      >
                        {task}
                      </Typography>

                    </div>
                  )
                )}

              </div>

            </CardBody>

          </Card>

          {/* ================================================= */}
          {/* QUICK ACTIONS */}
          {/* ================================================= */}

          <Card
            className="
              rounded-3xl
              shadow-xl
            "
          >

            <CardBody>

              <Typography
                variant="h4"
                className="
                  font-black
                  mb-6
                "
              >
                Quick Actions
              </Typography>

              <div
                className="
                  grid
                  grid-cols-2
                  gap-4
                "
              >

                <Button
                  onClick={() => navigate("/dashboard/receptionist/addinquiry")}
                  className=" rounded-xl bg-blue-700" >
                    Add New Inquiry
                </Button>

                <Button
                  className="
                    rounded-2xl
                    py-4
                    bg-green-600
                  "
                >
                  Call Parent
                </Button>

                <Button
                  className="
                    rounded-2xl
                    py-4
                    bg-orange-500
                  "
                >
                  Admission
                </Button>

                <Button
                  className="
                    rounded-2xl
                    py-4
                    bg-purple-600
                  "
                >
                  Reports
                </Button>

              </div>

            </CardBody>

          </Card>

          {/* ================================================= */}
          {/* NOTICE */}
          {/* ================================================= */}

          <Card
            className="
              rounded-3xl
              shadow-xl
              bg-gradient-to-r
              from-indigo-600
              to-blue-700
              text-white
            "
          >

            <CardBody>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-4
                "
              >

                <BellAlertIcon
                  className="
                    h-8
                    w-8
                  "
                />

                <Typography
                  variant="h4"
                  className="
                    font-black
                  "
                >
                  Important Notice
                </Typography>

              </div>

              <Typography
                className="
                  text-blue-100
                  leading-relaxed
                "
              >
                Parent-teacher meeting
                scheduled tomorrow.
                Ensure inquiry records
                and visitor passes are
                updated properly.
              </Typography>

              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                "
              >

                <ClockIcon
                  className="
                    h-5
                    w-5
                  "
                />

                <Typography
                  className="
                    text-sm
                  "
                >
                  Updated recently
                </Typography>

              </div>

            </CardBody>

          </Card>

        </div>

      </div>

    </div>
  );
}

export default Home;