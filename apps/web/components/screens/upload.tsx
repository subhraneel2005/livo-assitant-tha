"use client"

import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function UploadVideos() {

    const handleSubmit = () => {
        console.log("submit");
      };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-lg font-semibold">
            Improve the Knowledge Base
          </h1>
          <p className="text-sm text-muted-foreground">
           Add videos into the vector db. Only AI or Engineering related ones
          </p>
        </div>

        <div className="flex gap-2 mt-8">
          <Input
            placeholder="Paste YouTube URL..."
            className="flex-1"
            onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
          />
          <Button>Embed</Button>
        </div>
      </div>
    </div>
  );
}