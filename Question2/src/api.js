import { Log, setAuthToken, setApiBaseUrl } from "../../logging_middleware/index.js";

const API_BASE = "/evaluation-service/notifications";
const token = import.meta.env.VITE_AUTH_TOKEN || localStorage.getItem("access_token");

if (token) {
  setAuthToken(token);
}

// Bypass CORS by pointing the logging middleware to the Vite proxy
setApiBaseUrl("/evaluation-service");

export const fetchNotifications = async ({ page = 1, limit = 20, type = "" } = {}) => {
  try {
    let url = `${API_BASE}?page=${page}&limit=${limit}`;
    if (type) {
      url += `&notification_type=${type}`;
    }
    
    await Log("frontend", "info", "api", "Fetching notifications list");

    const res = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return data.notifications || [];
  } catch (error) {
    await Log("frontend", "error", "api", error.message);
    console.error("Fetch error:", error);
    return [];
  }
};
