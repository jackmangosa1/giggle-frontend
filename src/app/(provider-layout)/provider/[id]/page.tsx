"use client";
import React, { useState } from "react";
import { Table, Button, Badge, Card, Select } from "antd";
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
} from "react-icons/ai";

// Types
interface Booking {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  price: number;
  status: "pending" | "approved" | "rejected";
}

interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

// Sample Data
const revenueData: RevenueData[] = [
  { date: "2024-01", revenue: 4000, bookings: 24 },
  { date: "2024-02", revenue: 5500, bookings: 32 },
  { date: "2024-03", revenue: 4800, bookings: 28 },
  { date: "2024-04", revenue: 6000, bookings: 35 },
  { date: "2024-05", revenue: 5200, bookings: 30 },
  { date: "2024-06", revenue: 7000, bookings: 40 },
];

const bookingsData: Booking[] = [
  {
    id: "1",
    customerName: "John Doe",
    service: "Hair Cut",
    date: "2024-03-15",
    time: "10:00 AM",
    price: 50,
    status: "pending",
  },
  // Add more sample bookings as needed
];

const Page: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("6m");
  const [bookings, setBookings] = useState<Booking[]>(bookingsData);

  // Handle booking status change
  const handleStatusChange = (
    bookingId: string,
    newStatus: "approved" | "rejected"
  ) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      )
    );
  };

  // Table columns configuration
  const columns: ColumnsType<Booking> = [
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge
          status={
            status === "pending"
              ? "processing"
              : status === "approved"
              ? "success"
              : "error"
          }
          text={status.charAt(0).toUpperCase() + status.slice(1)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        record.status === "pending" ? (
          <div className="flex gap-2">
            <Button
              type="primary"
              icon={<AiOutlineCheck />}
              className="bg-green-500 hover:bg-green-600"
              onClick={() => handleStatusChange(record.id, "approved")}
            >
              Approve
            </Button>
            <Button
              danger
              icon={<AiOutlineClose />}
              onClick={() => handleStatusChange(record.id, "rejected")}
            >
              Reject
            </Button>
          </div>
        ) : null,
    },
  ];

  // Calculate summary statistics
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
      {/* Summary Cards */}
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
            <div className="text-green-500 flex items-center">
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

      {/* Revenue Graph */}
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

      {/* Bookings Table */}
      <Card title="Recent Bookings" className="shadow-md">
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default Page;
