
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const authService = {
  register: async (userData) => {
    const response = await axios.post(
      `${API_URL}/Auth/register`,
      userData
    );

    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(
      `${API_URL}/Auth/login`,
      credentials
    );

    return response.data;
  },
};

export default authService;
