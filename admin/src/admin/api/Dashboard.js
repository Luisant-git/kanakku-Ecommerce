const apiUrl = import.meta.env.VITE_API_URL;

const getTotalRevenueApi = async () => {
  const response = await fetch(`${apiUrl}/orders/total-sales`);
  const data = await response.json();
  return data;
};

const getTotalOrdersApi = async () => {
  const response = await fetch(`${apiUrl}/orders/total-orders`);
  const data = await response.json();
  return data;
};

const getTotalCustomersApi = async () => {
  const response = await fetch(`${apiUrl}/auth/customer/count`);
  const data = await response.json();
  return data;
};

const getPendingOrdersApi = async () => {
  const response = await fetch(`${apiUrl}/orders/pending-orders`);
  const data = await response.json();
  return data;
};

const getCompletedOrdersApi = async () => {
  const response = await fetch(`${apiUrl}/orders/completed-orders`);
  const data = await response.json();
  return data;
};

const getCancelledOrdersApi = async () => {
  const response = await fetch(`${apiUrl}/orders/cancelled-orders`);
  const data = await response.json();
  return data;
};

export {
  getTotalRevenueApi,
  getTotalOrdersApi,
  getTotalCustomersApi,
  getPendingOrdersApi,
  getCompletedOrdersApi,
  getCancelledOrdersApi,
};