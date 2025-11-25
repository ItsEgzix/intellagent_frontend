"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { getActiveAgents } from "@/util/api/agents";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Agent {
  id: string;
  name?: string;
  email: string;
  timezone?: string;
  avatar?: string;
}

interface AgentSelectorProps {
  selectedAgent: Agent | null;
  onAgentSelect: (agent: Agent | null) => void;
  onTimezoneChange?: (timezone: string) => void;
}

export default function AgentSelector({
  selectedAgent,
  onAgentSelect,
  onTimezoneChange,
}: AgentSelectorProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);

  // Fetch active agents on component mount
  useEffect(() => {
    const fetchAgents = async () => {
      setIsLoadingAgents(true);
      try {
        const agentsData = await getActiveAgents();
        setAgents(agentsData);

        // Auto-select if there's only one agent
        if (agentsData.length === 1 && !selectedAgent) {
          const singleAgent = agentsData[0];
          onAgentSelect(singleAgent);
          if (singleAgent.timezone && onTimezoneChange) {
            onTimezoneChange(singleAgent.timezone);
          }
        }
      } catch (error) {
        console.error("Failed to fetch agents:", error);
      } finally {
        setIsLoadingAgents(false);
      }
    };

    fetchAgents();
  }, [selectedAgent, onAgentSelect, onTimezoneChange]);

  const handleAgentClick = (agent: Agent) => {
    onAgentSelect(agent);
    if (agent.timezone && onTimezoneChange) {
      onTimezoneChange(agent.timezone);
    }
  };

  const handleChangeAgent = () => {
    onAgentSelect(null);
  };

  if (isLoadingAgents) {
    return (
      <div className="text-center py-4 text-gray-500 text-xs">
        Loading agents...
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-xs">
        No agents available
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mb-4">
      {selectedAgent ? (
        // Show only selected agent's avatar
        <div className="flex flex-col items-center mb-3">
          <div className="w-20 h-20 rounded-full border-4 border-[#111] overflow-hidden shadow-lg mb-3">
            <Image
              src={
                selectedAgent.avatar
                  ? selectedAgent.avatar.startsWith("http") ||
                    selectedAgent.avatar.startsWith("https")
                    ? selectedAgent.avatar
                    : `${API_URL}${
                        selectedAgent.avatar.startsWith("/") ? "" : "/"
                      }${selectedAgent.avatar}`
                  : "/elements/sze.png"
              }
              alt={selectedAgent.name || "Agent"}
              width={80}
              height={80}
              className="w-full h-full object-cover object-center"
              quality={100}
              unoptimized={true}
            />
          </div>
          {agents.length > 1 && (
            <button
              type="button"
              onClick={handleChangeAgent}
              className="text-xs text-gray-500 hover:text-[#111] underline"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Change agent
            </button>
          )}
        </div>
      ) : (
        // Show all agents when none selected
        <div className="w-full mb-3">
          <div className="flex items-center justify-center h-24 relative">
            <div className="flex items-center justify-center">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="group relative -ml-4 first:ml-0 transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:z-10"
                  onClick={() => handleAgentClick(agent)}
                >
                  <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden shadow-lg transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:border-[#111]">
                    <Image
                      src={
                        agent.avatar
                          ? agent.avatar.startsWith("http") ||
                            agent.avatar.startsWith("https")
                            ? agent.avatar
                            : `${API_URL}${
                                agent.avatar.startsWith("/") ? "" : "/"
                              }${agent.avatar}`
                          : "/elements/sze.png"
                      }
                      alt={agent.name || "Agent"}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover object-center"
                      unoptimized={agent.avatar?.startsWith("http") || false}
                      loading="lazy"
                    />
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30">
                    <div className="bg-[#111] text-white text-xs rounded py-1 px-2 text-center shadow-lg">
                      <p className="font-semibold">{agent.name || "Agent"}</p>
                      {agent.timezone && (
                        <p className="text-gray-300 text-[10px]">
                          {agent.timezone}
                        </p>
                      )}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#111]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Select an Agent text */}
      <h3
        className="text-sm font-semibold text-[#111] mb-4"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        {selectedAgent ? selectedAgent.name || "Agent" : "Select an Agent"}
      </h3>
    </div>
  );
}
