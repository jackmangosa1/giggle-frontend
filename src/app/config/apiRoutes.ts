const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const userId =
  typeof window !== "undefined"
    ? localStorage.getItem("userId") || sessionStorage.getItem("userId")
    : null;

const apiRoutes = {
  signupCustomer: `${API_BASE_URL}/api/auth/RegisterCustomer`,
  signupProvider: `${API_BASE_URL}/api/auth/RegisterProvider`,
  login: `${API_BASE_URL}/api/auth/login`,
  forgotPassword: `${API_BASE_URL}/api/auth/ForgotPassword`,
  resetPassword: `${API_BASE_URL}/api/auth/ResetPassword`,
  createService: `${API_BASE_URL}/api/providers/${userId}/services`,
  updateService: `${API_BASE_URL}/api/providers/${userId}/services`,
  deleteService: `${API_BASE_URL}/api/providers/${userId}/services`,
  getProviderProfile: `${API_BASE_URL}/api/providers/profile/${userId}`,
  getPublicProviderProfile: `${API_BASE_URL}/api/providers/profile`,
  updateProviderProfile: `${API_BASE_URL}/api/providers/profile/${userId}`,
  getService: `${API_BASE_URL}/api/providers/services`,
  getServiceCategories: `${API_BASE_URL}/api/providers/services/categories`,
  getSkills: `${API_BASE_URL}/api/providers/services/skills`,
  getProviders: `${API_BASE_URL}/api/customers/search-providers`,
  createBooking: `${API_BASE_URL}/api/customers/bookings`,
  getAllBookings: `${API_BASE_URL}/api/providers/bookings/${userId}`,
  updateBookingStatus: `${API_BASE_URL}/api/providers/bookings`,
  notificationHub: `${API_BASE_URL}/notificationHub`,
  getNotifications: `${API_BASE_URL}/api/customers/notifications/${userId}`,
  getCustomerProfile: `${API_BASE_URL}/api/customers/profile/${userId}`,
  updateCustomerProfile: `${API_BASE_URL}/api/customers/profile/${userId}`,
  savePayment: `${API_BASE_URL}/api/customers/payments`,
  confirmBooking: `${API_BASE_URL}/api/customers/bookings`,
  getProviderStatistics: `${API_BASE_URL}/api/providers/${userId}/statistics`,
  addCompletedService: `${API_BASE_URL}/api/providers/completed-services`,
  getAllCompletedServices: `${API_BASE_URL}/api/providers/completed-services/${userId}`,
  deleteCompletedService: `${API_BASE_URL}/api/providers/completed-services`,
  updateCompletedService: `${API_BASE_URL}/api/providers/completed-services`,
  getCompletedService: `${API_BASE_URL}/api/providers/completed-service`,
  createReview: `${API_BASE_URL}/api/customers/reviews`,
  updateReview: `${API_BASE_URL}/api/customers/reviews`,
  getReview: `${API_BASE_URL}/api/customers/reviews`,
  deleteReview: `${API_BASE_URL}/api/customers/reviews`,
};

export default apiRoutes;
