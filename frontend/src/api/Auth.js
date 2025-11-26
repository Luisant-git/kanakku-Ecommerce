const apiUrl = import.meta.env.VITE_API_URL;

// OTP Authentication APIs
const sendOtpApi = async (phoneData) => {
  try {
    const response = await fetch(`${apiUrl}/auth/user/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(phoneData),
    });
    return response.json();
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

const verifyOtpApi = async (otpData) => {
  try {
    const response = await fetch(`${apiUrl}/auth/user/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(otpData),
    });
    return response.json();
  } catch (error) {
    console.error("Error verifying OTP:", error);
  }
};

const otpLoginApi = async (loginData) => {
  try {
    const response = await fetch(`${apiUrl}/auth/user/otp-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    return response.json();
  } catch (error) {
    console.error("Error with OTP login:", error);
  }
};

// Keep existing registration (modified for OTP flow)
const userRegisterApi = async (userData) => {
  try {
    const response = await fetch(`${apiUrl}/auth/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

const forgotPasswordApi = async (userData) => {
  try {
    const response = await fetch(`${apiUrl}/auth/user/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.error("Error sending forgot password:", error);
  }
};

const resetPasswordApi = async (userData) => {
  try {
    const response = await fetch(`${apiUrl}/auth/user/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.error("Error resetting password:", error);
  }
};

const checkUserExistsApi = async (phoneData) => {
  try {
    const response = await fetch(`${apiUrl}/auth/user/check-exists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(phoneData),
    });
    return response.json();
  } catch (error) {
    console.error("Error checking user existence:", error);
  }
};

export { 
  sendOtpApi, 
  verifyOtpApi, 
  otpLoginApi, 
  userRegisterApi, 
  forgotPasswordApi, 
  resetPasswordApi,
  checkUserExistsApi 
}