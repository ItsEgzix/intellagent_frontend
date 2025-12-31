const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Settings {
  [key: string]: string;
}

/**
 * Get all settings (public endpoint)
 */
export async function getSettings(): Promise<Settings> {
  const response = await fetch(`${API_URL}/settings`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }

  const data = await response.json();
  return data.data || {};
}

/**
 * Get chatbot enabled status (public endpoint)
 */
export async function isChatbotEnabled(): Promise<boolean> {
  try {
    // Create abort controller for timeout (more compatible than AbortSignal.timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${API_URL}/settings/chatbot-enabled`, {
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(
        `Settings API returned ${response.status}, defaulting to enabled`
      );
      // Default to enabled if API fails
      return true;
    }

    const data = await response.json();
    return data.enabled !== false; // Default to true if not set
  } catch (error) {
    // Handle network errors gracefully
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.warn("Settings API request timed out, defaulting to enabled");
      } else if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        console.warn(
          "Cannot reach settings API (backend may be down or not started), defaulting to enabled. Make sure:",
          "\n1. Backend server is running",
          "\n2. Prisma migration has been run: npx prisma migrate dev",
          "\n3. Backend has been restarted after adding SettingsModule"
        );
      } else {
        console.error("Failed to check chatbot status:", error);
      }
    } else {
      console.error("Failed to check chatbot status:", error);
    }
    // Default to enabled if API fails - ensures chatbot works even if settings API is down
    return true;
  }
}

/**
 * Update chatbot enabled status (superadmin only)
 */
export async function updateChatbotEnabled(
  token: string,
  enabled: boolean
): Promise<void> {
  const response = await fetch(`${API_URL}/settings/chatbot-enabled`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ enabled }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to update setting" }));
    throw new Error(error.message || "Failed to update chatbot visibility");
  }
}

/**
 * Update a setting (superadmin only)
 */
export async function updateSetting(
  token: string,
  key: string,
  value: string,
  description?: string
): Promise<void> {
  const response = await fetch(`${API_URL}/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ key, value, description }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to update setting" }));
    throw new Error(error.message || "Failed to update setting");
  }
}

// ========== Email Notification Toggles ==========

export interface EmailNotifications {
  superadmin: boolean;
  agent: boolean;
  client: boolean;
  welcome: boolean;
}

export async function getEmailNotifications(
  token: string
): Promise<EmailNotifications> {
  const response = await fetch(`${API_URL}/settings/email/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch email notifications");
  }

  const data = await response.json();
  return data.data;
}

export async function updateEmailNotification(
  token: string,
  type: "superadmin" | "agent" | "client" | "welcome",
  enabled: boolean
): Promise<void> {
  const response = await fetch(
    `${API_URL}/settings/email/notifications/${type}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ enabled }),
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to update notification setting" }));
    throw new Error(error.message || "Failed to update notification setting");
  }
}

// ========== Additional Recipients ==========

export async function getEmailAdditionalRecipients(
  token: string
): Promise<string[]> {
  const response = await fetch(
    `${API_URL}/settings/email/additional-recipients`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch additional recipients");
  }

  const data = await response.json();
  return data.data.emails || [];
}

export async function updateEmailAdditionalRecipients(
  token: string,
  emails: string[]
): Promise<void> {
  const response = await fetch(
    `${API_URL}/settings/email/additional-recipients`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ emails }),
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to update additional recipients" }));
    throw new Error(error.message || "Failed to update additional recipients");
  }
}

// ========== Email Sender Configuration ==========

export interface EmailSender {
  address: string | null;
  name: string | null;
}

export async function getEmailSender(token: string): Promise<EmailSender> {
  const response = await fetch(`${API_URL}/settings/email/sender`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch email sender");
  }

  const data = await response.json();
  return data.data;
}

export async function updateEmailSender(
  token: string,
  address: string,
  name?: string
): Promise<void> {
  const response = await fetch(`${API_URL}/settings/email/sender`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ address, name }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Failed to update email sender" }));
    throw new Error(error.message || "Failed to update email sender");
  }
}
