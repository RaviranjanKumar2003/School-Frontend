import React, {
  useEffect,
  useMemo,
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
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
  StarIcon,
  CloudArrowUpIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid";

const BASE_URL =
  "http://localhost:8080/api";

function Testimonials() {

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

  const [testimonials, setTestimonials] =
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

  const [activeTab, setActiveTab] =
    useState("published");

  // =====================================================
  // FORM
  // =====================================================

  const [form, setForm] =
    useState({
      name: "",
      role: "",
      message: "",
      image: "",
      rating: 5,
      active: true,
      schoolId: schoolId || "",
    });

  // =====================================================
  // FETCH TESTIMONIALS
  // =====================================================

  const fetchTestimonials =
    async () => {

      try {

        if (!schoolId) return;

        const res =
          await fetch(
            `${BASE_URL}/testimonials/school/${schoolId}`
          );

        const data =
          await res.json();

        setTestimonials(data || []);

      } catch (err) {

        console.log(err);
      }
    };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {

    fetchTestimonials();

  }, [schoolId]);

  // =====================================================
  // FILTERED DATA
  // =====================================================

  const filteredTestimonials =
  useMemo(() => {

    if (activeTab === "published") {

      return testimonials.filter(
        (item) => item.active
      );
    }

    return testimonials.filter(
      (item) => !item.active
    );

  }, [
    testimonials,
    activeTab,
  ]);

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
            "Image upload failed"
          );
        }

        const data =
          await response.json();

        const uploadedUrl =
          `${BASE_URL}/file/profiles/${data.fileName}`;

        setForm((prev) => ({
          ...prev,
          image:
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
  // OPEN CREATE
  // =====================================================

  const openCreateDialog =
    () => {

      setEditingId(null);

      setErrorMessage("");

      setForm({
        name: "",
        role: "",
        message: "",
        image: "",
        rating: 5,
        active: false,
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
        name:
          item.name || "",

        role:
          item.role || "",

        message:
          item.message || "",

        image:
          item.image || "",

        rating:
          item.rating || 5,

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

  const saveTestimonial =
    async () => {

      try {

        setLoading(true);

        setErrorMessage("");

        if (!form.name) {

          setErrorMessage(
            "Name is required"
          );

          return;
        }

        if (!form.role) {

          setErrorMessage(
            "Role is required"
          );

          return;
        }

        if (!form.message) {

          setErrorMessage(
            "Message is required"
          );

          return;
        }

        const payload = {

          name:
            form.name,

          role:
            form.role,

          message:
            form.message,

          image:
            form.image,

          rating:
            Number(
              form.rating
            ),

          active:
            form.active,

          schoolId:
            Number(
              schoolId
            ),
        };

        const url =
          editingId
            ? `${BASE_URL}/testimonials/${editingId}`
            : `${BASE_URL}/testimonials`;

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

            body:
              JSON.stringify(
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
            ? "Testimonial Updated Successfully"
            : "Testimonial Added Successfully"
        );

        setOpen(false);

        fetchTestimonials();

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

  const deleteTestimonial =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this testimonial?"
        );

      if (!confirmDelete)
        return;

      try {

        await fetch(
          `${BASE_URL}/testimonials/${id}`,
          {
            method: "DELETE",
          }
        );

        alert(
          "Deleted Successfully"
        );

        fetchTestimonials();

      } catch (err) {

        console.log(err);
      }
    };

  // =====================================================
  // PUBLISH
  // =====================================================

  const publishTestimonial =
    async (item) => {

      try {

        const payload = {

          ...item,
          active: true,
          schoolId:
            Number(
              schoolId
            ),
        };

        const response =
          await fetch(
            `${BASE_URL}/testimonials/${item.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body:
                JSON.stringify(
                  payload
                ),
            }
          );

        if (!response.ok) {

          throw new Error(
            "Failed to publish testimonial"
          );
        }

        alert(
          "Testimonial Published Successfully"
        );

        fetchTestimonials();

      } catch (err) {

        console.log(err);

        alert(
          "Publish failed"
        );
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
  // RATING UI
  // =====================================================

  const renderStars =
    (count) => {

      return (
        <div className="flex gap-1">

          {[
            1, 2, 3, 4, 5,
          ].map((star) => (

            <StarIcon
              key={star}
              className={`h-5 w-5 ${
                star <= count
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}

        </div>
      );
    };

  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-orange-50
        via-white
        to-yellow-50
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
            Testimonials
          </Typography>

          <Typography
            className="
              text-gray-600
              mt-2
            "
          >
            Manage parent & student reviews
          </Typography>

        </div>

        <Button
          size="lg"
          color="orange"
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

          Add Testimonial

        </Button>

      </div>

      {/* TABS */}

      <div className="flex gap-4 mb-8">

        <Button
          color={
            activeTab ===
            "published"
              ? "green"
              : "gray"
          }
          className="rounded-xl"
          onClick={() =>
            setActiveTab(
              "published"
            )
          }
        >
          Published (
          {
            testimonials.filter(
              (i) =>
                i.active
            ).length
          }
          )
        </Button>

        <Button
          color={
            activeTab ===
            "pending"
              ? "red"
              : "gray"
          }
          className="rounded-xl"
          onClick={() =>
            setActiveTab(
              "pending"
            )
          }
        >
          Pending (
          {
            testimonials.filter(
              (i) =>
                !i.active
            ).length
          }
          )
        </Button>

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

        {filteredTestimonials.map(
          (item) => (

            <Card
              key={item.id}
              className="
                rounded-3xl
                shadow-xl
                overflow-hidden
              "
            >

              <CardBody>

                <div className="flex items-start gap-4">

                  {item.image ? (

                    <img
                      src={
                        item.image
                      }
                      alt={
                        item.name
                      }
                      className="
                        w-20
                        h-20
                        rounded-2xl
                        object-cover
                      "
                    />

                  ) : (

                    <div
                      className="
                        w-20
                        h-20
                        rounded-2xl
                        bg-gray-100
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <UserCircleIcon
                        className="
                          h-14
                          w-14
                          text-gray-400
                        "
                      />

                    </div>
                  )}

                  <div className="flex-1">

                    <div className="flex justify-between">

                      <div>

                        <Typography
                          variant="h5"
                          className="font-bold"
                        >
                          {item.name}
                        </Typography>

                        <Typography
                          className="
                            text-sm
                            text-gray-500
                          "
                        >
                          {item.role}
                        </Typography>

                      </div>

                      <Chip
                        value={
                          item.active
                            ? "ACTIVE"
                            : "PENDING"
                        }
                        color={
                          item.active
                            ? "green"
                            : "red"
                        }
                      />

                    </div>

                    <div className="mt-2">

                      {renderStars(
                        item.rating
                      )}

                    </div>

                  </div>

                </div>

                <Typography
                  className="
                    mt-5
                    text-gray-700
                    line-clamp-4
                  "
                >
                  {item.message}
                </Typography>

                <div className="flex gap-2 mt-6 flex-wrap">

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

                  {!item.active && (

                    <Button
                      color="green"
                      className="
                        rounded-xl
                        flex
                        items-center
                        gap-2
                      "
                      onClick={() =>
                        publishTestimonial(
                          item
                        )
                      }
                    >

                      <CheckBadgeIcon className="h-5 w-5" />

                      Publish

                    </Button>
                  )}

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
                      deleteTestimonial(
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
            ? "Update Testimonial"
            : "Add Testimonial"}

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
              label="Name"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
            />

            <Input
              label="Role"
              name="role"
              value={form.role}
              onChange={
                handleChange
              }
            />

            <Textarea
              label="Message"
              name="message"
              value={
                form.message
              }
              onChange={
                handleChange
              }
            />

            {/* IMAGE */}

            <div>

              <Typography className="mb-2 font-semibold">
                Upload Profile Image
              </Typography>

              <label
                className="
                  border-2
                  border-dashed
                  border-orange-300
                  rounded-2xl
                  p-6
                  flex
                  flex-col
                  items-center
                  justify-center
                  cursor-pointer
                  bg-orange-50
                "
              >

                <CloudArrowUpIcon className="h-14 w-14 text-orange-600 mb-3" />

                <Typography className="font-semibold text-orange-700">
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

            {/* IMAGE PREVIEW */}

            {form.image && (

              <div
                className="
                  rounded-2xl
                  overflow-hidden
                  border
                "
              >

                <img
                  src={
                    form.image
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

            {/* RATING */}

            <div>

              <Typography className="mb-2 font-semibold">
                Rating
              </Typography>

              <select
                name="rating"
                value={
                  form.rating
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

                <option value={1}>
                  1 Star
                </option>

                <option value={2}>
                  2 Star
                </option>

                <option value={3}>
                  3 Star
                </option>

                <option value={4}>
                  4 Star
                </option>

                <option value={5}>
                  5 Star
                </option>

              </select>

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
            color="orange"
            disabled={
              loading ||
              uploading
            }
            onClick={
              saveTestimonial
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
          Testimonial Preview
        </DialogHeader>

        <DialogBody>

          {selectedItem && (

            <div>

              <div className="flex items-center gap-5">

                {selectedItem.image ? (

                  <img
                    src={
                      selectedItem.image
                    }
                    alt={
                      selectedItem.name
                    }
                    className="
                      w-28
                      h-28
                      rounded-3xl
                      object-cover
                    "
                  />

                ) : (

                  <UserCircleIcon
                    className="
                      h-28
                      w-28
                      text-gray-400
                    "
                  />

                )}

                <div>

                  <Typography
                    variant="h3"
                    className="font-bold"
                  >
                    {
                      selectedItem.name
                    }
                  </Typography>

                  <Typography className="text-gray-500 mt-1">
                    {
                      selectedItem.role
                    }
                  </Typography>

                  <div className="mt-3">

                    {renderStars(
                      selectedItem.rating
                    )}

                  </div>

                </div>

              </div>

              <Typography
                className="
                  mt-8
                  text-gray-700
                  leading-8
                "
              >
                {
                  selectedItem.message
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

export default Testimonials;