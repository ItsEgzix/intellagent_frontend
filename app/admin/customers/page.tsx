"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  Customer,
  CreateCustomerDto,
} from "@/util/api/customers";
import { timezones } from "@/util/helpers/timezones";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MarkdownEditor } from "@/components/ui/markdown-editor";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Lead levels configuration
const LEAD_LEVELS = [
  { value: "new", label: "New", color: "bg-gray-100 text-gray-800" },
  {
    value: "contacted",
    label: "Contacted",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "responded",
    label: "Responded",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "qualified",
    label: "Qualified",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "customer",
    label: "Customer",
    color: "bg-green-100 text-green-800",
  },
] as const;

const getLevelConfig = (level: string) => {
  return LEAD_LEVELS.find((l) => l.value === level) || LEAD_LEVELS[0];
};

export default function CustomersPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<CreateCustomerDto>({
    name: "",
    email: "",
    phone: "",
    timezone: "Asia/Kuala_Lumpur",
    companyDetails: "",
    level: "new",
  });
  const [levelFilter, setLevelFilter] = useState<string>("all");

  useEffect(() => {
    fetchCustomers();
  }, [token]);

  const fetchCustomers = async () => {
    if (!token) return;

    try {
      const data = await getAllCustomers(token);
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      timezone: customer.timezone,
      companyDetails: customer.companyDetails || "",
      level: customer.level || "new",
    });
    setShowForm(true);
    setError("");
  };

  const handleCancel = () => {
    setEditingCustomer(null);
    setShowForm(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      timezone: "Asia/Kuala_Lumpur",
      companyDetails: "",
      level: "new",
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError("");

    try {
      if (editingCustomer) {
        await updateCustomer(token, editingCustomer.id, formData);
      } else {
        await createCustomer(token, formData);
      }

      await fetchCustomers();
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save customer");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    if (!token) return;

    try {
      await deleteCustomer(token, id);
      await fetchCustomers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete customer"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading customers...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-3xl font-bold text-[#111]"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Manage Customers
        </h1>
        <Button
          onClick={() => {
            handleCancel();
            setShowForm(true);
          }}
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Add New Customer
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle style={{ fontFamily: "var(--font-dm-sans)" }}>
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </CardTitle>
            <CardDescription style={{ fontFamily: "var(--font-dm-sans)" }}>
              {editingCustomer
                ? "Update customer information and company details."
                : "Create a new customer and add their company information."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="timezone"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Timezone *
                  </Label>
                  <select
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) =>
                      setFormData({ ...formData, timezone: e.target.value })
                    }
                    required
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {timezones.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="level"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Lead Level *
                  </Label>
                  <select
                    id="level"
                    value={formData.level || "new"}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    required
                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {LEAD_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label style={{ fontFamily: "var(--font-dm-sans)" }}>
                  Company Details (Markdown)
                </Label>
                <MarkdownEditor
                  value={formData.companyDetails || ""}
                  onChange={(value) =>
                    setFormData({ ...formData, companyDetails: value })
                  }
                  placeholder="Write detailed information about the company in Markdown format..."
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {editingCustomer ? "Update" : "Create"} Customer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {customers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p
              className="text-center text-muted-foreground"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              No customers found. Create your first customer to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle style={{ fontFamily: "var(--font-dm-sans)" }}>
                Customers (
                {levelFilter === "all"
                  ? customers.length
                  : customers.filter((c) => c.level === levelFilter).length}
                )
              </CardTitle>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="levelFilter"
                  className="text-sm"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Filter by Level:
                </Label>
                <select
                  id="levelFilter"
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="flex h-9 items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  <option value="all">All Levels</option>
                  {LEAD_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ fontFamily: "var(--font-dm-sans)" }}>
                    Name
                  </TableHead>
                  <TableHead style={{ fontFamily: "var(--font-dm-sans)" }}>
                    Email
                  </TableHead>
                  <TableHead style={{ fontFamily: "var(--font-dm-sans)" }}>
                    Phone
                  </TableHead>
                  <TableHead style={{ fontFamily: "var(--font-dm-sans)" }}>
                    Timezone
                  </TableHead>
                  <TableHead style={{ fontFamily: "var(--font-dm-sans)" }}>
                    Source
                  </TableHead>
                  <TableHead style={{ fontFamily: "var(--font-dm-sans)" }}>
                    Level
                  </TableHead>
                  <TableHead style={{ fontFamily: "var(--font-dm-sans)" }}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers
                  .filter(
                    (customer) =>
                      levelFilter === "all" || customer.level === levelFilter
                  )
                  .map((customer) => {
                    const levelConfig = getLevelConfig(customer.level || "new");
                    return (
                      <TableRow key={customer.id}>
                        <TableCell
                          className="font-medium"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          {customer.name}
                        </TableCell>
                        <TableCell
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          {customer.email}
                        </TableCell>
                        <TableCell
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          {customer.phone}
                        </TableCell>
                        <TableCell
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          {customer.timezone}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              customer.source === "admin"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                          >
                            {customer.source === "admin"
                              ? "Admin Added"
                              : "Website"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${levelConfig.color}`}
                            style={{ fontFamily: "var(--font-dm-sans)" }}
                          >
                            {levelConfig.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(customer)}
                              style={{ fontFamily: "var(--font-dm-sans)" }}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(customer.id)}
                              className="text-red-600 hover:text-red-800"
                              style={{ fontFamily: "var(--font-dm-sans)" }}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
