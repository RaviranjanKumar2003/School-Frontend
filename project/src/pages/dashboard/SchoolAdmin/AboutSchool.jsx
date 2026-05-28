import React, { useEffect, useState } from "react";
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
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaGlobe,
  FaSchool,
  FaBullseye,
  FaEye,
  FaUserTie,
  FaUpload,
} from "react-icons/fa";

function AboutSchool() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const schoolId = localStorage.getItem("schoolId");

  const [formData, setFormData] = useState({
    logo: "",
    tagline: "",
    about: "",
    mission: "",
    vision: "",
    board: "",
    medium: "",
    schoolType: "",
    establishedYear: "",
    principalMessage: "",
    schoolAdminMessage: "",
    website: "",
    facebookLink: "",
    instagramLink: "",
    youtubeLink: "",
  });

  // =========================
  // HANDLE CHANGE
  // =========================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // LOGO UPLOAD
  // =========================
  const handleLogoUpload = async (e) => {

  const file = e.target.files[0];

  if (!file) return;

  try {

    const data = new FormData();

    data.append("file", file);

    const res = await axios.post(
      "http://localhost:8080/api/file/upload",
      data,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    setFormData({
      ...formData,

      logo:
        "http://localhost:8080/api/file/profiles/"
        + res.data.fileName,
    });

  } catch (error) {

    console.log(error);

    alert("Logo upload failed");
  }
};

  // =========================
  // GET ABOUT DATA
  // =========================
  const fetchAboutSchool = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8080/api/about-school/${schoolId}`
      );

      if (res.data) {
        setFormData({
          logo: res.data.logo || "",
          tagline: res.data.tagline || "",
          about: res.data.about || "",
          mission: res.data.mission || "",
          vision: res.data.vision || "",
          board: res.data.board || "",
          medium: res.data.medium || "",
          schoolType: res.data.schoolType || "",
          establishedYear: res.data.establishedYear || "",
          principalMessage: res.data.principalMessage || "",
          schoolAdminMessage: res.data.schoolAdminMessage || "",
          website: res.data.website || "",
          facebookLink: res.data.facebookLink || "",
          instagramLink: res.data.instagramLink || "",
          youtubeLink: res.data.youtubeLink || "",
        });
      }
    } catch (error) {
      console.log("No About School Found Yet");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SAVE
  // =========================
  const handleSubmit = async () => {
    try {
      setSaving(true);

      await axios.post(
        `http://localhost:8080/api/about-school/${schoolId}`,
        formData
      );

      alert("About School Saved Successfully");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchAboutSchool();
  }, []);

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-100 p-3 md:p-6">
      {/* HEADER */}
      <div className="mb-6">
        <Typography
          variant="h3"
          className="font-bold text-gray-900 text-2xl md:text-4xl"
        >
          About School
        </Typography>

        <Typography className="text-gray-600 mt-2 text-sm md:text-base">
          Manage school branding, mission, vision, leadership messages and
          social media details.
        </Typography>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[500px]">
          <Spinner className="h-12 w-12" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="xl:col-span-2 space-y-6">
            {/* BASIC INFO */}
            <Card className="rounded-3xl shadow-md border border-gray-200">
              <CardBody>
                <div className="flex items-center gap-3 mb-6">
                  <FaSchool className="text-blue-600 text-2xl" />

                  <Typography
                    variant="h5"
                    className="font-bold text-gray-800"
                  >
                    Basic Information
                  </Typography>
                </div>

                {/* LOGO UPLOAD */}
                <div className="mb-8">
                  <Typography className="font-semibold text-gray-700 mb-3">
                    School Logo
                  </Typography>

                  <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="h-28 w-28 rounded-2xl overflow-hidden border bg-gray-100 shadow">
                      <img
                        src={
                          formData.logo ||
                          "https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
                        }
                        alt="school-logo"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleLogoUpload}
                      />

                      <div className="bg-blue-600 hover:bg-blue-700 transition-all text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-md">
                        <FaUpload />

                        {uploading ? "Uploading..." : "Upload Logo"}
                      </div>
                    </label>
                  </div>
                </div>

                {/* FORM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="School Tagline"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                  />

                  <Input
                    label="Board"
                    name="board"
                    value={formData.board}
                    onChange={handleChange}
                  />

                  <Input
                    label="Medium"
                    name="medium"
                    value={formData.medium}
                    onChange={handleChange}
                  />

                  <Input
                    label="School Type"
                    name="schoolType"
                    value={formData.schoolType}
                    onChange={handleChange}
                  />

                  <Input
                    label="Established Year"
                    name="establishedYear"
                    value={formData.establishedYear}
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-6">
                  <Textarea
                    label="About School"
                    rows={7}
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                  />
                </div>
              </CardBody>
            </Card>

            {/* MISSION */}
            <Card className="rounded-3xl shadow-md border border-gray-200">
              <CardBody>
                <div className="flex items-center gap-3 mb-6">
                  <FaBullseye className="text-green-600 text-2xl" />

                  <Typography
                    variant="h5"
                    className="font-bold text-gray-800"
                  >
                    Mission & Vision
                  </Typography>
                </div>

                <div className="space-y-6">
                  <Textarea
                    label="Mission"
                    rows={6}
                    name="mission"
                    value={formData.mission}
                    onChange={handleChange}
                  />

                  <Textarea
                    label="Vision"
                    rows={6}
                    name="vision"
                    value={formData.vision}
                    onChange={handleChange}
                  />
                </div>
              </CardBody>
            </Card>

            {/* LEADERSHIP */}
            <Card className="rounded-3xl shadow-md border border-gray-200">
              <CardBody>
                <div className="flex items-center gap-3 mb-6">
                  <FaUserTie className="text-purple-600 text-2xl" />

                  <Typography
                    variant="h5"
                    className="font-bold text-gray-800"
                  >
                    Leadership Messages
                  </Typography>
                </div>

                <div className="space-y-6">
                  <Textarea
                    label="Principal Message"
                    rows={6}
                    name="principalMessage"
                    value={formData.principalMessage}
                    onChange={handleChange}
                  />

                  <Textarea
                    label="School Admin Message"
                    rows={6}
                    name="schoolAdminMessage"
                    value={formData.schoolAdminMessage}
                    onChange={handleChange}
                  />
                </div>
              </CardBody>
            </Card>

            {/* SAVE BUTTON */}
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-blue-600 rounded-xl px-8 py-3"
              >
                {saving ? "Saving..." : "Save About School"}
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* PREVIEW */}
            <Card className="rounded-3xl shadow-md border border-gray-200 overflow-hidden">
              <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-700" />

              <CardBody className="relative">
                <div className="flex justify-center -mt-20">
                  <img
                    src={
                      formData.logo ||
                      "https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
                    }
                    alt="logo"
                    className="h-32 w-32 rounded-full border-4 border-white bg-white object-cover shadow-xl"
                  />
                </div>

                <div className="text-center mt-4">
                  <Typography
                    variant="h5"
                    className="font-bold text-gray-900"
                  >
                    School Preview
                  </Typography>

                  <Typography className="text-gray-600 mt-2 text-sm">
                    {formData.tagline || "Your School Tagline"}
                  </Typography>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Board</span>

                    <span className="text-gray-600">
                      {formData.board || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Medium</span>

                    <span className="text-gray-600">
                      {formData.medium || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">Type</span>

                    <span className="text-gray-600">
                      {formData.schoolType || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      Established
                    </span>

                    <span className="text-gray-600">
                      {formData.establishedYear || "-"}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* SOCIAL MEDIA */}
            <Card className="rounded-3xl shadow-md border border-gray-200">
              <CardBody>
                <div className="flex items-center gap-3 mb-6">
                  <FaGlobe className="text-pink-600 text-2xl" />

                  <Typography
                    variant="h5"
                    className="font-bold text-gray-800"
                  >
                    Social Media
                  </Typography>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <FaGlobe className="text-gray-700 text-xl" />

                    <Input
                      label="Website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <FaFacebookF className="text-blue-600 text-xl" />

                    <Input
                      label="Facebook Link"
                      name="facebookLink"
                      value={formData.facebookLink}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <FaInstagram className="text-pink-500 text-xl" />

                    <Input
                      label="Instagram Link"
                      name="instagramLink"
                      value={formData.instagramLink}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <FaYoutube className="text-red-600 text-xl" />

                    <Input
                      label="Youtube Link"
                      name="youtubeLink"
                      value={formData.youtubeLink}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* QUICK NOTES */}
            <Card className="rounded-3xl shadow-md border border-gray-200">
              <CardBody>
                <div className="flex items-center gap-3 mb-4">
                  <FaEye className="text-indigo-600 text-xl" />

                  <Typography
                    variant="h6"
                    className="font-bold text-gray-800"
                  >
                    Quick Notes
                  </Typography>
                </div>

                <ul className="space-y-3 text-sm text-gray-700">
                  <li>• Upload high quality school logo.</li>
                  <li>• Keep mission & vision concise.</li>
                  <li>• Add active social media links.</li>
                  <li>• Leadership messages improve trust.</li>
                  <li>• Keep information updated regularly.</li>
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default AboutSchool;