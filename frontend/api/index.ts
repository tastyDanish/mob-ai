import axios from "axios";

const API_BASE_URL = "http://localhost:5001";

export const fetchData = async (endpoint: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const addWord = async (word: string, isPositive: boolean) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/words`, {
      word,
      isPositive,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting word:", error);
    return null;
  }
};
