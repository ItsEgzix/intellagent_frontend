import React from "react";
// @ts-ignore - @lobehub/icons may not have full TypeScript definitions
import {
  Anthropic,
  CrewAI,
  HuggingFace,
  LangGraph,
  Ollama,
  OpenAI,
  Qwen,
  Vercel,
} from "@lobehub/icons";
import { SiNextdotjs, SiNestjs, SiSupabase, SiRender } from "react-icons/si";

export interface LoopItem {
  node: React.ReactNode;
  title: string;
  href: string;
}

// Technology logos for the logo loop below black box
export const techLogos: LoopItem[] = [
  {
    node: (
      <div className="flex flex-col items-center gap-2">
        <SiNextdotjs
          style={{ fontSize: "48px", width: "48px", height: "48px" }}
        />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          Next.js
        </span>
      </div>
    ),
    title: "Next.js",
    href: "https://nextjs.org",
  },
  {
    node: (
      <div className="flex flex-col items-center gap-2">
        <SiNestjs
          style={{ fontSize: "48px", width: "48px", height: "48px" }}
        />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          NestJS
        </span>
      </div>
    ),
    title: "NestJS",
    href: "https://nestjs.com",
  },
  {
    node: (
      <div className="flex flex-col items-center gap-2">
        <LangGraph
          style={{ fontSize: "48px", width: "48px", height: "48px" }}
        />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          Langgraph
        </span>
      </div>
    ),
    title: "Langgraph",
    href: "https://langchain-ai.github.io/langgraph",
  },
  {
    node: (
      <div className="flex flex-col items-center gap-2">
        <CrewAI style={{ fontSize: "48px", width: "48px", height: "48px" }} />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          CrewAI
        </span>
      </div>
    ),
    title: "CrewAI",
    href: "https://www.crewai.com",
  },
  {
    node: (
      <div className="flex flex-col items-center gap-2">
        <SiSupabase
          style={{ fontSize: "48px", width: "48px", height: "48px" }}
        />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          Supabase
        </span>
      </div>
    ),
    title: "Supabase",
    href: "https://supabase.com",
  },
  {
    node: (
      <div className="flex flex-col items-center gap-2">
        <Vercel style={{ fontSize: "48px", width: "48px", height: "48px" }} />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          Vercel
        </span>
      </div>
    ),
    title: "Vercel",
    href: "https://vercel.com",
  },
  {
    node: (
      <div className="flex flex-col items-center gap-2">
        <SiRender
          style={{ fontSize: "48px", width: "48px", height: "48px" }}
        />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          Render
        </span>
      </div>
    ),
    title: "Render",
    href: "https://render.com",
  },
  {
    node: (
      <div className="flex flex-col items-center gap-2">
        <HuggingFace
          style={{ fontSize: "48px", width: "48px", height: "48px" }}
        />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          Hugging Face
        </span>
      </div>
    ),
    title: "Hugging Face",
    href: "https://huggingface.co",
  },
  {
    node: (
      <div className="flex flex-col items-center gap-2">
        <Ollama style={{ fontSize: "48px", width: "48px", height: "48px" }} />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          Ollama
        </span>
      </div>
    ),
    title: "Ollama",
    href: "https://ollama.ai",
  },
  {
    node: (
      <div className="flex flex-col items-center gap-2">
        <Qwen style={{ fontSize: "48px", width: "48px", height: "48px" }} />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          Qwen
        </span>
      </div>
    ),
    title: "Qwen",
    href: "https://qwenlm.github.io",
  },
  {
    node: (
      <div className="flex flex-col items-center gap-2">
        <OpenAI style={{ fontSize: "48px", width: "48px", height: "48px" }} />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          OpenAI
        </span>
      </div>
    ),
    title: "OpenAI",
    href: "https://openai.com",
  },
  {
    node: (
      <div className="flex flex-col items-center gap-2">
        <Anthropic
          style={{ fontSize: "48px", width: "48px", height: "48px" }}
        />
        <span
          style={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          Anthropic
        </span>
      </div>
    ),
    title: "Anthropic",
    href: "https://www.anthropic.com",
  },
];

