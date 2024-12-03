const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const userId =
  localStorage.getItem("userId") || sessionStorage.getItem("userId");

const apiRoutes = {
  signupCustomer: `${API_BASE_URL}/api/auth/RegisterCustomer`,
  signupProvider: `${API_BASE_URL}/api/auth/RegisterProvider`,
  login: `${API_BASE_URL}/api/auth/login`,
  forgotPassword: `${API_BASE_URL}/api/auth/ForgotPassword`,
  resetPassword: `${API_BASE_URL}/api/auth/ResetPassword`,
  createService: `${API_BASE_URL}/api/providers/${userId}/services`,
  getProviderProfile: `${API_BASE_URL}/api/providers/profile/${userId}`,
};

export default apiRoutes;
