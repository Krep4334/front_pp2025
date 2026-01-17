type EnvKey =
  | "VITE_AUTH_URL"
  | "VITE_USER_URL"
  | "VITE_ORDER_URL"
  | "VITE_RESTAURANT_URL"
  | "VITE_NOTIFICATION_URL"
  | "VITE_API_PROTOCOL"
  | "VITE_API_HOST"
  | "VITE_AUTH_PORT"
  | "VITE_USER_PORT"
  | "VITE_ORDER_PORT"
  | "VITE_RESTAURANT_PORT"
  | "VITE_NOTIFICATION_PORT";

const env = (key: EnvKey): string | undefined =>
  import.meta.env[key] as string | undefined;

const buildServiceUrl = (
  serviceUrlKey: EnvKey,
  portKey: EnvKey,
  defaultPort: number
) => {
  const explicit = env(serviceUrlKey);
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  const protocol = env("VITE_API_PROTOCOL") || "http";
  const host = env("VITE_API_HOST") || "localhost";
  const port = env(portKey) || String(defaultPort);
  return `${protocol}://${host}:${port}`;
};

export const apiConfig = {
  auth: buildServiceUrl("VITE_AUTH_URL", "VITE_AUTH_PORT", 8001),
  user: buildServiceUrl("VITE_USER_URL", "VITE_USER_PORT", 8002),
  order: buildServiceUrl("VITE_ORDER_URL", "VITE_ORDER_PORT", 8003),
  restaurant: buildServiceUrl("VITE_RESTAURANT_URL", "VITE_RESTAURANT_PORT", 8004),
  notification: buildServiceUrl(
    "VITE_NOTIFICATION_URL",
    "VITE_NOTIFICATION_PORT",
    8005
  ),
};

