import { apiConfig } from "./config";
import { apiFetch } from "./http";

export interface RegisterInput {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  role: string;
  is_active: boolean;
}

export interface AddressInput {
  title?: string;
  street_address: string;
  city: string;
  postal_code?: string;
  is_default?: boolean;
}

export interface AddressOut {
  id: number;
  user_id: number;
  title?: string | null;
  street_address: string;
  city: string;
  postal_code?: string | null;
  is_default: boolean;
}

export const registerUser = (payload: RegisterInput) =>
  apiFetch<UserProfile>(`${apiConfig.user}/users`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getProfile = (accessToken: string) =>
  apiFetch<UserProfile>(`${apiConfig.user}/users/me`, undefined, accessToken);

export const createAddress = (payload: AddressInput, accessToken: string) =>
  apiFetch<AddressOut>(`${apiConfig.user}/users/me/addresses`, {
    method: "POST",
    body: JSON.stringify(payload),
  }, accessToken);

export const getAddresses = (accessToken: string) =>
  apiFetch<AddressOut[]>(`${apiConfig.user}/users/me/addresses`, undefined, accessToken);

