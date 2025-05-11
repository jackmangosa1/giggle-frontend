"use client";
import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Badge, Card, Select, message, Empty } from "antd";
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
  AiOutlineInbox,
  AiOutlineFilePdf,
  AiOutlineDownload,
} from "react-icons/ai";
import apiRoutes from "@/app/config/apiRoutes";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const [updatingBookingId, setUpdatingBookingId] = useState<number | null>(
    null
  );
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const getFilteredData = () => {
    if (!dashboardData?.monthlyData || dashboardData.monthlyData.length === 0)
      return [];

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

  const hasChartData = () => {
    const data = getFilteredData();
    return data && data.length > 0;
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiRoutes.getAllBookings);

      if (response.status === 404) {
        setBookings([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Only show an error message for actual errors, not empty bookings
      if (!(error instanceof Error && error.message.includes("404"))) {
        message.error("Failed to fetch bookings");
      }
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

  const renderEmptyBookingState = () => (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <div className="flex flex-col items-center">
          <p className="text-base font-medium text-gray-500 mb-1">
            No Bookings Yet
          </p>
          <p className="text-sm text-gray-400 text-center max-w-md mb-4">
            You don't have any bookings yet. When customers book your services,
            they will appear here.
          </p>
        </div>
      }
    />
  );

  const renderNoDataState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <AiOutlineInbox className="text-5xl text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-500 mb-2">
        No Data Available
      </h3>
      <p className="text-gray-400 text-center max-w-md">
        Your dashboard is currently empty. As you receive bookings and complete
        services, your revenue data will appear here.
      </p>
    </div>
  );

  const getReportTimeRangeName = () => {
    switch (timeRange) {
      case "1m":
        return "Monthly";
      case "3m":
        return "Quarterly";
      case "6m":
        return "Bi-Annual";
      case "1y":
        return "Annual";
      default:
        return "Custom";
    }
  };

  const generatePdfReport = async () => {
    if (!dashboardRef.current) return;

    try {
      setGeneratingPdf(true);
      message.loading({ content: "Preparing PDF report...", key: "pdfGen" });

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const reportTitle = `${getReportTimeRangeName()} Service Provider Report`;
      const date = new Date().toLocaleDateString();
      pdf.setFontSize(20);
      pdf.text(reportTitle, pageWidth / 2, 15, { align: "center" });
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${date}`, pageWidth / 2, 22, { align: "center" });

      pdf.setFontSize(16);
      pdf.text("Summary Statistics", 15, 35);
      pdf.setFontSize(12);
      pdf.text(
        `Total Revenue: $${dashboardData?.totalRevenue.toLocaleString() || 0}`,
        20,
        45
      );
      pdf.text(
        `Total Bookings: ${dashboardData?.totalBookings.toLocaleString() || 0}`,
        20,
        52
      );
      pdf.text(
        `Revenue Growth: ${dashboardData?.revenueGrowthPercentage || 0}%`,
        20,
        59
      );

      const chartElement = dashboardRef.current.querySelector(
        ".revenue-chart-container"
      );
      if (chartElement) {
        pdf.setFontSize(16);
        pdf.text("Revenue Overview", 15, 75);

        const chartCanvas = await html2canvas(chartElement as HTMLElement, {
          scale: 2,
          logging: false,
          useCORS: true,
        });

        const chartImgData = chartCanvas.toDataURL("image/png");
        const chartImgWidth = 180;
        const chartImgHeight =
          (chartCanvas.height * chartImgWidth) / chartCanvas.width;

        pdf.addImage(
          chartImgData,
          "PNG",
          15,
          80,
          chartImgWidth,
          chartImgHeight
        );

        let yPosition = 80 + chartImgHeight + 15;

        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(16);
        pdf.text("Recent Bookings", 15, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setTextColor(100);
        const tableHeaders = [
          "ID",
          "Customer",
          "Service",
          "Price",
          "Date",
          "Status",
        ];
        const colWidths = [15, 50, 50, 20, 30, 25];
        let xPosition = 15;

        tableHeaders.forEach((header, i) => {
          pdf.text(header, xPosition, yPosition);
          xPosition += colWidths[i];
        });

        yPosition += 6;
        pdf.setDrawColor(200);
        pdf.line(15, yPosition - 3, 190, yPosition - 3);

        pdf.setTextColor(0);
        const bookingsToShow = bookings.slice(0, 10); 

        bookingsToShow.forEach((booking, index) => {
          if (yPosition > pageHeight - 10) {
            pdf.addPage();
            yPosition = 20;

            xPosition = 15;
            tableHeaders.forEach((header, i) => {
              pdf.text(header, xPosition, yPosition);
              xPosition += colWidths[i];
            });
            yPosition += 6;
            pdf.line(15, yPosition - 3, 190, yPosition - 3);
          }

          xPosition = 15;
          pdf.text(booking.bookingId.toString(), xPosition, yPosition);
          xPosition += colWidths[0];

          const truncate = (text: string, maxLength: number) => {
            return text.length > maxLength
              ? text.substring(0, maxLength) + "..."
              : text;
          };

          pdf.text(truncate(booking.customerName, 20), xPosition, yPosition);
          xPosition += colWidths[1];

          pdf.text(truncate(booking.serviceName, 20), xPosition, yPosition);
          xPosition += colWidths[2];

          pdf.text(`$${booking.price}`, xPosition, yPosition);
          xPosition += colWidths[3];

          pdf.text(booking.date, xPosition, yPosition);
          xPosition += colWidths[4];

          const status = StatusMap[getBookingStatusEnum(booking.bookingStatus)];
          pdf.text(status, xPosition, yPosition);

          yPosition += 7;
        });
      }

      const pageCount = (pdf as any).getNumberOfPages(); 
    
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      }

      pdf.save(
        `service-provider-${getReportTimeRangeName().toLowerCase()}-report.pdf`
      );
      message.success({
        content: "PDF report generated successfully!",
        key: "pdfGen",
        duration: 3,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      message.error({
        content: "Failed to generate PDF report",
        key: "pdfGen",
        duration: 3,
      });
    } finally {
      setGeneratingPdf(false);
    }
  };

  const timeRangeOptions = [
    { value: "1m", label: "Last Month" },
    { value: "3m", label: "Last 3 Months" },
    { value: "6m", label: "Last 6 Months" },
    { value: "1y", label: "Last Year" },
  ];

  return (
    <div
      className="p-6 w-full max-w-5xl mx-auto flex-1 ml-16 md:ml-96"
      ref={dashboardRef}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <Select
            value={timeRange}
            onChange={setTimeRange}
            options={timeRangeOptions}
            style={{ width: 150 }}
          />
          <Button
            type="primary"
            icon={<AiOutlineFilePdf />}
            onClick={generatePdfReport}
            loading={generatingPdf}
            className="flex items-center"
          >
            Export {getReportTimeRangeName()} Report
          </Button>
        </div>
      </div>

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
                {dashboardData?.totalBookings.toLocaleString() || 0}
              </h3>
            </div>
            <div className="text-green-500">
              <AiOutlineArrowUp className="text-4xl" />
            </div>
          </div>
        </Card>
        <Card className="shadow-md">
          <div className="flex items-center">
            {dashboardData?.revenueGrowthPercentage !== undefined && (
              <>
                {dashboardData.revenueGrowthPercentage >= 0 ? (
                  <AiOutlineArrowUp className="text-4xl text-green-500" />
                ) : (
                  <AiOutlineArrowDown className="text-4xl text-red-500" />
                )}
              </>
            )}
            <div className="ml-4">
              <p className="text-sm text-gray-500">Revenue Growth</p>
              <h2
                className={`text-2xl font-bold ${
                  dashboardData?.revenueGrowthPercentage !== undefined
                    ? dashboardData.revenueGrowthPercentage >= 0
                      ? "text-green-500"
                      : "text-red-500"
                    : "text-gray-400"
                }`}
              >
                {dashboardData?.revenueGrowthPercentage !== undefined
                  ? dashboardData.revenueGrowthPercentage
                  : 0}
                %
              </h2>
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="Revenue Overview"
        className="mb-6 shadow-md revenue-chart-container"
      >
        <div className="h-[400px]">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p>Loading chart data...</p>
            </div>
          ) : hasChartData() ? (
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
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="flex flex-col items-center">
                    <p className="text-base font-medium text-gray-500 mb-1">
                      No Revenue Data
                    </p>
                    <p className="text-sm text-gray-400 text-center max-w-md">
                      Start completing bookings to see your revenue and booking
                      trends on this chart.
                    </p>
                  </div>
                }
              />
            </div>
          )}
        </div>
      </Card>

      <Card title="Recent Bookings" className="shadow-md">
        {loading ? (
          <div className="py-8 text-center">Loading bookings...</div>
        ) : bookings.length > 0 ? (
          <Table
            columns={columns}
            dataSource={bookings}
            rowKey="bookingId"
            pagination={{
              pageSize: 5,
              size: "small",
              showSizeChanger: false,
            }}
            className="border rounded-lg overflow-hidden"
            size="middle"
          />
        ) : (
          <div className="py-8">{renderEmptyBookingState()}</div>
        )}
      </Card>
    </div>
  );
};

export default Page;
