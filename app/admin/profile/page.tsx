"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/auth-context";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function ProfilePage() {
  const { token, user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    timezone: "Asia/Kuala_Lumpur",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email,
        timezone: user.timezone || "Asia/Kuala_Lumpur",
      });
      // Construct full avatar URL if it exists
      if (user.avatar) {
        const avatarUrl =
          user.avatar.startsWith("http") || user.avatar.startsWith("data:")
            ? user.avatar
            : `${API_URL}${user.avatar.startsWith("/") ? "" : "/"}${
                user.avatar
              }`;
        setAvatarPreview(avatarUrl);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("timezone", formData.timezone);

      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile);
      }

      const response = await fetch(`${API_URL}/auth/users/${user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1
        className="text-3xl font-bold text-[#111] mb-8"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        My Profile
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4 text-sm">
          {success}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: "var(--font-dm-sans)" }}>
            Profile Information
          </CardTitle>
          <CardDescription style={{ fontFamily: "var(--font-dm-sans)" }}>
            Update your personal information and preferences.
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
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
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
                <Label style={{ fontFamily: "var(--font-dm-sans)" }}>
                  Avatar
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                />
                <div className="mt-2 flex items-center gap-3">
                  <div className="relative w-20 h-20">
                    {avatarPreview || user.avatar ? (
                      <img
                        src={
                          avatarPreview
                            ? avatarPreview
                            : user.avatar?.startsWith("http") ||
                              user.avatar?.startsWith("data:")
                            ? user.avatar
                            : `${API_URL}${
                                user.avatar?.startsWith("/") ? "" : "/"
                              }${user.avatar}`
                        }
                        alt="Avatar preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = parent.querySelector(
                              ".avatar-preview-fallback"
                            ) as HTMLElement;
                            if (fallback) {
                              fallback.style.display = "flex";
                            }
                          }
                        }}
                      />
                    ) : null}
                    <div
                      className={`avatar-preview-fallback w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300 absolute top-0 left-0 ${
                        !avatarPreview && !user.avatar ? "flex" : "hidden"
                      }`}
                    >
                      <span
                        className="text-gray-400 text-xl font-medium"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {(formData.name || formData.email || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {isSubmitting ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
