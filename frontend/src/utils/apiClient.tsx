// utils/apiClient.ts
const apiClient = async (
  url: string,
  refreshAuthToken: () => Promise<string>, // Accept refreshAuthToken as the second argument
  options: RequestInit = {} // Accept options as the third argument
) => {
  let token = localStorage.getItem("authToken");

  // Ensure headers is treated as a plain object
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json");

  // Update options with the new headers
  options.headers = headers;

  let response: Response;
  try {
    response = await fetch(url, options);

    // If the token is expired, refresh it and retry the request
    if (response.status === 401) {
      const newToken = await refreshAuthToken(); // Use the passed refreshAuthToken function
      localStorage.setItem("authToken", newToken);

      // Update the Authorization header with the new token
      headers.set("Authorization", `Bearer ${newToken}`);
      options.headers = headers;

      // Retry the request with the new token
      response = await fetch(url, options);
    }

    if (!response.ok) {
      let errorMessage = "An error occurred while processing your request.";
      if (response.status === 404) {
        errorMessage = "The requested resource was not found.";
      } else if (response.status === 500) {
        errorMessage = "A server error occurred. Please try again later.";
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    // Ensure the error is an instance of Error
    if (error instanceof Error) {
      throw error;
    } else if (typeof error === "string") {
      throw new Error(error);
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
};

export default apiClient;