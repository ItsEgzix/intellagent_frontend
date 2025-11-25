"use client";

import React from "react";
import { cx } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import ReactMarkdown, {
  type Components,
  type ExtraProps,
} from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/conversation";
import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/util/api/chatbot";
import { sendChatMessage } from "@/util/api/chatbot";
import { ArrowUp, ChevronDown, UserIcon, X } from "lucide-react";
import { useI18n } from "@/app/contexts/i18n-context";
import { useAutomation } from "@/app/contexts/automation-context";

const FORM_WIDTH = 700;
const FORM_HEIGHT = 800;
const SPEED_FACTOR = 1;

interface OrbProps {
  dimension?: string;
  className?: string;
  tones?: {
    base?: string;
    accent1?: string;
    accent2?: string;
    accent3?: string;
  };
  spinDuration?: number;
}

const ColorOrb: React.FC<OrbProps> = ({
  dimension = "192px",
  className,
  tones,
  spinDuration = 20,
}) => {
  const fallbackTones = {
    base: "oklch(95% 0.02 264.695)",
    accent1: "oklch(75% 0.15 350)",
    accent2: "oklch(80% 0.12 200)",
    accent3: "oklch(78% 0.14 280)",
  };

  const palette = { ...fallbackTones, ...tones };
  const dimValue = parseInt(dimension.replace("px", ""), 10);

  const blurStrength =
    dimValue < 50
      ? Math.max(dimValue * 0.008, 1)
      : Math.max(dimValue * 0.015, 4);
  const contrastStrength =
    dimValue < 50
      ? Math.max(dimValue * 0.004, 1.2)
      : Math.max(dimValue * 0.008, 1.5);
  const pixelDot =
    dimValue < 50
      ? Math.max(dimValue * 0.004, 0.05)
      : Math.max(dimValue * 0.008, 0.1);
  const shadowRange =
    dimValue < 50
      ? Math.max(dimValue * 0.004, 0.5)
      : Math.max(dimValue * 0.008, 2);
  const maskRadius =
    dimValue < 30
      ? "0%"
      : dimValue < 50
      ? "5%"
      : dimValue < 100
      ? "15%"
      : "25%";
  const adjustedContrast =
    dimValue < 30
      ? 1.1
      : dimValue < 50
      ? Math.max(contrastStrength * 1.2, 1.3)
      : contrastStrength;

  return (
    <div
      className={cn("color-orb", className)}
      style={
        {
          width: dimension,
          height: dimension,
          "--base": palette.base,
          "--accent1": palette.accent1,
          "--accent2": palette.accent2,
          "--accent3": palette.accent3,
          "--spin-duration": `${spinDuration}s`,
          "--blur": `${blurStrength}px`,
          "--contrast": adjustedContrast,
          "--dot": `${pixelDot}px`,
          "--shadow": `${shadowRange}px`,
          "--mask": maskRadius,
        } as React.CSSProperties
      }
    >
      <style jsx>{`
        @property --angle {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        .color-orb {
          display: grid;
          grid-template-areas: "stack";
          overflow: hidden;
          border-radius: 50%;
          position: relative;
          transform: scale(1.1);
        }

        .color-orb::before,
        .color-orb::after {
          content: "";
          display: block;
          grid-area: stack;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          transform: translateZ(0);
        }

        .color-orb::before {
          background: conic-gradient(
              from calc(var(--angle) * 2) at 25% 70%,
              var(--accent3),
              transparent 20% 80%,
              var(--accent3)
            ),
            conic-gradient(
              from calc(var(--angle) * 2) at 45% 75%,
              var(--accent2),
              transparent 30% 60%,
              var(--accent2)
            ),
            conic-gradient(
              from calc(var(--angle) * -3) at 80% 20%,
              var(--accent1),
              transparent 40% 60%,
              var(--accent1)
            ),
            conic-gradient(
              from calc(var(--angle) * 2) at 15% 5%,
              var(--accent2),
              transparent 10% 90%,
              var(--accent2)
            ),
            conic-gradient(
              from calc(var(--angle) * 1) at 20% 80%,
              var(--accent1),
              transparent 10% 90%,
              var(--accent1)
            ),
            conic-gradient(
              from calc(var(--angle) * -2) at 85% 10%,
              var(--accent3),
              transparent 20% 80%,
              var(--accent3)
            );
          box-shadow: inset var(--base) 0 0 var(--shadow)
            calc(var(--shadow) * 0.2);
          filter: blur(var(--blur)) contrast(var(--contrast));
          animation: spin var(--spin-duration) linear infinite;
        }

        .color-orb::after {
          background-image: radial-gradient(
            circle at center,
            var(--base) var(--dot),
            transparent var(--dot)
          );
          background-size: calc(var(--dot) * 2) calc(var(--dot) * 2);
          backdrop-filter: blur(calc(var(--blur) * 2))
            contrast(calc(var(--contrast) * 2));
          mix-blend-mode: overlay;
        }

        .color-orb[style*="--mask: 0%"]::after {
          mask-image: none;
        }

        .color-orb:not([style*="--mask: 0%"])::after {
          mask-image: radial-gradient(black var(--mask), transparent 75%);
        }

        @keyframes spin {
          to {
            --angle: 360deg;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .color-orb::before {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

type CodeProps = React.HTMLAttributes<HTMLElement> &
  ExtraProps & {
    inline?: boolean;
  };

const markdownComponents: Components = {
  p: ({ children }) => <p className="text-base leading-relaxed">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 ml-6 list-disc space-y-1 text-base leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 ml-6 list-decimal space-y-1 text-base leading-relaxed">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  code: ({ inline, children, className, ...props }: CodeProps) => {
    if (inline) {
      return (
        <code
          className="rounded-md bg-foreground/10 px-1.5 py-0.5 text-sm"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <pre className="my-3 overflow-x-auto rounded-2xl border border-foreground/10 bg-background/60 p-4 text-sm leading-relaxed shadow-inner">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    );
  },
};

// Component to animate markdown text using TextGenerateEffect
function AnimatedMarkdown({ message }: { message: string }) {
  return (
    <div className="space-y-3 text-[17px] leading-relaxed text-foreground">
      <TextGenerateEffect
        words={message}
        className="font-normal text-[17px] leading-relaxed text-foreground tracking-normal"
        filter={true}
        duration={0.3}
      />
    </div>
  );
}

// Static markdown component with consistent styling (no animation)
function StaticMarkdown({ message }: { message: string }) {
  return (
    <div className="space-y-3 text-[17px] leading-relaxed text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {message}
      </ReactMarkdown>
    </div>
  );
}

interface ContextShape {
  showForm: boolean;
  successFlag: boolean;
  triggerOpen: () => void;
  triggerClose: () => void;
  submitMessage: (message: string) => Promise<void>;
  messages: ChatMessage[];
  isSubmitting: boolean;
  errorMessage: string | null;
  animatedMessageIds: Set<string>;
  setMessage: (message: string) => void;
}

const FormContext = React.createContext<ContextShape | null>(null);

const useFormContext = () => {
  const context = React.useContext(FormContext);

  if (!context) {
    throw new Error(
      "useFormContext must be used within a FormContext.Provider"
    );
  }

  return context;
};

function MorphPanel() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [successFlag, setSuccessFlag] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = React.useState<string | undefined>(
    undefined
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [animatedMessageIds, setAnimatedMessageIds] = React.useState<
    Set<string>
  >(new Set());
  const successTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const { setLocale: setI18nLocale } = useI18n();
  const { triggerMeetingAutomation, isAutomating } = useAutomation();

  const triggerClose = React.useCallback(() => {
    // Don't close if automation is in progress
    if (isAutomating) {
      return;
    }
    setShowForm(false);
    textareaRef.current?.blur();
  }, [isAutomating]);

  const triggerOpen = React.useCallback(() => {
    setShowForm(true);
    // Mark all existing messages as animated when reopening to prevent re-animation
    setAnimatedMessageIds((prev) => {
      const newSet = new Set(prev);
      messages.forEach((msg, idx) => {
        if (msg.role === "model") {
          const messageId = `model-${idx}-${msg.message.slice(0, 10)}`;
          newSet.add(messageId);
        }
      });
      return newSet;
    });
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  }, [messages]);

  React.useEffect(() => {
    function clickOutsideHandler(e: MouseEvent) {
      // Don't close if we're processing a message or automation is in progress
      if (isSubmitting || isAutomating) return;

      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        showForm
      ) {
        triggerClose();
      }
    }

    document.addEventListener("mousedown", clickOutsideHandler);
    return () => document.removeEventListener("mousedown", clickOutsideHandler);
  }, [showForm, triggerClose, isSubmitting, isAutomating]);

  React.useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const submitMessage = React.useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // Keep the form open during processing
      if (!showForm) {
        setShowForm(true);
      }

      setIsSubmitting(true);
      setErrorMessage(null);
      setMessages((prev) => [...prev, { role: "user", message: trimmed }]);

      try {
        const response = await sendChatMessage(trimmed, sessionId);
        let responseMessage = response.response;

        // Check if the response contains a locale change instruction
        const localeMatch = responseMessage.match(/LOCALE_CHANGE:(\w+)/);
        if (localeMatch) {
          const newLocale = localeMatch[1];
          // Change locale without page reload
          await setI18nLocale(newLocale);
          // Remove the LOCALE_CHANGE instruction from the message
          responseMessage = responseMessage
            .replace(/LOCALE_CHANGE:\w+/g, "")
            .trim();
          // Add confirmation message
          responseMessage =
            responseMessage ||
            `Language changed to ${newLocale}. The website interface has been updated.`;
        }

        // Check if the response contains meeting automation instruction
        // Handle both plain text and markdown code block formats
        console.log("DEBUG: Raw response received:", responseMessage);
        if (responseMessage.includes("MEETING_AUTOMATION")) {
          // Try to extract JSON from markdown code block first
          let jsonString = "";

          // Pattern 1: Inside markdown code block ```json MEETING_AUTOMATION:{...} ```
          const markdownMatch = responseMessage.match(
            /```(?:json)?\s*MEETING_AUTOMATION:({[\s\S]*?})\s*```/
          );

          if (markdownMatch && markdownMatch[1]) {
            jsonString = markdownMatch[1];
            console.log("DEBUG: Found in markdown code block");
          } else {
            // Pattern 2: Plain text MEETING_AUTOMATION:{...}
            // Use brace counting to properly extract the JSON object
            const automationIndex = responseMessage.indexOf(
              "MEETING_AUTOMATION:"
            );
            if (automationIndex !== -1) {
              const afterMarker = responseMessage.substring(
                automationIndex + "MEETING_AUTOMATION:".length
              );

              // Find the opening brace
              const braceStartIndex = afterMarker.indexOf("{");
              if (braceStartIndex !== -1) {
                // Count braces to find the matching closing brace
                let braceCount = 0;
                let jsonEndIndex = -1;

                for (let i = braceStartIndex; i < afterMarker.length; i++) {
                  if (afterMarker[i] === "{") braceCount++;
                  if (afterMarker[i] === "}") {
                    braceCount--;
                    if (braceCount === 0) {
                      jsonEndIndex = i + 1;
                      break;
                    }
                  }
                }

                if (jsonEndIndex > 0) {
                  jsonString = afterMarker.substring(
                    braceStartIndex,
                    jsonEndIndex
                  );
                  console.log(
                    "DEBUG: Found in plain text using brace matching"
                  );
                }
              }
            }

            // Fallback to regex if brace matching didn't work
            if (!jsonString) {
              const plainMatch = responseMessage.match(
                /MEETING_AUTOMATION:\s*({[\s\S]*?})\s*(?:\n\n|```|$|\.|,|;|\s*$)/m
              );
              if (plainMatch && plainMatch[1]) {
                jsonString = plainMatch[1];
                console.log("DEBUG: Found in plain text using regex fallback");
              }
            }
          }

          if (jsonString) {
            try {
              const automationData = JSON.parse(jsonString);
              console.log("✅ Automation data detected:", automationData);
              // Remove the automation instruction from the message (keep everything before it)
              responseMessage = responseMessage.replace(
                /```(?:json)?\s*MEETING_AUTOMATION:[\s\S]*?\s*```/g,
                ""
              );
              responseMessage = responseMessage.replace(
                /MEETING_AUTOMATION:[\s\S]*?(?:\n\n|```|$)/g,
                ""
              );
              // Trigger the automation AFTER updating the message
              setTimeout(() => {
                console.log(
                  "🚀 Triggering automation with data:",
                  automationData
                );
                triggerMeetingAutomation(automationData);
              }, 500);
            } catch (error) {
              console.error("❌ Failed to parse automation data:", error);
              console.error("JSON string:", jsonString);
            }
          } else {
            console.warn(
              "⚠️ MEETING_AUTOMATION found but couldn't extract JSON"
            );
            console.warn(
              "Response snippet:",
              responseMessage.substring(0, 800)
            );
          }
        }

        setMessages((prev) => {
          const newMessages: ChatMessage[] = [
            ...prev,
            { role: "model" as const, message: responseMessage },
          ];
          // Mark all previous AI messages as animated so they don't re-animate
          prev.forEach((msg, idx) => {
            if (msg.role === "model") {
              const prevMessageId = `model-${idx}-${msg.message.slice(0, 10)}`;
              setAnimatedMessageIds((prevIds: Set<string>) =>
                new Set(prevIds).add(prevMessageId)
              );
            }
          });
          return newMessages;
        });
        setSessionId(response.sessionId);
        setSuccessFlag(true);
        if (successTimeoutRef.current) {
          clearTimeout(successTimeoutRef.current);
        }
        successTimeoutRef.current = setTimeout(
          () => setSuccessFlag(false),
          1500
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";
        setErrorMessage(message);
        setMessages((prev) => [
          ...prev,
          { role: "model", message: `Error: ${message}` },
        ]);
      } finally {
        setIsSubmitting(false);
      }
    },
    [sessionId, showForm]
  );

  const setMessage = React.useCallback((msg: string) => {
    // Dispatch custom event that InputForm will listen to
    const event = new CustomEvent("set-chat-message", {
      detail: { message: msg },
    });
    window.dispatchEvent(event);
  }, []);

  const ctx = React.useMemo(
    () => ({
      showForm,
      successFlag,
      triggerOpen,
      triggerClose,
      submitMessage,
      messages,
      isSubmitting,
      errorMessage,
      animatedMessageIds,
      setMessage,
    }),
    [
      showForm,
      successFlag,
      triggerOpen,
      triggerClose,
      submitMessage,
      messages,
      isSubmitting,
      errorMessage,
      animatedMessageIds,
      setMessage,
    ]
  );

  // Update global ref
  React.useEffect(() => {
    formContextRef = ctx;
  }, [ctx]);

  return (
    <motion.div
      ref={wrapperRef}
      data-panel
      className={cx(
        "bg-background relative z-10 flex flex-col items-center overflow-hidden border shadow-2xl"
      )}
      initial={false}
      animate={{
        width: showForm ? FORM_WIDTH : "auto",
        height: showForm ? FORM_HEIGHT : 64,
        borderRadius: showForm ? 14 : 20,
      }}
      transition={{
        type: "spring",
        stiffness: 550 / SPEED_FACTOR,
        damping: 45,
        mass: 0.7,
        delay: showForm ? 0 : 0.08,
      }}
      style={{ maxWidth: "100vw", maxHeight: "calc(100vh - 32px)" }}
    >
      <FormContext.Provider value={ctx}>
        <DockBar />
        <InputForm ref={textareaRef} />
      </FormContext.Provider>
    </motion.div>
  );
}

function DockBar() {
  const { showForm, triggerOpen } = useFormContext();

  return (
    <footer className="mt-auto flex h-[64px] select-none items-center justify-center whitespace-nowrap">
      <div className="flex items-center justify-center gap-3 px-4 max-sm:h-12 max-sm:px-3">
        <div className="flex w-fit items-center gap-2">
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="blank"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                className="h-5 w-5"
              />
            ) : (
              <motion.div
                key="orb"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ColorOrb
                  dimension="32px"
                  tones={{ base: "oklch(22.64% 0 0)" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          type="button"
          className="flex h-12 min-w-[150px] items-center justify-center rounded-full bg-background px-6 text-base font-semibold text-foreground transition hover:bg-background/90"
          onClick={triggerOpen}
        >
          <span className="truncate">Ask AI</span>
        </Button>
      </div>
    </footer>
  );
}

const SUGGESTIONS = [
  {
    title: "You couldn't find your language?",
    subtitle: "I can translate the website for you",
    message: "translate the website to ..",
  },
  {
    title: "Wanna see a proof of concept",
    subtitle: "of web automation? Ask me to schedule a meeting",
    message: "can you schedule a meeting for me?",
  },
  {
    title: "How IntellAgent is different",
    subtitle: "from other startups",
    message: "How IntellAgent is different from other startups",
  },
];

const InputForm = React.forwardRef<HTMLTextAreaElement>((_, ref) => {
  const {
    triggerClose,
    showForm,
    submitMessage,
    messages,
    isSubmitting,
    errorMessage,
    successFlag,
    animatedMessageIds,
  } = useFormContext();
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const [message, setMessage] = React.useState("");

  // Listen for external message setting
  React.useEffect(() => {
    const handleSetMessage = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      if (customEvent.detail?.message) {
        setMessage(customEvent.detail.message);
        setTimeout(() => {
          if (ref && typeof ref !== "function" && ref.current) {
            ref.current.focus();
            ref.current.setSelectionRange(
              customEvent.detail.message.length,
              customEvent.detail.message.length
            );
          }
        }, 100);
      }
    };

    window.addEventListener("set-chat-message", handleSetMessage);
    return () => {
      window.removeEventListener("set-chat-message", handleSetMessage);
    };
  }, [ref]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!message.trim()) return;
    const messageToSend = message.trim();
    setMessage(""); // Clear immediately
    await submitMessage(messageToSend);
  }

  function handleSuggestionClick(suggestion: string) {
    setMessage(suggestion);
    // Focus the textarea after setting the message
    setTimeout(() => {
      if (ref && typeof ref !== "function" && ref.current) {
        ref.current.focus();
        // Move cursor to end
        ref.current.setSelectionRange(suggestion.length, suggestion.length);
      }
    }, 0);
  }

  function handleKeys(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") triggerClose();
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      btnRef.current?.click();
    }
    // Shift+Enter allows new line (default behavior, no preventDefault)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute bottom-0"
      style={{
        width: FORM_WIDTH,
        height: FORM_HEIGHT,
        pointerEvents: showForm ? "all" : "none",
      }}
    >
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 550 / SPEED_FACTOR,
              damping: 45,
              mass: 0.7,
            }}
            className="flex h-full flex-col gap-3 p-3"
          >
            <div className="flex items-center justify-between px-1">
              <p className="z-10 ml-7 flex items-center gap-2 text-sm font-medium text-foreground">
                AI Conversation
                <AnimatePresence>
                  {successFlag && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-emerald-500"
                    >
                      Sent
                    </motion.span>
                  )}
                </AnimatePresence>
              </p>
              <div className="flex items-center gap-2">
                <div className="text-foreground mt-1 flex -translate-y-[3px] items-center gap-1 rounded-[12px] bg-transparent pr-1 text-center text-xs select-none">
                  <KeyHint className="w-fit">Enter</KeyHint>
                  <span className="text-xs text-muted-foreground">to send</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <KeyHint className="w-fit">Shift</KeyHint>
                  <KeyHint className="w-fit">Enter</KeyHint>
                  <span className="text-xs text-muted-foreground">
                    new line
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={triggerClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Conversation className="flex-1 rounded-2xl border border-foreground/15 bg-background/70 shadow-inner backdrop-blur">
              <ConversationContent className="flex min-h-full flex-col gap-3">
                {messages.length === 0 ? (
                  <div className="mt-auto grid w-full grid-cols-2 gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s.title + s.subtitle}
                        type="button"
                        onClick={() =>
                          handleSuggestionClick(
                            s.message || `${s.title} ${s.subtitle}`
                          )
                        }
                        className="flex flex-col items-start gap-1 rounded-xl border border-foreground/10 bg-background/50 p-3 text-left text-base transition-colors hover:bg-background/80"
                      >
                        <span className="font-medium text-foreground">
                          {s.title}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {s.subtitle}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    {messages.map((entry, index) => {
                      const isUser = entry.role === "user";
                      const messageId = `${
                        entry.role
                      }-${index}-${entry.message.slice(0, 10)}`;
                      const isLatestAI =
                        !isUser && index === messages.length - 1;
                      const hasBeenAnimated = animatedMessageIds.has(messageId);

                      return (
                        <div
                          key={messageId}
                          className={cn(
                            "flex gap-2",
                            isUser
                              ? "items-end justify-end"
                              : "items-start justify-start"
                          )}
                        >
                          {!isUser && (
                            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border border-foreground/10 bg-background/50 p-1 shadow-sm">
                              <ColorOrb dimension="22px" />
                            </div>
                          )}

                          {isUser ? (
                            <span className="max-w-[85%] rounded-2xl bg-foreground px-4 py-2.5 text-[17px] leading-relaxed text-background shadow">
                              {entry.message}
                            </span>
                          ) : (
                            <div className="markdown-response max-w-[85%]">
                              {isLatestAI && !hasBeenAnimated ? (
                                <AnimatedMarkdown message={entry.message} />
                              ) : (
                                <StaticMarkdown message={entry.message} />
                              )}
                            </div>
                          )}

                          {isUser && (
                            <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border border-foreground/10 bg-foreground/5 shadow-sm">
                              <UserIcon className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {isSubmitting && (
                      <div className="flex gap-2 items-start justify-start">
                        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border border-foreground/10 bg-background/50 p-1 shadow-sm">
                          <ColorOrb dimension="22px" />
                        </div>
                        <div className="markdown-response max-w-[85%] text-[17px] leading-relaxed">
                          <TextShimmer
                            as="span"
                            className="italic text-foreground/70"
                            duration={2}
                            spread={2}
                          >
                            Thinking...
                          </TextShimmer>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            <div className="relative rounded-[30px] border border-foreground/10 bg-background/70 p-3 shadow-inner backdrop-blur">
              <textarea
                ref={ref}
                placeholder="Ask me anything about IntellAgent, our AI services, or how we can help your business..."
                name="message"
                className="min-h-[90px] w-full resize-none rounded-[22px] border border-transparent bg-transparent px-6 pr-20 py-4 text-[17px] leading-relaxed outline-none placeholder:text-muted-foreground"
                required
                onKeyDown={handleKeys}
                spellCheck={false}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                disabled={isSubmitting}
              />
              <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-3 max-sm:top-auto max-sm:bottom-4 max-sm:translate-y-0">
                <Button
                  type="submit"
                  className="h-11 w-11 rounded-full p-0"
                  disabled={isSubmitting || !message.trim()}
                  aria-label="Send message"
                >
                  <ArrowUp className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {errorMessage && (
              <p className="px-1 text-xs text-rose-500" role="alert">
                {errorMessage}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute left-3 top-2"
          >
            <ColorOrb
              dimension="28px"
              tones={{
                base: "oklch(22.64% 0 0)",
                accent1: "oklch(75% 0.15 350)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
});
InputForm.displayName = "InputForm";

function KeyHint({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <kbd
      className={cx(
        "text-foreground flex h-6 w-fit items-center justify-center rounded-sm border px-1.5 font-sans",
        className
      )}
    >
      {children}
    </kbd>
  );
}

// Global ref to access form functions
let formContextRef: ContextShape | null = null;

export function FloatingAIWidget() {
  const [showLanguageMessage, setShowLanguageMessage] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  React.useEffect(() => {
    // Hide message after 10 seconds
    const timer = setTimeout(() => {
      setShowLanguageMessage(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Listen for form state changes
  React.useEffect(() => {
    const checkFormState = () => {
      if (formContextRef) {
        setIsFormOpen(formContextRef.showForm);
      }
    };

    const interval = setInterval(checkFormState, 100);
    return () => clearInterval(interval);
  }, []);

  const handleLanguageClick = () => {
    setShowLanguageMessage(false);
    if (formContextRef) {
      formContextRef.triggerOpen();
      setTimeout(() => {
        formContextRef?.setMessage("translate the website to ..");
      }, 100);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div className="pointer-events-auto absolute bottom-6 right-6 max-sm:bottom-4 max-sm:right-4 flex flex-col items-end">
        {/* Language translation attention message */}
        <AnimatePresence>
          {showLanguageMessage && !isFormOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-auto mb-3 cursor-pointer"
              onClick={handleLanguageClick}
            >
              <div
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2.5 shadow-lg hover:shadow-xl transition-shadow"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                <span className="text-sm font-medium text-white whitespace-nowrap">
                  You couldn't find your language? Let me translate
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLanguageMessage(false);
                  }}
                  className="ml-2 rounded-full p-1 hover:bg-white/20 transition-colors"
                  aria-label="Close message"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <MorphPanel />
      </div>
    </div>
  );
}
