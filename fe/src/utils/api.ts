import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { handleApiError } from "./handleApiError";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  timeout: 5000,
});

// Request Interceptor: Attach Authorization Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle API errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(handleApiError(error))
);

// Generic API request function with strong types
export const apiRequest = async <T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const headers =
      data instanceof FormData
        ? { ...config?.headers }
        : { "Content-Type": "application/json", ...config?.headers };
    const response: AxiosResponse<T> = await api.request<T>({
      method,
      url,
      data,
      headers,
      ...config,
    });
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(error);
  }
};

export default api;
