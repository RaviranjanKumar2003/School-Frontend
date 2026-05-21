import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Chip,
  Spinner,
  Textarea,
} from "@material-tailwind/react";

import {
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

const BASE_URL = "http://localhost:8080/api";

function CallLogs({ inquiryId }) {

  // =====================================
  // STATES
  // =====================================

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("CONNECTED");
  const [duration, setDuration] = useState("");

  const [saving, setSaving] = useState(false);

  // =====================================
  // FETCH LOGS
  // =====================================

  const fetchLogs = async () => {
    try {

      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/calllogs/inquiry/${inquiryId}`
      );

      setLogs(res.data || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    if (inquiryId) {
      fetchLogs();
    }

  }, [inquiryId]);

  // =====================================
  // ADD LOG
  // =====================================

  const addLog = async () => {

    if (!notes.trim()) {
      alert("Please enter notes");
      return;
    }

    try {

      setSaving(true);

      const payload = {
        inquiryId,
        type: "CALL",
        status,
        duration,
        notes,
      };

      const res = await axios.post(
        `${BASE_URL}/calllogs`,
        payload
      );

      setLogs([res.data, ...logs]);

      setNotes("");
      setDuration("");
      setStatus("CONNECTED");

    } catch (err) {
      console.error(err);
      alert("Failed to save call log");
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // STATUS COLOR
  // =====================================

  const getStatusColor = (status) => {

    switch (status) {

      case "CONNECTED":
        return "green";

      case "NO_ANSWER":
        return "red";

      case "BUSY":
        return "orange";

      default:
        return "blue";
    }
  };

  // =====================================
  // STATUS ICON
  // =====================================

  const getStatusIcon = (status) => {

    switch (status) {

      case "CONNECTED":
        return <CheckCircleIcon className="h-4 w-4" />;

      case "NO_ANSWER":
        return <XCircleIcon className="h-4 w-4" />;

      case "BUSY":
        return <ExclamationTriangleIcon className="h-4 w-4" />;

      default:
        return <PhoneIcon className="h-4 w-4" />;
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="space-y-6">

      {/* ================================= */}
      {/* ADD CALL LOG */}
      {/* ================================= */}

      <Card className="rounded-3xl shadow-xl border border-blue-100">
        <CardBody>

          <Typography
            variant="h5"
            className="font-bold mb-5 text-blue-900"
          >
            Add Call Log
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* STATUS */}

            <div>
              <Typography className="mb-2 text-sm font-semibold">
                Call Status
              </Typography>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded-xl p-3 outline-none focus:border-blue-700"
              >
                <option value="CONNECTED">
                  Connected
                </option>

                <option value="NO_ANSWER">
                  No Answer
                </option>

                <option value="BUSY">
                  Busy
                </option>
              </select>
            </div>

            {/* DURATION */}

            <div>
              <Typography className="mb-2 text-sm font-semibold">
                Duration
              </Typography>

              <Input
                label="e.g. 3m 20s"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>

          </div>

          {/* NOTES */}

          <div className="mt-5">

            <Typography className="mb-2 text-sm font-semibold">
              Notes
            </Typography>

            <Textarea
              label="Parent interested in admission..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

          </div>

          {/* BUTTON */}

          <div className="mt-5">

            <Button
              onClick={addLog}
              disabled={saving}
              className="bg-blue-700 flex items-center gap-2"
            >
              <PhoneIcon className="h-4 w-4" />

              {saving ? "Saving..." : "Save Call Log"}
            </Button>

          </div>

        </CardBody>
      </Card>

      {/* ================================= */}
      {/* CALL HISTORY */}
      {/* ================================= */}

      <Card className="rounded-3xl shadow-xl border border-blue-100">
        <CardBody>

          <div className="flex items-center justify-between mb-6">

            <Typography
              variant="h5"
              className="font-bold text-blue-900"
            >
              Call History
            </Typography>

            <Chip
              value={`${logs.length} Logs`}
              color="blue"
            />

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="flex justify-center py-10">
              <Spinner className="h-10 w-10" />
            </div>

          ) : logs.length === 0 ? (

            <div className="text-center py-10 text-gray-500">
              No call logs found
            </div>

          ) : (

            <div className="space-y-6">

              {logs.map((log, index) => (

                <div
                  key={log.id}
                  className="flex gap-4 border-l-4 border-blue-200 pl-4"
                >

                  {/* ICON */}

                  <div className="mt-1">

                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">

                      <PhoneIcon className="h-5 w-5 text-blue-700" />

                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="flex-1">

                    {/* TOP */}

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                      <Typography className="font-bold text-lg">
                        Call #{logs.length - index}
                      </Typography>

                      <Chip
                        value={log.status}
                        color={getStatusColor(log.status)}
                        icon={getStatusIcon(log.status)}
                      />

                    </div>

                    {/* TIME */}

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">

                      <ClockIcon className="h-4 w-4" />

                      {
                        log.createdAt
                          ? new Date(log.createdAt).toLocaleString()
                          : log.time
                      }

                    </div>

                    {/* DURATION */}

                    <div className="mt-2 text-sm font-medium text-gray-700">

                      Duration:
                      {" "}
                      {log.duration || "0m"}

                    </div>

                    {/* NOTES */}

                    <div className="mt-3 bg-blue-50 rounded-2xl p-4 text-gray-800">

                      {log.notes || "No notes"}

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

export default CallLogs;