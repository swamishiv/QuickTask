
import axios from "axios";

const API_URL = "https://localhost:7026/api/Auth";

const authService = {
  register: async (userData) => {
    const response = await axios.post(
      `${API_URL}/register`,
      userData
    );

    return response.data;
  },

  login: async (credentials) => {
    const response = await axios.post(
      `${API_URL}/login`,
      credentials
    );

    return response.data;
  },
};

export default authService;
