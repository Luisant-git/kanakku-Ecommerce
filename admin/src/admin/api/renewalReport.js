const apiUrl = import.meta.env.VITE_API_URL;

const getPendingRenewalReport = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    const url = `${apiUrl}/renewal-report/pending${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error("Error fetching renewal report:", error);
  }
};

export { getPendingRenewalReport };