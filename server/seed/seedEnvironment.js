function getSeedEnvironmentError(environment) {
  const nodeEnv = environment.NODE_ENV?.trim().toLowerCase();
  if (!nodeEnv) return "NODE_ENV must be explicitly set before demo seeding.";
  if (nodeEnv === "production") return "Demo seeding is disabled in production.";
  if (environment.ALLOW_DEMO_SEED !== "true") {
    return "Set ALLOW_DEMO_SEED=true to explicitly enable demo seeding.";
  }
  return null;
}

module.exports = getSeedEnvironmentError;
