// Token utilities for admin authentication
export const getToken = () => {
  return localStorage.getItem('adminToken');
};

export const setToken = (token) => {
  localStorage.setItem('adminToken', token);
};

export const removeToken = () => {
  localStorage.removeItem('adminToken');
};

export const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    return null;
  }
};

export const isValidAdminToken = () => {
  const token = getToken();
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded || decoded.type !== 'admin') return false;
  
  // Check if token is expired (optional)
  if (decoded.exp && decoded.exp < Date.now() / 1000) return false;
  
  return true;
};