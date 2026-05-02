let API_URL = "http://20.207.122.201/evaluation-service/logs";

const VALID_STACKS = new Set(["backend", "frontend"]);
const VALID_LEVELS = new Set(["debug", "info", "warn", "error", "fatal"]);
const BACKEND_PACKAGES = new Set([
  "cache", "controller", "cron_job", "db", "domain", 
  "handler", "repository", "route", "service", 
  "auth", "config", "middleware", "utils"
]);
const FRONTEND_PACKAGES = new Set([
  "api", "component", "hook", "page", "state", 
  "style", "auth", "config", "middleware", "utils"
]);

let authToken = "";

export const setAuthToken = (token) => {
  authToken = token;
};

export const setApiBaseUrl = (url) => {
  API_URL = `${url}/logs`;
};

export const Log = async (stack, level, pkg, message) => {
  if (!VALID_STACKS.has(stack)) {
    throw new Error(`Invalid stack: ${stack}`);
  }
  if (!VALID_LEVELS.has(level)) {
    throw new Error(`Invalid level: ${level}`);
  }
  if (stack === "backend" && !BACKEND_PACKAGES.has(pkg)) {
    throw new Error(`Invalid package for backend: ${pkg}`);
  }
  if (stack === "frontend" && !FRONTEND_PACKAGES.has(pkg)) {
    throw new Error(`Invalid package for frontend: ${pkg}`);
  }
  if (!authToken) {
    throw new Error("Auth token is not set");
  }

  const payload = {
    stack,
    level,
    package: pkg,
    message
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Log API failed with status ${response.status}: ${text}`);
  }

  return response.json();
};

export const loggingMiddleware = (stack, pkg) => {
  return async (req, res, next) => {
    try {
      await next();
    } catch (error) {
      const level = error.level || "error";
      const message = error.message || String(error);
      try {
        await Log(stack, level, pkg, message);
      } catch (logError) {
        console.error("Failed to send log:", logError);
      }
      throw error;
    }
  };
};
