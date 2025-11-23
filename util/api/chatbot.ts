import { API_URL } from "./config";

export interface ChatMessage {
  role: "user" | "model";
  message: string;
}

export interface SendMessageResponse {
  response: string;
  sessionId: string;
}

export interface SessionHistory {
  sessionId: string;
  history: ChatMessage[];
}

// Send a message to the chatbot
export const sendChatMessage = async (
  message: string,
  sessionId?: string
): Promise<SendMessageResponse> => {
  const response = await fetch(`${API_URL}/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to send message");
  }

  return response.json();
};

// Get session history
export const getSessionHistory = async (
  sessionId: string
): Promise<SessionHistory> => {
  const response = await fetch(`${API_URL}/chat/sessions/${sessionId}/history`);

  if (!response.ok) {
    throw new Error("Failed to get session history");
  }

  return response.json();
};

// Clear a session
export const clearSession = async (sessionId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/chat/sessions/${sessionId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to clear session");
  }
};
