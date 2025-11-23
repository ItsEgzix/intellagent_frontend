import { API_URL, getAuthHeaders } from "./config";

export interface Email {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Subscribe to newsletter (public endpoint)
export const subscribeToNewsletter = async (email: string): Promise<Email> => {
  const response = await fetch(`${API_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to subscribe to newsletter");
  }
  return response.json();
};

// Get all email subscriptions (requires auth)
export const getAllEmails = async (token: string): Promise<Email[]> => {
  const response = await fetch(`${API_URL}/emails`, {
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch emails");
  }
  return response.json();
};
