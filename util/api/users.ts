import { API_URL, getAuthHeaders, getAuthJsonHeaders } from "./config";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  isAgent: boolean;
  isActive: boolean;
  timezone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Get all users (requires auth, admin or superadmin)
export const getAllUsers = async (token: string): Promise<User[]> => {
  const response = await fetch(`${API_URL}/auth/users`, {
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};
