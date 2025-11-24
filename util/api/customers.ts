import { API_URL, getAuthHeaders } from "./config";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  timezone: string;
  companyDetails?: string;
  adminId?: string;
  admin?: {
    id: string;
    name: string | null;
    email: string;
  };
  source: string; // "website" or "admin"
  level: string; // "new", "contacted", "responded", "qualified", "customer"
  createdAt: string;
  updatedAt: string;
  meetings?: any[];
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
  timezone: string;
  companyDetails?: string;
  level?: string; // "new", "contacted", "responded", "qualified", "customer"
}

export interface UpdateCustomerDto {
  name?: string;
  email?: string;
  phone?: string;
  timezone?: string;
  companyDetails?: string;
  level?: string; // "new", "contacted", "responded", "qualified", "customer"
}

export const getAllCustomers = async (token: string): Promise<Customer[]> => {
  const response = await fetch(`${API_URL}/customers`, {
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }
  return response.json();
};

export const getCustomer = async (
  token: string,
  id: string
): Promise<Customer> => {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch customer");
  }
  return response.json();
};

export const createCustomer = async (
  token: string,
  data: CreateCustomerDto
): Promise<Customer> => {
  const response = await fetch(`${API_URL}/customers`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create customer");
  }
  return response.json();
};

export const updateCustomer = async (
  token: string,
  id: string,
  data: UpdateCustomerDto
): Promise<Customer> => {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update customer");
  }
  return response.json();
};

export const deleteCustomer = async (
  token: string,
  id: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete customer");
  }
};
