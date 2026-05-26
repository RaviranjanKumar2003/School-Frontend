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
  Switch,
} from "@material-tailwind/react";

import {

  BookOpenIcon,
  ComputerDesktopIcon,
  WifiIcon,
  TruckIcon,
  ShieldCheckIcon,
  HomeModernIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  VideoCameraIcon,
  TvIcon,
  CpuChipIcon,
  HeartIcon,
  FireIcon,
  FlagIcon,
  SunIcon,
  CakeIcon,
  TrophyIcon,
  BoltIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  MicrophoneIcon,
  PresentationChartBarIcon,
  SparklesIcon,
  PlusIcon,
  CheckCircleIcon,

} from "@heroicons/react/24/solid";

const BASE_URL =
  "http://localhost:8080/api";

function OurFacilities() {

  // ======================================================
  // SCHOOL ADMIN DATA
  // ======================================================

  const adminData =
    JSON.parse(
      localStorage.getItem(
        "schoolAdminData"
      )
    ) || {};

  const schoolId =
    adminData?.school?.id ||
    adminData?.schoolId;

  // ======================================================
  // STATES
  // ======================================================

  const [facilities, setFacilities] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  // ======================================================
  // FORM
  // ======================================================

  const [form, setForm] = useState({
    title: "",
    description: "",
    icon: "library",
    totalCount: 1,
    active: true,
    schoolId: schoolId || "",
  });

  // ======================================================
  // ICONS MAP
  // ======================================================

  const facilityIcons = {

  // =========================================
  // EDUCATION
  // =========================================

  library: BookOpenIcon,
  computer: ComputerDesktopIcon,
  smartclass: PresentationChartBarIcon,
  classroom: AcademicCapIcon,
  laboratory: BeakerIcon,
  science: BeakerIcon,
  exam: ClipboardDocumentCheckIcon,
  digital: DevicePhoneMobileIcon,

  // =========================================
  // INTERNET & TECH
  // =========================================

  wifi: WifiIcon,
  internet: GlobeAltIcon,
  cctv: VideoCameraIcon,
  projector: TvIcon,
  ai: CpuChipIcon,

  // =========================================
  // TRANSPORT
  // =========================================

  transport: TruckIcon,
  bus: TruckIcon,
  parking: TruckIcon,

  // =========================================
  // SAFETY
  // =========================================

  security: ShieldCheckIcon,
  medical: HeartIcon,
  firstaid: HeartIcon,
  fire: FireIcon,

  // =========================================
  // HOSTEL & CAMPUS
  // =========================================

  hostel: HomeModernIcon,
  campus: BuildingOffice2Icon,
  playground: FlagIcon,
  garden: SunIcon,
  cafeteria: CakeIcon,
  canteen: CakeIcon,

  // =========================================
  // SPORTS
  // =========================================

  sports: TrophyIcon,
  cricket: TrophyIcon,
  football: TrophyIcon,
  basketball: TrophyIcon,
  gym: BoltIcon,
  yoga: SparklesIcon,

  // =========================================
  // CULTURAL
  // =========================================

  music: MusicalNoteIcon,
  dance: SparklesIcon,
  art: PaintBrushIcon,
  auditorium: MicrophoneIcon,

  // =========================================
  // DEFAULT
  // =========================================

  default: BuildingOffice2Icon,
};

  // ======================================================
  // FETCH FACILITIES
  // ======================================================

  const fetchFacilities =
    async () => {

      try {

        if (!schoolId) return;

        const res = await fetch(
          `${BASE_URL}/facilities/school/${schoolId}`
        );

        const data =
          await res.json();

        console.log(
          "FACILITIES : ",
          data
        );

        setFacilities(data || []);

      } catch (err) {

        console.log(err);

      }
    };

  // ======================================================
  // LOAD
  // ======================================================

  useEffect(() => {

    fetchFacilities();

  }, [schoolId]);

  // ======================================================
  // HANDLE CHANGE
  // ======================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,

      [name]:
        name === "totalCount"
          ? Number(value)
          : value,
    }));
  };

  // ======================================================
  // OPEN CREATE
  // ======================================================

  const openCreateDialog =
    () => {

      setEditingId(null);

      setErrorMessage("");

      setForm({
        title: "",
        description: "",
        icon: "library",
        totalCount: 1,
        active: true,
        schoolId: schoolId,
      });

      setOpen(true);
    };

  // ======================================================
  // OPEN EDIT
  // ======================================================

  const openEditDialog = (
    facility
  ) => {

    setEditingId(facility.id);

    setErrorMessage("");

    setForm({
      title:
        facility.title || "",

      description:
        facility.description || "",

      icon:
        facility.icon ||
        "library",

      totalCount:
        facility.totalCount || 1,

      active:
        facility.active ?? true,

      schoolId:
        facility.schoolId ||
        schoolId,
    });

    setOpen(true);
  };

  // ======================================================
  // SAVE FACILITY
  // ======================================================

  const saveFacility =
    async () => {

      try {

        setLoading(true);

        setErrorMessage("");

        // ======================================================
        // VALIDATION
        // ======================================================

        if (!schoolId) {

          setErrorMessage(
            "School ID not found. Please login again."
          );

          return;
        }

        const payload = {
          title:
            form.title,

          description:
            form.description,

          icon:
            form.icon,

          totalCount:
            Number(
              form.totalCount
            ),

          active:
            form.active,

          schoolId:
            Number(
              schoolId
            ),
        };

        console.log(
          "SENDING DATA => ",
          payload
        );

        // ======================================================
        // API
        // ======================================================

        const url = editingId
          ? `${BASE_URL}/facilities/${editingId}`
          : `${BASE_URL}/facilities`;

        const method = editingId
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

        // ======================================================
        // ERROR
        // ======================================================

        if (!response.ok) {

          const errorText =
            await response.text();

          console.log(
            "BACKEND ERROR => ",
            errorText
          );

          throw new Error(
            errorText
          );
        }

        // ======================================================
        // SUCCESS
        // ======================================================

        alert(
          editingId
            ? "Facility Updated Successfully"
            : "Facility Added Successfully"
        );

        setOpen(false);

        fetchFacilities();

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

  // ======================================================
  // DELETE
  // ======================================================

  const deleteFacility =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this facility?"
        );

      if (!confirmDelete)
        return;

      try {

        await fetch(
          `${BASE_URL}/facilities/${id}`,
          {
            method: "DELETE",
          }
        );

        alert(
          "Facility Deleted"
        );

        fetchFacilities();

      } catch (err) {

        console.log(err);
      }
    };

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
        md:p-8
      "
    >

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

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
            Our Facilities
          </Typography>

          <Typography
            className="
              text-gray-600
              mt-2
            "
          >
            Manage school
            facilities
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

          Add Facility

        </Button>

      </div>

      {/* ====================================================== */}
      {/* STATS */}
      {/* ====================================================== */}

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
                  Total Facilities
                </Typography>

                <Typography
                  variant="h3"
                  className="font-black"
                >
                  {
                    facilities.length
                  }
                </Typography>

              </div>

              <div className="bg-blue-100 p-4 rounded-2xl">

                <BuildingOffice2Icon className="h-8 w-8 text-blue-700" />

              </div>

            </div>

          </CardBody>

        </Card>

        <Card className="rounded-3xl shadow-lg">

          <CardBody>

            <div className="flex items-center justify-between">

              <div>

                <Typography className="text-gray-500 text-sm">
                  Active
                </Typography>

                <Typography
                  variant="h3"
                  className="font-black"
                >
                  {
                    facilities.filter(
                      (
                        f
                      ) =>
                        f.active
                    ).length
                  }
                </Typography>

              </div>

              <div className="bg-green-100 p-4 rounded-2xl">

                <CheckCircleIcon className="h-8 w-8 text-green-700" />

              </div>

            </div>

          </CardBody>

        </Card>

        <Card className="rounded-3xl shadow-lg">

          <CardBody>

            <div className="flex items-center justify-between">

              <div>

                <Typography className="text-gray-500 text-sm">
                  Premium
                </Typography>

                <Typography
                  variant="h3"
                  className="font-black"
                >
                  {
                    facilities.length
                  }
                </Typography>

              </div>

              <div className="bg-purple-100 p-4 rounded-2xl">

                <SparklesIcon className="h-8 w-8 text-purple-700" />

              </div>

            </div>

          </CardBody>

        </Card>

      </div>

      {/* ====================================================== */}
      {/* GRID */}
      {/* ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >

        {facilities.map(
          (facility) => {

            const IconComponent =
              facilityIcons[
                facility.icon
              ] ||
              BuildingOffice2Icon;

            return (

              <Card
                key={
                  facility.id
                }
                className={`
  rounded-3xl
  shadow-xl
  hover:shadow-2xl
  transition-all
  ${
    !facility.active
      ? "opacity-60 grayscale"
      : ""
  }
`}
              >

                <CardBody>

                  <div className="flex justify-between items-start mb-5">

                    <div
                      className="
                        bg-gradient-to-r
                        from-blue-500
                        to-indigo-600
                        p-4
                        rounded-2xl
                      "
                    >

                      <IconComponent className="h-8 w-8 text-white" />

                    </div>

                    <Chip
                      value={
                        facility.active
                          ? "ACTIVE"
                          : "INACTIVE"
                      }
                      color={
                        facility.active
                          ? "green"
                          : "red"
                      }
                    />

                  </div>

                  <Typography
                    variant="h5"
                    className="font-bold mb-2"
                  >
                    {
                      facility.title
                    }
                  </Typography>

                  <Typography className="text-blue-700 font-semibold mb-2">
                    Total :
                    {" "}
                    {
                      facility.totalCount
                    }
                  </Typography>

                  <Typography className="text-gray-600 min-h-[80px]">
                    {
                      facility.description
                    }
                  </Typography>

                  <div className="flex gap-3 mt-8">

                    <Button
                      fullWidth
                      color="blue"
                      className="rounded-2xl"
                      onClick={() =>
                        openEditDialog(
                          facility
                        )
                      }
                    >
                      Edit
                    </Button>

                    <Button
                      fullWidth
                      color="red"
                      variant="outlined"
                      className="rounded-2xl"
                      onClick={() =>
                        deleteFacility(
                          facility.id
                        )
                      }
                    >
                      Delete
                    </Button>

                  </div>

                </CardBody>

              </Card>
            );
          }
        )}

      </div>

      {/* ====================================================== */}
      {/* DIALOG */}
      {/* ====================================================== */}

      <Dialog
        open={open}
        handler={() =>
          setOpen(false)
        }
        size="md"
      >

        <DialogHeader>

          {editingId
            ? "Update Facility"
            : "Add Facility"}

        </DialogHeader>

        <DialogBody divider>

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
              label="Facility Title"
              name="title"
              value={
                form.title
              }
              onChange={
                handleChange
              }
            />

            {/* ICON */}

            <div>

              <Typography className="mb-2 text-sm font-semibold">
                Facility Icon
              </Typography>

              <select
  name="icon"
  value={form.icon}
  onChange={handleChange}
  className="
    w-full
    border
    border-gray-300
    rounded-xl
    px-4
    py-3
  "
