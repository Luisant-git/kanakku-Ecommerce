const apiUrl = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    "authorization": `Bearer ${token}`,
  };
};

const calculatePriceApi = async (productId, versionId) => {
  try {
    const response = await fetch(`${apiUrl}/orders/calculate-price`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, versionId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to calculate price');
    }
    return data;
  } catch (error) {
    console.error("Error calculating price:", error);
    throw error;
  }
};

const createDirectOrderApi = async (orderData) => {
  try {
    const response = await fetch(`${apiUrl}/orders`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order');
    }
    return data;
  } catch (error) {
    console.error("Error creating direct order:", error);
    throw error;
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

export { calculatePriceApi, createDirectOrderApi, getOrdersByUserApi}