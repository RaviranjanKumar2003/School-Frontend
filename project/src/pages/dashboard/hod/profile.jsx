import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
} from "@material-tailwind/react";

import {
  PencilIcon,
  CameraIcon,
} from "@heroicons/react/24/solid";

import { useEffect, useState } from "react";
import axios from "axios";
import { ProfileInfoCard } from "@/widgets/cards";

export function Profile() {

  // ================= STATES =================
  const [hod, setHod] = useState(null);

  const [open, setOpen] = useState(false);

  const [hover, setHover] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    schoolName: "",
    username: "",
    password: "",
    email: "",
    phone: "",
  });

  const [image, setImage] = useState(null);

  const [coverImages, setCoverImages] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [newImages, setNewImages] = useState([]);

  const storedHod = JSON.parse(
    localStorage.getItem("hodData")
  );

  const hodId = storedHod?.id;

  // ================= FETCH HOD =================
  const fetchHod = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `http://localhost:8080/api/hods/${hodId}`
      );

      console.log("HOD DATA =", res.data);

      setHod(res.data);

      setFormData({
        name: res.data.name || "",
        department: res.data.department || "",
        schoolName:
          res.data.school?.schoolName || "",
        username: res.data.username || "",
        password: res.data.password || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
      });

      setCoverImages(
        Array.isArray(res.data.coverImages)
          ? res.data.coverImages
          : []
      );

      setCurrentIndex(0);

    } catch (err) {

      console.error(
        "Fetch HOD error:",
        err.response?.data || err.message
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    if (hodId) {
      fetchHod();
    }

  }, [hodId]);

  // ================= AUTO SLIDER =================
  useEffect(() => {

    if (coverImages.length <= 1) return;

    const interval = setInterval(() => {

      setCurrentIndex((prev) =>
        prev === coverImages.length - 1
          ? 0
          : prev + 1
      );

    }, 3000);

    return () => clearInterval(interval);

  }, [coverImages]);

  // ================= LOADING =================
  if (loading || !hod) {

    return (
      <div className="text-center mt-10">
        Loading...
      </div>
    );
  }

  // ================= PROFILE IMAGE URL =================
  const imageUrl =
  `http://localhost:8080/api/hods/image/get/${hodId}`;

  // ================= COVER URL =================
  const coverUrl = (fileName) =>
    `http://localhost:8080/api/hods/cover/get-file/${hodId}/${fileName}`;

  // ================= CURRENT COVER =================
  const currentCover =
    coverImages.length > 0
      ? coverUrl(coverImages[currentIndex])
      : "/default-cover.jpg";

  // ================= UPDATE PROFILE =================
  const handleUpdate = async () => {

    try {

      const data = new FormData();

      data.append(
        "data",
        new Blob(
          [
            JSON.stringify({
              ...formData,
            }),
          ],
          {
            type: "application/json",
          }
        )
      );

      if (image) {
        data.append("file", image);
      }

      await axios.put(
        `http://localhost:8080/api/hods/update-hod/${hodId}`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setOpen(false);

      fetchHod();

    } catch (err) {

      console.error(
        "Update error:",
        err.response?.data || err.message
      );
    }
  };

  // ================= COVER IMAGE UPLOAD =================
  const handleCoverUpload = async () => {

    if (newImages.length === 0) return;

    try {

      const data = new FormData();

      newImages.forEach((file) => {
        data.append("images", file);
      });

      await axios.post(
        `http://localhost:8080/api/hods/cover/upload-multiple/${hodId}`,
        data,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setNewImages([]);

      fetchHod();

    } catch (err) {

      console.error(
        "Cover upload error:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <>

      {/* ================= COVER IMAGE ================= */}
      <div
        className="relative mt-8 h-72 w-full rounded-2xl overflow-hidden group shadow-xl"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >

        {/* COVER IMAGE */}
        <img
  src={currentCover}
  alt="cover"
  className="w-full h-full object-cover transition-all duration-700"
  onError={(e) => {

    e.target.onerror = null;

    e.target.src =
      "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1200";
  }}
/>

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/40" />

        {/* CONTROLS */}
        {hover && (

          <div className="absolute right-5 top-5 flex gap-3">

            <label className="cursor-pointer bg-white p-3 rounded-full shadow-lg hover:scale-105 transition">

              <CameraIcon className="h-6 w-6 text-gray-700" />

              <input
                type="file"
                multiple
                hidden
                onChange={(e) =>
                  setNewImages(
                    Array.from(e.target.files)
                  )
                }
              />

            </label>

            {newImages.length > 0 && (

              <Button
                size="sm"
                color="green"
                onClick={handleCoverUpload}
              >
                Upload ({newImages.length})
              </Button>

            )}

          </div>

        )}

        {/* DOTS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">

          {coverImages.map((_, i) => (

            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex
                  ? "bg-white scale-110"
                  : "bg-gray-400"
              }`}
            />

          ))}

        </div>

      </div>

      {/* ================= PROFILE CARD ================= */}
      <Card className="mx-3 -mt-16 mb-6 rounded-3xl shadow-2xl border border-gray-100">

        <CardBody>

          {/* TOP */}
          <div className="flex flex-col md:flex-row items-center gap-6">

            <Avatar
  src={imageUrl}
  size="xxl"
  className="border-4 border-white shadow-xl"
  alt="profile"
  onError={(e) => {

    e.target.onerror = null;

    e.target.src =
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  }}
/>

            <div className="text-center md:text-left">

              {/* SCHOOL NAME */}
              <Typography
                variant="small"
                className="mt-2 text-blue-600 font-semibold"
              >
                {hod.school?.schoolName}
              </Typography>

              <Typography
                variant="h3"
                color="blue-gray"
              >
                {hod.name}
              </Typography>

              <Typography
                variant="h6"
                className="text-blue-gray-500 mt-1"
              >
                {hod.department}
              </Typography>

            </div>

          </div>

          {/* DETAILS */}
          <div className="mt-10">

            <ProfileInfoCard
              title="HOD Details"
              details={{
                School:
                  hod.school?.schoolName,
                Department:
                  hod.department,
                Email: hod.email,
                Phone: hod.phone,
                Username: hod.username,
              }}
              action={

                <Tooltip content="Edit Profile">

                  <PencilIcon
                    className="h-5 w-5 cursor-pointer text-blue-gray-700 hover:text-blue-600"
                    onClick={() => setOpen(true)}
                  />

                </Tooltip>

              }
            />

          </div>

        </CardBody>

      </Card>

      {/* ================= EDIT MODAL ================= */}
      <Dialog
        open={open}
        handler={setOpen}
        size="md"
      >

        <DialogHeader className="text-2xl">
          Edit Profile
        </DialogHeader>

        <DialogBody className="space-y-5">

          {/* NAME */}
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
          />

          {/* DEPARTMENT */}
          <Input
            label="Department"
            value={formData.department}
            onChange={(e) =>
              setFormData({
                ...formData,
                department: e.target.value,
              })
            }
          />

          {/* SCHOOL */}
          <Input
            label="School Name"
            value={formData.schoolName}
            disabled
          />

          {/* USERNAME */}
          <Input
            label="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({
                ...formData,
                username: e.target.value,
              })
            }
          />

          {/* PASSWORD */}
          <Input
            type="password"
            label="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
          />

          {/* EMAIL */}
          <Input
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />

          {/* PHONE */}
          <Input
            label="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                phone: e.target.value,
              })
            }
          />

          {/* IMAGE */}
          <input
            type="file"
            className="border p-2 rounded-lg w-full"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
          />

        </DialogBody>

        <DialogFooter className="gap-3">

          <Button
            variant="text"
            color="red"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            color="green"
            onClick={handleUpdate}
          >
            Update Profile
          </Button>

        </DialogFooter>

      </Dialog>

    </>
  );
}

export default Profile;