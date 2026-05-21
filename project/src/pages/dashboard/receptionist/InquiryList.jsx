import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardBody,
  Typography,
  Chip,
  Button,
  Input,
  Spinner,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Avatar,
} from "@material-tailwind/react";

import {
  PhoneIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  UserCircleIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BellAlertIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

// ======================================================
// BASE URL
// ======================================================

const BASE_URL = "http://localhost:8080/api";

// ======================================================
// INQUIRY LIST
// ======================================================

function InquiryList() {
  const navigate = useNavigate();

  // ======================================================
  // LOCAL STORAGE
  // ======================================================

  const receptionistData = JSON.parse(
    localStorage.getItem("receptionistData") || "{}"
  );

  const schoolCode =
    receptionistData?.school?.schoolCode;

  const schoolName =
    receptionistData?.school?.schoolName;

  // ======================================================
  // STATES
  // ======================================================

  const [inquiries, setInquiries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");

  const [selectedInquiry, setSelectedInquiry] =
    useState(null);

  // ======================================================
  // FETCH INQUIRIES
  // ======================================================

  const fetchInquiries = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${BASE_URL}/inquiries/school/${schoolCode}`
      );

      setInquiries(response.data || []);
    } catch (err) {
      console.log(
        "Inquiry Fetch Error:",
        err.response?.data || err.message
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
  // ACTIONS
  // ======================================================

  const callParent = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const whatsapp = (phone) => {
    window.open(
      `https://wa.me/${phone}`,
      "_blank"
    );
  };

  const sendSMS = (phone) => {
    window.location.href = `sms:${phone}`;
  };

  // ======================================================
  // FILTERED DATA
  // ======================================================

  const filteredData = useMemo(() => {
    return inquiries
      .filter((item) => {
        if (filter === "ALL") return true;

        return (
          item.status === filter
        );
      })
      .filter((item) => {
        const value =
          search.toLowerCase();

        return (
          item.studentName
            ?.toLowerCase()
            .includes(value) ||
          item.parentName
            ?.toLowerCase()
            .includes(value) ||
          item.phone
            ?.includes(value) ||
          item.email
            ?.toLowerCase()
            .includes(value)
        );
      });
  }, [inquiries, filter, search]);

  // ======================================================
  // STATS
  // ======================================================

  const totalInquiries =
    inquiries.length;

  const admittedCount =
    inquiries.filter(
      (i) =>
        i.status === "ADMITTED"
    ).length;

  const followUpCount =
    inquiries.filter(
      (i) =>
        i.status === "FOLLOW_UP"
    ).length;

  const pendingCount =
    inquiries.filter(
      (i) =>
        i.status === "PENDING"
    ).length;

  const todayCount =
    inquiries.filter((i) => {
      const today =
        new Date().toDateString();

      return (
        new Date(
          i.createdAt
        ).toDateString() === today
      );
    }).length;

  // ======================================================
  // STATUS COLOR
  // ======================================================

  const getStatusColor = (status) => {
    switch (status) {
      case "ADMITTED":
        return "green";

      case "FOLLOW_UP":
        return "orange";

      case "PENDING":
        return "blue";

      default:
        return "blue";
    }
  };

  // ======================================================
  // STATS ARRAY
  // ======================================================

  const stats = [
    {
      title: "Total",
      value: totalInquiries,
      icon:
        ClipboardDocumentListIcon,
      color:
        "from-blue-500 to-cyan-500",
    },

    {
      title: "Today",
      value: todayCount,
      icon: UserGroupIcon,
      color:
        "from-indigo-500 to-purple-500",
    },

    {
      title: "Follow Ups",
      value: followUpCount,
      icon:
        CalendarDaysIcon,
      color:
        "from-orange-500 to-red-500",
    },

    {
      title: "Admitted",
      value: admittedCount,
      icon:
        CheckCircleIcon,
      color:
        "from-green-500 to-emerald-500",
    },
  ];

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        className="
          h-screen
          flex
          items-center
          justify-center
          bg-gradient-to-br
          from-blue-50
          to-indigo-50
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
        to-indigo-50
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
          text-white
          rounded-3xl
          p-6
          md:p-8
          shadow-2xl
          relative
          overflow-hidden
        "
      >

        {/* BG */}

        <div
          className="
            absolute
            -top-10
            -right-10
            h-48
            w-48
            rounded-full
            bg-white/10
          "
        />

        <div
          className="
            absolute
            -bottom-14
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
            xl:items-center
            xl:justify-between
            gap-6
          "
        >

          {/* LEFT */}

          <div>

            <Typography
              variant="h2"
              className="
                text-3xl
                md:text-5xl
                font-black
              "
            >
              Inquiry Management
            </Typography>

            <Typography
              className="
                mt-3
                text-blue-100
                max-w-2xl
              "
            >
              Manage admission inquiries,
              follow-ups, parent
              communication and
              student lead conversion.
            </Typography>

            <div
              className="
                mt-5
                flex
                items-center
                gap-3
              "
            >

              <AcademicCapIcon
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

          </div>

          {/* RIGHT */}

          <div
            className="
              bg-white/10
              backdrop-blur-md
              rounded-3xl
              p-5
              flex
              items-center
              gap-4
            "
          >

          </div>

        </div>

      </div>


      {/* ================================================= */}
      {/* SEARCH + FILTER */}
      {/* ================================================= */}

      <Card
        className="
          mt-8
          rounded-3xl
          shadow-lg
        "
      >

        <CardBody>

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-4
              gap-4
            "
          >

            {/* SEARCH */}

            <div className="relative lg:col-span-2">

              <Input
                label="Search inquiry"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

              <MagnifyingGlassIcon
                className="
                  h-5
                  w-5
                  absolute
                  right-3
                  top-3
                  text-gray-500
                "
              />

            </div>

            {/* FILTER */}

            <select
              className="
                w-full
                border
                border-gray-300
                rounded-xl
                p-3
                outline-none
              "
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
            >

              <option value="ALL">
                All Status
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="FOLLOW_UP">
                Follow Up
              </option>

              <option value="ADMITTED">
                Admitted
              </option>

            </select>

            {/* ACTIONS */}

            <div className="flex gap-3">

              <Button
                onClick={() =>
                  navigate(
                    "/dashboard/receptionist/addinquiry"
                  )
                }
                className="
                  bg-blue-700
                  rounded-xl
                  flex
                  items-center
                  gap-2
                "
              >

                <PlusIcon
                  className="
                    h-5
                    w-5
                  "
                />

                Add

              </Button>

              <Button
                onClick={
                  fetchInquiries
                }
                className="
                  bg-gray-900
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

        </CardBody>

      </Card>

      {/* ================================================= */}
      {/* LIST */}
      {/* ================================================= */}

      <div className="mt-8 space-y-5">

        {filteredData.length === 0 ? (

          <Card
            className="
              rounded-3xl
              shadow-lg
            "
          >

            <CardBody
              className="
                py-16
                text-center
              "
            >

              <AcademicCapIcon
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
                "
              >
                No Inquiry Found
              </Typography>

            </CardBody>

          </Card>

        ) : (

          filteredData.map(
            (item, index) => (

              <Card
                key={index}
                className="
                  rounded-3xl
                  shadow-md
                  hover:shadow-2xl
                  transition-all
                  border
                  border-gray-100
                "
              >

                <CardBody>

                  <div
                    className="
                      flex
                      flex-col
                      xl:flex-row
                      xl:items-center
                      xl:justify-between
                      gap-6
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
                          variant="h5"
                          className="
                            font-bold
                          "
                        >
                          {item.studentName}
                        </Typography>

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            mt-2
                          "
                        >

                          <UserCircleIcon
                            className="
                              h-5
                              w-5
                              text-gray-500
                            "
                          />

                          <Typography
                            className="
                              text-gray-700
                            "
                          >
                            Parent:
                            {" "}
                            {item.parentName}
                          </Typography>

                        </div>

                        <div
                          className="
                            mt-3
                            flex
                            flex-col
                            lg:flex-row
                            lg:flex-wrap
                            gap-3
                            text-sm
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-gray-700
                            "
                          >

                            <PhoneIcon
                              className="
                                h-4
                                w-4
                              "
                            />

                            {item.phone}

                          </div>

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-gray-700
                            "
                          >

                            <EnvelopeIcon
                              className="
                                h-4
                                w-4
                              "
                            />

                            {item.email ||
                              "No Email"}

                          </div>

                          <div
                            className="
                              flex
                              items-center
                              gap-2
                              text-gray-700
                            "
                          >

                            <CalendarDaysIcon
                              className="
                                h-4
                                w-4
                              "
                            />

                            {item.createdAt
                              ? new Date(
                                  item.createdAt
                                ).toLocaleDateString()
                              : "No Date"}

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* RIGHT */}

                    <div
                      className="
                        flex
                        flex-col
                        gap-4
                      "
                    >

                      <div
                        className="
                          flex
                          justify-start
                          xl:justify-end
                        "
                      >

                        <Chip
                          value={
                            item.status ||
                            "PENDING"
                          }
                          color={getStatusColor(
                            item.status
                          )}
                          className="
                            rounded-full
                          "
                        />

                      </div>

                      {/* BUTTONS */}

                      <div
                        className="
                          flex
                          flex-wrap
                          gap-2
                        "
                      >

                        <Button
                          size="sm"
                          className="
                            bg-green-600
                            rounded-xl
                          "
                          onClick={() =>
                            callParent(
                              item.phone
                            )
                          }
                        >
                          Call
                        </Button>

                        <Button
                          size="sm"
                          className="
                            bg-blue-600
                            rounded-xl
                          "
                          onClick={() =>
                            whatsapp(
                              item.phone
                            )
                          }
                        >
                          WhatsApp
                        </Button>

                        <Button
                          size="sm"
                          className="
                            bg-purple-600
                            rounded-xl
                          "
                          onClick={() =>
                            sendSMS(
                              item.phone
                            )
                          }
                        >
                          SMS
                        </Button>

                        <Button
  size="sm"
  className="
    bg-gray-900
    rounded-xl
    flex
    items-center
    gap-2
  "
  onClick={() =>
    navigate(
      `/dashboard/receptionist/inquiryDetails/${item.id || item._id}`
    )
  }
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

                  </div>

                </CardBody>

              </Card>
            )
          )
        )}

      </div>

      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      <Dialog
        open={!!selectedInquiry}
        handler={() =>
          setSelectedInquiry(null)
        }
        size="md"
      >

        <DialogHeader>
          Inquiry Details
        </DialogHeader>

        <DialogBody divider>

          {selectedInquiry && (

            <div className="space-y-5">

              <div
                className="
                  flex
                  items-center
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
                    variant="h5"
                    className="
                      font-bold
                    "
                  >
                    {
                      selectedInquiry.studentName
                    }
                  </Typography>

                  <Typography
                    className="
                      text-gray-600
                    "
                  >
                    Parent:
                    {" "}
                    {
                      selectedInquiry.parentName
                    }
                  </Typography>

                </div>

              </div>

              <div className="space-y-4">

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <PhoneIcon
                    className="
                      h-5
                      w-5
                      text-gray-600
                    "
                  />

                  <Typography>
                    {
                      selectedInquiry.phone
                    }
                  </Typography>

                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <EnvelopeIcon
                    className="
                      h-5
                      w-5
                      text-gray-600
                    "
                  />

                  <Typography>
                    {selectedInquiry.email ||
                      "No Email"}
                  </Typography>

                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <ClockIcon
                    className="
                      h-5
                      w-5
                      text-gray-600
                    "
                  />

                  <Typography>
                    {selectedInquiry.createdAt
                      ? new Date(
                          selectedInquiry.createdAt
                        ).toLocaleString()
                      : "No Date"}
                  </Typography>

                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <CheckCircleIcon
                    className="
                      h-5
                      w-5
                      text-gray-600
                    "
                  />

                  <Chip
                    value={
                      selectedInquiry.status ||
                      "PENDING"
                    }
                    color={getStatusColor(
                      selectedInquiry.status
                    )}
                  />

                </div>

              </div>

            </div>
          )}

        </DialogBody>

        <DialogFooter>

          <Button
            variant="text"
            color="red"
            onClick={() =>
              setSelectedInquiry(null)
            }
          >
            Close
          </Button>

        </DialogFooter>

      </Dialog>

    </div>
  );
}

export default InquiryList;