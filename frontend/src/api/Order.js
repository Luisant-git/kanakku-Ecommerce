const apiUrl = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    "authorization": `Bearer ${token}`,
  };
};

const createOrderApi = async (orderData) => {
  try {
    const response = await fetch(`${apiUrl}/orders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return response.json();
  } catch (error) {
    console.error("Error creating order:", error);
  }
};

const getOrdersByUserApi = async () => {
  try {
    const response = await fetch(`${apiUrl}/orders/user`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return response.json();
  } catch (error) {
    console.error("Error getting orders:", error);
  }
};

export { createOrderApi, getOrdersByUserApi}