>

  {/* EDUCATION */}
  <option value="library">Library</option>
  <option value="computer">Computer Lab</option>
  <option value="smartclass">Smart Class</option>
  <option value="classroom">Classroom</option>
  <option value="laboratory">Laboratory</option>
  <option value="science">Science Lab</option>
  <option value="exam">Exam Hall</option>
  <option value="digital">Digital Learning</option>

  {/* INTERNET & TECH */}
  <option value="wifi">WiFi</option>
  <option value="internet">Internet</option>
  <option value="cctv">CCTV</option>
  <option value="projector">Projector</option>
  <option value="ai">AI Lab</option>

  {/* TRANSPORT */}
  <option value="transport">Transport</option>
  <option value="bus">School Bus</option>
  <option value="parking">Parking</option>

  {/* SAFETY */}
  <option value="security">Security</option>
  <option value="medical">Medical Room</option>
  <option value="firstaid">First Aid</option>
  <option value="fire">Fire Safety</option>

  {/* HOSTEL & CAMPUS */}
  <option value="hostel">Hostel</option>
  <option value="campus">Campus</option>
  <option value="playground">Playground</option>
  <option value="garden">Garden</option>
  <option value="cafeteria">Cafeteria</option>
  <option value="canteen">Canteen</option>

  {/* SPORTS */}
  <option value="sports">Sports</option>
  <option value="cricket">Cricket</option>
  <option value="football">Football</option>
  <option value="basketball">Basketball</option>
  <option value="gym">Gym</option>
  <option value="yoga">Yoga</option>

  {/* CULTURAL */}
  <option value="music">Music Room</option>
  <option value="dance">Dance Room</option>
  <option value="art">Art Room</option>
  <option value="auditorium">Auditorium</option>

</select>

            <Input
              type="number"
              label="Total Count"
              name="totalCount"
              value={
                form.totalCount
              }
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

            <div className="flex items-center justify-between">

              <Typography className="font-medium">
                Active
              </Typography>

              <Switch
                checked={
                  form.active
                }
                onChange={() =>
                  setForm({
                    ...form,
                    active:
                      !form.active,
                  })
                }
              />

            </div>

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
              loading
            }
            onClick={
              saveFacility
            }
          >

            {loading
              ? "Saving..."
              : editingId
              ? "Update"
              : "Save"}

          </Button>

        </DialogFooter>

      </Dialog>

    </div>
  );
}

export default OurFacilities;