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
} from "react-icons/ai";
import apiRoutes from "@/app/config/apiRoutes";

enum BookingStatus {
  Pending,
  Approved,
  Rejected,
  Completed,
  Confirmed,
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
  serviceName: string;
  price: number;
  date: string;
  time: string;
  paymentStatus: string;
  bookingStatus: string | BookingStatus;
}

interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

const revenueData: RevenueData[] = [
  { date: "2024-01", revenue: 4000, bookings: 24 },
  { date: "2024-02", revenue: 5500, bookings: 32 },
  { date: "2024-03", revenue: 4800, bookings: 28 },
  { date: "2024-04", revenue: 6000, bookings: 35 },
  { date: "2024-05", revenue: 5200, bookings: 30 },
  { date: "2024-06", revenue: 7000, bookings: 40 },
];

const getBookingStatusEnum = (
  status: string | BookingStatus
): BookingStatus => {
  if (typeof status === "number") {
    return status;
  }
  return BookingStatus[status as keyof typeof BookingStatus];
};

const Page: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("6m");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingBookingId, setUpdatingBookingId] = useState<number | null>(
    null
  );

  useEffect(() => {
    fetchBookings();
  }, []);

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
              className="bg-green-500 hover:bg-green-600"
            >
              Approve
            </Button>
            <Button
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
            className="bg-green-500 hover:bg-green-600"
          >
            Complete
          </Button>
        );
      case StatusMap[BookingStatus.Rejected]:
        return null;
      default:
        return null;
    }
  };

  const columns: ColumnsType<Booking> = [
    {
      title: "ID",
      dataIndex: "bookingId",
      key: "bookingId",
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Service",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "100px",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
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
      render: (_, record) => renderStatusActions(record),
    },
  ];

  const totalRevenue = revenueData.reduce((sum, data) => sum + data.revenue, 0);
  const totalBookings = revenueData.reduce(
    (sum, data) => sum + data.bookings,
    0
  );
  const lastMonthRevenue = revenueData[revenueData.length - 1].revenue;
  const previousMonthRevenue = revenueData[revenueData.length - 2].revenue;
  const revenueGrowth =
    ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

  return (
    <div className="p-6 w-full max-w-4xl mx-auto flex-1 ml-16 md:ml-96">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold">
                ${totalRevenue.toLocaleString()}
              </h3>
            </div>
            <AiFillDollarCircle className="text-4xl text-blue-500" />
          </div>
        </Card>
        <Card className="shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Bookings</p>
              <h3 className="text-2xl font-bold">{totalBookings}</h3>
            </div>
            <div className="text-green-500">
              <AiOutlineArrowUp className="text-4xl" />
            </div>
          </div>
        </Card>
        <Card className="shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Revenue Growth</p>
              <h3 className="text-2xl font-bold">
                {revenueGrowth.toFixed(1)}%
                {revenueGrowth >= 0 ? (
                  <AiOutlineArrowUp className="inline ml-2 text-green-500" />
                ) : (
                  <AiOutlineArrowDown className="inline ml-2 text-red-500" />
                )}
              </h3>
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
            <LineChart data={revenueData}>
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
