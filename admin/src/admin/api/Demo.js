const API_BASE_URL = "http://localhost:4010";

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const getAllDemoDownloadsApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/demo/all`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    throw error.message || error;
  }
};