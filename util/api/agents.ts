import { API_URL, getAuthHeaders, getAuthJsonHeaders } from "./config";

export interface Agent {
  id: string;
  email: string;
  name?: string;
  role: string;
  isAgent: boolean;
  timezone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Get all active agents (public endpoint)
export const getActiveAgents = async (): Promise<Agent[]> => {
  const response = await fetch(`${API_URL}/agents/active`);
  if (!response.ok) {
    throw new Error("Failed to fetch active agents");
  }
  return response.json();
};

// Get all agents (requires auth)
export const getAllAgents = async (token: string): Promise<Agent[]> => {
  const response = await fetch(`${API_URL}/agents`, {
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch agents");
  }
  return response.json();
};

// Get agent by ID (requires auth)
export const getAgentById = async (
  id: string,
  token: string
): Promise<Agent> => {
  const response = await fetch(`${API_URL}/agents/${id}`, {
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch agent");
  }
  return response.json();
};

// Create agent (requires auth)
export const createAgent = async (
  agentData: Partial<Agent>,
  token: string
): Promise<Agent> => {
  const response = await fetch(`${API_URL}/agents`, {
    method: "POST",
    headers: getAuthJsonHeaders(token),
    body: JSON.stringify(agentData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create agent");
  }
  return response.json();
};

// Update agent (requires auth)
export const updateAgent = async (
  id: string,
  agentData: Partial<Agent>,
  token: string
): Promise<Agent> => {
  const response = await fetch(`${API_URL}/agents/${id}`, {
    method: "PATCH",
    headers: getAuthJsonHeaders(token),
    body: JSON.stringify(agentData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update agent");
  }
  return response.json();
};

// Delete agent (requires auth)
export const deleteAgent = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/agents/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete agent");
  }
};

// Get available time slots for an agent
export const getAvailableTimeSlots = async (
  agentId: string,
  date: string,
  timezone: string
): Promise<string[]> => {
  const response = await fetch(
    `${API_URL}/agents/${agentId}/available-slots?date=${date}&timezone=${timezone}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch available time slots");
  }
  return response.json();
};
