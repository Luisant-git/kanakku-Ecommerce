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

const getOrderByIdApi = async (orderId) => {
  try {
    const response = await fetch(`${apiUrl}/orders/${orderId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return response.json();
  } catch (error) {
    console.error("Error getting order:", error);
  }
};

const updateOrderApi = async (orderId, orderData) => {
  try {
    const response = await fetch(`${apiUrl}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};


export { getAllOrderApi , getOrderByIdApi, updateOrderApi , getAuthHeaders}