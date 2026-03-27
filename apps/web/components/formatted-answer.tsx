"use client"

import SourceHover from "./source-hover"

export default function FormattedAnswer({ text }: { text: string }) {
  const regex =
    /\[source:\s*([^\|]+)\|\s*([^\|]+)\|\s*(https:\/\/youtube\.com[^\]]+)\]/g

  const parts = text.split(regex)

  const elements = []

  for (let i = 0; i < parts.length; i++) {
    if (i % 4 === 0) {
      elements.push(<span key={i}>{parts[i]}</span>)
    } else {
      const videoId = parts[i]
      const timestamp = parts[i + 1]
      const url = parts[i + 2]

      elements.push(
        <SourceHover
          key={i}
          videoId={videoId}
          timestamp={timestamp}
          url={url}
        />
      )

      i += 2
    }
  }

  return <div className="whitespace-pre-wrap">{elements}</div>
}