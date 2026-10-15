// Variables the API cannot run without. Checked once at startup so a missing or misspelled
// name fails fast with a clear message instead of as 500s at runtime (e.g. JWT_EXPIRE missing
// makes every login throw). Names are case-sensitive on Linux.
export const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET", "JWT_EXPIRE", "JWT_COOKIE_EXPIRE"] as const;

// Throws listing the missing names (never their values); call right after dotenv.config()
export const assertRequiredEnv = (names: readonly string[] = REQUIRED_ENV): void => {
  const missing = names.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
        "Set them in backend/config/config.env (see config.env.env) or in the host's settings.",
    );
  }
};
