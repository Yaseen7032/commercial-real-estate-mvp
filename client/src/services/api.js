export async function checkBackendHealth() {
  const response = await fetch("http://localhost:5000/api/health");

  if (!response.ok) {
    throw new Error("Backend health check failed");
  }

  return response.json();
}