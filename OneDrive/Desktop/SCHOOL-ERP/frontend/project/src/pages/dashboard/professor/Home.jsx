import React, { useEffect, useState } from "react";

import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
  Spinner,
} from "@material-tailwind/react";

import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

import {
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";

import axios from "axios";

export function Home() {

  const [loading, setLoading] = useState(true);

  const [statisticsCardsData, setStatisticsCardsData] = useState([]);

  const [statisticsChartsData, setStatisticsChartsData] = useState([]);

  const [projectsTableData, setProjectsTableData] = useState([]);

  const [ordersOverviewData, setOrdersOverviewData] = useState([]);

  const [overviewPercentage, setOverviewPercentage] = useState(0);

  useEffect(() => {

    fetchDashboardData();

  }, []);

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      // ================= API CALLS =================

      const [
        cardsResponse,
        chartsResponse,
        subjectsResponse,
        ordersResponse,
      ] = await Promise.all([
        axios.get("http://localhost:8080/api/dashboard/cards"),
        axios.get("http://localhost:8080/api/dashboard/charts"),
        axios.get("http://localhost:8080/api/dashboard/subjects"),
        axios.get("http://localhost:8080/api/dashboard/orders"),
      ]);

      const cardsData = cardsResponse.data || [];
      const chartsData = chartsResponse.data || [];
      const subjectsData = subjectsResponse.data || [];
      const ordersData = ordersResponse.data || [];

      // ================= CARDS =================

      const updatedCards = [
        {
          color: "gray",
          icon: BanknotesIcon,
          title: "Total Students",
          value:
            cardsData.find(
              (item) => item.title === "Total Students"
            )?.value || 0,

          footer: {
            color: "text-green-500",
            value:
              cardsData.find(
                (item) => item.title === "Total Students"
              )?.value || 0,

            label: "students available",
          },
        },

        {
          color: "gray",
          icon: UsersIcon,
          title: "Total Professors",
          value:
            cardsData.find(
              (item) => item.title === "Total Professors"
            )?.value || 0,

          footer: {
            color: "text-green-500",
            value:
              cardsData.find(
                (item) => item.title === "Total Professors"
              )?.value || 0,

            label: "teachers available",
          },
        },

        {
          color: "gray",
          icon: UserPlusIcon,
          title: "Subjects",
          value: subjectsData.length || 0,

          footer: {
            color: "text-green-500",
            value: subjectsData.length || 0,

            label: "subjects assigned",
          },
        },

        {
          color: "gray",
          icon: ChartBarIcon,
          title: "Overview",
          value: ordersData.length || 0,

          footer: {
            color: "text-green-500",
            value: ordersData.length || 0,

            label: "live records",
          },
        },
      ];

      setStatisticsCardsData(updatedCards);

      // ================= CHARTS =================

      setStatisticsChartsData(chartsData);

      // ================= SUBJECT TABLE =================

      setProjectsTableData(subjectsData);

      // ================= OVERVIEW =================

      setOrdersOverviewData(ordersData);

      // ================= OVERVIEW PERCENT =================

      const totalStudents =
        cardsData.find(
          (item) => item.title === "Total Students"
        )?.value || 0;

      setOverviewPercentage(
        totalStudents > 0 ? 100 : 0
      );

    } catch (error) {

      console.error(
        "Dashboard fetch error:",
        error
      );

      // ================= FALLBACK =================

      setStatisticsCardsData([
        {
          color: "gray",
          icon: BanknotesIcon,
          title: "Total Students",
          value: "0",

          footer: {
            color: "text-red-500",
            value: "0",
            label: "No Data",
          },
        },

        {
          color: "gray",
          icon: UsersIcon,
          title: "Total Professors",
          value: "0",

          footer: {
            color: "text-red-500",
            value: "0",
            label: "No Data",
          },
        },

        {
          color: "gray",
          icon: UserPlusIcon,
          title: "Subjects",
          value: "0",

          footer: {
            color: "text-red-500",
            value: "0",
            label: "No Data",
          },
        },

        {
          color: "gray",
          icon: ChartBarIcon,
          title: "Overview",
          value: "0",

          footer: {
            color: "text-red-500",
            value: "0",
            label: "No Data",
          },
        },
      ]);

      setStatisticsChartsData([]);

      setProjectsTableData([]);

      setOrdersOverviewData([]);

      setOverviewPercentage(0);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {

    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="mt-12">

      {/* ================= CARDS ================= */}

      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">

        {statisticsCardsData.map(
          ({ icon, title, footer, ...rest }) => (

            <StatisticsCard
              key={title}
              {...rest}
              title={title}
              icon={React.createElement(icon, {
                className: "w-6 h-6 text-white",
              })}
              footer={
                <Typography className="font-normal text-blue-gray-600">

                  <strong className={footer.color}>
                    {footer.value}
                  </strong>

                  &nbsp;

                  {footer.label}
                </Typography>
              }
            />
          )
        )}
      </div>

      {/* ================= CHARTS ================= */}

      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">

        {statisticsChartsData.map((props) => (

          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >

                <ClockIcon
                  strokeWidth={2}
                  className="h-4 w-4 text-blue-gray-400"
                />

                &nbsp;

                {props.footer}
              </Typography>
            }
          />
        ))}
      </div>

      {/* ================= MAIN SECTION ================= */}

      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ================= SUBJECT TABLE ================= */}

        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">

          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >

            <div>

              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-1"
              >
                Subjects
              </Typography>

              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >

                <CheckCircleIcon
                  strokeWidth={3}
                  className="h-4 w-4 text-blue-gray-200"
                />

                <strong>
                  {projectsTableData.length} subjects
                </strong>

                &nbsp;available
              </Typography>
            </div>

            <Menu placement="left-start">

              <MenuHandler>

                <IconButton
                  size="sm"
                  variant="text"
                  color="blue-gray"
                >

                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currentColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>

              <MenuList>
                <MenuItem>Refresh</MenuItem>
                <MenuItem>Dashboard</MenuItem>
                <MenuItem>Settings</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>

          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">

            <table className="w-full min-w-[640px] table-auto">

              <thead>

                <tr>

                  {[
                    "subject",
                    "lecturer",
                    "lecture's",
                    "completion",
                  ].map((el) => (

                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-6 text-left"
                    >

                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>

                {projectsTableData.map(
                  (
                    {
                      img,
                      name,
                      members,
                      budget,
                      completion,
                    },
                    key
                  ) => {

                    const className = `py-3 px-5 ${
                      key ===
                      projectsTableData.length - 1
                        ? ""
                        : "border-b border-blue-gray-50"
                    }`;

                    return (
                      <tr key={key}>

                        <td className={className}>

                          <div className="flex items-center gap-4">

                            <Avatar
                              src={
                                img ||
                                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                              }
                              alt={name}
                              size="sm"
                            />

                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {name}
                            </Typography>
                          </div>
                        </td>

                        <td className={className}>

                          <div className="flex items-center">

                            {members?.map(
                              ({ img, name }, index) => (

                                <Tooltip
                                  key={index}
                                  content={name}
                                >

                                  <Avatar
                                    src={
                                      img ||
                                      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                    }
                                    alt={name}
                                    size="xs"
                                    variant="circular"
                                    className={`cursor-pointer border-2 border-white ${
                                      index === 0
                                        ? ""
                                        : "-ml-2.5"
                                    }`}
                                  />
                                </Tooltip>
                              )
                            )}
                          </div>
                        </td>

                        <td className={className}>

                          <Typography
                            variant="small"
                            className="text-xs text-center font-medium text-blue-gray-600"
                          >
                            {budget}
                          </Typography>
                        </td>

                        <td className={className}>

                          <div className="w-10/12">

                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {completion}%
                            </Typography>

                            <Progress
                              value={completion}
                              variant="gradient"
                              color={
                                completion === 100
                                  ? "green"
                                  : "blue"
                              }
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>

        {/* ================= OVERVIEW ================= */}

        <Card className="border border-blue-gray-100 shadow-sm">

          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >

            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2"
            >
              ID Card Order Overview
            </Typography>

            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >

              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />

              <strong>
                {overviewPercentage}%
              </strong>

              &nbsp;live data
            </Typography>
          </CardHeader>

          <CardBody className="pt-0">

            {ordersOverviewData.length > 0 ? (
              ordersOverviewData.map(
                (
                  {
                    color,
                    title,
                    description,
                  },
                  key
                ) => (

                  <div
                    key={key}
                    className="flex items-start gap-4 py-3"
                  >

                    <div
                      className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                        key ===
                        ordersOverviewData.length - 1
                          ? "after:h-0"
                          : "after:h-4/6"
                      }`}
                    >

                      <div
                        className={`h-3 w-3 rounded-full ${color || "bg-green-500"}`}
                      />
                    </div>

                    <div>

                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-medium"
                      >
                        {title}
                      </Typography>

                      <Typography
                        as="span"
                        variant="small"
                        className="text-xs font-medium text-blue-gray-500"
                      >
                        {description}
                      </Typography>
                    </div>
                  </div>
                )
              )
            ) : (
              <Typography
                variant="small"
                className="text-blue-gray-400"
              >
                No overview data available
              </Typography>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;