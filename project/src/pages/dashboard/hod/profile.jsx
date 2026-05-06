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

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    username: "",
    password: "",
    email: "",
    phone: "",
  });

  const [image, setImage] = useState(null);
  const [coverImages, setCoverImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newImages, setNewImages] = useState([]);

  const storedHod = JSON.parse(localStorage.getItem("hodData"));
  const hodId = storedHod?.id;

  // ================= FETCH HOD =================
  const fetchHod = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/hods/${hodId}`
      );

      setHod(res.data);

      setFormData({
        name: res.data.name || "",
        department: res.data.department || "",
        username: res.data.username || "",
        password: res.data.password || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
      });

      setCoverImages(res.data.coverImages || []);
      setCurrentIndex(0);

    } catch (err) {
      console.error("Fetch HOD error:", err);
    }
  };

  useEffect(() => {
    if (hodId) fetchHod();
  }, [hodId]);

  // ================= AUTO SLIDER =================
  useEffect(() => {
    if (coverImages.length <= 1) return;
    console.log("CURRENT FILE NAME:", coverImages);

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === coverImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [coverImages]);

  if (!hod) return <div className="text-center mt-10">Loading...</div>;

  // ================= PROFILE IMAGE =================
  const imageUrl = `http://localhost:8080/api/hods/image/get/${hodId}`;

  // 🔥 IMPORTANT FIX (FULL CORRECT ENDPOINT)
  const coverUrl = (fileName) =>
    `http://localhost:8080/api/hods/cover/get-file/${hodId}/${fileName}`;

  const currentCover =
    coverImages.length > 0
      ? coverUrl(coverImages[currentIndex])
      : "/img/default-cover.jpg";

  // ================= UPDATE PROFILE =================
  const handleUpdate = async () => {
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (image) data.append("file", image);

      await axios.put(
        `http://localhost:8080/api/hods/update-hod/${hodId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setOpen(false);
      fetchHod();

    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // ================= COVER UPLOAD =================
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
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setNewImages([]);
      fetchHod();

    } catch (err) {
      console.error("Cover upload error:", err);
    }
  };

  return (
    <>
      {/* ================= COVER SLIDER ================= */}
      <div
        className="relative mt-8 h-72 w-full rounded-xl overflow-hidden group"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >

        {/* IMAGE */}
        <img
          src={currentCover}
          className="w-full h-full object-cover transition-all duration-700"
          onError={(e) => {
            e.target.src = "/img/default-cover.jpg";
          }}
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/40" />

        {/* CONTROLS */}
        {hover && (
          <div className="absolute right-5 top-5 flex gap-2">

            <label className="cursor-pointer bg-white p-2 rounded-full shadow-lg">
              <CameraIcon className="h-6 w-6 text-gray-700" />
              <input
                type="file"
                multiple
                hidden
                onChange={(e) =>
                  setNewImages(Array.from(e.target.files))
                }
              />
            </label>

            {newImages.length > 0 && (
              <Button size="sm" color="green" onClick={handleCoverUpload}>
                Upload ({newImages.length})
              </Button>
            )}

          </div>
        )}

        {/* DOT INDICATOR */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {coverImages.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentIndex ? "bg-white" : "bg-gray-500"
              }`}
            />
          ))}
        </div>

      </div>

      {/* ================= PROFILE CARD ================= */}
      <Card className="mx-3 -mt-16 mb-6">
        <CardBody>

          <div className="flex items-center gap-6">

            <Avatar
              src={imageUrl}
              size="xl"
              onError={(e) => {
                e.target.src = "/img/user.png";
              }}
            />

            <div>
              <Typography variant="h5">{hod.name}</Typography>
              <Typography>{hod.department}</Typography>
            </div>

          </div>

          <div className="mt-10">
            <ProfileInfoCard
              title="HOD Details"
              details={{
                Name: hod.name,
                Department: hod.department,
                Email: hod.email,
                Phone: hod.phone,
                Username: hod.username,
              }}
              action={
                <Tooltip content="Edit Profile">
                  <PencilIcon
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => setOpen(true)}
                  />
                </Tooltip>
              }
            />
          </div>

        </CardBody>
      </Card>

      {/* ================= EDIT MODAL ================= */}
      <Dialog open={open} handler={setOpen}>
        <DialogHeader>Edit Profile</DialogHeader>

        <DialogBody className="space-y-4">

          {Object.keys(formData).map((key) => (
            <Input
              key={key}
              label={key}
              value={formData[key]}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
            />
          ))}

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />

        </DialogBody>

        <DialogFooter>
          <Button variant="text" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="green" onClick={handleUpdate}>
            Update
          </Button>
        </DialogFooter>

      </Dialog>
    </>
  );
}

export default Profile;