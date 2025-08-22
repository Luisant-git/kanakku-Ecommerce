const apiUrl = import.meta.env.VITE_API_URL;

const getAllCustomersApi = async () => {
  const response = await fetch(`${apiUrl}/customer`, {
    cache: "no-store",
  });
  const data = await response.json();
  return data;
};

const getCustomerByIdApi = async (id) => {
  const response = await fetch(`${apiUrl}/customer/${id}`, {
    cache: "no-store",
  });
  const data = await response.json();
  return data;
};

export { getAllCustomersApi, getCustomerByIdApi }