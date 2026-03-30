"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import RagSources from "../rag-sources";
import AnswerRenderer from "../answer-renderer";

type Message = {
  role: "user" | "assistant";
  content: string;
};

interface ChatScreenProps {
  onBack?: () => void;
}

export default function ChatScreen({ onBack }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setisLoading] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;

    const userMsg = { role: "user" as const, content: query };

    setMessages((m) => [...m, userMsg]);
    setQuery("");
    setisLoading(true);

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

    setisLoading(false);
  }

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="min-h-screen w-full flex flex-col">
      <header className="border-b px-6 py-3 flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-secondary rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">QA Chat</span>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <p className="text-muted-foreground text-sm mb-2">
                No messages yet
              </p>
              <p className="text-muted-foreground text-xs">
                Ask a question about your videos above
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <AnimatePresence>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] ${m.role === "user" ? "text-right" : "text-left"}`}
                    >
                      {m.role === "user" ? (
                        <div className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
                          {m.content}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <AnswerRenderer text={m.content.split(/sources/i)[0]} />
                          <RagSources text={m.content} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t px-6 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Input
            placeholder="Ask a question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="h-10"
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            size="sm"
            className="h-10 px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}
