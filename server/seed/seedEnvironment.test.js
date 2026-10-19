const assert = require("node:assert/strict");
const { test } = require("node:test");
const getSeedEnvironmentError = require("./seedEnvironment");

test("refuses production even with opt-in", () => {
  assert.equal(
    getSeedEnvironmentError({
      NODE_ENV: "production",
      ALLOW_DEMO_SEED: "true",
    }),
    "Demo seeding is disabled in production."
  );
});

test("refuses missing NODE_ENV", () => {
  assert.equal(
    getSeedEnvironmentError({ ALLOW_DEMO_SEED: "true" }),
    "NODE_ENV must be explicitly set before demo seeding."
  );
});

test("refuses blank NODE_ENV", () => {
  assert.equal(
    getSeedEnvironmentError({
      NODE_ENV: "  ",
      ALLOW_DEMO_SEED: "true",
    }),
    "NODE_ENV must be explicitly set before demo seeding."
  );
});

test("refuses missing opt-in in development", () => {
  assert.equal(
    getSeedEnvironmentError({ NODE_ENV: "development" }),
    "Set ALLOW_DEMO_SEED=true to explicitly enable demo seeding."
  );
});

test("refuses false opt-in in development", () => {
  assert.equal(
    getSeedEnvironmentError({
      NODE_ENV: "development",
      ALLOW_DEMO_SEED: "false",
    }),
    "Set ALLOW_DEMO_SEED=true to explicitly enable demo seeding."
  );
});

test("allows the guard for explicit development opt-in", () => {
  assert.equal(
    getSeedEnvironmentError({
      NODE_ENV: "development",
      ALLOW_DEMO_SEED: "true",
    }),
    null
  );
});
