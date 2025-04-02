import axios from "axios";

// Define the error response structure
interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

// Centralized API error handler
export const handleApiError = (error: unknown): ApiError => {
  console.error("API Error:", error); // Log error (optional)

  if (axios.isAxiosError(error)) {
    const { response } = error;
    if (!response) {
      return { message: "Network error: Unable to reach the server" };
    }

    const { status, data } = response;
    let message = data?.message || "An unexpected error occurred";

    switch (status) {
      case 400:
        message = data?.message || "Invalid request.";
        break;
      case 401:
        message = data?.message || "Unauthorized. Please log in again.";
        localStorage.removeItem("token");
        window.location.href = "/login"; // Redirect user
        break;
      case 403:
        message = data?.message || "Forbidden. You don't have permission.";
        break;
      case 404:
        message = data?.message || "Resource not found.";
        break;
      case 500:
        message = data?.message || "Server error. Try again later.";
        break;
    }

    return { message, status, details: data };
  }

  return { message: (error as Error).message || "Unexpected error" };
};
