"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

export interface MeetingAutomationData {
  agentId?: string;
  agentName?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  timezone: string;
  customerName: string;
  email: string;
  phone: string;
}

export type AutomationStage =
  | "idle"
  | "pending"
  | "scrolling"
  | "filling"
  | "submitting"
  | "completed"
  | "error";

export interface AutomationTargetHandle {
  scrollIntoView?: () => Promise<void> | void;
  fillForm?: (data: MeetingAutomationData) => Promise<void> | void;
  submitForm?: (data: MeetingAutomationData) => Promise<void> | void;
}

interface AutomationContextType {
  triggerMeetingAutomation: (data: MeetingAutomationData) => void;
  automationData: MeetingAutomationData | null;
  isAutomating: boolean;
  clearAutomation: () => void;
  registerAutomationTarget: (
    target: AutomationTargetHandle | null
  ) => () => void;
  automationStage: AutomationStage;
  automationError?: string | null;
}

const AutomationContext = createContext<AutomationContextType | null>(null);

export function AutomationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [automationData, setAutomationData] =
    useState<MeetingAutomationData | null>(null);
  const [isAutomating, setIsAutomating] = useState(false);
  const [automationStage, setAutomationStage] =
    useState<AutomationStage>("idle");
  const [automationError, setAutomationError] = useState<string | null>(null);

  const automationTargetRef = useRef<AutomationTargetHandle | null>(null);
  const automationDataRef = useRef<MeetingAutomationData | null>(null);

  useEffect(() => {
    automationDataRef.current = automationData;
  }, [automationData]);

  const triggerMeetingAutomation = useCallback(
    (data: MeetingAutomationData) => {
      console.log("DEBUG: triggerMeetingAutomation called with", data);
      setAutomationData(data);
      setIsAutomating(true);
      setAutomationStage("pending");
      setAutomationError(null);
    },
    []
  );

  const clearAutomation = useCallback(() => {
    setAutomationData(null);
    setIsAutomating(false);
    setAutomationStage("idle");
    setAutomationError(null);
  }, []);

  const runAutomationSequence = useCallback(
    async (data: MeetingAutomationData) => {
      const target = automationTargetRef.current;
      console.log(
        "DEBUG: runAutomationSequence started. Target exists?",
        !!target
      );
      if (!target) {
        console.warn("DEBUG: No automation target registered!");
        return;
      }

      try {
        console.log("DEBUG: Starting scroll phase");
        setAutomationStage("scrolling");
        await target.scrollIntoView?.();

        console.log("DEBUG: Starting fill phase");
        setAutomationStage("filling");
        await target.fillForm?.(data);

        if (target.submitForm) {
          console.log("DEBUG: Starting submit phase");
          setAutomationStage("submitting");
          await target.submitForm(data);
        }

        console.log("DEBUG: Automation completed");
        setAutomationStage("completed");
        setAutomationError(null);
      } catch (error) {
        console.error("Automation sequence failed:", error);
        setAutomationStage("error");
        setAutomationError(
          error instanceof Error ? error.message : "Automation failed"
        );
      } finally {
        setIsAutomating(false);
      }
    },
    []
  );

  useEffect(() => {
    if (automationData && automationTargetRef.current) {
      runAutomationSequence(automationData);
    }
  }, [automationData, runAutomationSequence]);

  const registerAutomationTarget = useCallback(
    (target: AutomationTargetHandle | null) => {
      automationTargetRef.current = target;

      if (target && automationDataRef.current) {
        runAutomationSequence(automationDataRef.current);
      }

      return () => {
        if (automationTargetRef.current === target) {
          automationTargetRef.current = null;
        }
      };
    },
    [runAutomationSequence]
  );

  return (
    <AutomationContext.Provider
      value={{
        triggerMeetingAutomation,
        automationData,
        isAutomating,
        clearAutomation,
        registerAutomationTarget,
        automationStage,
        automationError,
      }}
    >
      {children}
    </AutomationContext.Provider>
  );
}

export function useAutomation() {
  const context = useContext(AutomationContext);
  if (!context) {
    throw new Error("useAutomation must be used within AutomationProvider");
  }
  return context;
}
