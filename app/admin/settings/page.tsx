"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  updateChatbotEnabled,
  isChatbotEnabled,
  getEmailNotifications,
  updateEmailNotification,
  getEmailAdditionalRecipients,
  updateEmailAdditionalRecipients,
  getEmailSender,
  updateEmailSender,
  type EmailNotifications,
  type EmailSender,
} from "@/util/api/settings";

export default function SettingsPage() {
  const { token, user } = useAuth();
  const [chatbotEnabled, setChatbotEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Email notification toggles
  const [emailNotifications, setEmailNotifications] =
    useState<EmailNotifications>({
      superadmin: true,
      agent: true,
      client: true,
      welcome: true,
    });

  // Additional recipients
  const [additionalRecipients, setAdditionalRecipients] = useState<string[]>(
    []
  );
  const [newRecipient, setNewRecipient] = useState("");

  // Email sender
  const [emailSender, setEmailSender] = useState<EmailSender>({
    address: null,
    name: null,
  });

  useEffect(() => {
    if (user?.role !== "superadmin") {
      return;
    }

    const fetchSettings = async () => {
      if (!token) return;

      try {
        const [enabled, notifications, recipients, sender] = await Promise.all([
          isChatbotEnabled(),
          getEmailNotifications(token),
          getEmailAdditionalRecipients(token),
          getEmailSender(token),
        ]);

        setChatbotEnabled(enabled);
        setEmailNotifications(notifications);
        setAdditionalRecipients(recipients);
        setEmailSender(sender);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
        setMessage({
          type: "error",
          text: "Failed to load settings",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user, token]);

  const handleToggleChatbot = async (enabled: boolean) => {
    if (!token || user?.role !== "superadmin") {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await updateChatbotEnabled(token, enabled);
      setChatbotEnabled(enabled);
      setMessage({
        type: "success",
        text: `Chatbot ${enabled ? "enabled" : "disabled"} successfully`,
      });
    } catch (error) {
      console.error("Failed to update setting:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to update chatbot visibility",
      });
      // Revert the toggle on error
      setChatbotEnabled(!enabled);
    } finally {
      setIsSaving(false);
    }
  };

  // Email notification handlers
  const handleEmailNotificationToggle = async (
    type: keyof EmailNotifications,
    enabled: boolean
  ) => {
    if (!token) return;

    setIsSaving(true);
    setMessage(null);

    try {
      await updateEmailNotification(token, type, enabled);
      setEmailNotifications((prev) => ({ ...prev, [type]: enabled }));
      setMessage({
        type: "success",
        text: `${type} email notifications ${enabled ? "enabled" : "disabled"}`,
      });
    } catch (error) {
      console.error("Failed to update email notification:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to update email notification",
      });
      // Revert on error
      setEmailNotifications((prev) => ({ ...prev, [type]: !enabled }));
    } finally {
      setIsSaving(false);
    }
  };

  // Additional recipients handlers
  const handleAddRecipient = async () => {
    if (!token || !newRecipient.trim()) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newRecipient.trim())) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address",
      });
      return;
    }

    if (additionalRecipients.includes(newRecipient.trim())) {
      setMessage({
        type: "error",
        text: "This email is already in the list",
      });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const updated = [...additionalRecipients, newRecipient.trim()];
      await updateEmailAdditionalRecipients(token, updated);
      setAdditionalRecipients(updated);
      setNewRecipient("");
      setMessage({
        type: "success",
        text: "Additional recipient added",
      });
    } catch (error) {
      console.error("Failed to add recipient:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to add recipient",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveRecipient = async (email: string) => {
    if (!token) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const updated = additionalRecipients.filter((e) => e !== email);
      await updateEmailAdditionalRecipients(token, updated);
      setAdditionalRecipients(updated);
      setMessage({
        type: "success",
        text: "Recipient removed",
      });
    } catch (error) {
      console.error("Failed to remove recipient:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to remove recipient",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Email sender handlers
  const handleUpdateSender = async () => {
    if (!token || !emailSender.address) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailSender.address)) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address",
      });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await updateEmailSender(
        token,
        emailSender.address,
        emailSender.name || undefined
      );
      setMessage({
        type: "success",
        text: "Email sender configuration updated",
      });
    } catch (error) {
      console.error("Failed to update sender:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to update email sender",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Check if user is superadmin
  if (user?.role !== "superadmin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <h1
              className="text-2xl font-bold text-red-600 mb-4"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Access Denied
            </h1>
            <p
              className="text-gray-600 mb-6"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Only superadmin can access settings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-6"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Settings
        </h1>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {message.text}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle style={{ fontFamily: "var(--font-dm-sans)" }}>
              AI Chatbot
            </CardTitle>
            <CardDescription style={{ fontFamily: "var(--font-dm-sans)" }}>
              Control the visibility of the AI chatbot widget on the frontend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label
                  htmlFor="chatbot-enabled"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Enable Chatbot
                </Label>
                <p
                  className="text-sm text-gray-500"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  When enabled, the AI chatbot widget will be visible to all
                  visitors on the website
                </p>
              </div>
              <Switch
                id="chatbot-enabled"
                checked={chatbotEnabled}
                onCheckedChange={handleToggleChatbot}
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Notification Toggles */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle style={{ fontFamily: "var(--font-dm-sans)" }}>
              Email Notifications
            </CardTitle>
            <CardDescription style={{ fontFamily: "var(--font-dm-sans)" }}>
              Control which email notifications are sent when meetings are
              scheduled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label
                  htmlFor="notify-superadmin"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Notify Superadmins
                </Label>
                <p
                  className="text-sm text-gray-500"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Send email notifications to all superadmin users
                </p>
              </div>
              <Switch
                id="notify-superadmin"
                checked={emailNotifications.superadmin}
                onCheckedChange={(enabled) =>
                  handleEmailNotificationToggle("superadmin", enabled)
                }
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label
                  htmlFor="notify-agent"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Notify Agents
                </Label>
                <p
                  className="text-sm text-gray-500"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Send email notifications to assigned agents
                </p>
              </div>
              <Switch
                id="notify-agent"
                checked={emailNotifications.agent}
                onCheckedChange={(enabled) =>
                  handleEmailNotificationToggle("agent", enabled)
                }
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label
                  htmlFor="notify-client"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Notify Clients
                </Label>
                <p
                  className="text-sm text-gray-500"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Send confirmation emails to clients
                </p>
              </div>
              <Switch
                id="notify-client"
                checked={emailNotifications.client}
                onCheckedChange={(enabled) =>
                  handleEmailNotificationToggle("client", enabled)
                }
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label
                  htmlFor="notify-welcome"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Welcome Emails
                </Label>
                <p
                  className="text-sm text-gray-500"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Send welcome emails to new newsletter subscribers
                </p>
              </div>
              <Switch
                id="notify-welcome"
                checked={emailNotifications.welcome}
                onCheckedChange={(enabled) =>
                  handleEmailNotificationToggle("welcome", enabled)
                }
                disabled={isSaving}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Recipients */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle style={{ fontFamily: "var(--font-dm-sans)" }}>
              Additional Email Recipients
            </CardTitle>
            <CardDescription style={{ fontFamily: "var(--font-dm-sans)" }}>
              Add additional email addresses to receive meeting notifications
              (beyond superadmins)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="email@example.com"
                value={newRecipient}
                onChange={(e) => setNewRecipient(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddRecipient();
                  }
                }}
                disabled={isSaving}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
              <Button
                onClick={handleAddRecipient}
                disabled={isSaving || !newRecipient.trim()}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Add
              </Button>
            </div>

            {additionalRecipients.length > 0 && (
              <div className="space-y-2">
                {additionalRecipients.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span
                      className="text-sm"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {email}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRecipient(email)}
                      disabled={isSaving}
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Sender Configuration */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle style={{ fontFamily: "var(--font-dm-sans)" }}>
              Email Sender Configuration
            </CardTitle>
            <CardDescription style={{ fontFamily: "var(--font-dm-sans)" }}>
              Configure the sender name and address for all emails (overrides
              SMTP_FROM environment variable)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="sender-address"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                From Email Address
              </Label>
              <Input
                id="sender-address"
                type="email"
                placeholder="noreply@intellagent.com"
                value={emailSender.address || ""}
                onChange={(e) =>
                  setEmailSender({ ...emailSender, address: e.target.value })
                }
                disabled={isSaving}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="sender-name"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                From Name (Optional)
              </Label>
              <Input
                id="sender-name"
                type="text"
                placeholder="IntellAgent"
                value={emailSender.name || ""}
                onChange={(e) =>
                  setEmailSender({ ...emailSender, name: e.target.value })
                }
                disabled={isSaving}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              />
            </div>

            <Button
              onClick={handleUpdateSender}
              disabled={isSaving || !emailSender.address}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Save Sender Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
