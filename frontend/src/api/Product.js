const apiUrl = import.meta.env.VITE_API_URL;

const createProductApi = async (productData) => {
  try {
    const response = await fetch(`${apiUrl}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  } catch (error) {
    console.error("Error creating product:", error);
  }
};

const getAllProductsApi = async () => {
  try {
    const response = await fetch(`${apiUrl}/product`);
    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const getProductByIdApi = async (productId) => {
  try {
    const response = await fetch(`${apiUrl}/product/${productId}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching product by ID:", error);
  }
};

const updateProductApi = async (productId, productData) => {
  try {
    const response = await fetch(`${apiUrl}/product/${productId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

const deleteProductApi = async (productId) => {
  try {
    const response = await fetch(`${apiUrl}/product/${productId}`, {
      method: "DELETE",
    });
    return response.json();
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

const checkDownloadAccessApi = async (productId, userId) => {
  try {
    const response = await fetch(`${apiUrl}/product-access/${productId}/download-access?userId=${userId}`);
    return response.json();
  } catch (error) {
    console.error('Error checking download access:', error);
    return { hasAccess: false };
  }
};

const getUserRenewalDateApi = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiUrl}/product/${productId}/renewal-date`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.json();
  } catch (error) {
    console.error('Error getting renewal date:', error);
    return { nextRenewalDate: null };
  }
};

export { createProductApi, getAllProductsApi, updateProductApi, getProductByIdApi, deleteProductApi, checkDownloadAccessApi, getUserRenewalDateApi};
