import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Spinner,
} from "@material-tailwind/react";

import {
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  ComputerDesktopIcon,
  TruckIcon,
  BeakerIcon,
  BookOpenIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

const BASE_URL =
  "http://localhost:8080/api";

function SchoolStatistics() {

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

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [statisticsId, setStatisticsId] =
    useState(null);

  const [form, setForm] =
    useState({

      totalStudents: 0,
      boysCount: 0,
      girlsCount: 0,

      totalTeachers: 0,
      totalStaff: 0,

      totalClasses: 0,
      totalSections: 0,

      totalClassrooms: 0,
      totalLabs: 0,
      totalLibraries: 0,
      totalComputers: 0,
      totalBuses: 0,

      boardResultPercentage: 0,
      yearsOfExperience: 0,

      schoolId:
        schoolId || "",
    });

  // =====================================================
  // FETCH
  // =====================================================

  const fetchStatistics =
    async () => {

      try {

        if (!schoolId) return;

        setLoading(true);

        const res =
          await axios.get(
            `${BASE_URL}/statistics/school/${schoolId}`
          );

        if (res.data) {

          setStatisticsId(
            res.data.id
          );

          setForm({

            totalStudents:
              res.data.totalStudents || 0,

            boysCount:
              res.data.boysCount || 0,

            girlsCount:
              res.data.girlsCount || 0,

            totalTeachers:
              res.data.totalTeachers || 0,

            totalStaff:
              res.data.totalStaff || 0,

            totalClasses:
              res.data.totalClasses || 0,

            totalSections:
              res.data.totalSections || 0,

            totalClassrooms:
              res.data.totalClassrooms || 0,

            totalLabs:
              res.data.totalLabs || 0,

            totalLibraries:
              res.data.totalLibraries || 0,

            totalComputers:
              res.data.totalComputers || 0,

            totalBuses:
              res.data.totalBuses || 0,

            boardResultPercentage:
              res.data.boardResultPercentage || 0,

            yearsOfExperience:
              res.data.yearsOfExperience || 0,

            schoolId:
              schoolId,
          });
        }

      } catch (err) {

        console.log(err);
      } finally {

        setLoading(false);
      }
    };

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {

    fetchStatistics();

  }, [schoolId]);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange =
    (e) => {

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
  // SAVE
  // =====================================================

  const saveStatistics =
    async () => {

      try {

        setSaving(true);

        const payload = {

          ...form,

          schoolId:
            Number(schoolId),

          totalStudents:
            Number(form.totalStudents),

          boysCount:
            Number(form.boysCount),

          girlsCount:
            Number(form.girlsCount),

          totalTeachers:
            Number(form.totalTeachers),

          totalStaff:
            Number(form.totalStaff),

          totalClasses:
            Number(form.totalClasses),

          totalSections:
            Number(form.totalSections),

          totalClassrooms:
            Number(form.totalClassrooms),

          totalLabs:
            Number(form.totalLabs),

          totalLibraries:
            Number(form.totalLibraries),

          totalComputers:
            Number(form.totalComputers),

          totalBuses:
            Number(form.totalBuses),

          boardResultPercentage:
            Number(
              form.boardResultPercentage
            ),

          yearsOfExperience:
            Number(
              form.yearsOfExperience
            ),
        };

        if (statisticsId) {

          await axios.put(
            `${BASE_URL}/statistics/${statisticsId}`,
            payload
          );

          alert(
            "Statistics Updated Successfully"
          );

        } else {

          const res =
            await axios.post(
              `${BASE_URL}/statistics`,
              payload
            );

          setStatisticsId(
            res.data.id
          );

          alert(
            "Statistics Added Successfully"
          );
        }

      } catch (err) {

        console.log(err);

        alert(
          "Failed To Save Statistics"
        );

      } finally {

        setSaving(false);
      }
    };

  // =====================================================
  // CARD
  // =====================================================

  const StatCard = ({
    title,
    icon,
    children,
  }) => (

    <Card
      className="
        rounded-3xl
        shadow-lg
        border
      "
    >

      <CardBody>

        <div
          className="
            flex
            items-center
            gap-3
            mb-5
          "
        >

          <div
            className="
              p-3
              rounded-2xl
              bg-blue-100
            "
          >
            {icon}
          </div>

          <Typography
            variant="h5"
            className="font-bold"
          >
            {title}
          </Typography>

        </div>

        <div className="space-y-4">
          {children}
        </div>

      </CardBody>

    </Card>
  );

  // =====================================================
  // UI
  // =====================================================

  if (loading) {

    return (

      <div
        className="
          h-screen
          flex
          items-center
          justify-center
        "
      >
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

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
            School Statistics
          </Typography>

          <Typography
            className="
              text-gray-600
              mt-2
            "
          >
            Manage complete school
            statistics & overview
          </Typography>

        </div>

        <Button
          color="blue"
          size="lg"
          onClick={saveStatistics}
          disabled={saving}
          className="
            rounded-2xl
            flex
            items-center
            gap-2
          "
        >

          <PencilSquareIcon className="h-5 w-5" />

          {saving
            ? "Saving..."
            : "Save Statistics"}

        </Button>

      </div>

      {/* GRID */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-6
        "
      >

        {/* STUDENTS */}

        <StatCard
          title="Students"
          icon={
            <UserGroupIcon
              className="
                h-7
                w-7
                text-blue-700
              "
            />
          }
        >

          <Input
            type="number"
            label="Total Students"
            name="totalStudents"
            value={
              form.totalStudents
            }
            onChange={
              handleChange
            }
          />

          <Input
            type="number"
            label="Boys Count"
            name="boysCount"
            value={
              form.boysCount
            }
            onChange={
              handleChange
            }
          />

          <Input
            type="number"
            label="Girls Count"
            name="girlsCount"
            value={
              form.girlsCount
            }
            onChange={
              handleChange
            }
          />

        </StatCard>

        {/* STAFF */}

        <StatCard
          title="Teachers & Staff"
          icon={
            <AcademicCapIcon
              className="
                h-7
                w-7
                text-blue-700
              "
            />
          }
        >

          <Input
            type="number"
            label="Total Teachers"
            name="totalTeachers"
            value={
              form.totalTeachers
            }
            onChange={
              handleChange
            }
          />

          <Input
            type="number"
            label="Total Staff"
            name="totalStaff"
            value={
              form.totalStaff
            }
            onChange={
              handleChange
            }
          />

        </StatCard>

        {/* CLASSES */}

        <StatCard
          title="Classes & Sections"
          icon={
            <BuildingOffice2Icon
              className="
                h-7
                w-7
                text-blue-700
              "
            />
          }
        >

          <Input
            type="number"
            label="Total Classes"
            name="totalClasses"
            value={
              form.totalClasses
            }
            onChange={
              handleChange
            }
          />

          <Input
            type="number"
            label="Total Sections"
            name="totalSections"
            value={
              form.totalSections
            }
            onChange={
              handleChange
            }
          />

          <Input
            type="number"
            label="Total Classrooms"
            name="totalClassrooms"
            value={
              form.totalClassrooms
            }
            onChange={
              handleChange
            }
          />

        </StatCard>

        {/* FACILITIES */}

        <StatCard
          title="Facilities"
          icon={
            <ComputerDesktopIcon
              className="
                h-7
                w-7
                text-blue-700
              "
            />
          }
        >

          <Input
            type="number"
            label="Total Labs"
            name="totalLabs"
            value={
              form.totalLabs
            }
            onChange={
              handleChange
            }
          />

          <Input
            type="number"
            label="Total Libraries"
            name="totalLibraries"
            value={
              form.totalLibraries
            }
            onChange={
              handleChange
            }
          />

          <Input
            type="number"
            label="Total Computers"
            name="totalComputers"
            value={
              form.totalComputers
            }
            onChange={
              handleChange
            }
          />

          <Input
            type="number"
            label="Total Buses"
            name="totalBuses"
            value={
              form.totalBuses
            }
            onChange={
              handleChange
            }
          />

        </StatCard>

        {/* PERFORMANCE */}

        <StatCard
          title="Performance"
          icon={
            <BookOpenIcon
              className="
                h-7
                w-7
                text-blue-700
              "
            />
          }
        >

          <Input
            type="number"
            label="Board Result %"
            name="boardResultPercentage"
            value={
              form.boardResultPercentage
            }
            onChange={
              handleChange
            }
          />

          <Input
            type="number"
            label="Years Of Experience"
            name="yearsOfExperience"
            value={
              form.yearsOfExperience
            }
            onChange={
              handleChange
            }
          />

        </StatCard>

        {/* QUICK OVERVIEW */}

        <Card
          className="
            rounded-3xl
            shadow-lg
            bg-gradient-to-br
            from-blue-600
            to-indigo-700
            text-white
          "
        >

          <CardBody>

            <Typography
              variant="h4"
              className="
                font-black
                mb-6
              "
            >
              School Overview
            </Typography>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>Total Students</span>
                <strong>
                  {
                    form.totalStudents
                  }
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Total Teachers</span>
                <strong>
                  {
                    form.totalTeachers
                  }
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Total Classes</span>
                <strong>
                  {
                    form.totalClasses
                  }
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Total Labs</span>
                <strong>
                  {form.totalLabs}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Total Libraries</span>
                <strong>
                  {
                    form.totalLibraries
                  }
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Total Computers</span>
                <strong>
                  {
                    form.totalComputers
                  }
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Board Result</span>
                <strong>
                  {
                    form.boardResultPercentage
                  }%
                </strong>
              </div>

            </div>

          </CardBody>

        </Card>

      </div>

    </div>
  );
}

export default SchoolStatistics;