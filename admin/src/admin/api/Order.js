const apiUrl = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    "authorization": `Bearer ${token}`,
  };
};


const getAllOrderApi = async () => {
  try {
    const response = await fetch(`${apiUrl}/orders`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return response.json();
  } catch (error) {
    console.error("Error getting orders:", error);
  }
};

export { getAllOrderApi ,getAuthHeaders}