"use client";

import { Card } from "@/components/ui/card";

type Source = {
  videoId: string;
  timestamp: string;
  url: string;
};

function extractSources(text: string): Source[] {
  const regex =
    /\[source:\s*([^\|]+)\|\s*([^\|]+)\|\s*(https:\/\/youtube\.com[^\]]+)\]/g;

  const sources: Source[] = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    sources.push({
      videoId: match[1].trim(),
      timestamp: match[2].trim(),
      url: match[3].trim(),
    });
  }

  return sources;
}

function getEmbed(url: string) {
  const videoId = url.match(/v=([^&]+)/)?.[1];
  const start = url.match(/t=(\d+)/)?.[1] ?? "0";

  return `https://www.youtube.com/embed/${videoId}?start=${start}`;
}

export default function RagSources({ text }: { text: string }) {
  const sources = extractSources(text);

  if (!sources.length) return null;

  return (
    <div className="flex flex-col gap-3 mt-4">
      <div className="text-sm font-medium">Sources</div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2 justify-center items-center">
      {sources.map((s, i) => (    
          <Card key={i} className="p-3 flex flex-col gap-2 w-full max-w-sm bg-card">
            <div className="flex justify-between text-sm">
              <div>{s.videoId}</div>

              <a href={s.url} target="_blank" className="underline">
                {s.timestamp}
              </a>
            </div>

            <iframe
              className="w-90 h-50 rounded"
              src={getEmbed(s.url)}
              allowFullScreen
            />
          </Card>
      ))}
      </div>
    </div>
  );
}
