export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const getAuthHeaders = (
  token: string | null
): Record<string, string> => {
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getJsonHeaders = (): Record<string, string> => ({
  "Content-Type": "application/json",
});

export const getAuthJsonHeaders = (
  token: string | null
): Record<string, string> => ({
  ...getJsonHeaders(),
  ...getAuthHeaders(token),
});
