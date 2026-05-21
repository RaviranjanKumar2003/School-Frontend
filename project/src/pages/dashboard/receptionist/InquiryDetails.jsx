import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
  Spinner,
  Avatar,
  Textarea,
} from "@material-tailwind/react";

import {
  PhoneIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  UserCircleIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/solid";

// ======================================================
// BASE URL
// ======================================================

const BASE_URL =
  "http://localhost:8080/api";

// ======================================================
// COMPONENT
// ======================================================

function InquiryDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  // ======================================================
  // STATES
  // ======================================================

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [inquiry, setInquiry] =
    useState(null);

  const [note, setNote] =
    useState("");

  // ======================================================
  // FETCH
  // ======================================================

  const fetchInquiry = async () => {

    try {

      setLoading(true);

      setError("");

      const response =
        await axios.get(
          `${BASE_URL}/inquiries/${id}`
        );

      setInquiry(
        response.data
      );

    } catch (err) {

      console.log(err);

      setError(
        "Failed to load inquiry"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    if (id) {

      fetchInquiry();
    }

  }, [id]);

  // ======================================================
  // ACTIONS
  // ======================================================

  const callParent = () => {

    window.location.href =
      `tel:${inquiry?.phone}`;
  };

  const whatsappParent = () => {

    window.open(
      `https://wa.me/${inquiry?.phone}`,
      "_blank"
    );
  };

  const smsParent = () => {

    window.location.href =
      `sms:${inquiry?.phone}`;
  };

  // ======================================================
  // STATUS COLOR
  // ======================================================

  const getStatusColor = (
    status
  ) => {

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
          bg-blue-50
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
  // ERROR
  // ======================================================

  if (error) {

    return (

      <div
        className="
          min-h-screen
          flex
          flex-col
          items-center
          justify-center
          gap-4
        "
      >

        <Typography
          className="
            text-red-600
            font-bold
          "
        >
          {error}
        </Typography>

        <Button
          onClick={() =>
            navigate(-1)
          }
          className="bg-blue-700"
        >
          Go Back
        </Button>

      </div>
    );
  }

  // ======================================================
  // EMPTY
  // ======================================================

  if (!inquiry) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >

        <Typography>
          No Inquiry Found
        </Typography>

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
        md:p-8
      "
    >

      {/* ================================================= */}
      {/* BACK */}
      {/* ================================================= */}

      <Button
        onClick={() =>
          navigate(-1)
        }
        className="
          mb-5
          flex
          items-center
          gap-2
          bg-white
          text-blue-700
          shadow-md
        "
      >

        <ArrowLeftIcon
          className="
            h-4
            w-4
          "
        />

        Back

      </Button>

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <Card
        className="
          rounded-3xl
          shadow-2xl
          overflow-hidden
        "
      >

        <div
          className="
            bg-gradient-to-r
            from-blue-700
            via-indigo-700
            to-cyan-600
            p-8
            text-white
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-6
            "
          >

            {/* LEFT */}

            <div
              className="
                flex
                items-center
                gap-5
              "
            >

              <Avatar
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                size="xxl"
                className="
                  border-4
                  border-white
                "
              />

              <div>

                <Typography
                  variant="h3"
                  className="
                    font-black
                  "
                >
                  {
                    inquiry.studentName
                  }
                </Typography>

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-2
                  "
                >

                  <UserCircleIcon
                    className="
                      h-5
                      w-5
                    "
                  />

                  <Typography>
                    Parent:
                    {" "}
                    {
                      inquiry.parentName
                    }
                  </Typography>

                </div>

                <div className="mt-4">

                  <Chip
                    value={
                      inquiry.status ||
                      "PENDING"
                    }
                    color={getStatusColor(
                      inquiry.status
                    )}
                  />

                </div>

              </div>

            </div>

            {/* ACTIONS */}

            <div
              className="
                flex
                flex-wrap
                gap-3
              "
            >

              <Button
                onClick={
                  callParent
                }
                className="
                  bg-green-600
                  flex
                  items-center
                  gap-2
                "
              >

                <PhoneIcon
                  className="
                    h-4
                    w-4
                  "
                />

                Call

              </Button>

              <Button
                onClick={
                  whatsappParent
                }
                className="
                  bg-blue-600
                  flex
                  items-center
                  gap-2
                "
              >

                <ChatBubbleLeftRightIcon
                  className="
                    h-4
                    w-4
                  "
                />

                WhatsApp

              </Button>

              <Button
                onClick={
                  smsParent
                }
                className="
                  bg-purple-600
                "
              >
                SMS
              </Button>

            </div>

          </div>

        </div>

      </Card>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
          mt-6
        "
      >

        {/* ================================================= */}
        {/* LEFT */}
        {/* ================================================= */}

        <div
          className="
            lg:col-span-2
            space-y-6
          "
        >

          {/* DETAILS */}

          <Card
            className="
              rounded-3xl
              shadow-xl
            "
          >

            <CardBody>

              <Typography
                variant="h5"
                className="
                  font-black
                  mb-6
                "
              >
                Inquiry Information
              </Typography>

              <div className="space-y-5">

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <PhoneIcon
                    className="
                      h-5
                      w-5
                      text-blue-700
                    "
                  />

                  <Typography>
                    {inquiry.phone}
                  </Typography>

                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <EnvelopeIcon
                    className="
                      h-5
                      w-5
                      text-blue-700
                    "
                  />

                  <Typography>
                    {inquiry.email ||
                      "No Email"}
                  </Typography>

                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <AcademicCapIcon
                    className="
                      h-5
                      w-5
                      text-blue-700
                    "
                  />

                  <Typography>
                    {inquiry.className ||
                      "No Class"}
                  </Typography>

                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <CalendarDaysIcon
                    className="
                      h-5
                      w-5
                      text-blue-700
                    "
                  />

                  <Typography>

                    {inquiry.createdAt
                      ? new Date(
                          inquiry.createdAt
                        ).toLocaleString()
                      : "No Date"}

                  </Typography>

                </div>

              </div>

            </CardBody>

          </Card>

          {/* NOTES */}

          <Card
            className="
              rounded-3xl
              shadow-xl
            "
          >

            <CardBody>

              <Typography
                variant="h5"
                className="
                  font-black
                  mb-5
                "
              >
                Follow Up Notes
              </Typography>

              <Textarea
                label="Write follow-up note..."
                value={note}
                onChange={(e) =>
                  setNote(
                    e.target.value
                  )
                }
              />

              <Button
                className="
                  mt-4
                  bg-blue-700
                "
              >
                Save Note
              </Button>

            </CardBody>

          </Card>

        </div>

        {/* ================================================= */}
        {/* RIGHT */}
        {/* ================================================= */}

        <div className="space-y-6">

          {/* QUICK ACTIONS */}

          <Card
            className="
              rounded-3xl
              shadow-xl
            "
          >

            <CardBody>

              <Typography
                variant="h5"
                className="
                  font-black
                  mb-5
                "
              >
                Quick Actions
              </Typography>

              <div className="space-y-3">

                <Button
                  className="
                    w-full
                    bg-blue-700
                  "
                >
                  Follow Up
                </Button>

                <Button
                  className="
                    w-full
                    bg-green-600
                  "
                >
                  Mark Interested
                </Button>

                <Button
                  className="
                    w-full
                    bg-orange-600
                  "
                >
                  Start Admission
                </Button>

              </div>

            </CardBody>

          </Card>

          {/* STATUS */}

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
                  mb-4
                "
              >

                <CheckCircleIcon
                  className="
                    h-7
                    w-7
                    text-green-600
                  "
                />

                <Typography
                  variant="h5"
                  className="
                    font-black
                  "
                >
                  Current Status
                </Typography>

              </div>

              <Chip
                value={
                  inquiry.status ||
                  "PENDING"
                }
                color={getStatusColor(
                  inquiry.status
                )}
                className="
                  w-fit
                "
              />

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
                    text-gray-500
                  "
                />

                <Typography
                  className="
                    text-sm
                    text-gray-600
                  "
                >
                  Updated Recently
                </Typography>

              </div>

            </CardBody>

          </Card>

        </div>

      </div>

    </div>
  );
}

export default InquiryDetails;