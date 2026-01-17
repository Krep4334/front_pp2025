import { apiConfig } from "./config";
import { apiFetch } from "./http";

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
}

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
}

export const login = async (email: string, password: string): Promise<AuthTokens> => {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  const response = await fetch(`${apiConfig.auth}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Login failed ${response.status}: ${text}`);
  }

  const data = (await response.json()) as {
    access_token: string;
    refresh_token?: string | null;
    token_type: string;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || undefined,
    tokenType: data.token_type,
  };
};

export const fetchMe = (accessToken: string) =>
  apiFetch<AuthUser>(`${apiConfig.auth}/me`, undefined, accessToken);

export const refreshTokens = (refreshToken: string) =>
  apiFetch<{
    access_token: string;
    refresh_token: string;
    token_type: string;
  }>(`${apiConfig.auth}/refresh`, {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

export const logout = (refreshToken?: string) => {
  if (!refreshToken) return Promise.resolve();
  return apiFetch<void>(`${apiConfig.auth}/logout`, {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
};

