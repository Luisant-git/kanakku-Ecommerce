const apiUrl = import.meta.env.VITE_API_URL;

const uploadImageApi = async (imageData) => {
  try {
    const response = await fetch(`${apiUrl}/upload`, {
      method: 'POST',
      body: imageData,
    });
    if (response.status === 413) {
      return { error: 413, message: '413 Request Entity Too Large' };
    }
    if (!response.ok) {
      return { error: response.status, message: response.statusText };
    }
    return await response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
    return { error: 'network', message: error.message };
  }
};

export default uploadImageApi;