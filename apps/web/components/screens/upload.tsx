"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function UploadVideos() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pollStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      const res = await fetch(`http://localhost:8000/api/status/${jobId}`);
      const data = await res.json();

      setStatus(data.status);

      if (data.status === "completed" || data.status === "failed") {
        clearInterval(interval);
        setLoading(false);
      }
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!url) return;

    setLoading(true);
    setStatus("pending");

    const res = await fetch("http://localhost:8000/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    pollStatus(data.job_id);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">Improve the Knowledge Base</h1>
          <p className="text-sm text-muted-foreground">
            Add videos into the vector db. Only AI or Engineering related ones
          </p>
        </div>

        <div className="flex gap-2 mt-8">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube URL..."
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Embedding in process..." : "Embed video"}
          </Button>
        </div>

        {status && (
          <p className="text-sm text-muted-foreground">Status: {status}</p>
        )}
      </div>
    </div>
  );
}
