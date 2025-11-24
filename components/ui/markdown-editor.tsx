"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import { cn } from "@/lib/utils";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your company details in Markdown...",
  className,
}: MarkdownEditorProps) {
  const [editorValue, setEditorValue] = useState(value || "");

  // Sync with parent value changes
  useEffect(() => {
    setEditorValue(value || "");
  }, [value]);

  const handleChange = (val?: string) => {
    const newValue = val || "";
    setEditorValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={cn("space-y-2", className)} data-color-mode="light">
      <MDEditor
        value={editorValue}
        onChange={handleChange}
        preview="edit"
        hideToolbar={false}
        visibleDragbar={true}
        height={400}
        textareaProps={{
          placeholder: placeholder,
        }}
      />
    </div>
  );
}
