import React, { useState } from "react";
import axios from "axios";

import {
  Card,
  CardBody,
  Typography,
  Input,
  Textarea,
  Button,
  Spinner,
} from "@material-tailwind/react";

import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";

const BASE_URL = "http://localhost:8080/api";

function AddInquiry() {
  // ===================== STATE =====================
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    studentName: "",
    parentName: "",
    phone: "",
    email: "",
    message: "",
  });

  const receptionistData = JSON.parse(
    localStorage.getItem("receptionistData")
  );

  const school = receptionistData?.school;

  // ===================== CHANGE =====================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ===================== SUBMIT =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        schoolCode: school?.schoolCode,
        schoolName: school?.schoolName,
        status: "PENDING",
      };

      await axios.post(`${BASE_URL}/inquiries`, payload);

      alert("Inquiry Created Successfully!");

      setForm({
        studentName: "",
        parentName: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error("Create Inquiry Error:", err);
      alert("Failed to create inquiry");
    } finally {
      setLoading(false);
    }
  };

  // ===================== UI =====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 md:p-8">

      {/* HEADER */}
      <div className="mb-6">
        <Typography variant="h3" className="font-black text-blue-800">
          Add New Inquiry
        </Typography>

        <Typography className="text-gray-600 mt-1">
          Create admission inquiry for parents & students
        </Typography>
      </div>

      {/* CARD */}
      <Card className="max-w-3xl mx-auto shadow-2xl rounded-3xl">
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* STUDENT NAME */}
            <div>
              <Typography className="mb-1 font-semibold">
                Student Name
              </Typography>

              <Input
                name="studentName"
                value={form.studentName}
                onChange={handleChange}
                icon={<AcademicCapIcon className="h-5 w-5" />}
                placeholder="Enter student name"
                required
              />
            </div>

            {/* PARENT NAME */}
            <div>
              <Typography className="mb-1 font-semibold">
                Parent Name
              </Typography>

              <Input
                name="parentName"
                value={form.parentName}
                onChange={handleChange}
                icon={<UserIcon className="h-5 w-5" />}
                placeholder="Enter parent name"
                required
              />
            </div>

            {/* PHONE */}
            <div>
              <Typography className="mb-1 font-semibold">
                Phone Number
              </Typography>

              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                icon={<PhoneIcon className="h-5 w-5" />}
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <Typography className="mb-1 font-semibold">
                Email (Optional)
              </Typography>

              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                icon={<EnvelopeIcon className="h-5 w-5" />}
                placeholder="Enter email"
              />
            </div>

            {/* MESSAGE */}
            <div>
              <Typography className="mb-1 font-semibold">
                Inquiry Message
              </Typography>

              <Textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
                placeholder="Write inquiry details..."
                rows={5}
              />
            </div>

            {/* SCHOOL INFO (READONLY) */}
            <div className="p-4 bg-blue-50 rounded-xl border">
              <Typography className="text-sm text-gray-600">
                School
              </Typography>

              <Typography className="font-bold text-blue-700">
                {school?.schoolName}
              </Typography>
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Creating...
                </>
              ) : (
                "Create Inquiry"
              )}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddInquiry;