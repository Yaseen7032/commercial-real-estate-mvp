export async function checkBackendHealth() {
  const response = await fetch("http://localhost:5000/api/health");

  if (!response.ok) {
    throw new Error("Backend health check failed");
  }

  return response.json();
}

async function postAuthRequest(endpoint, payload) {
  let response;
  try {
    response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Unable to reach Locentra. Check that the backend is running.");
  }

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Authentication request failed.");
  }

  return result;
}

export function registerAccount(account) {
  return postAuthRequest("register", account);
}

export function loginAccount(credentials) {
  return postAuthRequest("login", credentials);
}

function getStoredToken() {
  const storedAuthentication = window.localStorage.getItem("locentraAuth")
    || window.sessionStorage.getItem("locentraAuth");
  if (!storedAuthentication) {
    throw new Error("Please sign in to continue.");
  }

  try {
    const { token } = JSON.parse(storedAuthentication);
    if (!token) throw new Error("Missing token");
    return token;
  } catch {
    throw new Error("Your session is invalid. Please sign in again.");
  }
}

async function requestAuthenticatedApi(path, options = {}) {
  const token = getStoredToken();
  let response;
  try {
    response = await fetch(`http://localhost:5000/api/${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Unable to reach Locentra. Check that the backend is running.");
  }

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "The request could not be completed.");
  }
  return result;
}

export function createRequirement(requirement) {
  return requestAuthenticatedApi("requirements", {
    method: "POST",
    body: JSON.stringify(requirement),
  });
}

export function getRequirements() {
  return requestAuthenticatedApi("requirements");
}

export function getRequirementMatches(requirementId) {
  return requestAuthenticatedApi(`requirements/${encodeURIComponent(requirementId)}/matches`);
}

export async function getProperties(type = "All") {
  const query = type && type !== "All" ? `?type=${encodeURIComponent(type)}` : "";
  const response = await fetch(`http://localhost:5000/api/properties${query}`);
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Unable to load properties.");
  }
  return result;
}

export function getMyProperties() {
  return requestAuthenticatedApi("properties/mine");
}

export function createProperty(property) {
  return requestAuthenticatedApi("properties", {
    method: "POST",
    body: JSON.stringify(property),
  });
}

export async function getProperty(propertyId) {
  const response = await fetch(`http://localhost:5000/api/properties/${encodeURIComponent(propertyId)}`);
  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Unable to load this property.");
  }
  return result;
}

export function getFavorites() {
  return requestAuthenticatedApi("favorites");
}

export function getFavoriteStatus(propertyId) {
  return requestAuthenticatedApi(`favorites/${encodeURIComponent(propertyId)}`);
}

export function saveFavorite(propertyId) {
  return requestAuthenticatedApi("favorites", {
    method: "POST",
    body: JSON.stringify({ propertyId }),
  });
}

export function removeFavorite(propertyId) {
  return requestAuthenticatedApi(`favorites/${encodeURIComponent(propertyId)}`, {
    method: "DELETE",
  });
}

export function getContactRequests() {
  return requestAuthenticatedApi("contact-requests");
}

export function getReceivedContactRequests() {
  return requestAuthenticatedApi("contact-requests/received");
}

export function createContactRequest(propertyId, requirementId) {
  return requestAuthenticatedApi("contact-requests", {
    method: "POST",
    body: JSON.stringify({ propertyId, ...(requirementId ? { requirementId } : {}) }),
  });
}

export function getProfile() {
  return requestAuthenticatedApi("auth/me");
}