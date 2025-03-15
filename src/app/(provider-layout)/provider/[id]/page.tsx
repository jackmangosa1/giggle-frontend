"use client";
import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Card, Select, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiFillDollarCircle,
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineCheckCircle,
  AiOutlineMessage,
} from "react-icons/ai";
import apiRoutes from "@/app/config/apiRoutes";
import { useRouter } from "next/navigation";

enum BookingStatus {
  Pending,
  Approved,
  Rejected,
  Completed,
  Confirmed,
}

interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

const StatusMap = {
  [BookingStatus.Pending]: "Pending",
  [BookingStatus.Approved]: "Approved",
  [BookingStatus.Rejected]: "Rejected",
  [BookingStatus.Completed]: "Completed",
  [BookingStatus.Confirmed]: "Confirmed",
} as const;

interface Booking {
  bookingId: number;
  customerName: string;
  customerId: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  paymentStatus: string;
  bookingStatus: string | BookingStatus;
}

const getBookingStatusEnum = (
  status: string | BookingStatus
): BookingStatus => {
  if (typeof status === "number") {
    return status;
  }
  return BookingStatus[status as keyof typeof BookingStatus];
};

const userId =
  typeof window !== "undefined"
    ? localStorage.getItem("userId") || sessionStorage.getItem("userId")
    : null;

