const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiRoutes = {
  signupCustomer: `${API_BASE_URL}/api/auth/RegisterCustomer`,
  signupProvider: `${API_BASE_URL}/api/auth/RegisterProvider`,
  login: `${API_BASE_URL}/api/login`,
  forgotPassword: `${API_BASE_URL}/api/auth/ForgotPassword`,
  resetPassword: `${API_BASE_URL}/api/auth/ResetPassword`,
};

export default apiRoutes;
