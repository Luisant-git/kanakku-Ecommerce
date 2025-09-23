const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const recordDemoDownloadApi = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/demo`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId }),
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

export const getDemoDownloadsApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/demo`, {
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