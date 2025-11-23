import {
  API_URL,
  getAuthHeaders,
  getAuthJsonHeaders,
  getJsonHeaders,
} from "./config";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  timezone?: string;
  avatar?: string;
  isActive: boolean;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
  role?: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// Get user profile (requires auth)
export const getProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }
  return response.json();
};

// Login
export const login = async (credentials: LoginDto): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: getJsonHeaders(),
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Login failed");
  }
  return response.json();
};

// Register (requires superadmin auth)
export const register = async (
  userData: RegisterDto,
  token: string
): Promise<User> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: getAuthJsonHeaders(token),
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Registration failed");
  }
  return response.json();
};

// Logout (requires auth)
export const logout = async (token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: getAuthHeaders(token),
  });
  // Don't throw error if logout fails - we still want to clear local storage
  if (!response.ok) {
    console.warn("Logout API call failed, but clearing local storage anyway");
  }
};
