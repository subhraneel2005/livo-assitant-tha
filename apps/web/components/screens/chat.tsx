"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import RagSources from "../rag-sources";
import FormattedAnswer from "../formatted-answer";
import AnswerRenderer from "../answer-renderer";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  function parseResponse(text: string) {
    const clean = text.replace(/\\n/g, "\n");

    const citationRegex =
      /\[source:\s*([^\|]+)\|\s*([^\|]+)\|\s*(https:\/\/youtube\.com[^\]]+)\]/g;

    const withHover = clean.replace(
      citationRegex,
      (_, videoId, timestamp, url) => {
        return `
        <span class="underline cursor-pointer" data-video="${videoId}" data-url="${url}" data-time="${timestamp}">
          ${videoId} ${timestamp}
        </span>
        `;
      },
    );

    const linked = withHover.replace(
      /(https:\/\/youtube\.com[^\s\]]+)/g,
      '<a href="$1" target="_blank" class="underline">$1</a>',
    );

    return linked;
  }

  async function handleSearch() {
    if (!query.trim()) return;

    const userMsg = { role: "user" as const, content: query };

    setMessages((m) => [...m, userMsg]);
    setQuery("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_query: query,
        }),
      });

      const data = await res.text();

      const parsed = parseResponse(data);

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data,
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Server error.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen w-full flex justify-center">
      <div className="w-full max-w-4xl flex flex-col h-screen">
        <ScrollArea className="flex-1 p-6">
          <div className="flex flex-col gap-4">
            {messages.map((m, i) => (
              <Card
                key={i}
                className={`p-4 whitespace-pre-wrap ${
                  m.role === "user" ? "self-end" : "self-start"
                }`}
              >
                {m.role === "assistant" ? (
                  <>
                    <>
                      {/* <FormattedAnswer text={m.content} /> */}
                      <AnswerRenderer text={m.content} />
                      <RagSources text={m.content} />
                    </>
                  </>
                ) : (
                  m.content
                )}
              </Card>
            ))}

            {loading && <Card className="p-4">Thinking...</Card>}
          </div>
        </ScrollArea>

        <div className="border-t p-4 flex gap-2">
          <Input
            placeholder="Ask about the videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <Button onClick={handleSearch} disabled={loading}>
            Ask
          </Button>
        </div>
      </div>
    </main>
  );
}
