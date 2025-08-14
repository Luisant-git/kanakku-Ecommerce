const apiUrl = import.meta.env.VITE_API_URL;

const loginApi = async (credentials) => {
  try {
    const response = await fetch(`${apiUrl}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

export { loginApi };