import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Chip,
  Select,
  Option,
} from "@material-tailwind/react";

import {
  CalendarDaysIcon,
  ClockIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

const BASE_URL = "http://localhost:8080/api";

function FollowUps({ inquiryId }) {

  // =========================
  // STATES
  // =========================

  const [loading, setLoading] = useState(false);

  const [followUps, setFollowUps] = useState([]);

  const [form, setForm] = useState({
    remark: "",
    nextFollowUpDate: "",
    status: "CALLED",
    updatedBy: "Admin",
  });

  // =========================
  // LOAD FOLLOWUPS
  // =========================

  useEffect(() => {
    if (inquiryId) {
      fetchFollowUps();
    }
  }, [inquiryId]);

  // =========================
  // FETCH FOLLOWUPS
  // =========================

  const fetchFollowUps = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/followups/inquiry/${inquiryId}`
      );

      setFollowUps(res.data || []);

    } catch (err) {
      console.error("Failed to load followups", err);
      setFollowUps([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADD FOLLOWUP
  // =========================

  const addFollowUp = async () => {

    if (!form.remark || !form.nextFollowUpDate) {
      alert("Please fill required fields");
      return;
    }

    try {

      const payload = {
        inquiryId: inquiryId,
        remark: form.remark,
        nextFollowUpDate: form.nextFollowUpDate,
        status: form.status,
        updatedBy: form.updatedBy,
      };

      await axios.post(
        `${BASE_URL}/followups`,
        payload
      );

      // RESET
      setForm({
        remark: "",
        nextFollowUpDate: "",
        status: "CALLED",
        updatedBy: "Admin",
      });

      // RELOAD
      fetchFollowUps();

    } catch (err) {
      console.error(err);
      alert("Failed to add follow-up");
    }
  };

  // =========================
  // STATUS COLOR
  // =========================

  const getStatusColor = (status) => {

    switch (status) {

      case "INTERESTED":
        return "green";

      case "NOT_INTERESTED":
        return "red";

      case "VISIT_SCHEDULED":
        return "blue";

      case "NOT_PICKED":
        return "orange";

      default:
        return "blue";
    }
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">

      {/* ========================= */}
      {/* ADD FOLLOWUP */}
      {/* ========================= */}

      <Card className="rounded-3xl shadow-lg">
        <CardBody>

          <Typography
            variant="h5"
            className="font-bold mb-5"
          >
            Add Follow-Up
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* REMARK */}

            <Input
              label="Remark"
              value={form.remark}
              onChange={(e) =>
                setForm({
                  ...form,
                  remark: e.target.value,
                })
              }
            />

            {/* DATE */}

            <Input
              type="date"
              label="Next Follow-Up Date"
              value={form.nextFollowUpDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  nextFollowUpDate: e.target.value,
                })
              }
            />

            {/* STATUS */}

            <Select
              label="Status"
              value={form.status}
              onChange={(val) =>
                setForm({
                  ...form,
                  status: val,
                })
              }
            >
              <Option value="CALLED">
                CALLED
              </Option>

              <Option value="NOT_PICKED">
                NOT_PICKED
              </Option>

              <Option value="INTERESTED">
                INTERESTED
              </Option>

              <Option value="NOT_INTERESTED">
                NOT_INTERESTED
              </Option>

              <Option value="VISIT_SCHEDULED">
                VISIT_SCHEDULED
              </Option>

            </Select>

            {/* UPDATED BY */}

            <Input
              label="Updated By"
              value={form.updatedBy}
              onChange={(e) =>
                setForm({
                  ...form,
                  updatedBy: e.target.value,
                })
              }
            />

          </div>

          <Button
            onClick={addFollowUp}
            className="mt-5 bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Save Follow-Up
          </Button>

        </CardBody>
      </Card>

      {/* ========================= */}
      {/* FOLLOWUP HISTORY */}
      {/* ========================= */}

      <Card className="rounded-3xl shadow-lg">
        <CardBody>

          <Typography
            variant="h5"
            className="font-bold mb-6"
          >
            Follow-Up History
          </Typography>

          {/* LOADING */}

          {loading ? (
            <div className="text-center py-10">
              Loading...
            </div>
          ) : followUps.length === 0 ? (

            <div className="text-center py-10 text-gray-500">
              No follow-ups found
            </div>

          ) : (

            <div className="space-y-5">

              {followUps.map((item) => (

                <div
                  key={item.id}
                  className="flex gap-4 border-l-4 border-blue-200 pl-4"
                >

                  {/* ICON */}

                  <div className="mt-1">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <CalendarDaysIcon className="h-5 w-5 text-blue-700" />
                    </div>
                  </div>

                  {/* CONTENT */}

                  <div className="flex-1">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

                      <Typography className="font-bold">
                        {item.remark}
                      </Typography>

                      <Chip
                        value={item.status}
                        color={getStatusColor(item.status)}
                      />

                    </div>

                    <div className="text-sm text-gray-600 mt-2 space-y-2">

                      {/* NEXT DATE */}

                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="h-4 w-4" />

                        Next Follow-Up:
                        {" "}
                        {formatDate(item.nextFollowUpDate)}
                      </div>

                      {/* CREATED */}

                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" />

                        Created:
                        {" "}
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : "-"}
                      </div>

                      {/* UPDATED BY */}

                      <div className="font-medium text-gray-800">
                        Updated By:
                        {" "}
                        {item.updatedBy || "-"}
                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </CardBody>
      </Card>

    </div>
  );
}

export default FollowUps;