const Page: React.FC = () => {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<string>("6m");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingBookingId, setUpdatingBookingId] = useState<number | null>(
    null
  );

  const [dashboardData, setDashboardData] = useState<{
    totalRevenue: number;
    totalBookings: number;
    revenueGrowthPercentage: number;
    monthlyData: RevenueData[];
  } | null>(null);

  useEffect(() => {
    fetchDashboardData();
    fetchBookings();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(apiRoutes.getProviderStatistics);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const transformedData = {
        ...data,
        monthlyData: data.revenueData.map((item: RevenueData) => ({
          date: item.date,
          revenue: item.revenue,
          bookings: item.bookings,
        })),
      };

      setDashboardData(transformedData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      message.error("Failed to fetch dashboard data");
    }
  };

  const getFilteredData = () => {
    if (!dashboardData?.monthlyData) return [];

    const currentDate = new Date();
    const monthsToShow =
      timeRange === "1m"
        ? 1
        : timeRange === "3m"
        ? 3
        : timeRange === "6m"
        ? 6
        : 12;

    return dashboardData.monthlyData.slice(-monthsToShow);
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(apiRoutes.getAllBookings);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setBookings(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    bookingId: number,
    newStatus: BookingStatus
  ) => {
    try {
      setUpdatingBookingId(bookingId);
      const response = await fetch(
        `${apiRoutes.updateBookingStatus}/${bookingId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStatus),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update booking status");
      }

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingId === bookingId
            ? { ...booking, bookingStatus: StatusMap[newStatus] }
            : booking
        )
      );

      message.success(`Booking status updated to ${StatusMap[newStatus]}`);
      await fetchBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
      message.error(
        error instanceof Error
          ? error.message
          : "Failed to update booking status"
      );
      await fetchBookings();
    } finally {
      setUpdatingBookingId(null);
    }
  };

  type BadgeStatus = "processing" | "success" | "error" | "default" | "warning";
  const getBadgeStatus = (status: BookingStatus): BadgeStatus => {
    switch (status) {
      case BookingStatus.Pending:
        return "processing";
      case BookingStatus.Approved:
        return "success";
      case BookingStatus.Rejected:
        return "error";
      case BookingStatus.Completed:
        return "success";
      case BookingStatus.Confirmed:
        return "processing";
      default:
        return "default";
    }
  };

  const renderStatusActions = (booking: Booking) => {
    const { bookingId, bookingStatus } = booking;
    const isUpdating = updatingBookingId === bookingId;

    const enumStatus = getBookingStatusEnum(bookingStatus);

    switch (StatusMap[enumStatus]) {
      case StatusMap[BookingStatus.Pending]:
        return (
          <div className="flex gap-2">
            <Button
              type="primary"
              icon={<AiOutlineCheck />}
              onClick={() =>
                handleStatusChange(bookingId, BookingStatus.Approved)
              }
              loading={isUpdating}
              disabled={isUpdating}
            >
              Approve
            </Button>
            <Button
              type="default"
              danger
              icon={<AiOutlineClose />}
              onClick={() =>
                handleStatusChange(bookingId, BookingStatus.Rejected)
              }
              loading={isUpdating}
              disabled={isUpdating}
            >
              Reject
            </Button>
            <Button
              type="link"
              icon={<AiOutlineMessage />}
              onClick={() =>
                router.push(
                  `/provider/${userId}/messages/chat/${booking.customerId}`
                )
              }
            >
              Chat
            </Button>
          </div>
        );
      case StatusMap[BookingStatus.Approved]:
        return (
          <Button
            type="primary"
            icon={<AiOutlineCheckCircle />}
            onClick={() =>
              handleStatusChange(bookingId, BookingStatus.Completed)
            }
            loading={isUpdating}
            disabled={isUpdating}
          >
            Complete
          </Button>
        );
      case StatusMap[BookingStatus.Confirmed]:
        return (
          <Button
            type="dashed"
            onClick={() =>
              router.push(`/provider/${bookingId}/create/portfolio`)
            }
          >
            Create Portfolio
          </Button>
        );
      default:
        return null;
    }
  };

  const columns: ColumnsType<Booking> = [
    {
      title: "ID",
      dataIndex: "bookingId",
      key: "bookingId",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
      onHeaderCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      width: "250px",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
      onHeaderCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
    },
    {
      title: "Service",
      dataIndex: "serviceName",
      key: "serviceName",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
      onHeaderCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toLocaleString()}`,
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
      onHeaderCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
      onHeaderCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
      onHeaderCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
      onHeaderCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
      render: (status: string) => (
        <Badge
          status={status === "Pending" ? "processing" : "success"}
          text={status}
        />
      ),
    },
    {
      title: "Booking Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
      onHeaderCell: () => ({
        style: {
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }),
      render: (status: string | BookingStatus) => {
        const enumStatus = getBookingStatusEnum(status);
        return (
          <Badge
            status={getBadgeStatus(enumStatus)}
            text={StatusMap[enumStatus]}
            className={
              enumStatus === BookingStatus.Approved
                ? "text-green-600"
                : enumStatus === BookingStatus.Rejected
                ? "text-red-600"
                : ""
            }
          />
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: Booking) => renderStatusActions(record),
    },
  ];

  return (
    <div className="p-6 w-full max-w-5xl mx-auto flex-1 ml-16 md:ml-96">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold">
                ${dashboardData?.totalRevenue.toLocaleString() || 0}
              </h3>
            </div>
            <AiFillDollarCircle className="text-4xl text-blue-500" />
          </div>
        </Card>
        <Card className="shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <h3 className="text-2xl font-bold">
                {" "}
                {dashboardData?.totalBookings.toLocaleString() || 0}
              </h3>
            </div>
            <div className="text-green-500">
              <AiOutlineArrowUp className="text-4xl" />
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center">
            {dashboardData?.revenueGrowthPercentage &&
            dashboardData?.revenueGrowthPercentage >= 0 ? (
              <AiOutlineArrowUp className="text-4xl text-green-500" />
            ) : (
              <AiOutlineArrowDown className="text-4xl text-red-500" />
            )}
            <div className="ml-4">
              <p className="text-sm text-gray-500">Revenue Growth</p>
              <h2
                className={`text-2xl font-bold ${
                  dashboardData?.revenueGrowthPercentage &&
                  dashboardData?.revenueGrowthPercentage >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {dashboardData?.revenueGrowthPercentage || 0}%
              </h2>
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="Revenue Overview"
        extra={
          <Select
            defaultValue="6m"
            onChange={setTimeRange}
            options={[
              { value: "1m", label: "Last Month" },
              { value: "3m", label: "Last 3 Months" },
              { value: "6m", label: "Last 6 Months" },
              { value: "1y", label: "Last Year" },
            ]}
          />
        }
        className="mb-6 shadow-md"
      >
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getFilteredData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                name="Revenue ($)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bookings"
                stroke="#82ca9d"
                name="Bookings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Recent Bookings" className="shadow-md">
        {error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <Table
            columns={columns}
            dataSource={bookings}
            rowKey="bookingId"
            pagination={{
              pageSize: 5,
              size: "small",
              showSizeChanger: false,
            }}
            loading={loading}
            className="border rounded-lg overflow-hidden"
            size="middle"
          />
        )}
      </Card>
    </div>
  );
};

export default Page;
