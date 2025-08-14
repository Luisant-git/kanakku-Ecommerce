const apiUrl = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    "authorization": `Bearer ${token}`,
  };
};

const addToCartApi = async (productData) => {
  try {
    const response = await fetch(`${apiUrl}/cart/add`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return response.json();
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

const getCartApi = async () => {
  try {
    const response = await fetch(`${apiUrl}/cart`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return response.json();
  } catch (error) {
    console.error("Error getting cart:", error);
  }
};

const removeFromCartApi = async (productId) => {
  try {
    const response = await fetch(`${apiUrl}/cart/remove/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.json();
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};

const getCartCountApi = async () => {
  try {
    const response = await fetch(`${apiUrl}/cart/count`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return response.json();
  } catch (error) {
    console.error("Error getting cart count:", error);
  }
};

export { addToCartApi, getCartApi, removeFromCartApi, getCartCountApi}