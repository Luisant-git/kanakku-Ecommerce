const apiUrl = import.meta.env.VITE_API_URL;

const uploadImageApi = async (imageData) => {
  try {
    const response = await fetch(`${apiUrl}/upload`, {
      method: 'POST',
      body: imageData,
    });
    if (response.status === 413) {
      return { error: 413, message: 'Request Entity Too Large' };
    }
    return response.json();
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

export default uploadImageApi;