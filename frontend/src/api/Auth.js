const apiUrl = import.meta.env.VITE_API_URL;

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

const userLoginApi = async (userData) => {
  try {
    const response = await fetch(`${apiUrl}/auth/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  } catch (error) {
    console.error("Error logging in:", error);
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

export { userRegisterApi, userLoginApi, forgotPasswordApi, resetPasswordApi }