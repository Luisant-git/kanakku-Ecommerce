const apiUrl = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    "authorization": `Bearer ${token}`,
  };
};

const getUserProfileApi = async () => {
  try {
    const response = await fetch(`${apiUrl}/auth/user/profile`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    return response.json();
  } catch (error) {
    console.error("Error getting user profile:", error);
  }
};

const updateUserProfileApi = async (data) => {
  try {
    const response = await fetch(`${apiUrl}/auth/user/profile`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
      cache: "no-store",
    });
    return response.json();
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
};

export {
    getUserProfileApi,
    updateUserProfileApi
}