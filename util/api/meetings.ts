import { API_URL, getAuthHeaders, getAuthJsonHeaders } from "./config";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  customerDate: string;
  customerTime: string;
  customerTimezone: string;
  agentDate?: string;
  agentTime?: string;
  agentTimezone?: string;
  customerId: string;
  customer?: Customer;
  agentId?: string;
  agent?: {
    id: string;
    name?: string;
    email: string;
    timezone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeetingDto {
  customerName: string;
  date: string; // Customer's date
  time: string; // Customer's time
  timezone: string; // Customer's timezone
  email: string;
  phone: string;
  agentId?: string;
}

// Get all meetings (requires auth for admin, public for calendar)
export const getAllMeetings = async (token?: string): Promise<Meeting[]> => {
  const headers = token ? getAuthHeaders(token) : {};
  const response = await fetch(`${API_URL}/meetings`, {
    headers,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch meetings");
  }
  return response.json();
};

// Create a meeting (public endpoint)
export const createMeeting = async (
  meetingData: CreateMeetingDto
): Promise<Meeting> => {
  const response = await fetch(`${API_URL}/meetings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meetingData),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create meeting");
  }
  return response.json();
};
