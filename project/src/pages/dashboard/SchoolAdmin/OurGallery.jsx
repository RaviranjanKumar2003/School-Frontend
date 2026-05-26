import React, {
  useEffect,
  useState,
} from "react";

import {
  Card,
  CardBody,
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
  Chip,
} from "@material-tailwind/react";

import {
  PhotoIcon,
  VideoCameraIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  SparklesIcon,
  CloudArrowUpIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";

const BASE_URL =
  "http://localhost:8080/api";

function OurGallery() {

  // =====================================================
  // ADMIN DATA
  // =====================================================

  const adminData =
    JSON.parse(
      localStorage.getItem(
        "schoolAdminData"
      )
    ) || {};

  const schoolId =
    adminData?.school?.id ||
    adminData?.schoolId;

  // =====================================================
  // STATES
  // =====================================================

  const [gallery, setGallery] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [previewOpen, setPreviewOpen] =
    useState(false);

  const [selectedItem, setSelectedItem] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      type: "IMAGE",

      // IMAGE
      fileName: "",

      // VIDEO
      videoUrl: "",

      // COMMON
      thumbnail: "",

      active: true,
      schoolId: schoolId || "",
    });

  // =====================================================
  // FETCH GALLERY
  // =====================================================

  const fetchGallery =
    async () => {

      try {

        if (!schoolId) return;

        const res =
          await fetch(
            `${BASE_URL}/gallery/school/${schoolId}`
          );

        const data =
          await res.json();

        setGallery(data || []);

      } catch (err) {

        console.log(err);
      }
    };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {

    fetchGallery();

  }, [schoolId]);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // IMAGE UPLOAD
  // =====================================================

  const handleImageUpload =
    async (e) => {

      try {

        const file =
          e.target.files[0];

        if (!file) return;

        setUploading(true);

        const formData =
          new FormData();

        formData.append("file", file);

        const response =
          await fetch(
            `${BASE_URL}/file/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

        if (!response.ok) {

          throw new Error(
            "Upload failed"
          );
        }

        const data =
          await response.json();

        const uploadedUrl =
          `${BASE_URL}/file/profiles/${data.fileName}`;

        setForm((prev) => ({
          ...prev,

          fileName:
            uploadedUrl,

          thumbnail:
            uploadedUrl,
        }));

      } catch (err) {

        console.log(err);

        alert(
          "Image upload failed"
        );

      } finally {

        setUploading(false);
      }
    };


  // =====================================================
// VIDEO UPLOAD
// =====================================================

const handleVideoUpload =
  async (e) => {

    try {

      const file =
        e.target.files[0];

      if (!file) return;

      setUploading(true);

      const formData =
        new FormData();

      // IMPORTANT
      // backend wants "file"

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          `${BASE_URL}/file/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

      if (!response.ok) {

        throw new Error(
          "Video upload failed"
        );
      }

      const data =
        await response.json();

      const uploadedUrl =
        `${BASE_URL}/file/profiles/${data.fileName}`;

      setForm((prev) => ({
        ...prev,

        videoUrl:
          uploadedUrl,
      }));

    } catch (err) {

      console.log(err);

      alert(
        "Video upload failed"
      );

    } finally {

      setUploading(false);
    }
  };

// =====================================================
// THUMBNAIL UPLOAD
// =====================================================

const handleThumbnailUpload =
  async (e) => {

    try {

      const file =
        e.target.files[0];

      if (!file) return;

      setUploading(true);

      const formData =
        new FormData();

      // IMPORTANT
      // backend wants "file"

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          `${BASE_URL}/file/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

      if (!response.ok) {

        throw new Error(
          "Thumbnail upload failed"
        );
      }

      const data =
        await response.json();

      const uploadedUrl =
        `${BASE_URL}/file/profiles/${data.fileName}`;

      setForm((prev) => ({
        ...prev,

        thumbnail:
          uploadedUrl,
      }));

    } catch (err) {

      console.log(err);

      alert(
        "Thumbnail upload failed"
      );

    } finally {

      setUploading(false);
    }
  };


  // =====================================================
  // OPEN CREATE
  // =====================================================

  const openCreateDialog =
    () => {

      setEditingId(null);

      setErrorMessage("");

      setForm({
        title: "",
        description: "",
        type: "IMAGE",
        fileName: "",
        videoUrl: "",
        thumbnail: "",
        active: true,
        schoolId: schoolId,
      });

      setOpen(true);
    };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEditDialog =
    (item) => {

      setEditingId(item.id);

      setErrorMessage("");

      setForm({
        title:
          item.title || "",

        description:
          item.description || "",

        type:
          item.type ||
          "IMAGE",

        fileName:
          item.fileName || "",

        videoUrl:
          item.videoUrl || "",

        thumbnail:
          item.thumbnail || "",

        active:
          item.active ?? true,

        schoolId:
          schoolId,
      });

      setOpen(true);
    };

  // =====================================================
  // SAVE
  // =====================================================

  const saveGallery =
    async () => {

      try {

        setLoading(true);

        setErrorMessage("");

        if (!schoolId) {

          setErrorMessage(
            "School ID not found"
          );

          return;
        }

        // IMAGE VALIDATION

        if (
          form.type ===
            "IMAGE" &&
          !form.fileName
        ) {

          setErrorMessage(
            "Please upload image"
          );

          return;
        }

        // VIDEO VALIDATION

        if (
          form.type ===
            "VIDEO" &&
          !form.videoUrl
        ) {

          setErrorMessage(
            "Please upload video"
          );

          return;
        }

        const payload = {

          title:
            form.title,

          description:
            form.description,

          type:
            form.type,

          fileName:
            form.fileName,

          videoUrl:
            form.videoUrl,

          thumbnail:
            form.thumbnail,

          active:
            form.active,

          schoolId:
            Number(
              schoolId
            ),
        };

        const url =
          editingId
            ? `${BASE_URL}/gallery/${editingId}`
            : `${BASE_URL}/gallery`;

        const method =
          editingId
            ? "PUT"
            : "POST";

        const response =
          await fetch(url, {
            method,

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
            ),
          });

        if (!response.ok) {

          const errorText =
            await response.text();

          throw new Error(
            errorText
          );
        }

        alert(
          editingId
            ? "Gallery Updated Successfully"
            : "Gallery Added Successfully"
        );

        setOpen(false);

        fetchGallery();

      } catch (err) {

        console.log(err);

        setErrorMessage(
          err.message ||
            "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteGallery =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this gallery item?"
        );

      if (!confirmDelete)
        return;

      try {

        await fetch(
          `${BASE_URL}/gallery/${id}`,
          {
            method: "DELETE",
          }
        );

        alert(
          "Deleted Successfully"
        );

        fetchGallery();

      } catch (err) {

        console.log(err);
      }
    };

  // =====================================================
  // PREVIEW
  // =====================================================

  const openPreview =
    (item) => {

      setSelectedItem(item);

      setPreviewOpen(true);
    };

  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-blue-50
        via-white
        to-indigo-50
        p-4
        md:p-8
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-5
          mb-10
        "
      >

        <div>

          <Typography
            variant="h2"
            className="
              font-black
              text-gray-900
            "
          >
            School Gallery
          </Typography>

          <Typography
            className="
              text-gray-600
              mt-2
            "
          >
            Manage school images
            & videos
          </Typography>

        </div>

        <Button
          size="lg"
          color="blue"
          className="
            rounded-2xl
            flex
            items-center
            gap-2
          "
          onClick={
            openCreateDialog
          }
        >

          <PlusIcon className="h-5 w-5" />

          Add Gallery

        </Button>

      </div>

      {/* STATS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-5
          mb-10
        "
      >

        <Card className="rounded-3xl shadow-lg">

          <CardBody>

            <div className="flex items-center justify-between">

              <div>

                <Typography className="text-gray-500 text-sm">
                  Total Items
                </Typography>

                <Typography
                  variant="h3"
                  className="font-black"
                >
                  {gallery.length}
                </Typography>

              </div>

              <div className="bg-blue-100 p-4 rounded-2xl">

                <SparklesIcon className="h-8 w-8 text-blue-700" />

              </div>

            </div>

          </CardBody>

        </Card>

        <Card className="rounded-3xl shadow-lg">

          <CardBody>

            <div className="flex items-center justify-between">

              <div>

                <Typography className="text-gray-500 text-sm">
                  Images
                </Typography>

                <Typography
                  variant="h3"
                  className="font-black"
                >
                  {
                    gallery.filter(
                      (g) =>
                        g.type ===
                        "IMAGE"
                    ).length
                  }
                </Typography>

              </div>

              <div className="bg-green-100 p-4 rounded-2xl">

                <PhotoIcon className="h-8 w-8 text-green-700" />

              </div>

            </div>

          </CardBody>

        </Card>

        <Card className="rounded-3xl shadow-lg">

          <CardBody>

            <div className="flex items-center justify-between">

              <div>

                <Typography className="text-gray-500 text-sm">
                  Videos
                </Typography>

                <Typography
                  variant="h3"
                  className="font-black"
                >
                  {
                    gallery.filter(
                      (g) =>
                        g.type ===
                        "VIDEO"
                    ).length
                  }
                </Typography>

              </div>

              <div className="bg-purple-100 p-4 rounded-2xl">

                <VideoCameraIcon className="h-8 w-8 text-purple-700" />

              </div>

            </div>

          </CardBody>

        </Card>

      </div>

      {/* GRID */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >

        {gallery.map(
          (item) => (

            <Card
              key={item.id}
              className="
                rounded-3xl
                overflow-hidden
                shadow-xl
                hover:shadow-2xl
                transition-all
              "
            >

              <div
                className="
                  relative
                  h-64
                  bg-gray-100
                "
              >

                {item.type === "VIDEO" ? (

  <div
    className="
      relative
      w-full
      h-full
      cursor-pointer
      group
    "
    onClick={() =>
      openPreview(item)
    }
  >

    {/* THUMBNAIL */}

    <img
      src={
        item.thumbnail ||
        "https://via.placeholder.com/500x300?text=Video"
      }
      alt={item.title}
      className="
        w-full
        h-full
        object-cover
      "
    />

    {/* DARK OVERLAY */}

    <div
      className="
        absolute
        inset-0
        bg-black/30
        group-hover:bg-black/40
        transition-all
      "
    />

    {/* PLAY ICON */}

    <div
      className="
        absolute
        inset-0
        flex
        items-center
        justify-center
      "
    >

      <PlayCircleIcon
        className="
          h-20
          w-20
          text-white
          drop-shadow-lg
        "
      />

    </div>

  </div>

) : (

                  <img
                    src={
                      item.fileName
                    }
                    alt={
                      item.title
                    }
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                )}

                <div className="absolute top-3 right-3">

                  <Chip
                    value={
                      item.type
                    }
                    color={
                      item.type ===
                      "VIDEO"
                        ? "purple"
                        : "green"
                    }
                  />

                </div>

              </div>

              <CardBody>

                <div className="flex justify-between items-start">

                  <div>

                    <Typography
                      variant="h5"
                      className="font-bold"
                    >
                      {item.title}
                    </Typography>

                    <Typography className="text-sm text-gray-500 mt-1">
                      {
                        item.description
                      }
                    </Typography>

                  </div>

                  <Chip
                    value={
                      item.active
                        ? "ACTIVE"
                        : "INACTIVE"
                    }
                    color={
                      item.active
                        ? "green"
                        : "red"
                    }
                  />

                </div>

                <div className="flex gap-2 mt-6">

                  <Button
                    fullWidth
                    color="blue"
                    className="rounded-xl"
                    onClick={() =>
                      openPreview(
                        item
                      )
                    }
                  >
                    View
                  </Button>

                  <Button
                    color="amber"
                    className="rounded-xl px-4"
                    onClick={() =>
                      openEditDialog(
                        item
                      )
                    }
                  >

                    <PencilSquareIcon className="h-5 w-5" />

                  </Button>

                  <Button
                    color="red"
                    className="rounded-xl px-4"
                    onClick={() =>
                      deleteGallery(
                        item.id
                      )
                    }
                  >

                    <TrashIcon className="h-5 w-5" />

                  </Button>

                </div>

              </CardBody>

            </Card>
          )
        )}

      </div>

      {/* ADD / UPDATE */}

      <Dialog
        open={open}
        handler={() =>
          setOpen(false)
        }
        size="md"
      >

        <DialogHeader>

          {editingId
            ? "Update Gallery"
            : "Add Gallery"}

        </DialogHeader>

        <DialogBody
  divider
  className="
    max-h-[75vh]
    overflow-y-auto
  "
>

          <div className="space-y-5">

            {errorMessage && (

              <div
                className="
                  bg-red-100
                  text-red-700
                  p-3
                  rounded-xl
                "
              >
                {errorMessage}
              </div>

            )}

            <Input
              label="Title"
              name="title"
              value={form.title}
              onChange={
                handleChange
              }
            />

            <Textarea
              label="Description"
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
            />

            {/* TYPE */}

            <div>

              <Typography className="mb-2 font-semibold">
                Select Type
              </Typography>

              <select
                name="type"
                value={
                  form.type
                }
                onChange={
                  handleChange
                }
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                "
              >

                <option value="IMAGE">
                  IMAGE
                </option>

                <option value="VIDEO">
                  VIDEO
                </option>

              </select>

            </div>

            {/* IMAGE */}

            {form.type ===
              "IMAGE" && (

              <div>

                <Typography className="mb-2 font-semibold">
                  Upload Image
                </Typography>

                <label
                  className="
                    border-2
                    border-dashed
                    border-blue-300
                    rounded-2xl
                    p-6
                    flex
                    flex-col
                    items-center
                    justify-center
                    cursor-pointer
                    bg-blue-50
                  "
                >

                  <CloudArrowUpIcon className="h-14 w-14 text-blue-600 mb-3" />

                  <Typography className="font-semibold text-blue-700">
                    Click To Upload Image
                  </Typography>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={
                      handleImageUpload
                    }
                  />

                </label>

              </div>
            )}

            {/* VIDEO */}

            {form.type ===
              "VIDEO" && (

              <div className="space-y-5">

                {/* VIDEO */}

                <div>

                  <Typography className="mb-2 font-semibold">
                    Upload Video
                  </Typography>

                  <label
                    className="
                      border-2
                      border-dashed
                      border-purple-300
                      rounded-2xl
                      p-6
                      flex
                      flex-col
                      items-center
                      justify-center
                      cursor-pointer
                      bg-purple-50
                    "
                  >

                    <VideoCameraIcon className="h-14 w-14 text-purple-600 mb-3" />

                    <Typography className="font-semibold text-purple-700">
                      Click To Upload Video
                    </Typography>

                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={
                        handleVideoUpload
                      }
                    />

                  </label>

                </div>

                {/* THUMBNAIL */}

                <div>

                  <Typography className="mb-2 font-semibold">
                    Upload Thumbnail
                  </Typography>

                  <label
                    className="
                      border-2
                      border-dashed
                      border-green-300
                      rounded-2xl
                      p-6
                      flex
                      flex-col
                      items-center
                      justify-center
                      cursor-pointer
                      bg-green-50
                    "
                  >

                    <PhotoIcon className="h-14 w-14 text-green-600 mb-3" />

                    <Typography className="font-semibold text-green-700">
                      Upload Thumbnail
                    </Typography>

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={
                        handleThumbnailUpload
                      }
                    />

                  </label>

                </div>

              </div>
            )}

            {/* PREVIEW */}

            {form.type ===
              "IMAGE" &&
              form.fileName && (

              <div className="rounded-2xl overflow-hidden border">

                <img
                  src={
                    form.fileName
                  }
                  alt="preview"
                  className="
                    w-full
                    h-64
                    object-cover
                  "
                />

              </div>
            )}

            {form.type ===
              "VIDEO" &&
              form.videoUrl && (

              <div className="rounded-2xl overflow-hidden border">

                <video
                  src={
                    form.videoUrl
                  }
                  controls
                  className="
                    w-full
                    h-64
                    object-cover
                  "
                />

              </div>
            )}

            <div className="flex items-center justify-between">

              <Typography className="font-medium">
                Status
              </Typography>

              <Chip
                value={
                  form.active
                    ? "ACTIVE"
                    : "INACTIVE"
                }
                color={
                  form.active
                    ? "green"
                    : "red"
                }
                onClick={() =>
                  setForm({
                    ...form,
                    active:
                      !form.active,
                  })
                }
                className="cursor-pointer"
              />

            </div>

          </div>

        </DialogBody>

        <DialogFooter className="gap-3">

          <Button
            variant="text"
            color="red"
            onClick={() =>
              setOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            color="blue"
            disabled={
              loading ||
              uploading
            }
            onClick={
              saveGallery
            }
          >

            {uploading
              ? "Uploading..."
              : loading
              ? "Saving..."
              : editingId
              ? "Update"
              : "Save"}

          </Button>

        </DialogFooter>

      </Dialog>

      {/* PREVIEW */}

      <Dialog
        open={previewOpen}
        handler={() =>
          setPreviewOpen(false)
        }
        size="lg"
      >

        <DialogHeader>
          Gallery Preview
        </DialogHeader>

        <DialogBody>

          {selectedItem && (

            <div>

              {selectedItem.type ===
              "VIDEO" ? (

                <video
                  src={
                    selectedItem.videoUrl
                  }
                  controls
                  autoPlay
                  className="
                    w-full
                    rounded-2xl
                  "
                />

              ) : (

                <img
                  src={
                    selectedItem.fileName
                  }
                  alt={
                    selectedItem.title
                  }
                  className="
                    w-full
                    rounded-2xl
                  "
                />

              )}

              <Typography
                variant="h4"
                className="mt-5 font-bold"
              >
                {
                  selectedItem.title
                }
              </Typography>

              <Typography className="mt-2 text-gray-600">
                {
                  selectedItem.description
                }
              </Typography>

            </div>

          )}

        </DialogBody>

        <DialogFooter>

          <Button
            color="red"
            onClick={() =>
              setPreviewOpen(false)
            }
          >
            Close
          </Button>

        </DialogFooter>

      </Dialog>

    </div>
  );
}

export default OurGallery;