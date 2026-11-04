
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7026/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach the JWT token to every API request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("quicktask_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const getTasks = async () => {
  const response = await api.get("/Tasks");
  return response.data;
};

export const createTask = async (task) => {
  const response = await api.post("/Tasks", task);
  return response.data;
};

export const updateTask = async (id, task) => {
  await api.put(`/Tasks/${id}`, task);
};

export const deleteTask = async (id) => {
  await api.delete(`/Tasks/${id}`);
};
